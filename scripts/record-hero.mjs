/**
 * Records the screen videos for the landing hero (laptop + phone):
 * the cover of /tema/<id>, a cursor/tap on "Buka Undangan", then a smooth scroll.
 *
 *   npm run build && npm start            (in another terminal)
 *   npm i -D playwright && npx playwright install chromium   (once; ffmpeg must be installed too)
 *   node scripts/record-hero.mjs afdal
 *
 * Output: public/landing/<id>-desktop.mp4 (960×600) and <id>-mobile.mp4 (480 wide), H.264 without sound.
 * Use them in `devices.video` (Hero / OCCASION_PAGES). Give re-recorded files a new name, or browsers may keep the old one.
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { chromium } from "playwright";

const theme = process.argv[2] || "afdal";
const base = process.env.BASE_URL || "http://localhost:3000";

const CSS = `[data-sample-bar],nextjs-portal{display:none!important} html{scrollbar-width:none} ::-webkit-scrollbar{display:none}
#rk-cursor{position:fixed;left:0;top:0;z-index:2147483647;pointer-events:none;transition:transform 1.1s cubic-bezier(.45,0,.2,1),opacity .4s}
#rk-cursor svg{display:block;filter:drop-shadow(0 2px 3px rgba(0,0,0,.45));transition:transform .15s}
#rk-cursor.press svg{transform:scale(.82)}
.rk-ripple{position:fixed;z-index:2147483646;pointer-events:none;border-radius:999px;background:rgba(255,255,255,.55);transform:translate(-50%,-50%) scale(.2);opacity:.9;animation:rkrip .7s ease-out forwards}
@keyframes rkrip{to{transform:translate(-50%,-50%) scale(1.6);opacity:0}}`;

async function record(mode, { scrollSeconds, fraction }) {
  const mobile = mode === "mobile";
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), `rk-${mode}-`));
  const browser = await chromium.launch({ args: ["--force-color-profile=srgb"] });
  const ctx = await browser.newContext(mobile ? { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true } : { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  // Keep the YouTube block on its thumbnail: its observer (the only one with threshold 0.35, see
  // themes/shared/Video.tsx) never fires, so the embed doesn't start loading mid-recording.
  await ctx.addInitScript(() => {
    const Real = window.IntersectionObserver;
    window.IntersectionObserver = new Proxy(Real, {
      construct(T, [cb, opts]) {
        return opts && opts.threshold === 0.35 ? { observe() {}, unobserve() {}, disconnect() {}, takeRecords: () => [] } : new T(cb, opts);
      },
    });
  });
  const page = await ctx.newPage();
  await page.goto(`${base}/tema/${theme}`, { waitUntil: "networkidle", timeout: 180000 });
  await page.addStyleTag({ content: CSS });
  // Load every image up front so nothing pops in while scrolling.
  await page.evaluate(() => document.querySelectorAll('img[loading="lazy"]').forEach((i) => (i.loading = "eager")));
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(2500);

  const box = await page.getByRole("button", { name: /Buka Undangan/i }).first().boundingBox();
  if (!box) throw new Error("Tombol Buka Undangan tidak ditemukan");
  const cx = box.x + box.width / 2;
  const cy = box.y + box.height / 2;

  const cdp = await ctx.newCDPSession(page);
  const frames = [];
  cdp.on("Page.screencastFrame", (f) => {
    frames.push({ data: f.data, t: f.metadata.timestamp });
    cdp.send("Page.screencastFrameAck", { sessionId: f.sessionId }).catch(() => {});
  });
  await cdp.send("Page.startScreencast", { format: "jpeg", quality: 92, maxWidth: mobile ? 780 : 1440, maxHeight: mobile ? 1688 : 900, everyNthFrame: 1 });
  await page.waitForTimeout(1300);

  if (!mobile) {
    await page.evaluate(({ x, y }) => {
      const d = document.createElement("div");
      d.id = "rk-cursor";
      d.innerHTML = '<svg width="26" height="30" viewBox="0 0 26 30"><path d="M3 2 L3 24 L9 18.5 L13 27.5 L17 25.8 L13 17 L21 17 Z" fill="#111" stroke="#fff" stroke-width="2" stroke-linejoin="round"/></svg>';
      d.style.transform = `translate(${x}px, ${y}px)`;
      document.body.appendChild(d);
    }, { x: cx + 260, y: cy + 240 });
    await page.waitForTimeout(250);
    await page.evaluate(({ x, y }) => (document.getElementById("rk-cursor").style.transform = `translate(${x - 3}px, ${y - 2}px)`), { x: cx, y: cy });
    await page.mouse.move(cx, cy, { steps: 8 });
    await page.waitForTimeout(1250);
    await page.evaluate(() => document.getElementById("rk-cursor").classList.add("press"));
  } else {
    await page.waitForTimeout(600);
  }
  await page.evaluate(({ x, y, s }) => {
    const r = document.createElement("div");
    r.className = "rk-ripple";
    Object.assign(r.style, { left: `${x}px`, top: `${y}px`, width: `${s}px`, height: `${s}px` });
    document.body.appendChild(r);
    setTimeout(() => r.remove(), 800);
  }, { x: cx, y: cy, s: mobile ? 70 : 54 });
  await page.waitForTimeout(140);
  if (mobile) await page.touchscreen.tap(cx, cy);
  else await page.mouse.click(cx, cy);
  await page.evaluate(() => {
    const c = document.getElementById("rk-cursor");
    if (!c) return;
    c.classList.remove("press");
    setTimeout(() => (c.style.opacity = "0"), 700);
  });
  await page.waitForTimeout(2600);

  await page.evaluate(async ({ sec, frac }) => {
    const target = Math.round((document.documentElement.scrollHeight - innerHeight) * frac);
    const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    document.documentElement.style.scrollBehavior = "auto";
    const start = performance.now();
    await new Promise((done) => {
      const step = (now) => {
        const t = Math.min(1, (now - start) / (sec * 1000));
        window.scrollTo(0, target * (0.75 * t + 0.25 * ease(t)));
        if (t < 1) requestAnimationFrame(step);
        else done();
      };
      requestAnimationFrame(step);
    });
  }, { sec: scrollSeconds, frac: fraction });
  await page.waitForTimeout(1200);
  await cdp.send("Page.stopScreencast");
  await browser.close();

  // Frames arrive only when the screen changes: keep their real durations.
  const list = ["ffconcat version 1.0"];
  frames.forEach((f, i) => {
    const name = `f${String(i).padStart(5, "0")}.jpg`;
    fs.writeFileSync(path.join(dir, name), Buffer.from(f.data, "base64"));
    const next = i + 1 < frames.length ? frames[i + 1].t : f.t + 0.5;
    list.push(`file ${name}`, `duration ${Math.max(0.001, next - f.t).toFixed(4)}`);
  });
  list.push(`file f${String(frames.length - 1).padStart(5, "0")}.jpg`);
  fs.writeFileSync(path.join(dir, "list.ffconcat"), list.join("\n"));
  const total = frames[frames.length - 1].t - frames[0].t + 0.5;
  const out = path.resolve(`public/landing/${theme}-${mode}.mp4`);
  const scale = mobile ? "scale=480:-2:flags=lanczos" : "scale=960:600:flags=lanczos";
  execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", path.join(dir, "list.ffconcat"), "-vf", `fps=30,${scale},fade=t=in:st=0:d=0.4,fade=t=out:st=${(total - 0.6).toFixed(2)}:d=0.6,format=yuv420p`, "-c:v", "libx264", "-preset", "slow", "-crf", mobile ? "27" : "26", "-movflags", "+faststart", "-an", out]);
  fs.rmSync(dir, { recursive: true, force: true });
  console.log(`${out} · ${frames.length} frames · ${(fs.statSync(out).size / 1024).toFixed(0)} KB`);
}

await record("desktop", { scrollSeconds: 13, fraction: 0.5 });
await record("mobile", { scrollSeconds: 13, fraction: 0.32 });
