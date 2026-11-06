import { THEMES, type ThemeId } from "@/themes/meta";
import { OCCASIONS, type Occasion } from "./occasion";
import { SECTION_KEYS, type SectionKey, type WeddingContent } from "./schema";

/**
 * Sample content for the newer themes. All people, places and account numbers
 * are fictional, and so are the faces in the sample images: the paintings in
 * public/demo/ilustrasi and the kid photos in public/demo/kecil are AI-generated.
 * Photo-heavy sections are hidden on these samples.
 */

const QURAN_21 =
  "Di antara tanda-tanda (kebesaran)-Nya ialah bahwa Dia menciptakan pasangan-pasangan untukmu dari (jenis) dirimu sendiri agar kamu merasa tenteram kepadanya. Dia menjadikan di antaramu rasa cinta dan kasih sayang. (Q.S Ar-Rum ayat 21)";

const GIFT_BODY = "Kehadiran dan doa restu Anda sudah menjadi kebahagiaan bagi kami. Jika berkenan memberikan tanda kasih, informasi berikut dapat memudahkan Anda.";

type Parts = {
  names: [string, string];
  eyebrow?: string;
  people: [WeddingContent["couple"]["first"], WeddingContent["couple"]["second"]?];
  headline?: string;
  quote: string;
  showBismillah: boolean;
  story?: WeddingContent["story"]["items"];
  date: string;
  time: string;
  venue: Pick<WeddingContent["venue"], "name" | "address" | "note"> & { schedules: [string, string][] };
  accounts: [string, string][];
  closingName: string;
  hashtag?: string;
  hidden: SectionKey[];
  scrollLabel?: string;
  /** Sample images: illustrations or AI kid photos (all of fictional people). */
  photos?: { hero?: string; closing?: string; gallery?: string[]; og?: string };
  cover?: Partial<WeddingContent["cover"]>;
};

const person = (fullName: string, parents: string, photo = ""): WeddingContent["couple"]["first"] => ({ fullName, parents, instagram: "", photo });

function build(theme: ThemeId, occasion: Occasion, p: Parts): WeddingContent {
  const t = THEMES[theme];
  const o = OCCASIONS[occasion];
  const empty = person("", "");
  return {
    version: 1,
    theme,
    occasion,
    style: { ...t.style, accent: "" },
    layouts: { ...t.layouts },
    logo: { mode: "monogram", image: "" },
    music: { mode: "library", trackId: t.defaultTrack, upload: "", uploadName: "" },
    order: [...SECTION_KEYS],
    hidden: p.hidden,
    cover: { greeting: "Kepada Yth. Bapak/Ibu/Saudara/i", buttonLabel: "Buka Undangan", kicker: "", title: "", bubbleA: "", bubbleB: "", photo: "", ...p.cover },
    hero: {
      eyebrow: p.eyebrow ?? "",
      firstName: p.names[0],
      secondName: p.names[1],
      imageDesktop: p.photos?.hero ?? "",
      imageMobile: p.photos?.hero ?? "",
      imageCutout: "",
      ogImage: p.photos?.og ?? "",
      namePosition: "top",
      showHeart: false,
      heartSize: "m",
      scrollLabel: p.scrollLabel ?? o.copy.scrollLabel,
    },
    couple: {
      showBismillah: p.showBismillah,
      headline: p.headline ?? o.copy.headline,
      quote: p.quote,
      first: p.people[0],
      second: p.people[1] ?? empty,
      videoUrl: "",
      videoThumb: "",
    },
    story: { eyebrow: o.copy.storyEyebrow, title: o.copy.storyTitle, items: p.story ?? [] },
    event: { eyebrow: "Save The Date", date: p.date, time: p.time, timezone: "WIB" },
    venue: {
      eyebrow: "Lokasi Acara",
      name: p.venue.name,
      address: p.venue.address,
      mapsUrl: `https://maps.google.com/?q=${encodeURIComponent(p.venue.address)}`,
      image: "",
      schedules: p.venue.schedules.map(([label, time], i) => ({ id: `j${i + 1}`, label, time })),
      note: p.venue.note,
    },
    gallery: { eyebrow: "Galeri", title: "Kenangan yang kami abadikan", photos: (p.photos?.gallery ?? []).map((src, i) => ({ id: `g${i}`, src })) },
    rsvp: { eyebrow: o.copy.rsvpEyebrow, title: "Ucapan & Doa", askCity: occasion === "nikah" },
    gift: {
      eyebrow: o.copy.giftEyebrow,
      title: o.copy.giftTitle,
      body: GIFT_BODY,
      accounts: p.accounts.map(([number, holder], i) => ({ id: `b${i + 1}`, bank: i ? "mandiri" : "bca", number, holder })),
      registry: { title: "", body: "", url: "", image: "" },
    },
    closing: { eyebrow: o.copy.closingEyebrow, quote: o.copy.closingQuote, displayName: p.closingName, hashtag: p.hashtag ?? "", image: p.photos?.closing ?? "" },
  };
}

