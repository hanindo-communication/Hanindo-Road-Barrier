export type CatalogCategory = "all" | "barrier" | "cone" | "stick";

export type CatalogSpec = {
  label: string;
  value: string;
};

export type CatalogProduct = {
  id: string;
  category: Exclude<CatalogCategory, "all">;
  categoryLabel: string;
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  officialUrl: string;
  specs: CatalogSpec[];
  benefits: string[];
  useCases: string[];
  decisionNote: string;
  accent: "red" | "orange" | "blue";
};

const roadBarrierBenefits = [
  "Polyethylene (PE) tahan cuaca dan paparan UV",
  "Dapat diisi air atau pasir hingga 80 liter",
  "Pengait antar-unit untuk susunan modular",
  "Plug atas dan bawah memudahkan isi-kuras",
  "Handle serta akses forklift membantu pemindahan",
  "Mendukung stiker reflektif atau identitas proyek",
];

const trafficConeBenefits = [
  "Warna terang untuk peringatan dan pengalihan jalur",
  "Pemantul cahaya membantu visibilitas malam",
  "Ringan dan cepat dipindahkan saat layout berubah",
];

const stickConeBenefits = [
  "Profil tinggi 110 cm untuk penanda yang jelas",
  "Bobot 1,2 kg untuk pemasangan yang portabel",
  "Berfungsi sebagai petunjuk jalur atau pembatas akses",
];

export const catalogCategories: Array<{ id: CatalogCategory; label: string; note: string }> = [
  { id: "all", label: "Semua produk", note: "09 SKU resmi" },
  { id: "barrier", label: "Road Barrier", note: "04 model" },
  { id: "cone", label: "Traffic Cone", note: "03 model" },
  { id: "stick", label: "Stick Cone", note: "02 model" },
];

