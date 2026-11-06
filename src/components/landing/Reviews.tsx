import { ArrowUpRight, Lock, Star } from "lucide-react";
import { getOccasion } from "@/lib/content";
import type { ReviewRecord } from "@/lib/server/data";

/*
 * Real reviews from clients (approved in Studio → Ulasan). Invitations are
 * private by default; only owners who allowed it get a "Lihat website" link.
 */

function Stars({ n, className = "h-4 w-4" }: { n: number; className?: string }) {
  return (
    <span className="inline-flex gap-0.5" aria-label={`${n} dari 5 bintang`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={`${className} ${i <= n ? "fill-[#F5B400] text-[#F5B400]" : "text-rk-line"}`} />
      ))}
    </span>
  );
}

const AVATAR = ["#E9C8B5", "#CFE0D2", "#D9D2EE", "#F3D8A7", "#F2C6CF", "#C9DCEB"];

function initial(name: string) {
  return name.trim().charAt(0).toUpperCase() || "R";
}

export function ReviewSummary({ reviews, made }: { reviews: ReviewRecord[]; made: number }) {
  const avg = reviews.reduce((n, r) => n + r.rating, 0) / Math.max(1, reviews.length);
  return (
    <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
      <div className="flex items-center gap-3">
        <p className="font-rk-display text-[52px] font-light leading-none tracking-[-0.03em]">{avg.toFixed(1)}</p>
        <div>
          <Stars n={Math.round(avg)} />
          <p className="mt-1 text-[13px] text-rk-mute">dari {reviews.length} ulasan pengguna</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="flex -space-x-2.5">
          {reviews.slice(0, 5).map((r, i) => (
            <span key={r.id} className="flex h-9 w-9 items-center justify-center rounded-full text-[13px] font-bold text-rk-ink ring-[3px] ring-[#efe7da]" style={{ background: AVATAR[i % AVATAR.length] }}>
              {initial(r.name)}
            </span>
          ))}
        </span>
        {made >= 25 && <p className="text-[13px] leading-tight text-rk-ink/70">{made}+ undangan sudah dibuat di Rayakan.my.id</p>}
      </div>
    </div>
  );
}

export function ReviewGrid({ reviews }: { reviews: ReviewRecord[] }) {
  return (
    <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
      {reviews.map((r, i) => (
        <article key={r.id} className="mb-4 break-inside-avoid rounded-[22px] border border-rk-line/80 bg-[#fffdf9] p-5 shadow-[0_18px_36px_-30px_rgba(60,40,20,0.6)]">
          <div className="flex items-center justify-between gap-2">
            <Stars n={r.rating} className="h-3.5 w-3.5" />
            <span className="text-[11px] text-rk-mute">{new Date(r.createdAt).toLocaleDateString("id-ID", { month: "short", year: "numeric" })}</span>
          </div>
          <p className="mt-3 whitespace-pre-line text-[14.5px] leading-relaxed text-rk-ink/85">&ldquo;{r.message}&rdquo;</p>
          <div className="mt-4 flex items-center gap-3 border-t border-rk-line/70 pt-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[13px] font-bold text-rk-ink" style={{ background: AVATAR[i % AVATAR.length] }}>
              {initial(r.name)}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[14px] font-semibold">{r.name}</span>
              <span className="block truncate text-[12px] text-rk-mute">
                {getOccasion(r.occasion).name}
                {r.city ? ` · ${r.city}` : ""}
              </span>
            </span>
            {r.link ? (
              <a href={r.link} target="_blank" rel="noreferrer" className="inline-flex h-8 shrink-0 items-center gap-1 rounded-full bg-rk-ink px-3 text-[12px] font-semibold text-white">
                Lihat <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            ) : (
              <span title="Dijaga privasinya atas permintaan pemilik acara" className="inline-flex h-8 shrink-0 items-center gap-1 rounded-full bg-rk-cream px-3 text-[11.5px] font-semibold text-rk-mute">
                <Lock className="h-3 w-3" /> Privat
              </span>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
