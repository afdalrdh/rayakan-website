import { THEMES, type ThemeId } from "@/themes/meta";
import { legacyStyle } from "@/themes/style";
import { withDefaults } from "./helpers";
import { SECTION_KEYS, type WeddingContent } from "./schema";

const aryaPhoto = (n: string) => ({ id: `g${n}`, src: `/demo/arya/g-${n}.jpg` });

/** Sample content for the "Malam Emas" theme (from the Arya & Alma site). */
export const DEMO_ARYA: WeddingContent = {
  version: 1,
  theme: "arya",
  style: { ...THEMES.arya.style, accent: "" },
  layouts: { ...THEMES.arya.layouts },
  logo: { mode: "image", image: "/demo/arya/logo.png" },
  music: { mode: "library", trackId: "arya-background", upload: "", uploadName: "" },
  order: [...SECTION_KEYS],
  hidden: [],
  cover: { greeting: "Kepada Yth. Bapak/Ibu/Saudara/i", buttonLabel: "Buka Undangan" },
  hero: {
    firstName: "Arya",
    secondName: "Almalia",
    imageDesktop: "/demo/arya/hero-desktop.jpg",
    imageMobile: "/demo/arya/hero-mobile.png",
    imageCutout: "/demo/arya/hero-cutout.png",
    ogImage: "/demo/arya/og.jpg",
    namePosition: "top",
    showHeart: true,
    heartSize: "m",
    scrollLabel: "Jelajahi Kisah Kami",
  },
  couple: {
    showBismillah: true,
    headline: "Kami mengundang Anda untuk menjadi bagian dari hari bahagia kami",
    quote:
      "Di antara tanda-tanda (kebesaran)-Nya ialah bahwa Dia menciptakan pasangan-pasangan untukmu dari (jenis) dirimu sendiri agar kamu merasa tenteram kepadanya. Dia menjadikan di antaramu rasa cinta dan kasih sayang. Sesungguhnya pada yang demikian itu benar-benar terdapat tanda-tanda (kebesaran Allah) bagi kaum yang berpikir. (Q.S Ar-Rum ayat 21)",
    first: {
      fullName: "Almalia Marcela, S.T.",
      parents: "Putri kedua dari bapak Suryana dan ibu Rini Hendriyani",
      instagram: "b__arellalma",
      photo: "/demo/arya/g-8622.jpg",
    },
    second: {
      fullName: "Arya Erlangga Gunawan, A.md.Si.",
      parents: "Putra pertama dari Bapak Gugun Gunawan dan Ibu Roro Shinta Merina",
      instagram: "aryaerlangga10",
      photo: "/demo/arya/g-8628.jpg",
    },
    videoUrl: "",
    videoThumb: "",
  },
  story: {
    eyebrow: "OUR STORY",
    title: "Babak Kisah Kami",
    items: [
      {
        id: "s1",
        date: "Maret 2020",
        title: "A Beginning We Never Expected",
        body: "Semua yang terjadi sudah tersusun dengan sangat rapi oleh sang Maha Kuasa, tidak ada pertemuan yang kebetulan di dunia ini. Kami bertemu pertama kalinya tanpa sengaja pada tahun 2020 di kota Garut saat mengikuti Kerja Praktik disalah satu perusahaan pembangkit listrik tenaga uap.",
        image: "/demo/arya/story-1.jpg",
        moreImages: [],
      },
      {
        id: "s2",
        date: "April 2024",
        title: "A Message That Changed Everything",
        body: "Tepat pada bulan April 2024, sebuah pesan sederhana kembali mempertemukan kami. Sebuah sapaan, kabar, dan ucapan minal aidzin walfaidzin membuka kembali percakapan yang tidak lagi seperti dulu.",
        image: "/demo/arya/story-2.png",
        moreImages: [],
      },
      {
        id: "s3",
        date: "Oktober 2024",
        title: "Choosing Each Other, Again and Again",
        body: "Tepat di bulan Oktober, ketika hubungan kami genap enam bulan, kami mengikat komitmen dengan bertunangan di hadapan kedua orang tua dan keluarga besar kami.",
        image: "/demo/arya/story-3.jpg",
        moreImages: [],
      },
      {
        id: "s4",
        date: "15 November 2026",
        title: "The Day We Become One",
        body: "Inilah hari dimana kami menyatukan takdir kami. Pernikahan ini adalah awal dari kehidupan yang kami nantikan, dimulai dari janji yang disaksikan oleh-Nya.",
        image: "/demo/arya/story-4.png",
        moreImages: [],
      },
    ],
  },
  event: { eyebrow: "Save The Date", date: "2026-11-15", time: "08:00", timezone: "WIB" },
  venue: {
    eyebrow: "Location",
    name: "Bale Pancaniti",
    address: "Cibabat, Kec. Cimahi Utara, Kota Cimahi, Jawa Barat 40514",
    mapsUrl: "https://maps.app.goo.gl/Z2w7EKrdcy8cjqcf7",
    image: "/demo/arya/venue.png",
    schedules: [
      { id: "j1", label: "Akad Nikah", time: "08.00 – 11.00 WIB" },
      { id: "j2", label: "Resepsi", time: "11.00 – 14.00 WIB" },
    ],
    note: "",
  },
  gallery: {
    eyebrow: "Our Memories",
    title: "Kenangan yang kami abadikan",
    photos: ["8413", "8495", "8425", "8478", "8526", "8569", "8592", "8681", "8431", "8545", "8687", "8705"].map(aryaPhoto),
  },
  rsvp: { eyebrow: "Wedding Wishes", title: "Ucapan & Doa", askCity: true },
  gift: {
    eyebrow: "Wedding Gift",
    title: "Berbagi Kebahagiaan",
    body: "Kehadiran Anda sudah menjadi kebahagiaan tersendiri bagi kami. Jika berkenan memberikan tanda kasih, kami menyediakan informasi berikut untuk memudahkan Anda.",
    accounts: [
      { id: "b1", bank: "seabank", number: "9010 4291 4568", holder: "ALMALIA MARCELA" },
      { id: "b2", bank: "bca", number: "086 075 9578", holder: "ARYA ERLANGGA GUNAWAN" },
    ],
    registry: { title: "", body: "", url: "", image: "" },
  },
  closing: {
    eyebrow: "See You On Our Big Day",
    quote:
      "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu kepada kami",
    displayName: "Alma & Arya",
    hashtag: "#AlmazingwithArya",
    image: "/demo/arya/g-8721.jpg",
  },
};