/** AI painting of fictional people (public/demo/ilustrasi) as the hero and link preview. */
const ill = (id: string) => ({ hero: `/demo/ilustrasi/${id}.webp`, og: `/demo/ilustrasi/${id}-og.webp` });

const story = (items: [string, string, string][]): WeddingContent["story"]["items"] => items.map(([date, title, body], i) => ({ id: `s${i + 1}`, date, title, body, image: "", moreImages: [] }));

export const DEMO_JAWA = build("jawa", "nikah", {
  names: ["Bagas", "Laras"],
  people: [person("Raden Bagas Prasetyo, S.H.", "Putra pertama dari Bapak Suryo Wibowo dan Ibu Endang Sulistyowati"), person("Larasati Kusumaningrum, S.Pd.", "Putri kedua dari Bapak Hadi Santoso dan Ibu Sri Wahyuni")],
  headline: "Kanthi nyuwun rahmat saha ridhonipun Gusti Allah SWT, kula sekalian badhe ngawontenaken pahargyan dhaup putra-putri kula",
  quote: QURAN_21,
  showBismillah: true,
  story: story([
    ["2019", "Wiwitan", "Kami pertama kali bertemu di pendopo kampus saat latihan karawitan. Laras menabuh saron, Bagas yang paling sering salah ketukan."],
    ["2023", "Lamaran", "Dengan restu kedua keluarga, lamaran dilaksanakan secara sederhana di rumah keluarga Laras di Klaten."],
    ["2027", "Dhaup", "Kami memohon doa restu untuk langkah baru yang akan kami jalani bersama."],
  ]),
  date: "2027-05-22",
  time: "09:00",
  venue: { name: "Pendopo Ndalem Sekar", address: "Jl. Rotowijayan, Kadipaten, Kraton, Yogyakarta", note: "Busana nuansa batik sogan atau warna senada.", schedules: [["Akad Nikah", "09.00 – 10.00 WIB"], ["Panggih & Resepsi", "11.00 – 14.00 WIB"]] },
  accounts: [["1234 5678 90", "RADEN BAGAS PRASETYO"], ["1300 0098 7654 3", "LARASATI KUSUMANINGRUM"]],
  closingName: "Bagas & Laras",
  hashtag: "#BagasLarasDhaup",
  hidden: ["gallery"],
  photos: ill("jawa"),
});

export const DEMO_SUNDA = build("sunda", "nikah", {
  names: ["Rangga", "Nenden"],
  people: [person("Rangga Permana Putra, S.Kom.", "Putra kadua ti Bapak Ujang Supriatna sareng Ibu Euis Komariah"), person("Nenden Sri Rahayu, S.E.", "Putri cikal ti Bapak Dadang Hermawan sareng Ibu Iis Rosita")],
  headline: "Kalayan nyuhunkeun rahmat sareng ridho Allah SWT, kami bade ngalaksanakeun walimatul 'ursy putra-putri kami",
  quote: QURAN_21,
  showBismillah: true,
  story: story([
    ["2020", "Patepung", "Patepung di acara ngaliwet sareng rerencangan di Lembang. Obrolan sakedap jadi panjang dugi ka sonten."],
    ["2024", "Narosan", "Kalayan restu ti kadua kulawarga, acara narosan dilaksanakeun di Bandung."],
    ["2027", "Walimah", "Muga-muga Gusti Allah ngaberkahan lengkah anyar kami."],
  ]),
  date: "2027-03-13",
  time: "08:00",
  venue: { name: "Saung Kalapa", address: "Jl. Raya Lembang, Kab. Bandung Barat, Jawa Barat", note: "", schedules: [["Akad Nikah", "08.00 – 09.30 WIB"], ["Resepsi & Sawer", "10.00 – 13.00 WIB"]] },
  accounts: [["1234 5678 90", "RANGGA PERMANA PUTRA"], ["1300 0012 3456 7", "NENDEN SRI RAHAYU"]],
  closingName: "Rangga & Nenden",
  hashtag: "#RanggaNendenNyarandé",
  hidden: ["gallery"],
  photos: ill("sunda"),
});

