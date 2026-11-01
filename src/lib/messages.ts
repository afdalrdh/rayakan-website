export const DEFAULT_WA_TEMPLATE = `Kepada Yth.
{{nama}}

Tanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu/Saudara/i untuk hadir di acara pernikahan kami.

Berikut link undangan digital kami:
{{link}}

Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.

Terima kasih.`;

const NAME = /\{\{\s*(nama|nama_tamu|guest_name)\s*\}\}/gi;
const LINK = /\{\{\s*(link|link_undangan)\s*\}\}/gi;

export function renderWaMessage(template: string | null | undefined, guestName: string, link: string) {
  let msg = (template?.trim() || DEFAULT_WA_TEMPLATE).replace(NAME, guestName);
  LINK.lastIndex = 0;
  msg = LINK.test(msg) ? msg.replace(LINK, link) : `${msg.trim()}\n\n${link}`;
  return msg.trim();
}

/** 0812… / +62 812… / 62812… → 62812… (for wa.me links). */
export function normalizePhone(raw: string | null | undefined) {
  const d = (raw || "").replace(/\D/g, "");
  if (!d) return "";
  if (d.startsWith("0")) return `62${d.slice(1)}`;
  if (d.startsWith("8")) return `62${d}`;
  return d;
}

export function waLink(phone: string, text: string) {
  const p = normalizePhone(phone);
  return `https://wa.me/${p}?text=${encodeURIComponent(text)}`;
}

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://rayakan.my.id").replace(/\/$/, "");
export const SITE_HOST = SITE_URL.replace(/^https?:\/\//, "");

export function guestSlugify(name: string) {
  return name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}