const afdalPhoto = (n: string) => ({ id: `a${n}`, src: `/demo/afdal/g-${n}.webp` });

/** Sample content for the "Putih Marun" theme (from the Afdal & Putri site). */
export const DEMO_AFDAL: WeddingContent = {
  version: 1,
  theme: "afdal",
  style: { ...THEMES.afdal.style, accent: "" },
  layouts: { ...THEMES.afdal.layouts },
  logo: { mode: "image", image: "/demo/afdal/logo.png" },
  music: { mode: "library", trackId: "afdal-background", upload: "", uploadName: "" },
  order: [...SECTION_KEYS],
  hidden: [],
  cover: { greeting: "Kepada Yth. Bapak/Ibu/Saudara/i", buttonLabel: "Buka Undangan" },
  hero: {
    firstName: "Afdal",
    secondName: "Putri",
    imageDesktop: "/demo/afdal/hero.webp",
    imageMobile: "/demo/afdal/hero.webp",
    imageCutout: "/demo/afdal/hero-cutout.webp",
    ogImage: "/demo/afdal/og.jpg",
    namePosition: "top",
    showHeart: true,
    heartSize: "m",
    scrollLabel: "Jelajahi Kisah Kami",
  },
  couple: {
    showBismillah: true,
    headline: "Kami mengundang Anda untuk menjadi bagian dari hari bahagia kami",
    quote: DEMO_ARYA.couple.quote,
    first: {
      fullName: "Putri Andiyani A.Md.Si",
      parents: "Putri pertama dari Bapak Dicky Mulyadi dan Ibu Aan Samsinar",
      instagram: "putriandiy",
      photo: "/demo/afdal/putri.webp",
    },
    second: {
      fullName: "Afdal Ramdan Daman Huri S.Tr.Kom",
      parents: "Putra pertama dari Bapak Amrizal dan Ibu Nelda Warni",
      instagram: "afdalrdh",
      photo: "/demo/afdal/afdal.webp",
    },
    videoUrl: "https://www.youtube.com/watch?v=IUpgqxPePvg",
    videoThumb: "/demo/afdal/video-thumb.webp",
  },
  story: {
    eyebrow: "Our Story",
    title: "Perjalanan Kami",
    items: [
      { id: "c1", date: "Chapter one (2020)", title: "Bagaimana Kami Bertemu", body: "Berawal dari organisasi BEM Polban, kami sering berkoordinasi dan bertukar cerita hingga rasa nyaman tumbuh di tengah masa pandemi. Tanpa kami sadari, percakapan sederhana itu menjadi awal dari perjalanan yang jauh lebih panjang.", image: "/demo/afdal/story-1.webp", moreImages: [] },
      { id: "c2", date: "Chapter two (2021 – 2023)", title: "Bertumbuh Bersama", body: "Kuliah, tugas, organisasi, dan banyak cerita menjadi bagian dari perjalanan kami. Di masa ini kami menikmati kebersamaan sambil belajar memahami, mendukung, dan bertumbuh menjadi pribadi yang lebih dewasa.", image: "/demo/afdal/story-2.webp", moreImages: [] },
      { id: "c3", date: "Chapter three (2023 – 2026)", title: "Menjelajah Dunia Bersama", body: "Memasuki dunia kerja, kami menemukan kebahagiaan dalam perjalanan-perjalanan sederhana ke berbagai tempat dan alam yang indah. Dari setiap perjalanan, kami belajar untuk saling memahami dan menikmati setiap proses kehidupan bersama.", image: "/demo/afdal/story-3a.webp", moreImages: ["/demo/afdal/story-3b.webp", "/demo/afdal/story-3c.webp", "/demo/afdal/story-3d.webp"] },
      { id: "c4", date: "Chapter four (18 April 2026)", title: "Lamaran", body: "Dengan restu Allah SWT dan kedua keluarga, kami memutuskan membawa hubungan ini ke jenjang yang lebih serius. Hari itu menjadi awal pertemuan dua keluarga yang dipersatukan oleh niat baik dan harapan yang sama.", image: "/demo/afdal/story-4.webp", moreImages: [] },
      { id: "c5", date: "Last chapter", title: "Hari Bahagia", body: "Dengan penuh rasa syukur, kami memutuskan untuk mengikat janji suci pernikahan dan memulai babak baru kehidupan bersama. Semoga langkah ini menjadi awal dari perjalanan panjang yang penuh cinta dan keberkahan.", image: "/demo/afdal/story-5.webp", moreImages: [] },
    ],
  },
  event: { eyebrow: "Towards Our Happy Day", date: "2026-07-04", time: "08:00", timezone: "WIB" },
  venue: {
    eyebrow: "Location",
    name: "Marsoeta Coffee & Eatery",
    address: "Jl. Raya Soreang - Banjaran, Cangkuang, Kec. Cangkuang, Kabupaten Bandung, Jawa Barat 40238",
    mapsUrl: "https://maps.app.goo.gl/c1f1gSJj4YU5AWZG9",
    image: "/demo/afdal/venue.webp",
    schedules: [
      { id: "j1", label: "Akad Nikah", time: "08.00 – 10.00 WIB" },
      { id: "j2", label: "Resepsi", time: "11.00 – 14.00 WIB" },
    ],
    note: "Bagi tamu yang membawa kendaraan, area parkir tersedia di SMA Bhakti Mulya.",
  },
  gallery: {
    eyebrow: "Our Memories",
    title: "Kenangan yang kami abadikan.",
    photos: ["p1", "p2", "l1", "p3", "p4", "p5", "p6", "l2", "p7", "p8", "p9", "p10", "p11", "p12"].map(afdalPhoto),
  },
  rsvp: { eyebrow: "Wedding Wishes", title: "Ucapan & Doa", askCity: true },
  gift: {
    eyebrow: "Wedding Gift",
    title: "Berbagi Kebahagiaan",
    body: DEMO_ARYA.gift.body,
    accounts: [
      { id: "b1", bank: "mandiri", number: "1300 0260 0977 2", holder: "PUTRI ANDIYANI" },
      { id: "b2", bank: "bri", number: "0675 0101 2631 509", holder: "AFDAL RAMDAN DAMAN HURI" },
    ],
    registry: {
      title: "Kirim ke Rumah",
      body: "Apabila Anda berkenan memberikan tanda kasih, kami telah menyiapkan daftar hadiah yang dapat dipilih melalui tombol di bawah ini.",
      url: "https://www.myregistry.com/giftlist/afput-wedding",
      image: "/demo/afdal/gift.webp",
    },
  },
  closing: {
    eyebrow: "See You On Our Big Day",
    quote: "Merupakan suatu kebahagiaan dan kehormatan bagi kami, apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu kepada kami",
    displayName: "Afdal & Putri",
    hashtag: "",
    image: "/demo/afdal/closing.webp",
  },
};

