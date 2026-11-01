import type { BlockKey } from "@/lib/content";
import { ClosingForm } from "./ClosingForm";
import { CoupleForm } from "./CoupleForm";
import { CoverForm } from "./CoverForm";
import { EventForm } from "./EventForm";
import { GalleryForm } from "./GalleryForm";
import { GiftForm } from "./GiftForm";
import { HeroForm } from "./HeroForm";
import { RsvpForm } from "./RsvpForm";
import { StoryForm } from "./StoryForm";
import { VenueForm } from "./VenueForm";

/** One form per editable block. Add a block = add a form here. */
export const BLOCK_FORMS: Record<BlockKey, () => React.JSX.Element> = {
  cover: CoverForm,
  hero: HeroForm,
  couple: CoupleForm,
  story: StoryForm,
  event: EventForm,
  venue: VenueForm,
  gallery: GalleryForm,
  rsvp: RsvpForm,
  gift: GiftForm,
  closing: ClosingForm,
};
