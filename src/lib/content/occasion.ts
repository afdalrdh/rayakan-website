/**
 * Kinds of events an invitation can be for. Every theme and layout works for
 * every occasion: only labels, default texts and the number of people change.
 * No React here, so the server can import it.
 */

export const OCCASION_IDS = ["nikah", "ultah", "khitan"] as const;
export type Occasion = (typeof OCCASION_IDS)[number];

export interface OccasionDef {
  id: Occasion;
  /** "Pernikahan" */
  name: string;
  /** Short label for chips: "Nikah" */
  short: string;
  /** One celebrant (birthday, circumcision) instead of a couple. */
  single: boolean;
  /** Default line above the names ("The Wedding of"). Clients can override it per site. */
  eyebrow: string;
  /** Editor labels for the people. */
  person: [string, string];
  /** Small heading above the profile cards. */
  peopleEyebrow: string;
  /** Editor names for the profile and story blocks. */
  coupleBlock: string;
  storyBlock: string;
  /** Used in "ucapan & doa untuk …". */
  wishFor: string;
  /** Default schedule labels for a new invitation. */
  schedules: [string, string];
  /** Texts swapped in when a site switches occasion (only fields still on a default value). */
  copy: {
    headline: string;
    storyEyebrow: string;
    storyTitle: string;
    rsvpEyebrow: string;
    giftEyebrow: string;
    giftTitle: string;
    closingEyebrow: string;
    closingQuote: string;
    scrollLabel: string;
  };
  /** "Stiker" cover: default small line and title, and suggested speech bubbles. */
  sticker: { kicker: string; title: string; bubbles: [string, string] };
}

export const OCCASIONS: Record<Occasion, OccasionDef> = {
  nikah: {
    id: "nikah",
    name: "Pernikahan",
    short: "Nikah",
    single: false,
    eyebrow: "The Wedding of",
    person: ["Mempelai 1", "Mempelai 2"],
    peopleEyebrow: "The Bride & Groom",
    coupleBlock: "Mempelai",
    storyBlock: "Kisah Cinta",
    wishFor: "kedua mempelai",
    schedules: ["Akad Nikah", "Resepsi"],
    copy: {
      headline: "Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan pernikahan kami",
      storyEyebrow: "Our Story",
      storyTitle: "Kisah Kami",
      rsvpEyebrow: "Wedding Wishes",
      giftEyebrow: "Wedding Gift",
      giftTitle: "Berbagi Kebahagiaan",
      closingEyebrow: "See You On Our Big Day",
      closingQuote: "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu kepada kami",
      scrollLabel: "Jelajahi Kisah Kami",
    },
    sticker: { kicker: "Akhirnya…", title: "Kami Menikah", bubbles: ["Nanti kita nikah, ya!", "Janji kelingking dulu!"] },
  },
  ultah: {
    id: "ultah",
    name: "Ulang Tahun",
    short: "Ultah",
    single: true,
    eyebrow: "Ulang Tahun",
    person: ["Yang berulang tahun", ""],
    peopleEyebrow: "Yang Berulang Tahun",
    coupleBlock: "Yang Berulang Tahun",
    storyBlock: "Cerita",
    wishFor: "yang berulang tahun",
    schedules: ["Acara Utama", "Tiup Lilin"],
    copy: {
      headline: "Dengan penuh sukacita, kami mengundang Bapak/Ibu/Saudara/i dan teman-teman untuk hadir di pesta ulang tahun",
      storyEyebrow: "Cerita",
      storyTitle: "Tumbuh Setiap Tahun",
      rsvpEyebrow: "Birthday Wishes",
      giftEyebrow: "Birthday Gift",
      giftTitle: "Kirim Kado",
      closingEyebrow: "Sampai Jumpa di Pesta",
      closingQuote: "Kehadiran dan doa kalian adalah kado terindah. Terima kasih sudah ikut merayakan!",
      scrollLabel: "Lihat Undangan",
    },
    sticker: { kicker: "Yeay!", title: "Aku Ulang Tahun", bubbles: ["Datang ke pestaku, ya!", "Ada kue & balon!"] },
  },
  khitan: {
    id: "khitan",
    name: "Khitanan",
    short: "Khitan",
    single: true,
    eyebrow: "Tasyakuran Khitanan",
    person: ["Ananda", ""],
    peopleEyebrow: "Putra Kami",
    coupleBlock: "Profil Ananda",
    storyBlock: "Cerita",
    wishFor: "ananda",
    schedules: ["Khitanan", "Tasyakuran"],
    copy: {
      headline: "Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan tasyakuran khitanan putra kami",
      storyEyebrow: "Cerita",
      storyTitle: "Langkah Kecil Ananda",
      rsvpEyebrow: "Doa untuk Ananda",
      giftEyebrow: "Tanda Kasih",
      giftTitle: "Berbagi Kebahagiaan",
      closingEyebrow: "Terima Kasih",
      closingQuote: "Merupakan suatu kehormatan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa untuk ananda",
      scrollLabel: "Lihat Undangan",
    },
    sticker: { kicker: "Bismillah", title: "Aku Dikhitan", bubbles: ["Aku berani!", "Doakan aku, ya!"] },
  },
};

export function getOccasion(id: string | undefined): OccasionDef {
  return OCCASIONS[(id as Occasion) ?? "nikah"] ?? OCCASIONS.nikah;
}

export const isOccasion = (v: unknown): v is Occasion => typeof v === "string" && (OCCASION_IDS as readonly string[]).includes(v);
