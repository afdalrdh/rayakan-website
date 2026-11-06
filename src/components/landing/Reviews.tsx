import { ArrowRight, Check, Star } from "lucide-react";
import Link from "next/link";
import { getOccasion, isOccasion, type Occasion } from "@/lib/content";
import { TRUST } from "@/lib/marketing";
import type { ReviewRecord } from "@/lib/records";

/*
 * Reviews from real clients (written in Admin → Pengaturan, approved in
 * Studio → Ulasan). Avatars are small illustrations, never photos, so nobody's
 * face is shown. Invitations are private by default; only owners who allowed
 * it get a "Lihat undangan" link. Never add made-up reviews.
 */

const TINTS = ["#F1D9C7", "#D9E6D6", "#E1DAF0", "#F4E1B7", "#F3D2DA", "#D3E2EE"];

function Stars({ n, className = "h-4 w-4" }: { n: number; className?: string }) {
  return (
    <span className="inline-flex gap-0.5" role="img" aria-label={`${n} dari 5 bintang`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} aria-hidden className={`${className} ${i <= n ? "fill-[#E9A23B] text-[#E9A23B]" : "text-rk-line"}`} />
      ))}
    </span>
  );
}

/** Faceless illustrated avatar: a couple, a birthday child, or a boy in a peci. */
export function ReviewAvatar({ occasion, seed, className = "h-10 w-10" }: { occasion: Occasion; seed: number; className?: string }) {
  const bg = TINTS[seed % TINTS.length];
  const skin = ["#E8B998", "#D9A07B", "#C98B65"][seed % 3];
  const hair = "#3A2A22";
  return (
    <svg viewBox="0 0 40 40" aria-hidden className={`shrink-0 rounded-full ${className}`}>
      <rect width="40" height="40" rx="20" fill={bg} />
      {occasion === "nikah" ? (
        <>
          {/* groom */}
          <path d="M5 40 C 5 30, 10 27, 15 27 C 20 27, 24 30, 24 40 Z" fill="#3F4659" />
          <circle cx="14.5" cy="19" r="5.6" fill={skin} />
          <path d="M8.8 18 C 9 12.5, 20 12, 20.2 17.6 C 17 15.6, 12 15.8, 8.8 18 Z" fill={hair} />
          {/* bride with hijab */}
          <path d="M17 40 C 17 29, 22 26, 27 26 C 32 26, 36 29, 36 40 Z" fill="#FFFFFF" />
          <path d="M20.2 23.5 C 20 15, 33.8 15, 33.6 23.5 C 33.4 28.5, 20.4 28.5, 20.2 23.5 Z" fill="#F6E7DD" />
          <circle cx="26.9" cy="21.4" r="4.6" fill={skin} />
        </>
      ) : occasion === "ultah" ? (
        <>
          <path d="M9 40 C 9 30, 14 27, 20 27 C 26 27, 31 30, 31 40 Z" fill="#F2C14E" />
          <circle cx="20" cy="20" r="6.4" fill={skin} />
          <path d="M13.6 19.4 C 13.4 13.4, 26.6 13.4, 26.4 19.4 C 23.5 16.8, 16.5 16.8, 13.6 19.4 Z" fill={hair} />
          <path d="M15.5 13.4 L20 3.8 L24.5 13.4 Z" fill="#E86A6A" />
          <circle cx="20" cy="3.8" r="1.8" fill="#FFFFFF" />
        </>
      ) : (
        <>
          <path d="M9 40 C 9 30, 14 27, 20 27 C 26 27, 31 30, 31 40 Z" fill="#FFFFFF" />
          <circle cx="20" cy="20.5" r="6.2" fill={skin} />
          <rect x="13.4" y="11.2" width="13.2" height="6.4" rx="1.6" fill="#1F2A2A" />
          <path d="M14 31 L26 31 L25 40 L15 40 Z" fill="#2F7A5A" opacity="0.85" />
        </>
      )}
    </svg>
  );
}

const monthYear = (iso: string) => new Date(iso).toLocaleDateString("id-ID", { month: "long", year: "numeric" });
const occasionOf = (r: ReviewRecord): Occasion => (isOccasion(r.occasion) ? r.occasion : "nikah");

