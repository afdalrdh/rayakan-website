import "server-only";
import ExcelJS from "exceljs";

export interface ParsedGuest {
  name: string;
  phone: string | null;
  groupLabel: string | null;
}

const ALIASES: Record<string, keyof ParsedGuest> = {
  "nama tamu": "name",
  nama: "name",
  "nama undangan": "name",
  name: "name",
  "nomor whatsapp": "phone",
  whatsapp: "phone",
  "no wa": "phone",
  "nomor wa": "phone",
  "no hp": "phone",
  hp: "phone",
  telepon: "phone",
  phone: "phone",
  grup: "groupLabel",
  group: "groupLabel",
  kelompok: "groupLabel",
  kategori: "groupLabel",
};

function cellText(v: ExcelJS.CellValue): string {
  if (v === null || v === undefined) return "";
  if (typeof v === "string" || typeof v === "number" || typeof v === "boolean") return String(v);
  if (v instanceof Date) return v.toISOString();
  if (typeof v === "object") {
    if ("text" in v && typeof v.text === "string") return v.text;
    if ("result" in v) return String(v.result ?? "");
    if ("richText" in v && Array.isArray(v.richText)) return v.richText.map((t) => t.text).join("");
  }
  return "";
}

function fromRows(rows: string[][]): { guests: ParsedGuest[]; skipped: number } {
  if (!rows.length) return { guests: [], skipped: 0 };
  const header = rows[0].map((h) => h.trim().toLowerCase());
  const idx: Partial<Record<keyof ParsedGuest, number>> = {};
  header.forEach((h, i) => {
    const k = ALIASES[h];
    if (k && idx[k] === undefined) idx[k] = i;
  });
  const hasHeader = idx.name !== undefined;
  if (!hasHeader) idx.name = 0;
  const guests: ParsedGuest[] = [];
  let skipped = 0;
  for (const r of rows.slice(hasHeader ? 1 : 0)) {
    const name = (r[idx.name!] ?? "").replace(/\s+/g, " ").trim().slice(0, 100);
    if (!name) {
      if (r.some((c) => c.trim())) skipped++;
      continue;
    }
    guests.push({
      name,
      phone: idx.phone !== undefined ? (r[idx.phone] ?? "").replace(/[^\d+]/g, "").slice(0, 20) || null : null,
      groupLabel: idx.groupLabel !== undefined ? (r[idx.groupLabel] ?? "").trim().slice(0, 40) || null : null,
    });
  }
  return { guests, skipped };
}

function parseCsv(text: string): string[][] {
  const sep = (text.split("\n")[0].match(/;/g)?.length ?? 0) > (text.split("\n")[0].match(/,/g)?.length ?? 0) ? ";" : ",";
  const rows: string[][] = [];
  let row: string[] = [];
  let cur = "";
  let q = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (q) {
      if (ch === '"' && text[i + 1] === '"') {
        cur += '"';
        i++;
      } else if (ch === '"') q = false;
      else cur += ch;
    } else if (ch === '"') q = true;
    else if (ch === sep) {
      row.push(cur);
      cur = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      row.push(cur);
      rows.push(row);
      row = [];
      cur = "";
    } else cur += ch;
  }
  if (cur || row.length) {
    row.push(cur);
    rows.push(row);
  }
  return rows;
}

export async function parseGuestFile(file: File) {
  const buf = Buffer.from(await file.arrayBuffer());
  if (/\.csv$/i.test(file.name) || file.type === "text/csv") {
    return fromRows(parseCsv(buf.toString("utf8").replace(/^﻿/, "")));
  }
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.load(buf as unknown as ExcelJS.Buffer);
  const ws = wb.worksheets[0];
  if (!ws) return { guests: [], skipped: 0 };
  const rows: string[][] = [];
  ws.eachRow({ includeEmpty: false }, (r) => {
    const vals = (r.values as ExcelJS.CellValue[]).slice(1).map(cellText);
    rows.push(vals);
  });
  return fromRows(rows);
}

export async function guestTemplate() {
  const wb = new ExcelJS.Workbook();
  wb.creator = "Rayakan.my.id";
  const ws = wb.addWorksheet("Daftar Tamu", { views: [{ state: "frozen", ySplit: 1 }] });
  ws.columns = [
    { header: "Nama Tamu", key: "name", width: 34 },
    { header: "Nomor WhatsApp", key: "phone", width: 22 },
    { header: "Grup", key: "group", width: 20 },
  ];
  ws.addRow(["Bapak/Ibu Budi Santoso", "081234567890", "Keluarga"]);
  ws.addRow(["Sinta & Partner", "", "Teman kampus"]);
  const h = ws.getRow(1);
  h.font = { bold: true, color: { argb: "FFFFFFFF" } };
  h.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF120D10" } };
  return Buffer.from(await wb.xlsx.writeBuffer());
}
