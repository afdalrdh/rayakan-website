import "server-only";
import { createHmac, randomBytes, scrypt as _scrypt, timingSafeEqual, createHash } from "crypto";
import { promisify } from "util";
import { cookies, headers } from "next/headers";
import { one, query } from "./db";

const scrypt = promisify(_scrypt) as (pw: string, salt: Buffer, len: number) => Promise<Buffer>;
const COOKIE = "rk_session";
const MAX_AGE = 60 * 60 * 24 * 14; // 14 hari

function secret() {
  const s = process.env.SESSION_SECRET?.trim();
  if (s && s.length >= 24) return s;
  if (process.env.VERCEL) throw new Error("SESSION_SECRET belum diisi (minimal 24 karakter).");
  return "dev-only-secret-change-me-rayakan-platform";
}

export async function hashPassword(pw: string) {
  const salt = randomBytes(16);
  const key = await scrypt(pw, salt, 32);
  return `scrypt$${salt.toString("base64url")}$${key.toString("base64url")}`;
}

export async function verifyPassword(pw: string, stored: string) {
  const [alg, s, k] = stored.split("$");
  if (alg !== "scrypt" || !s || !k) return false;
  const key = await scrypt(pw, Buffer.from(s, "base64url"), 32);
  const want = Buffer.from(k, "base64url");
  return want.length === key.length && timingSafeEqual(want, key);
}

/** Readable random password for clients, e.g. "mawar-4821". */
export function generatePassword() {
  const words = ["mawar", "melati", "cinta", "bahagia", "rayakan", "janji", "kasih", "senja", "purnama", "anggrek", "lestari", "abadi"];
  const w = words[randomBytes(1)[0] % words.length];
  const n = 1000 + (randomBytes(2).readUInt16BE(0) % 9000);
  return `${w}-${n}`;
}

export type Session = { role: "owner" } | { role: "site"; slug: string; v: string };

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

function encode(s: Session & { e: number }) {
  const p = Buffer.from(JSON.stringify(s)).toString("base64url");
  return `${p}.${sign(p)}`;
}

function decode(token?: string): (Session & { e: number }) | null {
  if (!token) return null;
  const [p, sig] = token.split(".");
  if (!p || !sig) return null;
  const want = sign(p);
  if (want.length !== sig.length || !timingSafeEqual(Buffer.from(want), Buffer.from(sig))) return null;
  try {
    const s = JSON.parse(Buffer.from(p, "base64url").toString());
    return s.e > Date.now() / 1000 ? s : null;
  } catch {
    return null;
  }
}

/** Short fingerprint of the password hash: resetting a password logs old sessions out. */
export function passwordVersion(hash: string) {
  return createHash("sha256").update(hash).digest("base64url").slice(0, 10);
}

export async function setSession(s: Session) {
  const jar = await cookies();
  jar.set(COOKIE, encode({ ...s, e: Math.floor(Date.now() / 1000) + MAX_AGE }), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: MAX_AGE,
    path: "/",
  });
}

export async function clearSession() {
  (await cookies()).delete(COOKIE);
}

export async function getSession() {
  return decode((await cookies()).get(COOKIE)?.value);
}

export async function isOwner() {
  return (await getSession())?.role === "owner";
}

/** Owner can open every site; a client only their own (and only while the password is unchanged). */
export async function canEditSite(slug: string) {
  const s = await getSession();
  if (!s) return false;
  if (s.role === "owner") return true;
  if (s.slug !== slug) return false;
  const row = await one<{ password_hash: string }>(`SELECT password_hash FROM sites WHERE slug = $1`, [slug]);
  return !!row && passwordVersion(row.password_hash) === s.v;
}

export async function requireOwner() {
  if (!(await isOwner())) throw new Error("Tidak diizinkan");
}

export async function requireSite(slug: string) {
  if (!(await canEditSite(slug))) throw new Error("Sesi berakhir. Silakan masuk lagi.");
}

export function ownerCredentials() {
  const u = process.env.STUDIO_USERNAME?.trim();
  const p = process.env.STUDIO_PASSWORD?.trim();
  if (u && p) return { username: u, password: p, isDefault: false };
  if (process.env.VERCEL) return null;
  return { username: "admin", password: "admin123", isDefault: true };
}

export async function clientIp() {
  const h = await headers();
  return (h.get("x-forwarded-for")?.split(",")[0] || h.get("x-real-ip") || "local").trim();
}

export function ipHash(ip: string) {
  return createHash("sha256").update(`${ip}:${secret()}`).digest("base64url").slice(0, 16);
}

/** 5 wrong attempts per 15 minutes per (ip, account). */
export async function loginAllowed(key: string) {
  const row = await one<{ count: number; first_at: string }>(`SELECT count, first_at FROM login_attempts WHERE key = $1`, [key]);
  if (!row) return true;
  const age = Date.now() - new Date(row.first_at).getTime();
  if (age > 15 * 60 * 1000) {
    await query(`DELETE FROM login_attempts WHERE key = $1`, [key]);
    return true;
  }
  return row.count < 5;
}

export async function recordLoginFailure(key: string) {
  await query(
    `INSERT INTO login_attempts (key, count, first_at) VALUES ($1, 1, NOW())
     ON CONFLICT (key) DO UPDATE SET count = login_attempts.count + 1`,
    [key],
  );
}

export async function clearLoginFailures(key: string) {
  await query(`DELETE FROM login_attempts WHERE key = $1`, [key]);
}
