import "server-only";
import { one, query } from "../db/client";

/** Failed logins per key (ip + account), used to slow down password guessing. */
export async function getLoginAttempts(key: string) {
  return one<{ count: number; first_at: string }>(`SELECT count, first_at FROM login_attempts WHERE key = $1`, [key]);
}

export async function addLoginAttempt(key: string) {
  await query(
    `INSERT INTO login_attempts (key, count, first_at) VALUES ($1, 1, NOW())
     ON CONFLICT (key) DO UPDATE SET count = login_attempts.count + 1`,
    [key],
  );
}

export async function clearLoginAttempts(key: string) {
  await query(`DELETE FROM login_attempts WHERE key = $1`, [key]);
}