/** Photos for one fictional sample couple (AI-generated, see public/demo/<folder>). */
const demoPhotos = (folder: string, names: string[]) => names.map((n) => ({ id: `${folder}-${n}`, src: `/demo/${folder}/${n}.webp` }));

/** Sample content for the "Taman Sage" theme — fictional couple, garden wedding. */
export const DEMO_SAGE: WeddingContent = {
  version: 1,
  theme: "sage",
  style: { ...THEMES.sage.style, accent: "" },
  layouts: { ...THEMES.sage.layouts },
  logo: { mode: "monogram", image: "" },
  music: { mode: "library", trackId: THEMES.sage.defaultTrack, upload: "", uploadName: "" },
  order: [...SECTION_KEYS],
  hidden: [],
  cover: { greeting: "Kepada Yth. Bapak/Ibu/Saudara/i", buttonLabel: "Buka Undangan" },
  hero: {
    firstName: "Raka",
    secondName: "Nadia",
    imageDesktop: "/demo/sage/hero-desktop.webp",
    imageMobile: "/demo/sage/hero-mobile.webp",
    imageCutout: "",
    ogImage: "/demo/sage/hero-desktop.webp",
    namePosition: "top",
    showHeart: true,
    heartSize: "m",
    scrollLabel: "Jelajahi Kisah Kami",
  },
  couple: {
    showBismillah: true,
    headline: "Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan pernikahan kami",
    quote: DEMO_ARYA.couple.quote,
    first: {
      fullName: "Nadia Kirana Putri, S.Ds.",
      parents: "Putri kedua dari Bapak Hendra Wijaya dan Ibu Sri Lestari",
      instagram: "nadiakirana",
      photo: "/demo/sage/bride.webp",
    },
    second: {
      fullName: "Raka Pratama Aditya, S.T.",
      parents: "Putra pertama dari Bapak Bambang Setiawan dan Ibu Dewi Anggraeni",
      instagram: "rakapratama",
      photo: "/demo/sage/groom.webp",
    },
    videoUrl: "",
    videoThumb: "",
  },
  story: {
    eyebrow: "Our Story",
    title: "Tumbuh Bersama",
    items: [
      { id: "s1", date: "Mei 2021", title: "Bertemu di Antara Tanaman", body: "Kami bertemu tanpa sengaja di sebuah toko tanaman kecil di Lembang. Nadia mencari pakis, Raka salah mengira dia pegawai toko. Tawa hari itu menjadi awal dari percakapan panjang yang tidak pernah selesai.", image: "/demo/sage/story-1.webp", moreImages: [] },
      { id: "s2", date: "2022 – 2024", title: "Akhir Pekan yang Sederhana", body: "Piknik di taman, buku yang dibaca bergantian, dan obrolan sampai sore. Dari hal-hal kecil itu kami belajar bahwa bahagia tidak harus rumit.", image: "/demo/sage/story-2.webp", moreImages: [] },
      { id: "s3", date: "2025", title: "Melangkah ke Arah yang Sama", body: "Di tengah kabut kebun teh, kami sepakat untuk terus berjalan bersama — melewati jalan yang mudah maupun yang menanjak.", image: "/demo/sage/story-3.webp", moreImages: [] },
      { id: "s4", date: "8 Februari 2026", title: "Lamaran", body: "Dengan restu kedua keluarga, cincin itu akhirnya tersemat. Hari itu dua keluarga dipertemukan oleh niat baik dan harapan yang sama.", image: "/demo/sage/story-4.webp", moreImages: [] },
    ],
  },
  event: { eyebrow: "Save The Date", date: "2026-12-12", time: "09:00", timezone: "WIB" },
  venue: {
    eyebrow: "Location",
    name: "Taman Kaca Dago",
    address: "Jl. Ir. H. Juanda, Dago, Kec. Coblong, Kota Bandung, Jawa Barat",
    mapsUrl: "https://maps.google.com/?q=Dago+Bandung",
    image: "/demo/sage/venue.webp",
    schedules: [
      { id: "j1", label: "Akad Nikah", time: "09.00 – 10.30 WIB" },
      { id: "j2", label: "Resepsi Taman", time: "11.00 – 14.00 WIB" },
    ],
    note: "Acara diadakan di area terbuka. Disarankan memakai alas kaki yang nyaman untuk rumput.",
  },
  gallery: {
    eyebrow: "Our Memories",
    title: "Kenangan yang kami abadikan",
    photos: demoPhotos("sage", ["g-2", "g-1", "hero-desktop", "story-3", "bride", "groom", "g-3", "story-2", "closing", "story-1", "hero-mobile", "story-4"]),
  },
  rsvp: { eyebrow: "Wedding Wishes", title: "Ucapan & Doa", askCity: true },
  gift: {
    eyebrow: "Wedding Gift",
    title: "Berbagi Kebahagiaan",
    body: DEMO_ARYA.gift.body,
    accounts: [
      { id: "b1", bank: "bca", number: "1234 5678 90", holder: "NADIA KIRANA PUTRI" },
      { id: "b2", bank: "mandiri", number: "1300 0123 4567 8", holder: "RAKA PRATAMA ADITYA" },
    ],
    registry: { title: "", body: "", url: "", image: "" },
  },
  closing: {
    eyebrow: "See You On Our Big Day",
    quote: "Merupakan suatu kebahagiaan dan kehormatan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu kepada kami",
    displayName: "Raka & Nadia",
    hashtag: "#RakaNadiaBersemi",
    image: "/demo/sage/closing.webp",
  },
};

