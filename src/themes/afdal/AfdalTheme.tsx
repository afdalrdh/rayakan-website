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

/** "Putih Marun" — light, airy, oversized condensed names. Adapted from the Afdal & Putri site. */
export function AfdalTheme({ guestName }: { guestName: string }) {
  const { content, mode } = useTheme();
  const logo = <CoupleLogo className="h-auto w-[120px] brightness-0 invert sm:w-[150px] md:w-[170px]" />;
  return (
    <main style={paletteStyle(content)} className="min-h-screen bg-t-bg text-neutral-950">
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