export const DEMO_SEJOLI = build("sejoli", "nikah", {
  names: ["Fikri", "Salsa"],
  people: [person("Fikri Ramadhan, S.T.", "Putra pertama dari Bapak Hendra Gunawan dan Ibu Maya Sari"), person("Salsabila Putri, S.Psi.", "Putri ketiga dari Bapak Agus Salim dan Ibu Rina Marlina")],
  quote: QURAN_21,
  showBismillah: true,
  story: story([
    ["Juli 2021", "Satu Meja di Perpustakaan", "Kami rebutan kursi dekat jendela. Akhirnya berbagi meja, lalu berbagi cerita, lalu berbagi mimpi."],
    ["Desember 2024", "Pertanyaan Paling Penting", "Di bawah hujan kecil, Fikri bertanya. Salsa menjawab sebelum pertanyaannya selesai."],
    ["Januari 2027", "Hari yang Kami Tunggu", "Kami ingin hari ini dirayakan bersama orang-orang tersayang."],
  ]),
  date: "2027-01-16",
  time: "10:00",
  venue: { name: "Gedung Serbaguna Kirana", address: "Jl. Kemang Raya, Jakarta Selatan", note: "", schedules: [["Akad Nikah", "10.00 – 11.00 WIB"], ["Resepsi", "11.30 – 14.00 WIB"]] },
  accounts: [["1234 5678 90", "FIKRI RAMADHAN"], ["1300 0045 6789 0", "SALSABILA PUTRI"]],
  closingName: "Fikri & Salsa",
  hashtag: "#FikriSalsaSejoli",
  hidden: ["gallery"],
  photos: ill("sejoli"),
});

export const DEMO_LUKIS = build("lukis", "nikah", {
  names: ["Reza", "Anindya"],
  people: [person("Reza Mahendra, S.Ars.", "Putra kedua dari Bapak Teguh Mahendra dan Ibu Lina Kartika"), person("Anindya Kirana, S.Sn.", "Putri pertama dari Bapak Yusuf Hidayat dan Ibu Ratna Dewi")],
  headline: "Dengan memohon rahmat Allah SWT, kami bermaksud menyelenggarakan pernikahan kami di antara bunga-bunga yang bermekaran",
  quote: QURAN_21,
  showBismillah: true,
  story: story([
    ["2020", "Sketsa Pertama", "Anindya melukis bunga di taman kota, Reza berhenti terlalu lama untuk melihat. Sejak itu ia selalu kembali di hari Minggu."],
    ["2023", "Warna yang Sama", "Kami sadar kami menyukai warna yang sama, kopi yang sama, dan jalan pulang yang sama."],
    ["2027", "Bermekaran", "Kami ingin hari bahagia ini dipenuhi doa dari orang-orang terkasih."],
  ]),
  date: "2027-04-10",
  time: "09:00",
  venue: { name: "Kebun Bunga Cempaka", address: "Jl. Raya Puncak, Cisarua, Kab. Bogor", note: "Acara di taman terbuka, siapkan alas kaki yang nyaman.", schedules: [["Akad Nikah", "09.00 – 10.00 WIB"], ["Garden Party", "10.30 – 14.00 WIB"]] },
  accounts: [["1234 5678 90", "REZA MAHENDRA"], ["1300 0067 8901 2", "ANINDYA KIRANA"]],
  closingName: "Reza & Anindya",
  hashtag: "#RezaAnindyaBermekaran",
  hidden: ["gallery"],
  photos: ill("lukis"),
});

export const DEMO_KECIL = build("kecil", "nikah", {
  names: ["Bayu", "Tiara"],
  people: [person("Bayu Aditya Nugraha", "Putra pertama dari Bapak Wahyu Nugraha dan Ibu Desi Ratnasari", "/demo/kecil/kid-boy.webp"), person("Tiara Anjani", "Putri bungsu dari Bapak Rudi Hartono dan Ibu Yanti Susanti", "/demo/kecil/kid-girl.webp")],
  headline: "Dulu kami berlarian di halaman yang sama, kini kami berjalan ke arah yang sama",
  quote: QURAN_21,
  showBismillah: true,
  story: story([
    ["1999", "Tetangga Sebelah", "Kami tumbuh di gang yang sama di Malang. Tiara selalu menang main kelereng, Bayu selalu pura-pura kalah."],
    ["2018", "Bertemu Lagi", "Setelah lama terpisah, reuni kecil mempertemukan kami kembali. Ceritanya ternyata belum selesai."],
    ["2027", "Selamanya", "Teman main masa kecil, kini teman hidup selamanya."],
  ]),
  date: "2027-06-19",
  time: "09:00",
  venue: { name: "Rumah Joglo Kenangan", address: "Jl. Ijen, Klojen, Kota Malang, Jawa Timur", note: "", schedules: [["Akad Nikah", "09.00 – 10.00 WIB"], ["Resepsi", "11.00 – 14.00 WIB"]] },
  accounts: [["1234 5678 90", "BAYU ADITYA NUGRAHA"], ["1300 0034 5678 9", "TIARA ANJANI"]],
  closingName: "Bayu & Tiara",
  hashtag: "#DariKecilSampaiSelamanya",
  hidden: ["gallery"],
  photos: { og: "/demo/kecil/og.webp" },
  cover: { photo: "/demo/kecil/pair-cutout.webp", bubbleA: "Nanti kita nikah, ya!", bubbleB: "Janji kelingking dulu!" },
});