/** Sample content for the "Navy Mewah" theme — fictional couple, night ballroom wedding. */
export const DEMO_NAVY: WeddingContent = {
  version: 1,
  theme: "navy",
  style: { ...THEMES.navy.style, accent: "" },
  layouts: { ...THEMES.navy.layouts },
  logo: { mode: "monogram", image: "" },
  music: { mode: "library", trackId: THEMES.navy.defaultTrack, upload: "", uploadName: "" },
  order: [...SECTION_KEYS],
  hidden: [],
  cover: { greeting: "Kepada Yth. Bapak/Ibu/Saudara/i", buttonLabel: "Buka Undangan" },
  hero: {
    firstName: "Bima",
    secondName: "Kirana",
    imageDesktop: "/demo/navy/hero-desktop.webp",
    imageMobile: "/demo/navy/hero-mobile.webp",
    imageCutout: "",
    ogImage: "/demo/navy/hero-desktop.webp",
    namePosition: "top",
    showHeart: true,
    heartSize: "m",
    scrollLabel: "Jelajahi Kisah Kami",
  },
  couple: {
    showBismillah: true,
    headline: "Dengan penuh rasa syukur, kami mengundang Anda untuk merayakan hari pernikahan kami",
    quote: DEMO_ARYA.couple.quote,
    first: {
      fullName: "Kirana Ayu Maheswari, S.E.",
      parents: "Putri pertama dari Bapak Arief Rahman dan Ibu Maya Sari",
      instagram: "kiranamaheswari",
      photo: "/demo/navy/bride.webp",
    },
    second: {
      fullName: "Bima Satria Nugraha, M.M.",
      parents: "Putra kedua dari Bapak Teguh Santoso dan Ibu Ratna Dewi",
      instagram: "bimasatria",
      photo: "/demo/navy/groom.webp",
    },
    videoUrl: "",
    videoThumb: "",
  },
  story: {
    eyebrow: "Our Story",
    title: "Babak Kisah Kami",
    items: [
      { id: "s1", date: "Agustus 2020", title: "Satu Lagu, Satu Meja", body: "Malam itu sebuah klub jazz kecil di Jakarta penuh sesak, dan satu-satunya kursi kosong ada di meja Kirana. Satu lagu berubah menjadi tiga jam percakapan.", image: "/demo/navy/story-1.webp", moreImages: [] },
      { id: "s2", date: "2021 – 2023", title: "Hujan di Kota", body: "Pulang kantor di bawah satu payung, kopi larut malam, dan jalanan basah yang memantulkan lampu kota. Di tengah kesibukan, kami selalu menemukan waktu untuk satu sama lain.", image: "/demo/navy/story-2.webp", moreImages: [] },
      { id: "s3", date: "Juni 2024", title: "Senja di Labuan Bajo", body: "Perjalanan pertama kami ke timur Indonesia. Di haluan kapal, menatap pulau-pulau di bawah langit biru tua, kami tahu ingin melihat lebih banyak senja bersama.", image: "/demo/navy/story-3.webp", moreImages: [] },
      { id: "s4", date: "14 Februari 2026", title: "Sebuah Pertanyaan", body: "Di antara ratusan lilin dan lampu kota, Bima berlutut dan bertanya. Jawabannya, tentu saja, ya.", image: "/demo/navy/story-4.webp", moreImages: [] },
    ],
  },
  event: { eyebrow: "Save The Date", date: "2027-01-23", time: "18:30", timezone: "WIB" },
  venue: {
    eyebrow: "Location",
    name: "The Grand Ballroom",
    address: "Jl. Jend. Sudirman, Senayan, Kec. Kebayoran Baru, Jakarta Selatan",
    mapsUrl: "https://maps.google.com/?q=Senayan+Jakarta",
    image: "/demo/navy/venue.webp",
    schedules: [
      { id: "j1", label: "Pemberkatan / Akad", time: "16.00 – 17.30 WIB" },
      { id: "j2", label: "Resepsi Malam", time: "18.30 – 21.30 WIB" },
    ],
    note: "Dress code: Black Tie / formal dengan nuansa biru tua.",
  },
  gallery: {
    eyebrow: "Our Memories",
    title: "Kenangan yang kami abadikan",
    photos: demoPhotos("navy", ["g-1", "g-2", "hero-desktop", "g-3", "bride", "groom", "story-3", "closing", "hero-mobile", "story-2", "story-4", "story-1"]),
  },
  rsvp: { eyebrow: "Wedding Wishes", title: "Ucapan & Doa", askCity: true },
  gift: {
    eyebrow: "Wedding Gift",
    title: "Tanda Kasih",
    body: DEMO_ARYA.gift.body,
    accounts: [
      { id: "b1", bank: "bca", number: "0987 6543 21", holder: "KIRANA AYU MAHESWARI" },
      { id: "b2", bank: "bri", number: "0123 0101 2345 678", holder: "BIMA SATRIA NUGRAHA" },
    ],
    registry: { title: "", body: "", url: "", image: "" },
  },
  closing: {
    eyebrow: "See You On Our Big Night",
    quote: "Merupakan suatu kehormatan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu kepada kami",
    displayName: "Bima & Kirana",
    hashtag: "#BimaKiranaForever",
    image: "/demo/navy/closing.webp",
  },
};