export const catalogProducts: CatalogProduct[] = [
  {
    id: "road-barrier-mathes",
    category: "barrier",
    categoryLabel: "Road Barrier",
    eyebrow: "WATER-FILLABLE",
    title: "Road Barrier Mathes",
    description: "Barrier modular untuk pengaturan lalu lintas, lahan parkir, dan area kerja yang membutuhkan pembatas stabil.",
    image: "https://roadbarrierindonesia.com/wp-content/uploads/2022/04/road-barrier-type-mathes.webp",
    officialUrl: "https://roadbarrierindonesia.com/produk/road-barrier-mathes/",
    accent: "red",
    specs: [
      { label: "Panjang", value: "120 cm" },
      { label: "Lebar", value: "47 cm" },
      { label: "Tinggi", value: "78 cm" },
      { label: "Kapasitas air", value: "Max 80 L" },
      { label: "Berat", value: "10 kg" },
      { label: "Warna", value: "Merah" },
    ],
    benefits: roadBarrierBenefits,
    useCases: ["Proyek jalan", "Pengaturan lalu lintas", "Parkir luas", "Event outdoor", "Jalan umum"],
    decisionNote: "Model paling panjang dan tinggi dalam lini ini, sekaligus paling ringan saat kosong. Cocok saat area membutuhkan pembatas yang lebih terlihat dan efisien ditangani.",
  },
  {
    id: "road-barrier-1",
    category: "barrier",
    categoryLabel: "Road Barrier",
    eyebrow: "COMPACT PROFILE",
    title: "Road Barrier 1",
    description: "Water barrier plastik berbahan PE dengan ukuran ringkas untuk membentuk jalur pembatas yang mudah dipindahkan.",
    image: "https://roadbarrierindonesia.com/wp-content/uploads/2022/03/road-barrier-1.webp",
    officialUrl: "https://roadbarrierindonesia.com/produk/road-barrier-1/",
    accent: "red",
    specs: [
      { label: "Panjang", value: "114 cm" },
      { label: "Lebar", value: "46 cm" },
      { label: "Tinggi", value: "72 cm" },
      { label: "Kapasitas air", value: "Max 80 L" },
      { label: "Berat", value: "12 kg" },
      { label: "Warna", value: "Merah" },
    ],
    benefits: roadBarrierBenefits,
    useCases: ["Area parkir", "Event", "Jalan lingkungan", "Proyek ringan", "Area sementara"],
    decisionNote: "Profil paling ringkas dalam lini road barrier. Pilih model ini untuk ruang terbatas dan layout yang perlu mudah disesuaikan.",
  },
  {
    id: "road-barrier-2",
    category: "barrier",
    categoryLabel: "Road Barrier",
    eyebrow: "MODULAR SYSTEM",
    title: "Road Barrier 2",
    description: "Profil road barrier yang siap diisi air atau pasir untuk membantu menjaga pembatas tetap stabil di area proyek.",
    image: "https://roadbarrierindonesia.com/wp-content/uploads/2022/03/RB2-e1676952922484.webp",
    officialUrl: "https://roadbarrierindonesia.com/produk/road-barrier-2/",
    accent: "red",
    specs: [
      { label: "Panjang", value: "116 cm" },
      { label: "Lebar", value: "48 cm" },
      { label: "Tinggi", value: "76 cm" },
      { label: "Kapasitas air", value: "Max 80 L" },
      { label: "Berat", value: "12 kg" },
      { label: "Warna", value: "Merah" },
    ],
    benefits: roadBarrierBenefits,
    useCases: ["Proyek kecil–menengah", "Area parkir", "Area kerja", "Pengalihan jalur sementara"],
    decisionNote: "Ukuran proporsional untuk kebutuhan serbaguna. Cocok sebagai titik tengah antara footprint ringkas dan visibilitas pembatas.",
  },
  {
    id: "road-barrier-3",
    category: "barrier",
    categoryLabel: "Road Barrier",
    eyebrow: "PROJECT READY",
    title: "Road Barrier 3",
    description: "Road barrier plastik untuk jalur kerja dan pembatas area umum dengan sistem pengisian sebagai pemberat.",
    image: "https://roadbarrierindonesia.com/wp-content/uploads/2022/04/roadbarrier3.webp",
    officialUrl: "https://roadbarrierindonesia.com/produk/road-barrier-3/",
    accent: "red",
    specs: [
      { label: "Panjang", value: "116 cm" },
      { label: "Lebar", value: "48 cm" },
      { label: "Tinggi", value: "77 cm" },
      { label: "Kapasitas air", value: "Max 80 L" },
      { label: "Berat", value: "12 kg" },
      { label: "Warna", value: "Merah" },
    ],
    benefits: roadBarrierBenefits,
    useCases: ["Jalan raya", "Proyek konstruksi", "Kawasan industri", "Area intensif"],
    decisionNote: "Model 12 kg dengan tinggi 77 cm untuk pekerjaan yang membutuhkan profil pembatas lebih tegas dan stabil.",
  },
  {
    id: "traffic-cone-mathes",
    category: "cone",
    categoryLabel: "Traffic Cone",
    eyebrow: "HIGH VISIBILITY",
    title: "Traffic Cone Mathes",
    description: "Traffic cone berwarna terang dengan reflektor untuk kebutuhan pengalihan jalur dan peringatan area kerja.",
    image: "https://roadbarrierindonesia.com/wp-content/uploads/2022/03/Traffic-Cone-Mathes-1024x997.webp",
    officialUrl: "https://roadbarrierindonesia.com/produk/traffic-cone-mathes/",
    accent: "orange",
    specs: [
      { label: "Tinggi", value: "73 cm" },
      { label: "Lebar alas", value: "35 cm" },
      { label: "Warna", value: "Orange" },
      { label: "Fitur", value: "Schotlite reflector" },
    ],
    benefits: trafficConeBenefits,
    useCases: ["Perbaikan jalan", "Pengalihan lalu lintas", "Peringatan bahaya", "Operasional malam"],
    decisionNote: "Pilihan cone 73 cm dengan alas lebih ramping. Cocok saat visibilitas dibutuhkan tanpa footprint alas yang terlalu besar.",
  },
  {
    id: "traffic-cone-50",
    category: "cone",
    categoryLabel: "Traffic Cone",
    eyebrow: "EASY DEPLOY",
    title: "Traffic Cone 50",
    description: "Cone kompak untuk pengaturan jalur, pekerjaan jalan, dan penanda bahaya di area dengan ruang terbatas.",
    image: "https://roadbarrierindonesia.com/wp-content/uploads/2022/03/tc-50.webp",
    officialUrl: "https://roadbarrierindonesia.com/produk/traffic-cone-50/",
    accent: "orange",
    specs: [
      { label: "Tinggi", value: "57 cm" },
      { label: "Lebar alas", value: "37 cm" },
      { label: "Berat", value: "0,8 kg" },
      { label: "Warna", value: "Orange" },
    ],
    benefits: trafficConeBenefits,
    useCases: ["Area sempit", "Parkir", "Peringatan bahaya", "Pengaturan jalur sementara"],
    decisionNote: "Model paling kompak dan ringan untuk penandaan cepat di area yang ruang geraknya terbatas.",
  },
  {
    id: "traffic-cone-75",
    category: "cone",
    categoryLabel: "Traffic Cone",
    eyebrow: "NIGHT VISIBLE",
    title: "Traffic Cone 75",
    description: "Traffic cone tinggi dengan warna high-visibility dan pemantul cahaya untuk situasi pengalihan jalur.",
    image: "https://roadbarrierindonesia.com/wp-content/uploads/2022/03/traffic-cone-75-min.webp",
    officialUrl: "https://roadbarrierindonesia.com/produk/traffic-cone-75/",
    accent: "orange",
    specs: [
      { label: "Tinggi", value: "73 cm" },
      { label: "Lebar alas", value: "43 cm" },
      { label: "Berat", value: "1,2 kg" },
      { label: "Warna", value: "Orange" },
    ],
    benefits: trafficConeBenefits,
    useCases: ["Perbaikan jalan", "Pengalihan jalur", "Work zone", "Kondisi siang–malam"],
    decisionNote: "Cone 73 cm dengan alas 43 cm dan bobot 1,2 kg untuk kehadiran visual serta pijakan yang lebih besar.",
  },
  {
    id: "stick-cone",
    category: "stick",
    categoryLabel: "Stick Cone",
    eyebrow: "FLEXIBLE SAFETY",
    title: "Stick Cone",
    description: "Delineator untuk pembatas samping jalan, petunjuk jalur, dan pengaturan akses kendaraan ke area tertentu.",
    image: "https://roadbarrierindonesia.com/wp-content/uploads/2022/03/stick-cone-min.webp",
    officialUrl: "https://roadbarrierindonesia.com/produk/stick-cone/",
    accent: "blue",
    specs: [
      { label: "Tinggi", value: "110 cm" },
      { label: "Lebar", value: "76 cm" },
      { label: "Berat", value: "1,2 kg" },
      { label: "Warna", value: "Orange" },
    ],
    benefits: stickConeBenefits,
    useCases: ["Pembatas samping jalan", "Petunjuk jalur", "Entrance", "Parkir", "Pembatas kendaraan"],
    decisionNote: "Untuk titik yang perlu ditandai secara vertikal tanpa memakai barrier penuh, terutama akses kendaraan dan sisi jalur.",
  },
  {
    id: "stick-cone-2",
    category: "stick",
    categoryLabel: "Stick Cone",
    eyebrow: "FLEXIBLE SAFETY",
    title: "Stick Cone 2",
    description: "Versi stick cone untuk marking samping jalan dan pembatas akses dengan visibilitas tinggi di lapangan.",
    image: "https://roadbarrierindonesia.com/wp-content/uploads/2022/04/STC2.webp",
    officialUrl: "https://roadbarrierindonesia.com/produk/stick-cone-2/",
    accent: "blue",
    specs: [
      { label: "Tinggi", value: "110 cm" },
      { label: "Lebar", value: "76 cm" },
      { label: "Berat", value: "1,2 kg" },
      { label: "Warna", value: "Orange" },
    ],
    benefits: stickConeBenefits,
    useCases: ["Pembatas samping jalan", "Petunjuk jalur", "Entrance", "Parkir", "Pembatas kendaraan"],
    decisionNote: "Alternatif model stick cone untuk barikade ringan dan penanda akses yang sering dipindahkan.",
  },
];
