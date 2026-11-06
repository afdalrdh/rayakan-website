/**
 * What server actions return to the UI: either `{ ok: true, ...data }` or a
 * human-readable error. Actions catch their own errors so a failed request
 * never shows Next's error page in the middle of an editor.
 */
export type ActionResult<T = object> = ({ ok: true } & T) | { ok: false; error: string };

export function fail(e: unknown): { ok: false; error: string } {
  return { ok: false, error: e instanceof Error ? e.message : "Terjadi kesalahan." };
}
