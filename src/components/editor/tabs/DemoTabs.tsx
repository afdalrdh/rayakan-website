"use client";

import { SITE_HOST } from "@/lib/messages";
import { useEditor } from "../context";
import { Group } from "../fields";
import { TabShell } from "./TabShell";

/* Sandbox-only versions of the Tamu / Ucapan / Lainnya tabs (no database). */

const SAMPLE_GUESTS = [
  { name: "Keluarga Wijaya", status: "Terkirim" },
  { name: "Bagus Hartono", status: "Belum dikirim" },
  { name: "Ibu Ratna Sari", status: "Terkirim" },
  { name: "Sinta Permata", status: "Belum dikirim" },
];

export function DemoGuestsTab() {
  const { slug } = useEditor();
  return (
    <TabShell title="Tamu & Kirim WA" note="Daftar tamu, import Excel, link nama per tamu, dan template pesan WhatsApp diambil dari admin Arya. Menu ini disambungkan ke database di tahap berikutnya.">
      <div className="divide-y divide-rk-line overflow-hidden rounded-2xl border border-rk-line bg-white">
        {SAMPLE_GUESTS.map((g) => (
          <div key={g.name} className="flex items-center gap-3 px-4 py-3.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-rk-cream font-rk-sans text-[13px] font-bold text-rk-ink">{g.name.charAt(0)}</span>
            <span className="min-w-0 flex-1">
              <span className="block font-rk-sans text-[14px] font-semibold text-rk-ink">{g.name}</span>
              <span className="block truncate font-rk-sans text-[12px] text-rk-mute">{SITE_HOST}/{slug}/{g.name.toLowerCase().replace(/\s+/g, "-")}</span>
            </span>
            <span className={`rounded-full px-2.5 py-1 font-rk-sans text-[11px] font-bold ${g.status === "Terkirim" ? "bg-emerald-50 text-emerald-700" : "bg-[#25D366] text-white"}`}>{g.status === "Terkirim" ? "✓ Terkirim" : "WhatsApp"}</span>
          </div>
        ))}
      </div>
    </TabShell>
  );
}

export function DemoWishesTab() {
  return (
    <TabShell title="Ucapan & Kehadiran" note="Rekap RSVP (hadir / tidak hadir) dan semua ucapan tamu, sama seperti menu Reservasi di admin Arya. Disambungkan ke database di tahap berikutnya.">
      <div className="grid grid-cols-3 gap-2.5">
        {[
          ["24", "Ucapan"],
          ["19", "Hadir"],
          ["5", "Tidak hadir"],
        ].map(([n, l]) => (
          <div key={l} className="rounded-2xl border border-rk-line bg-white p-3.5">
            <p className="font-rk-sans text-[24px] font-semibold leading-none tracking-tight tabular-nums text-rk-ink">{n}</p>
            <p className="mt-1 font-rk-sans text-[12px] text-rk-mute">{l}</p>
          </div>
        ))}
      </div>
    </TabShell>
  );
}

export function DemoMoreTab({ onReset, onSave }: { onReset: () => void; onSave: () => void }) {
  return (
    <TabShell title="Lainnya" note="Kamu sedang memakai Coba Gratis. Perubahan tersimpan di browser ini sampai kamu menyimpan draf.">
      <Group title="Simpan & lanjutkan kapan saja">
        <p className="font-rk-sans text-[13px] leading-relaxed text-rk-mute">Simpan draf dengan nama dan nomor WhatsApp. Kamu dapat alamat undangan sendiri dan link edit pribadi, lalu bisa kirim ke admin saat siap diterbitkan.</p>
        <button type="button" onClick={onSave} className="h-12 w-full rounded-2xl bg-rk-ink font-rk-sans text-[14px] font-bold text-white">
          Simpan draf
        </button>
      </Group>
      <button type="button" onClick={onReset} className="w-full rounded-2xl border border-rk-line bg-white py-3 font-rk-sans text-[14px] font-semibold text-red-700">
        Mulai ulang dari contoh tema
      </button>
    </TabShell>
  );
}