export const DEMO_BY_THEME: Record<ThemeId, WeddingContent> = {
  arya: DEMO_ARYA,
  afdal: DEMO_AFDAL,
  sage: DEMO_SAGE,
  navy: DEMO_NAVY,
};

export function demoContent(theme: ThemeId = "arya"): WeddingContent {
  return structuredClone(DEMO_BY_THEME[theme] ?? DEMO_ARYA);
}

/** @deprecated use demoContent("arya") — kept for older imports. */
export const DEMO_CONTENT = DEMO_ARYA;

/** Fills fields added after the content was saved (see withDefaults). */
export function normalizeContent(content: unknown): WeddingContent {
  const raw = (content && typeof content === "object" ? content : {}) as Record<string, unknown>;
  const theme = (typeof raw.theme === "string" && raw.theme in THEMES ? raw.theme : "arya") as ThemeId;
  // Sites saved before the design system had a theme palette instead of style + layouts.
  const migrated = {
    ...raw,
    style: raw.style ?? legacyStyle(theme, String(raw.palette ?? ""), typeof raw.customAccent === "string" ? raw.customAccent : undefined),
    layouts: raw.layouts ?? { ...THEMES[theme].layouts },
  };
  delete (migrated as Record<string, unknown>).palette;
  delete (migrated as Record<string, unknown>).customAccent;
  return withDefaults(migrated, DEMO_ARYA);
}
