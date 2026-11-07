import { ArrowRight, Check, Star, User } from "lucide-react";
import Link from "next/link";
import { getOccasion, isOccasion, type Occasion } from "@/lib/content";
import { TRUST } from "@/lib/marketing";
import type { ReviewRecord } from "@/lib/records";

/*
 * Reviews from real clients (written in Admin → Pengaturan, approved in
 * Studio → Ulasan), shown on the home page as two slowly moving rows of cards.
 * The cards are not clickable on purpose: the section is something to read in
 * passing, not to navigate. Never add made-up reviews.
 */

function Stars({ n, className = "h-4 w-4" }: { n: number; className?: string }) {
  return (
    <span className="inline-flex gap-0.5" role="img" aria-label={`${n} dari 5 bintang`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} aria-hidden className={`${className} ${i <= n ? "fill-[#E9A23B] text-[#E9A23B]" : "fill-rk-line text-rk-line"}`} />
      ))}
    </span>
  );
}

const occasionOf = (r: ReviewRecord): Occasion => (isOccasion(r.occasion) ? r.occasion : "nikah");
const shortDate = (iso: string) => new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });

/** One review: who wrote it, the stars, their words, and when. */
function ReviewCard({ r, hidden = false }: { r: ReviewRecord; hidden?: boolean }) {
  return (
    <article aria-hidden={hidden || undefined} className="flex w-[290px] shrink-0 flex-col rounded-[20px] border border-rk-line/80 bg-[#fffdf9] p-6 shadow-[0_16px_32px_-28px_rgba(60,40,20,0.55)] sm:w-[320px]">
      <div className="flex items-center gap-3.5">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#f3e7d7] text-rk-bronze">
          <User aria-hidden className="h-[22px] w-[22px]" strokeWidth={1.6} />
        </span>
        <span className="min-w-0">
          <span className="block truncate font-rk-serif text-[19px] leading-tight text-rk-ink">{r.name}</span>
          <span className="mt-0.5 block truncate text-[13px] text-rk-ink/55">
            {getOccasion(occasionOf(r)).name}
            {r.city ? ` · ${r.city}` : ""}
          </span>
        </span>
      </div>
      <Stars n={r.rating} className="mt-5 h-[18px] w-[18px]" />
      <p className="mt-3.5 line-clamp-6 whitespace-pre-line text-[15px] leading-relaxed text-rk-ink/85">&ldquo;{r.message}&rdquo;</p>
      <time dateTime={r.createdAt} className="mt-auto pt-5 text-[13px] text-rk-ink/50">
        {shortDate(r.createdAt)}
      </time>
    </article>
  );
}

/** Below this many reviews a moving row would just repeat the same cards, so they sit still. */
const MIN_FOR_SLIDER = 4;
/** From this many reviews they split into two rows moving in opposite directions. */
const MIN_FOR_TWO_ROWS = 10;

/**
 * One endlessly moving row. The cards are repeated until one copy is wider
 * than a large screen, then that copy is rendered twice and the track slides
 * by exactly one copy (translateX -50%), so the loop has no visible seam.
 */
function MarqueeRow({ items, reverse = false }: { items: ReviewRecord[]; reverse?: boolean }) {
  const repeat = Math.max(1, Math.ceil(7 / items.length));
  const copy = Array.from({ length: repeat }, () => items).flat();
  return (
    <div className="overflow-hidden motion-reduce:overflow-x-auto">
      <div className={`rk-marquee flex w-max ${reverse ? "rk-marquee-rev" : ""}`} style={{ animationDuration: `${copy.length * 9}s` }}>
        {[0, 1].map((half) => (
          <div key={half} className="flex items-stretch gap-5 pr-5">
            {copy.map((r, i) => (
              <ReviewCard key={`${half}-${i}`} r={r} hidden={half === 1 || i >= items.length} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Approved reviews: a still row when there are only a few, otherwise one or two auto-sliding rows. */
export function ReviewSlider({ reviews }: { reviews: ReviewRecord[] }) {
  if (reviews.length < MIN_FOR_SLIDER) {
    return (
      <div className="flex flex-wrap items-stretch justify-center gap-5 px-4">
        {reviews.map((r) => (
          <ReviewCard key={r.id} r={r} />
        ))}
      </div>
    );
  }
  const rows = reviews.length >= MIN_FOR_TWO_ROWS ? [reviews.filter((_, i) => i % 2 === 0), reviews.filter((_, i) => i % 2 === 1)] : [reviews];
  return (
    <div className="rk-fade-x space-y-5">
      {rows.map((row, i) => (
        <MarqueeRow key={i} items={row} reverse={i === 1} />
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
