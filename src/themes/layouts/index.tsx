"use client";

import type { BlockKey } from "@/lib/content";
import { layoutOf } from "./catalog";
import { CLOSING_LAYOUTS } from "./closing";
import { COUPLE_LAYOUTS } from "./couple";
import { COVER_LAYOUTS } from "./cover";
import { EVENT_LAYOUTS } from "./event";
import { GALLERY_LAYOUTS } from "./gallery";
import { GIFT_LAYOUTS } from "./gift";
import { HERO_LAYOUTS } from "./hero";
import { RSVP_LAYOUTS } from "./rsvp";
import { STORY_LAYOUTS } from "./story";
import { VENUE_LAYOUTS } from "./venue";

type SectionComp = () => React.JSX.Element | null;

/** Component for every (block, layout id). The catalogue (catalog.ts) lists the same ids. */
const SECTIONS: Record<Exclude<BlockKey, "cover">, Record<string, SectionComp>> = {
  hero: HERO_LAYOUTS,
  couple: COUPLE_LAYOUTS,
  story: STORY_LAYOUTS,
  event: EVENT_LAYOUTS,
  venue: VENUE_LAYOUTS,
  gallery: GALLERY_LAYOUTS,
  rsvp: RSVP_LAYOUTS,
  gift: GIFT_LAYOUTS,
  closing: CLOSING_LAYOUTS,
};

export function sectionComponent(block: Exclude<BlockKey, "cover">, id: string | undefined): SectionComp {
  return SECTIONS[block][layoutOf(block, id).id];
}

export function coverFace(id: string | undefined) {
  return COVER_LAYOUTS[layoutOf("cover", id).id];
}
