export type CatalogCategory = "all" | "barrier" | "cone" | "stick";

export type CatalogSpec = {
  label: string;
  value: string;
};

export type CatalogVariant = {
  id: string;
  label: string;
  image: string;
  sourceFile: string;
  specs?: CatalogSpec[];
};

export type CatalogProduct = {
  id: string;
  category: Exclude<CatalogCategory, "all">;
  categoryLabel: string;
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  specs: CatalogSpec[];
  benefits: string[];
  useCases: string[];
  decisionNote: string;
  accent: "red" | "orange" | "blue";
  specSource: string;
  variants: CatalogVariant[];
  bestSeller?: boolean;
};

const roadBarrierBenefits = [
  "Polyethylene (PE) tahan cuaca dan paparan UV",
  "Dapat diisi air atau pasir* sebagai pemberat",
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

export const catalogProducts: CatalogProduct[] = [
  {
    id: "road-barrier-2",
    specSource: "Ukuran dan berat mengacu pada arsip website sebelumnya; foto Drive tidak mencantumkan spesifikasi angka. Konfirmasikan spesifikasi akhir ke tim sales.",
    variants: [
      {
        id: "red",
        label: "Merah",
        image: "/products/road-barrier-2.webp?v=20261126-drive",
        sourceFile: "RB 2.png",
        specs: [
          {
            label: "Warna",
            value: "Merah"
          }
        ]
      },
      {
        id: "white",
        label: "Putih",
        image: "/products/road-barrier-2-white.webp?v=20261126-drive",
        sourceFile: "RB 2 White.png",
        specs: [
          {
            label: "Warna",
            value: "Putih"
          }
        ]
      }
    ],
    category: "barrier",
    categoryLabel: "Road Barrier",
    eyebrow: "BEST SELLER · RB2",
    bestSeller: true,
    title: "Road Barrier 2",
    description: "Profil road barrier yang siap diisi air atau pasir untuk membantu menjaga pembatas tetap stabil di area proyek.",
    image: "/products/road-barrier-2.webp?v=20261126-drive",
    accent: "red",
    specs: [
      { label: "Panjang", value: "116 cm" },
      { label: "Lebar", value: "48 cm" },
      { label: "Tinggi", value: "76 cm" },
      { label: "Berat", value: "12 kg" },
      { label: "Warna", value: "Merah" },
    ],
    benefits: roadBarrierBenefits,
    useCases: ["Proyek kecil–menengah", "Area parkir", "Area kerja", "Pengalihan jalur sementara"],
    decisionNote: "Ukuran proporsional untuk kebutuhan serbaguna. Cocok sebagai titik tengah antara footprint ringkas dan visibilitas pembatas.",
  },
  {
    id: "road-barrier-mathes",
    specSource: "Ukuran dan berat mengacu pada arsip website sebelumnya; foto Drive tidak mencantumkan spesifikasi angka. Konfirmasikan spesifikasi akhir ke tim sales.",
    variants: [
      {
        id: "reflector",
        label: "Reflektor putih",
        image: "/products/road-barrier-mathes.webp?v=20261126-drive",
        sourceFile: "RBM.png"
      },
      {
        id: "arrow",
        label: "Panah satu arah",
        image: "/products/road-barrier-mathes-arrow.webp?v=20261126-drive",
        sourceFile: "RB Mathes.png"
      },
      {
        id: "double-arrow",
        label: "Panah dua arah",
        image: "/products/road-barrier-mathes-double-arrow.webp?v=20261126-drive",
        sourceFile: "RB Mathes panah.png"
      }
    ],
    category: "barrier",
    categoryLabel: "Road Barrier",
    eyebrow: "WATER-FILLABLE",
    title: "Road Barrier Mathes",
    description: "Barrier modular untuk pengaturan lalu lintas, lahan parkir, dan area kerja yang membutuhkan pembatas stabil.",
    image: "/products/road-barrier-mathes.webp?v=20261126-drive",
    accent: "red",
    specs: [
      { label: "Panjang", value: "120 cm" },
      { label: "Lebar", value: "47 cm" },
      { label: "Tinggi", value: "78 cm" },
      { label: "Berat", value: "10 kg" },
      { label: "Warna", value: "Merah" },
    ],
    benefits: roadBarrierBenefits,
    useCases: ["Proyek jalan", "Pengaturan lalu lintas", "Parkir luas", "Event outdoor", "Jalan umum"],
    decisionNote: "Pilih tampilan reflektor putih, panah satu arah, atau panah dua arah sesuai kebutuhan penandaan proyek. Konfirmasikan ukuran dan konfigurasi reflektor sebelum pemesanan.",
  },
  {
    id: "road-barrier-1",
    specSource: "Ukuran dan berat mengacu pada arsip website sebelumnya; foto Drive tidak mencantumkan spesifikasi angka. Konfirmasikan spesifikasi akhir ke tim sales.",
    variants: [
      {
        id: "red",
        label: "Merah",
        image: "/products/road-barrier-1.webp?v=20261126-drive",
        sourceFile: "RB 1.png",
        specs: [
          {
            label: "Warna",
            value: "Merah"
          }
        ]
      },
      {
        id: "white",
        label: "Putih",
        image: "/products/road-barrier-1-white.webp?v=20261126-drive",
        sourceFile: "RB 1 white.png",
        specs: [
          {
            label: "Warna",
            value: "Putih"
          }
        ]
      }
    ],
    category: "barrier",
    categoryLabel: "Road Barrier",
    eyebrow: "COMPACT PROFILE",
    title: "Road Barrier 1",
    description: "Water barrier plastik berbahan PE dengan ukuran ringkas untuk membentuk jalur pembatas yang mudah dipindahkan.",
    image: "/products/road-barrier-1.webp?v=20261126-drive",
    accent: "red",
    specs: [
      { label: "Panjang", value: "114 cm" },
      { label: "Lebar", value: "46 cm" },
      { label: "Tinggi", value: "72 cm" },
      { label: "Berat", value: "12 kg" },
      { label: "Warna", value: "Merah" },
    ],
    benefits: roadBarrierBenefits,
    useCases: ["Area parkir", "Event", "Jalan lingkungan", "Proyek ringan", "Area sementara"],
    decisionNote: "Profil ringkas dengan pilihan foto merah atau putih. Konfirmasikan stok warna dan kebutuhan reflektor saat meminta penawaran.",
  },
  {
    id: "road-barrier-3",
    specSource: "Ukuran dan berat mengacu pada arsip website sebelumnya; foto Drive tidak mencantumkan spesifikasi angka. Konfirmasikan spesifikasi akhir ke tim sales.",
    variants: [
      {
        id: "red",
        label: "Merah",
        image: "/products/road-barrier-3.webp?v=20261126-drive",
        sourceFile: "RB 3.png"
      }
    ],
    category: "barrier",
    categoryLabel: "Road Barrier",
    eyebrow: "PROJECT READY",
    title: "Road Barrier 3",
    description: "Road barrier plastik untuk jalur kerja dan pembatas area umum dengan sistem pengisian sebagai pemberat.",
    image: "/products/road-barrier-3.webp?v=20261126-drive",
    accent: "red",
    specs: [
      { label: "Panjang", value: "116 cm" },
      { label: "Lebar", value: "48 cm" },
      { label: "Tinggi", value: "77 cm" },
      { label: "Berat", value: "12 kg" },
      { label: "Warna", value: "Merah" },
    ],
    benefits: roadBarrierBenefits,
    useCases: ["Jalan raya", "Proyek konstruksi", "Kawasan industri", "Area intensif"],
    decisionNote: "Model 12 kg dengan tinggi 77 cm untuk pekerjaan yang membutuhkan profil pembatas lebih tegas dan stabil.",
  },
  {
    id: "road-barrier-4",
    category: "barrier",
    categoryLabel: "Road Barrier",
    eyebrow: "RB4 · PRODUCT RANGE",
    title: "Road Barrier 4",
    description: "Road barrier merah dengan tiga alur vertikal dan reflektor panah di bagian atas.",
    image: "/products/road-barrier-4.webp?v=20261126-drive",
    accent: "red",
    specs: [
      {
        label: "Ukuran",
        value: "Konfirmasi ke tim sales"
      },
      {
        label: "Berat",
        value: "Konfirmasi ke tim sales"
      }
    ],
    benefits: [
      "Reflektor panah untuk penandaan arah",
      "Bentuk produk mengikuti foto yang tersedia"
    ],
    useCases: [
      "Pembatas area proyek",
      "Pengaturan jalur sementara"
    ],
    decisionNote: "Sampaikan jumlah dan lokasi pemasangan agar tim sales dapat mengonfirmasi dimensi, material, kapasitas pemberat, serta stok model ini.",
    specSource: "Foto tersedia di folder Produk Trijaya. Dimensi, berat, material, dan kapasitas isi tidak tertulis pada gambar.",
    variants: [
      {
        id: "standard",
        label: "Standar",
        image: "/products/road-barrier-4.webp?v=20261126-drive",
        sourceFile: "RB 4.png"
      }
    ]
  },
  {
    id: "road-barrier-5",
    category: "barrier",
    categoryLabel: "Road Barrier",
    eyebrow: "RB5 · PRODUCT RANGE",
    title: "Road Barrier 5",
    description: "Road barrier oranye dengan bukaan tengah, pola silang, dan dua panel reflektor panah.",
    image: "/products/road-barrier-5.webp?v=20261126-drive",
    accent: "red",
    specs: [
      {
        label: "Ukuran",
        value: "Konfirmasi ke tim sales"
      },
      {
        label: "Berat",
        value: "Konfirmasi ke tim sales"
      }
    ],
    benefits: [
      "Reflektor panah untuk penandaan arah",
      "Bentuk produk mengikuti foto yang tersedia"
    ],
    useCases: [
      "Pembatas area proyek",
      "Pengaturan jalur sementara"
    ],
    decisionNote: "Sampaikan jumlah dan lokasi pemasangan agar tim sales dapat mengonfirmasi dimensi, material, kapasitas pemberat, serta stok model ini.",
    specSource: "Foto tersedia di folder Produk Trijaya. Dimensi, berat, material, dan kapasitas isi tidak tertulis pada gambar.",
    variants: [
      {
        id: "standard",
        label: "Standar",
        image: "/products/road-barrier-5.webp?v=20261126-drive",
        sourceFile: "5. RB5.png"
      }
    ]
  },
  {
    id: "traffic-cone-mathes",
    specSource: "Ukuran dan berat mengacu pada arsip website sebelumnya; foto Drive tidak mencantumkan spesifikasi angka. Konfirmasikan spesifikasi akhir ke tim sales.",
    variants: [
      {
        id: "standard",
        label: "Standar",
        image: "/products/traffic-cone-mathes.webp?v=20261126-drive",
        sourceFile: "TC MATHE.png"
      }
    ],
    category: "cone",
    categoryLabel: "Traffic Cone",
    eyebrow: "HIGH VISIBILITY",
    title: "Traffic Cone Mathes",
    description: "Traffic cone berwarna terang dengan reflektor untuk kebutuhan pengalihan jalur dan peringatan area kerja.",
    image: "/products/traffic-cone-mathes.webp?v=20261126-drive",
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
    specSource: "Ukuran dan berat mengacu pada arsip website sebelumnya; foto Drive tidak mencantumkan spesifikasi angka. Konfirmasikan spesifikasi akhir ke tim sales.",
    variants: [
      {
        id: "standard",
        label: "Standar",
        image: "/products/traffic-cone-50.webp?v=20261126-drive",
        sourceFile: "TC50.png"
      }
    ],
    category: "cone",
    categoryLabel: "Traffic Cone",
    eyebrow: "EASY DEPLOY",
    title: "Traffic Cone 50",
    description: "Cone kompak untuk pengaturan jalur, pekerjaan jalan, dan penanda bahaya di area dengan ruang terbatas.",
    image: "/products/traffic-cone-50.webp?v=20261126-drive",
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
    specSource: "Ukuran dan berat mengacu pada arsip website sebelumnya; foto Drive tidak mencantumkan spesifikasi angka. Konfirmasikan spesifikasi akhir ke tim sales.",
    variants: [
      {
        id: "standard",
        label: "Standar",
        image: "/products/traffic-cone-75.webp?v=20261126-drive",
        sourceFile: "TC75.png"
      }
    ],
    category: "cone",
    categoryLabel: "Traffic Cone",
    eyebrow: "NIGHT VISIBLE",
    title: "Traffic Cone 75",
    description: "Traffic cone tinggi dengan warna high-visibility dan pemantul cahaya untuk situasi pengalihan jalur.",
    image: "/products/traffic-cone-75.webp?v=20261126-drive",
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
    specSource: "Ukuran dan berat mengacu pada arsip website sebelumnya; foto Drive tidak mencantumkan spesifikasi angka. Konfirmasikan spesifikasi akhir ke tim sales.",
    variants: [
      {
        id: "standard",
        label: "Standar",
        image: "/products/stick-cone.webp?v=20261126-drive",
        sourceFile: "STC.png"
      }
    ],
    category: "stick",
    categoryLabel: "Stick Cone",
    eyebrow: "FLEXIBLE SAFETY",
    title: "Stick Cone",
    description: "Stick cone untuk pembatas samping jalan, petunjuk jalur, dan pengaturan akses kendaraan ke area tertentu.",
    image: "/products/stick-cone.webp?v=20261126-drive",
    accent: "blue",
    specs: [
      { label: "Tinggi", value: "110 cm" },
      { label: "Berat", value: "1,2 kg" },
      { label: "Warna", value: "Orange" },
    ],
    benefits: stickConeBenefits,
    useCases: ["Pembatas samping jalan", "Petunjuk jalur", "Entrance", "Parkir", "Pembatas kendaraan"],
    decisionNote: "Untuk titik yang perlu ditandai secara vertikal tanpa memakai barrier penuh, terutama akses kendaraan dan sisi jalur.",
  },
  {
    id: "stick-cone-2",
    specSource: "Ukuran dan berat mengacu pada arsip website sebelumnya; foto Drive tidak mencantumkan spesifikasi angka. Konfirmasikan spesifikasi akhir ke tim sales.",
    variants: [
      {
        id: "standard",
        label: "Standar",
        image: "/products/stick-cone-2.webp?v=20261126-drive",
        sourceFile: "STC 2.png"
      }
    ],
    category: "stick",
    categoryLabel: "Stick Cone",
    eyebrow: "FLEXIBLE SAFETY",
    title: "Stick Cone 2",
    description: "Versi stick cone untuk marking samping jalan dan pembatas akses dengan visibilitas tinggi di lapangan.",
    image: "/products/stick-cone-2.webp?v=20261126-drive",
    accent: "blue",
    specs: [
      { label: "Tinggi", value: "110 cm" },
      { label: "Berat", value: "1,2 kg" },
      { label: "Warna", value: "Orange" },
    ],
    benefits: stickConeBenefits,
    useCases: ["Pembatas samping jalan", "Petunjuk jalur", "Entrance", "Parkir", "Pembatas kendaraan"],
    decisionNote: "Alternatif model stick cone untuk barikade ringan dan penanda akses yang sering dipindahkan.",
  },
];

export const catalogCounts = {
  all: catalogProducts.length,
  barrier: catalogProducts.filter(product => product.category === "barrier").length,
  cone: catalogProducts.filter(product => product.category === "cone").length,
  stick: catalogProducts.filter(product => product.category === "stick").length,
  variants: catalogProducts.reduce((count, product) => count + product.variants.length, 0),
};

export const catalogCategories: Array<{ id: CatalogCategory; label: string; note: string }> = [
  { id: "all", label: "Semua produk", note: `${catalogCounts.all} model` },
  { id: "barrier", label: "Road Barrier", note: `${catalogCounts.barrier} model` },
  { id: "cone", label: "Traffic Cone", note: `${catalogCounts.cone} model` },
  { id: "stick", label: "Stick Cone", note: `${catalogCounts.stick} model` },
];

export function getProductVariant(product: CatalogProduct, variantId?: string) {
  return product.variants.find(variant => variant.id === variantId) ?? product.variants[0];
}

export function getVariantSpecs(product: CatalogProduct, variant: CatalogVariant) {
  return product.specs.map(spec => variant.specs?.find(override => override.label === spec.label) ?? spec);
}
