"use client";

import type { Person } from "@/lib/content";
import { Block, EmptyPhoto, Img, InstagramIcon, useTheme, VideoEmbed } from "../../shared";
import { SECTION_Y } from "./Heading";

function ProfileCard({ p }: { p: Person }) {
  const handle = p.instagram.replace(/^@/, "").trim();
  return (
    <article className="mx-auto grid h-full w-full grid-cols-[108px_1fr] items-center gap-4 rounded-[18px] bg-white p-3.5 text-left shadow-[0_18px_50px_rgba(58,35,28,0.07)] md:grid-cols-[150px_1fr] md:gap-6 md:p-4">
      <div className="relative aspect-[3/4] overflow-hidden rounded-[12px] bg-t-input">
        {p.photo ? <Img src={p.photo} alt={p.fullName} fill sizes="300px" className="object-cover" /> : <EmptyPhoto label="Foto" />}
      </div>
      <div className="flex min-w-0 flex-col justify-center">
        <h3 className="font-serif text-[17px] font-bold leading-[1.2] text-t-accent md:text-[22px]">{p.fullName || "Nama lengkap"}</h3>
        <p className="mt-2 text-[12.5px] leading-[1.55] text-[#756b67] md:mt-3 md:text-[14px] md:leading-[1.65]">{p.parents}</p>
        {handle && (
          <a href={`https://instagram.com/${handle}`} target="_blank" rel="noreferrer" className="mt-2 inline-flex w-fit items-center gap-1.5 rounded-md bg-t-input px-2.5 py-1 text-[12px] font-semibold leading-none text-[#332724] md:mt-4 md:text-[13px]">
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
      <section id="invitation" className={`bg-t-bg px-5 text-center font-sans text-[#5b4d49] md:px-8 ${SECTION_Y}`}>
        <div className="mx-auto max-w-[1120px]">
          {cp.showBismillah && (
            <div
              role="img"
              aria-label="Bismillahirrahmanirrahim"
              className="mx-auto aspect-[306/64] w-[220px] bg-t-accent sm:w-[260px] md:w-[300px]"
              style={{ mask: "url(/themes/shared/bismillah.svg) center / contain no-repeat", WebkitMask: "url(/themes/shared/bismillah.svg) center / contain no-repeat" }}
            />
          )}
          <h2 className="mx-auto mt-8 max-w-[340px] px-2 font-serif text-[22px] italic leading-[1.3] text-t-accent sm:max-w-[580px] sm:text-[28px] md:mt-10 md:max-w-[820px] md:text-[34px]">&quot;{cp.headline}&quot;</h2>
          <div className="mx-auto mt-8 h-px w-12 bg-t-muted/40 md:mt-10" />
          {cp.videoUrl && <VideoEmbed url={cp.videoUrl} thumb={cp.videoThumb} title={`Video ${c.hero.firstName} & ${c.hero.secondName}`} className="mx-auto mt-10 max-w-[520px] md:mt-14 md:max-w-[960px]" />}
          {cp.quote && <p className="mx-auto mt-10 max-w-[340px] text-[14px] leading-[1.7] text-[#6a615e] sm:max-w-[540px] md:mt-12 md:max-w-[760px] md:text-[16px] md:leading-[1.8]">{cp.quote}</p>}
          <div className="mx-auto mt-16 h-px w-12 bg-t-muted/40 md:mt-20" />
          <p className="mt-8 text-[12px] font-medium uppercase tracking-[0.24em] text-t-muted md:mt-10 md:text-[13px]">The Bride &amp; Groom</p>
          <div className="mx-auto mt-8 grid max-w-[400px] gap-5 sm:max-w-[720px] sm:grid-cols-2 md:mt-10 md:max-w-[1000px] md:gap-8">
            <ProfileCard p={cp.first} />
            <ProfileCard p={cp.second} />
          </div>
        </div>
      </section>
    </Block>
  );
}