export const DEMO_KONFETI = build("konfeti", "ultah", {
  names: ["Alea", ""],
  eyebrow: "Ulang Tahun ke-5",
  people: [person("Alea Kirana Putri", "Putri pertama dari Bapak Dimas Saputra dan Ibu Nadia Fitri")],
  headline: "Yeay! Alea sudah 5 tahun! Yuk datang dan rayakan bersama di pesta kecil kami",
  quote: "“Setiap tahun kamu tumbuh, setiap tahun kami bersyukur.” Terima kasih sudah menjadi bagian dari cerita Alea.",
  showBismillah: false,
  date: "2026-12-20",
  time: "15:00",
  venue: { name: "Kafe Pelangi Ceria", address: "Jl. Setiabudi No. 21, Kota Bandung", note: "Dress code: warna-warni! Ada sesi foto & permainan seru.", schedules: [["Pesta & Permainan", "15.00 – 16.30 WIB"], ["Tiup Lilin", "16.30 WIB"]] },
  accounts: [["1234 5678 90", "NADIA FITRI"]],
  closingName: "Alea",
  hashtag: "#Alea5Tahun",
  hidden: ["story", "gallery"],
  photos: ill("konfeti"),
});

export const DEMO_ANGKASA = build("angkasa", "ultah", {
  names: ["Arkan", ""],
  eyebrow: "Ulang Tahun ke-7",
  people: [person("Muhammad Arkan Pratama", "Putra pertama dari Bapak Rizky Pratama dan Ibu Annisa Rahma")],
  headline: "3… 2… 1… Meluncur! Ayo ikut petualangan ulang tahun Arkan yang ke-7",
  quote: "“Setinggi apa pun mimpimu, ke sana kamu bisa terbang.” Terima kasih sudah menemani Arkan tumbuh.",
  showBismillah: false,
  date: "2027-01-30",
  time: "14:00",
  venue: { name: "Taman Bermain Bintang", address: "Jl. Dago Atas No. 7, Kota Bandung", note: "Akan ada pertunjukan sains mini & teropong bintang.", schedules: [["Peluncuran Pesta", "14.00 WIB"], ["Tiup Lilin", "15.30 WIB"]] },
  accounts: [["1234 5678 90", "ANNISA RAHMA"]],
  closingName: "Arkan",
  hashtag: "#ArkanKeAngkasa",
  hidden: ["story", "gallery"],
  photos: ill("angkasa"),
});

export const DEMO_KHITAN = build("khitan", "khitan", {
  names: ["Rafa", ""],
  people: [person("Muhammad Rafa Alfarizi", "Putra kedua dari Bapak Ahmad Fauzi dan Ibu Siti Rahmawati")],
  quote: "“Dan (ingatlah) ketika Ibrahim diuji Tuhannya dengan beberapa kalimat (perintah dan larangan), lalu Ibrahim menunaikannya.” (Q.S Al-Baqarah ayat 124)",
  showBismillah: true,
  date: "2026-12-27",
  time: "10:00",
  venue: { name: "Kediaman Keluarga Bapak Ahmad Fauzi", address: "Jl. Cempaka Putih No. 12, Kota Bekasi", note: "", schedules: [["Khitanan", "08.00 WIB"], ["Tasyakuran", "10.00 – 13.00 WIB"]] },
  accounts: [["1234 5678 90", "AHMAD FAUZI"]],
  closingName: "Rafa",
  hidden: ["story", "gallery"],
  photos: ill("khitan"),
});

export const DEMO_EXTRA = {
  jawa: DEMO_JAWA,
  sunda: DEMO_SUNDA,
  sejoli: DEMO_SEJOLI,
  lukis: DEMO_LUKIS,
  kecil: DEMO_KECIL,
  konfeti: DEMO_KONFETI,
  angkasa: DEMO_ANGKASA,
  khitan: DEMO_KHITAN,
} satisfies Partial<Record<ThemeId, WeddingContent>>;
