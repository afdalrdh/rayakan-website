import { contentTypeOf, readLocalFile } from "@/server/media";

/** Local development only: serves files saved to .data/uploads. */
export async function GET(_req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const rel = (await params).path.join("/");
  const data = await readLocalFile(rel);
  if (!data) return new Response("Not found", { status: 404 });
  return new Response(new Uint8Array(data), {
    headers: { "Content-Type": contentTypeOf(rel), "Cache-Control": "public, max-age=31536000, immutable" },
  });
}
