import { guestTemplate } from "@/lib/server/excel";

export async function GET() {
  const buf = await guestTemplate();
  return new Response(new Uint8Array(buf), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="template-daftar-tamu.xlsx"',
    },
  });
}