/** Average rating, count and a stack of avatars. Only rendered when there are real reviews. */
export function ReviewSummary({ reviews, made }: { reviews: ReviewRecord[]; made: number }) {
  const avg = reviews.reduce((n, r) => n + r.rating, 0) / Math.max(1, reviews.length);
  return (
    <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
      <div className="flex items-center gap-3">
        <p className="font-rk-display text-[52px] font-light leading-none tracking-[-0.03em]">{avg.toFixed(1)}</p>
        <div>
          <Stars n={Math.round(avg)} />
          <p className="mt-1 text-[13px] text-rk-ink/65">dari {reviews.length} ulasan klien</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="flex -space-x-2.5">
          {reviews.slice(0, 5).map((r, i) => (
            <span key={r.id} className="rounded-full ring-[3px] ring-[#efe7da]">
              <ReviewAvatar occasion={occasionOf(r)} seed={i} className="h-9 w-9" />
            </span>
          ))}
        </span>
        {made >= 25 && <p className="text-[13px] leading-tight text-rk-ink/70">{made}+ undangan sudah dibuat di Rayakan.my.id</p>}
      </div>
    </div>
  );
}

/** One review card: stars, the words, then who wrote it. */
function ReviewCard({ r, i }: { r: ReviewRecord; i: number }) {
  const occasion = occasionOf(r);
  return (
    <article className="mb-4 break-inside-avoid rounded-[22px] border border-rk-line/80 bg-[#fffdf9] p-5 shadow-[0_18px_36px_-30px_rgba(60,40,20,0.6)] sm:p-6">
      <div className="flex items-center justify-between gap-2">
        <Stars n={r.rating} className="h-3.5 w-3.5" />
        <time dateTime={r.createdAt} className="text-[12px] text-rk-ink/55">
          {monthYear(r.createdAt)}
        </time>
      </div>
      <p className="mt-3.5 whitespace-pre-line font-rk-display text-[18px] font-light italic leading-[1.45] text-rk-ink/90">&ldquo;{r.message}&rdquo;</p>
      <div className="mt-5 flex items-center gap-3 border-t border-rk-line/70 pt-4">
        <ReviewAvatar occasion={occasion} seed={i} />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[14px] font-semibold">{r.name}</span>
          <span className="block truncate text-[12px] text-rk-ink/60">
            {getOccasion(occasion).name}
            {r.city ? ` · ${r.city}` : ""}
          </span>
        </span>
        {r.link && (
          <a href={r.link} target="_blank" rel="noreferrer" className="shrink-0 text-[12px] font-semibold text-rk-bronze underline-offset-4 hover:underline">
            Lihat undangan
          </a>
        )}
      </div>
    </article>
  );
}

export function ReviewGrid({ reviews }: { reviews: ReviewRecord[] }) {
  return (
    <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
      {reviews.map((r, i) => (
        <ReviewCard key={r.id} r={r} i={i} />
      ))}
    </div>
  );
}

/**
 * Shown while there are no approved reviews yet: honest promises instead of
 * borrowed testimonials, plus a way for clients to leave the first review.
 */
export function ReviewsEmpty({ className = "" }: { className?: string }) {
  return (
    <div className={`grid gap-4 rounded-[26px] border border-rk-line/80 bg-[#fffdf9] p-6 sm:p-8 md:grid-cols-[1.1fr_1fr] md:items-center ${className}`}>
      <div>
        <p className="font-rk-display text-[clamp(26px,3.4vw,36px)] font-light leading-tight">Ulasan pertama sedang kami kumpulkan.</p>
        <p className="mt-3 max-w-[460px] text-[14.5px] leading-relaxed text-rk-ink/70">Kami hanya menampilkan ulasan asli dari klien. Sambil menunggu, ini yang kami janjikan untuk setiap undangan:</p>
        <Link href="/buat" prefetch={false} className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-rk-ink px-5 text-[14px] font-semibold text-white">
          Coba gratis dulu <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <ul className="grid gap-2.5 text-[14.5px]">
        {TRUST.map((t) => (
          <li key={t} className="flex items-center gap-3 rounded-2xl bg-[#f3ece1] px-4 py-3 font-semibold text-rk-ink/85">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-rk-ink text-[#f3d8a7]">
              <Check className="h-3.5 w-3.5" />
            </span>
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
}
