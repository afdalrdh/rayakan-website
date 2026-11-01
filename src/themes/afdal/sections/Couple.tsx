"use client";

import type { Person } from "@/lib/content";
import { Block, EmptyPhoto, Img, InstagramIcon, useTheme, VideoEmbed } from "../../shared";

function ProfileCard({ p }: { p: Person }) {
  const handle = p.instagram.replace(/^@/, "").trim();
  return (
    <article className="mx-auto grid w-full max-w-[500px] grid-cols-[112px_1fr] gap-4 rounded-[16px] bg-white p-3 text-left shadow-[0_18px_50px_rgba(58,35,28,0.06)] sm:grid-cols-[96px_1fr] sm:gap-3 md:grid-cols-[150px_1fr] md:gap-5 md:p-4">
      <div className="relative aspect-[3/4] overflow-hidden rounded-[12px] bg-t-input">
        {p.photo ? <Img src={p.photo} alt={p.fullName} fill sizes="300px" className="object-cover" /> : <EmptyPhoto label="Foto" />}
      </div>
      <div className="flex min-w-0 flex-col justify-center">
        <h3 className="font-serif text-[15px] font-bold leading-[1.12] text-t-accent md:text-[22px]">{p.fullName || "Nama lengkap"}</h3>
        <p className="mt-2 text-[11px] leading-[1.5] text-[#756b67] md:mt-3 md:text-[14px] md:leading-[1.65]">{p.parents}</p>
        {handle && (
          <a href={`https://instagram.com/${handle}`} target="_blank" rel="noreferrer" className="mt-2 inline-flex w-fit items-center gap-1.5 rounded-md bg-t-input px-2.5 py-1 text-[11px] font-semibold leading-none text-[#332724] md:mt-3 md:text-[13px]">
            <InstagramIcon size={13} />
            {handle}
          </a>
        )}
      </div>
    </article>
  );
}

/** Calligraphy, invitation line, optional video, quote and both profiles. */
export function Couple() {
  const { content: c } = useTheme();
  const cp = c.couple;
  return (
    <Block id="couple">
      <section id="invitation" className="bg-t-bg px-4 py-14 text-center font-sans text-[#5b4d49] md:px-8 md:py-24">
        <div className="mx-auto max-w-[1200px]">
          {cp.showBismillah && (
            <div
              role="img"
              aria-label="Bismillahirrahmanirrahim"
              className="mx-auto aspect-[306/64] w-[220px] bg-t-accent sm:w-[260px] md:w-[300px]"
              style={{ mask: "url(/themes/shared/bismillah.svg) center / contain no-repeat", WebkitMask: "url(/themes/shared/bismillah.svg) center / contain no-repeat" }}
            />
          )}
          <h2 className="mx-auto mt-7 max-w-[340px] px-2 font-serif text-[21px] italic leading-[1.25] text-t-accent sm:max-w-[580px] sm:text-[29px] md:mt-8 md:max-w-[860px] md:text-[34px]">&quot;{cp.headline}&quot;</h2>
          <div className="mx-auto mt-8 h-px w-9 bg-t-muted/30 md:mt-10" />
          {cp.videoUrl && <VideoEmbed url={cp.videoUrl} thumb={cp.videoThumb} title={`Video ${c.hero.firstName} & ${c.hero.secondName}`} className="mx-auto mt-14 max-w-[520px] md:mt-16 md:max-w-[1040px]" />}
          {cp.quote && <p className="mx-auto mt-8 max-w-[340px] text-[14px] leading-[1.62] text-[#6a615e] sm:max-w-[540px] md:mt-9 md:max-w-[860px] md:text-[16px] md:leading-[1.82]">{cp.quote}</p>}
          <div className="mx-auto mt-10 h-px w-9 bg-t-muted/30 md:mt-24" />
          <p className="mt-7 text-[11px] uppercase tracking-[0.3em] text-t-muted md:mt-10">The Bride &amp; Groom</p>
          <div className="mx-auto mt-8 grid max-w-[340px] gap-7 sm:max-w-[640px] sm:grid-cols-2 md:mt-9 md:max-w-[1140px] md:gap-14">
            <ProfileCard p={cp.first} />
            <ProfileCard p={cp.second} />
          </div>
        </div>
      </section>
    </Block>
  );
}
