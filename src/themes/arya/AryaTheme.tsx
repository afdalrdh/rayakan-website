"use client";

import type { SectionKey } from "@/lib/content";
import { CoupleLogo, CoverInline, CoverOverlay, paletteStyle, useTheme } from "../shared";
import { Hero } from "./Hero";
import { Closing } from "./sections/Closing";
import { Couple } from "./sections/Couple";
import { EventDate } from "./sections/EventDate";
import { Gallery } from "./sections/Gallery";
import { Gift } from "./sections/Gift";
import { Rsvp } from "./sections/Rsvp";
import { Story } from "./sections/Story";
import { Venue } from "./sections/Venue";

const SECTIONS: Record<SectionKey, () => React.JSX.Element | null> = { couple: Couple, story: Story, event: EventDate, venue: Venue, gallery: Gallery, rsvp: Rsvp, gift: Gift };

/** "Malam Emas" — dark, cinematic, gold accents. Adapted from the Arya & Alma site. */
export function AryaTheme({ guestName }: { guestName: string }) {
  const { content, mode } = useTheme();
  const logo = <CoupleLogo underline className="h-auto w-[80px] sm:w-[95px] md:w-[110px]" />;
  return (
    <main style={paletteStyle(content)} className="min-h-screen bg-t-bg text-[#F5F0E8]">
      {mode === "edit" && <CoverInline guestName={guestName} logo={logo} />}
      <Hero />
      {content.order
        .filter((k) => !content.hidden.includes(k))
        .map((k) => {
          const S = SECTIONS[k];
          return <S key={k} />;
        })}
      <Closing />
      {mode === "live" && <CoverOverlay guestName={guestName} logo={logo} />}
    </main>
  );
}
