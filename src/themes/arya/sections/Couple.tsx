"use client";

import type { Person } from "@/lib/content";
import { Block, EmptyPhoto, Img, InstagramIcon, useTheme, VideoEmbed } from "../../shared";

function ProfileCard({ p }: { p: Person }) {
  const handle = p.instagram.replace(/^@/, "").trim();
  return (
    <article className="group flex flex-col overflow-hidden rounded-[22px] border border-white/10 bg-t-card p-4 text-left shadow-[0_20px_40px_rgba(0,0,0,0.4)] transition duration-300 hover:border-t-accent/40 md:p-5">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[16px] bg-t-input">
        {p.photo ? <Img src={p.photo} alt={p.fullName} fill quality={80} sizes="(min-width: 768px) 460px, 92vw" className="object-cover transition duration-500 group-hover:scale-105" /> : <EmptyPhoto />}
      </div>
      <div className="flex flex-1 flex-col justify-between pt-5">
        <div>
          <h3 className="font-serif text-[20px] font-semibold leading-[1.2] text-t-accent md:text-[23px]">{p.fullName || "Nama lengkap"}</h3>
          <p className="mt-2 font-sans text-[13px] leading-[1.6] text-neutral-400 md:text-[14px]">{p.parents}</p>
        </div>
        {handle && (
          <a
            href={`https://instagram.com/${handle}`}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex w-fit items-center gap-2 rounded-full border border-t-accent/30 bg-t-input px-3.5 py-1.5 font-sans text-[12px] font-medium text-t-accent transition hover:border-t-accent"
          >
            <InstagramIcon />@{handle}
          </a>
        )}
      </div>
    </article>
  );
}

/** Opening text, optional video, both profiles and the quote. */
export function Couple() {
  const { content: c } = useTheme();
  const cp = c.couple;
  return (
    <Block id="couple">
      <section id="invitation" className="relative bg-t-bg px-4 py-16 text-center font-sans text-neutral-300 sm:px-6 md:px-8 md:py-24">
        <div className="mx-auto max-w-[1100px]">
          {cp.showBismillah && (
            <div
              role="img"
              aria-label="Bismillahirrahmanirrahim"
              className="mx-auto aspect-[306/64] w-[220px] bg-linear-to-r from-t-muted via-t-accent to-t-muted sm:w-[260px] md:w-[300px]"
              style={{ mask: "url(/themes/shared/bismillah.svg) center / contain no-repeat", WebkitMask: "url(/themes/shared/bismillah.svg) center / contain no-repeat" }}
            />
          )}
          <h2 className="mx-auto mt-6 max-w-[850px] font-serif text-[22px] italic leading-[1.3] text-t-accent sm:text-[30px] md:mt-8 md:text-[38px]">&quot;{cp.headline}&quot;</h2>
          <div className="mx-auto mt-6 h-px w-14 bg-t-muted/60 md:mt-8" />
          {cp.videoUrl && <VideoEmbed url={cp.videoUrl} thumb={cp.videoThumb} title={`Video ${c.hero.firstName} & ${c.hero.secondName}`} className="mx-auto mt-12 max-w-[960px] rounded-[22px] border border-white/10" />}
          <div className="mx-auto mt-12 grid max-w-[960px] gap-6 sm:grid-cols-2 md:gap-8">
            <ProfileCard p={cp.first} />
            <ProfileCard p={cp.second} />
          </div>
          {cp.quote && <p className="mx-auto mt-14 max-w-[820px] px-2 font-sans text-[13px] leading-[1.75] text-neutral-400 sm:text-[14px] md:mt-16 md:text-[15px] md:leading-[1.85]">{cp.quote}</p>}
        </div>
      </section>
    </Block>
  );
}
