"use client";

import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from "react";
import ThemeToggle from "./ThemeToggle";
import HeroProductExplorer from "./HeroProductExplorer";
import ProductVariants from "./ProductVariants";
import { catalogProducts, catalogCounts, getProductVariant } from "./catalog-data";
import InteractiveCarousel from "./InteractiveCarousel";
import { ProductSymbol, BestSellerBadge, type SymbolKind } from "./ProductSymbols";

const logoUrl = "/logo-roadbarrier-official.png";
const legacySiteUrl = "/pelajari-lebih-lanjut/";
const heroUrl = "/legacy-assets/wp-content/uploads/2022/10/road-barrier-scaled.webp";
const products = [
  {
    id: "barrier",
    eyebrow: "BEST SELLER · RB2",
    catalogId: "road-barrier-2",
    title: "Cool Monkey Road Barrier 2",
    desc: "Road Barrier 2 berbahan PE. Spesifikasi arsip: 116 × 48 × 76 cm dan 12 kg; konfirmasikan detail akhir saat pemesanan. Dapat diisi air atau pasir* lalu dikaitkan antar-unit.",
    spec: `${catalogCounts.barrier} model · pilihan merah / putih`,
    highlights: ["PE anti-UV", "Isi air / pasir", "Pengait modular"],
    icon: "barrier",
    image: "/products/road-barrier-2.webp?v=20261126-drive",
    viewerKind: "procedural",
    viewerEmbed: "",
    referenceImage: "/reference-road-barrier.png",
    viewerSource: "Model ringan berdasarkan referensi produk resmi",
  },
  {
    id: "cone",
    eyebrow: "TRAFFIC CONTROL",
    catalogId: "traffic-cone-mathes",
    title: "Cool Monkey Traffic Cone Mathes",
    desc: "Cone berwarna terang dengan pemantul cahaya untuk pengalihan jalur, perbaikan jalan, dan peringatan bahaya—termasuk saat malam.",
    spec: `${catalogCounts.cone} model · foto produk terbaru`,
    highlights: ["Warna terang", "Pemantul cahaya", "Mudah dipindah"],
    icon: "cone",
    image: "/products/traffic-cone-mathes.webp?v=20261126-drive",
    viewerKind: "procedural",
    viewerEmbed: "",
    referenceImage: "/reference-traffic-cone.png",
    viewerSource: "Model interaktif berdasarkan referensi produk",
  },
  {
    id: "stick",
    eyebrow: "FLEXIBLE SAFETY",
    catalogId: "stick-cone-2",
    title: "Cool Monkey Stick Cone 2",
    desc: "Stick cone setinggi 110 cm untuk pembatas samping jalan, petunjuk jalur, dan barikade akses kendaraan ke area tertentu.",
    spec: `${catalogCounts.stick} model · dua bentuk kepala`,
    highlights: ["Penanda akses", "Profil tinggi 110 cm", "Portabel"],
    icon: "stick",
    image: "/products/stick-cone-2.webp?v=20261126-drive",
    viewerKind: "procedural",
    viewerEmbed: "",
    referenceImage: "/reference-stick-cone.png",
    viewerSource: "Model interaktif berdasarkan referensi produk",
  },
];

const journeyChoices = [
  { id: "konstruksi", kicker: "PROYEK JALAN", title: "Saya kontraktor", desc: "Butuh barrier untuk work zone, akses proyek, atau pekerjaan konstruksi?", product: "barrier" },
  { id: "jalan", kicker: "TRAFFIC CONTROL", title: "Saya atur lalu lintas", desc: "Cari road barrier atau traffic cone agar jalur lebih terlihat dan teratur.", product: "cone" },
  { id: "publik", kicker: "AREA PUBLIK", title: "Saya kelola area publik", desc: "Pilih road barrier atau traffic cone untuk entrance, parkir, event, dan area sementara.", product: "barrier" },
  { id: "distributor", kicker: "B2B / BULK ORDER", title: "Saya butuh bulk order", desc: "Diskusikan volume, spesifikasi, dan kebutuhan pengadaan dalam satu jalur.", product: "barrier" },
];

const aboutFeatures = [
  { title: "Rentang produk yang jelas", description: `${catalogCounts.barrier} road barrier, ${catalogCounts.cone} traffic cone, dan ${catalogCounts.stick} stick cone untuk dibandingkan sesuai kebutuhan lapangan.` },
  { title: "Siap kebutuhan proyek", description: "Konsultasi model, volume, lokasi kirim, hingga kebutuhan stiker atau branding." },
  { title: "Untuk berbagai area", description: "Relevan untuk konstruksi, pengalihan lalu lintas, parkir, event, dan pembatas akses." },
];

type FitAnswerKey = "project" | "area" | "priority" | "visibility" | "deployment" | "volume";

const fitQuestions: Array<{
  key: FitAnswerKey;
  label: string;
  helper: string;
  options: Array<{ id: string; label: string; note: string }>;
}> = [
  {
    key: "project",
    label: "Tipe proyek Anda?",
    helper: "Biar rekomendasi dimulai dari konteks lapangannya.",
    options: [
      { id: "construction", label: "Konstruksi / work zone", note: "Barrier sementara untuk area kerja" },
      { id: "traffic", label: "Pengaturan lalu lintas", note: "Road barrier dan traffic cone untuk jalur" },
      { id: "public", label: "Event / area publik", note: "Membatasi area dan entrance" },
    ],
  },
  {
    key: "area",
    label: "Produk dipakai di area seperti apa?",
    helper: "Karakter area membantu menentukan bentuk pengamanan yang paling masuk akal.",
    options: [
      { id: "work-zone", label: "Jalur kendaraan / work zone", note: "Perlu pembatas yang terlihat dan stabil" },
      { id: "diversion", label: "Pengalihan jalur sementara", note: "Perlu penanda yang cepat dipasang" },
      { id: "entrance", label: "Entrance / parkir / event", note: "Perlu marking akses yang fleksibel" },
    ],
  },
  {
    key: "priority",
    label: "Hasil utama yang ingin dicapai?",
    helper: "Pilih fungsi yang paling penting untuk tim Anda.",
    options: [
      { id: "barrier", label: "Membatasi kendaraan", note: "Struktur modular dan bisa diberi pemberat" },
      { id: "cone", label: "Mengarahkan jalur", note: "High-visibility untuk warning dan diversion" },
      { id: "stick", label: "Menandai akses / titik tertentu", note: "Fleksibel untuk marking area" },
    ],
  },
  {
    key: "visibility",
    label: "Seberapa penting visibilitas malam?",
    helper: "Jawaban ini membantu tim memahami kebutuhan pemantul cahaya di lapangan.",
    options: [
      { id: "day", label: "Mayoritas siang hari", note: "Area terang dengan kontrol visual" },
      { id: "day-night", label: "Siang sampai malam", note: "Perlu penanda yang tetap terlihat" },
      { id: "high-visibility", label: "Sangat ramai / risiko tinggi", note: "Prioritaskan visibilitas maksimum" },
    ],
  },
  {
    key: "deployment",
    label: "Cara pemasangan yang Anda butuhkan?",
    helper: "Pilih cara kerja yang paling dekat dengan operasional proyek.",
    options: [
      { id: "fillable", label: "Modular dan bisa diberi pemberat", note: "Untuk barisan pembatas yang stabil" },
      { id: "portable", label: "Ringan untuk pindah cepat", note: "Untuk perubahan layout berulang" },
      { id: "flexible", label: "Fleksibel untuk marking titik", note: "Untuk entrance, parkir, dan akses" },
    ],
  },
  {
    key: "volume",
    label: "Skala kebutuhan Anda?",
    helper: "Estimasi awal saja—nanti tim kami bantu detailnya.",
    options: [
      { id: "small", label: "Kurang dari 20 unit", note: "Kebutuhan spot / area kecil" },
      { id: "medium", label: "20–100 unit", note: "Kebutuhan proyek menengah" },
      { id: "bulk", label: "100+ unit / bulk order", note: "Pengadaan dan distribusi" },
    ],
  },
];

const articles = [
  {
    title: "Mengapa Kontraktor Perlu Menyediakan Water Barrier Proyek di Setiap Proyek Jalan?",
    meta: "30 Mei 2026 · Proyek & safety",
    image: "/legacy-assets/wp-content/uploads/2026/05/image-1-1024x683.webp",
    href: "/pelajari-lebih-lanjut/water-barrier-proyek/",
  },
  {
    title: "Tips Memilih Ukuran Water Barrier Sesuai Kebutuhan Area",
    meta: "19 Mei 2026 · Panduan pembelian",
    image: "/legacy-assets/wp-content/uploads/2026/05/image-1024x683.webp",
    href: "/pelajari-lebih-lanjut/tips-memilih-ukuran-water-barrier/",
  },
  {
    title: "Water Barrier Pembatas Serbaguna",
    meta: "30 April 2026 · Insight produk",
    image: "/legacy-assets/wp-content/uploads/2026/04/Tips-Memilih-Water-Barrier-Sesuai-Anggaran.webp",
    href: "/pelajari-lebih-lanjut/tips-memilih-water-barrier-sesuai-anggaran/",
  },
  {
    title: "Mengapa Memilih Barrier Pembatas Jalan dengan Material Plastik?",
    meta: "29 April 2026 · Material & safety",
    image: "/legacy-assets/wp-content/uploads/2026/04/Mengapa-Memilih-Barrier-Pembatas-Jalan-dengan-Material-Plastik.webp",
    href: "/pelajari-lebih-lanjut/mengapa-memilih-barrier-pembatas-jalan-dengan-material-plastik/",
  },
  {
    title: "Road Barrier Plastik untuk Proyek Pemerintah: Solusi Pengaman Jalan yang Praktis dan Ekonomis",
    meta: "16 Maret 2026 · Infrastruktur",
    image: "/legacy-assets/wp-content/uploads/2026/03/Road-Barrier-Plastik-untuk-Proyek-Pemerintah.webp",
    href: "/pelajari-lebih-lanjut/road-barrier-plastik-untuk-proyek-pemerintah-solusi-pengaman-jalan-yang-praktis-dan-ekonomis/",
  },
  {
    title: "Keunggulan Material Road Barrier Plastik untuk Proyek Konstruksi",
    meta: "16 Maret 2026 · Material & safety",
    image: "/legacy-assets/wp-content/uploads/2026/03/Keunggulan-Material-Road-Barrier-Plastik-untuk-Proyek-Konstruksi.webp",
    href: "/pelajari-lebih-lanjut/keunggulan-material-road-barrier-plastik-untuk-proyek-konstruksi/",
  },
];

const ArrowUpRight = () => (
  <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 15 15 5M7 5h8v8" /></svg>
);

const Check = () => (
  <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m4 10 4 4 8-8" /></svg>
);

function ProductVisual({ image, title }: { image: string; title: string }) {
  return <div className="product-visual legacy-product-photo"><img src={image} alt={title} loading="lazy" /></div>;
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState("barrier");
  const [activeUseCase, setActiveUseCase] = useState("konstruksi");
  const [activeJourney, setActiveJourney] = useState("konstruksi");
  const [activeFeature, setActiveFeature] = useState(0);
  const [heroPointer, setHeroPointer] = useState({ x: 50, y: 50 });
  const [fitStep, setFitStep] = useState(0);
  const [fitRegion, setFitRegion] = useState("");
  const [regionError, setRegionError] = useState(false);
  const regionInputRef = useRef<HTMLInputElement>(null);
  const fitStepCount = fitQuestions.length + 1;
  const isRegionStep = fitStep === fitQuestions.length;
  const [fitAnswers, setFitAnswers] = useState<Record<FitAnswerKey, string>>({ project: "construction", area: "work-zone", priority: "barrier", visibility: "day-night", deployment: "fillable", volume: "bulk" });
  const [scrollProgress, setScrollProgress] = useState(0);
  const currentProduct = products.find((product) => product.id === activeProduct) ?? products[0];
  const [homeVariantIds, setHomeVariantIds] = useState<Record<string, string>>({});
  const currentCatalogProduct = catalogProducts.find(product => product.id === currentProduct.catalogId)!;
  const currentVariant = getProductVariant(currentCatalogProduct, homeVariantIds[currentCatalogProduct.id]);

  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0);
    };
    updateScrollProgress();
    window.addEventListener("scroll", updateScrollProgress, { passive: true });
    window.addEventListener("resize", updateScrollProgress);
    return () => {
      window.removeEventListener("scroll", updateScrollProgress);
      window.removeEventListener("resize", updateScrollProgress);
    };
  }, []);

  const fitProject = fitQuestions.find((question) => question.key === "project")?.options.find((option) => option.id === fitAnswers.project) ?? fitQuestions[0].options[0];
  const fitArea = fitQuestions.find((question) => question.key === "area")?.options.find((option) => option.id === fitAnswers.area) ?? fitQuestions[1].options[0];
  const fitProduct = products.find((product) => product.id === fitAnswers.priority) ?? products[0];
  const fitCatalogProduct = catalogProducts.find(product => product.id === fitProduct.catalogId)!;
  const fitVariant = getProductVariant(fitCatalogProduct, homeVariantIds[fitCatalogProduct.id]);
  const fitVisibility = fitQuestions.find((question) => question.key === "visibility")?.options.find((option) => option.id === fitAnswers.visibility) ?? fitQuestions[3].options[1];
  const fitDeployment = fitQuestions.find((question) => question.key === "deployment")?.options.find((option) => option.id === fitAnswers.deployment) ?? fitQuestions[4].options[0];
  const fitVolume = fitQuestions.find((question) => question.key === "volume")?.options.find((option) => option.id === fitAnswers.volume) ?? fitQuestions[5].options[2];
  const fitPriority = fitQuestions[2].options.find((option) => option.id === fitAnswers.priority) ?? fitQuestions[2].options[0];
  const fitMessage = [
    "Halo Road Barrier Indonesia, saya ingin konsultasi kebutuhan produk.",
    "",
    `Wilayah proyek: ${fitRegion.trim()}`,
    `Tipe proyek: ${fitProject.label}`,
    `Area penggunaan: ${fitArea.label}`,
    `Kebutuhan utama: ${fitPriority.label}`,
    `Visibilitas: ${fitVisibility.label}`,
    `Cara pemasangan: ${fitDeployment.label}`,
    `Jumlah kebutuhan: ${fitVolume.label}`,
    `Produk yang ingin dikonsultasikan: ${fitProduct.title}`,
    `Varian pilihan: ${fitVariant.label}`,
    "",
    "Mohon informasi produk yang sesuai, harga, stok, dan pengiriman ke wilayah saya. Terima kasih.",
  ].join("\n");
  const fitWhatsAppHref = `https://wa.me/628133200200?text=${encodeURIComponent(fitMessage)}`;

  useEffect(() => {
    if (isRegionStep) regionInputRef.current?.focus({ preventScroll: true });
  }, [isRegionStep]);

  const prepareFitContact = (event: MouseEvent<HTMLAnchorElement>) => {
    if (fitRegion.trim().length < 2) {
      event.preventDefault();
      setRegionError(true);
      setFitStep(fitQuestions.length);
      regionInputRef.current?.focus();
      document.getElementById("fit-check")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    setActiveProduct(fitProduct.id);
  };

  const startJourney = (choice: (typeof journeyChoices)[number]) => {
    setActiveJourney(choice.id);
    setActiveProduct(choice.product);
    if (choice.id !== "distributor") setActiveUseCase(choice.id);
    window.setTimeout(() => document.getElementById("produk")?.scrollIntoView({ behavior: "smooth", block: "start" }), 30);
  };

  const chooseFit = (answer: string) => {
    const key = fitQuestions[fitStep].key;
    setFitAnswers((current) => ({ ...current, [key]: answer }));
    if (key === "priority") setActiveProduct(answer);
    if (fitStep < fitQuestions.length) setFitStep((current) => current + 1);
  };

  return (
    <main>
      <div className="topbar">
        <div className="container topbar-inner">
          <span><i className="status-dot" /> Supplier road safety equipment untuk kebutuhan proyek</span>
          <span className="topbar-right">Respons cepat · Konsultasi spesifikasi · Pengiriman Indonesia</span>
        </div>
      </div>

      <header className="site-header">
        <div className="container nav-wrap">
          <a className="brand" href="#home" aria-label="Road Barrier Indonesia">
            <img src={logoUrl} alt="Road Barrier Indonesia" />
            <span><strong>ROAD BARRIER</strong><small>INDONESIA</small></span>
          </a>
          <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? "Tutup menu" : "Buka menu"} aria-expanded={menuOpen} aria-controls="primary-navigation">{menuOpen ? "×" : "☰"}</button>
          <nav id="primary-navigation" className={menuOpen ? "main-nav open" : "main-nav"}>
            <a href="#home" onClick={() => setMenuOpen(false)}>Home</a>
            <a href="#tentang" onClick={() => setMenuOpen(false)}>Tentang Kami</a>
            <a href="/katalog" onClick={() => setMenuOpen(false)}>Produk</a>
            <a href="#insight" onClick={() => setMenuOpen(false)}>News</a>
            <a href="#kontak" onClick={() => setMenuOpen(false)}>Contact Person</a>
          </nav>
          <ThemeToggle />
          <a className="nav-cta" href="#kontak">Minta Penawaran <ArrowUpRight /></a>
        </div>
        <div className="scroll-progress" aria-hidden="true"><span style={{ width: `${scrollProgress}%` }} /></div>
      </header>

      <section
        className="hero"
        id="home"
        style={{ "--mx": `${heroPointer.x}%`, "--my": `${heroPointer.y}%` } as CSSProperties}
        onPointerMove={(event) => {
          if ((event.target as Element).closest("#product-explorer")) return;
          const bounds = event.currentTarget.getBoundingClientRect();
          setHeroPointer({ x: ((event.clientX - bounds.left) / bounds.width) * 100, y: ((event.clientY - bounds.top) / bounds.height) * 100 });
        }}
        onPointerLeave={() => setHeroPointer({ x: 50, y: 50 })}
      >
        <div className="hero-bg" style={{ backgroundImage: `url(${heroUrl})` }} />
        <div className="hero-grid" />
        <div className="hero-glow" />
        <div className="hero-rail"><span>01</span><i /><span>04</span></div>
        <div className="container hero-inner">
          <div className="hero-copy">
            <div className="breadcrumb"><span>Home</span><b>/</b><span>Road Safety Equipment</span></div>
            <div className="eyebrow light">ROAD SAFETY EQUIPMENT · PROJECT READY</div>
            <h1>Ringan dipindah.<br /><em>Stabil saat dipasang.</em></h1>
            <p>Road barrier plastik PE anti-UV yang dapat diisi air atau pasir*, lalu dikaitkan antar-unit untuk membentuk pembatas proyek yang rapi dan stabil.</p>
            <div className="hero-proof-pills" aria-label="Keunggulan utama road barrier"><span>PE tahan cuaca</span><span>Isi air / pasir*</span><span>Sistem modular</span></div>
            <div className="hero-actions">
              <a className="button hero-fit-cta" href="#fit-check"><svg className="consult-cta-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11.5a8 8 0 0 1-8 8H5l-4 3 2-7a8 8 0 1 1 17-4Z"/><path d="M7 9h8M7 13h5"/></svg>Konsultasi Kebutuhan Anda <ArrowUpRight /></a>
              <a className="button button-ghost hero-product-link" href="/katalog">Lihat Produk <ArrowUpRight /></a>
            </div>
            <p className="hero-consult-note">Isi kebutuhan &amp; wilayah, lalu konsultasi via WhatsApp Retno.</p>
            <div className="hero-note"><span className="avatar-stack"><i /><i /><i /></span><span>Diproduksi untuk kebutuhan jalan, konstruksi, parkir, dan event.</span></div>
          </div>
          <HeroProductExplorer />
        </div>
      </section>

      <div className="signal-ticker" aria-label="Road safety principles">
        <div className="signal-track"><span>ROAD SAFETY</span><b>✳</b><span>HIGH VISIBILITY</span><b>✳</b><span>MODULAR SYSTEM</span><b>✳</b><span>PROJECT READY</span><b>✳</b><span>ROAD SAFETY</span><b>✳</b><span>HIGH VISIBILITY</span><b>✳</b><span>MODULAR SYSTEM</span><b>✳</b><span>PROJECT READY</span></div>
      </div>

      <section className="proof-strip">
        <div className="container proof-grid">
          <div><strong>PE</strong><span>Material tahan cuaca dan anti-UV</span></div>
          <div><strong>{catalogCounts.all}</strong><span>Model dalam 3 kategori produk</span></div>
          <div><strong>38</strong><span>Provinsi, siap supply</span></div>
          <div className="proof-accent"><span className="mini-arrow">↗</span><span>Siap diskusi kebutuhan<br />dan volume proyek</span></div>
        </div>
      </section>

      <section className="core-usp-section" id="keunggulan">
        <div className="container">
          <div className="core-usp-heading">
            <div><div className="eyebrow">KEUNGGULAN ROAD BARRIER COOL MONKEY</div><h2>Satu sistem. <em>Empat keuntungan di lapangan.</em></h2></div>
            <p>Dirancang untuk area yang berubah cepat: mudah diturunkan dan ditata saat kosong, lalu menjadi lebih kokoh setelah ditempatkan, diisi, dan dihubungkan.</p>
          </div>
          <InteractiveCarousel label="Keunggulan road barrier">
            {[
              { icon: "transport", title: "Angkut lebih praktis", text: "Bobot kosong 10–12 kg memudahkan pemindahan dan penataan sebelum pemasangan.", detail: "HANDLE + FORKLIFT ACCESS" },
              { icon: "fill", title: "Dapat diisi air / pasir*", text: "Gunakan air atau pasir sebagai pemberat agar barrier lebih stabil di lokasi kerja.", detail: "PLUG ATAS + PLUG BAWAH" },
              { icon: "modular", title: "Susun secara modular", text: "Pengait antar-unit membuat barisan pembatas lebih rapi, tersambung, dan mudah disesuaikan.", detail: "INTERLOCKING SYSTEM" },
              { icon: "visibility", title: "Tetap mudah terlihat", text: "Warna terang dan opsi stiker reflektif membantu visibilitas sekaligus identifikasi proyek.", detail: "REFLECTIVE + BRANDING" },
            ].map((feature, index) => (
              <article className="benefit-slide" key={feature.icon}>
                <div className="slide-symbol"><ProductSymbol kind={feature.icon as SymbolKind} /></div>
                <span className="slide-number">0{index + 1}</span>
                <div className="benefit-slide-copy"><small>{feature.detail}</small><h3>{feature.title}</h3><p>{feature.text}</p></div>
                <span className="slide-watermark" aria-hidden="true">0{index + 1}</span>
              </article>
            ))}
          </InteractiveCarousel>
          <p className="core-usp-footnote">* Jenis dan volume pemberat menyesuaikan model. Konsultasikan dengan tim sales.</p>
          <div className="material-proof"><span>PE berkualitas tinggi</span><p>Tahan panas, hujan, dan paparan UV. Material dapat didaur ulang dengan kebutuhan perawatan yang rendah.</p><a href="/katalog">Bandingkan {catalogCounts.barrier} model barrier <ArrowUpRight /></a></div>
        </div>
      </section>

      <section className="journey-section">
        <div className="container">
          <div className="journey-heading"><div><div className="eyebrow">MULAI DARI KEBUTUHAN ANDA</div><h2>Cari road barrier<br />atau traffic cone?</h2></div><p>Pilih jalur yang paling dekat dengan kebutuhan Anda. Kami arahkan langsung ke produk dan use case yang relevan.</p></div>
          <InteractiveCarousel label="Pilihan kebutuhan">
            {journeyChoices.map((choice, index) => (
              <button className={activeJourney === choice.id ? "journey-card active" : "journey-card"} key={choice.id} onClick={() => startJourney(choice)}>
                <span className="journey-index">0{index + 1}</span><span className="journey-symbol"><ProductSymbol kind={choice.id as SymbolKind} /></span><span className="journey-kicker">{choice.kicker}</span><strong>{choice.title}</strong><p>{choice.desc}</p><span className="journey-arrow">Lihat rekomendasi <ArrowUpRight /></span>
              </button>
            ))}
          </InteractiveCarousel>
        </div>
      </section>

      <section className="section products-section" id="produk">
        <div className="container">
          <div className="section-heading-row"><div><div className="eyebrow">PRODUK UTAMA</div><h2>Safety equipment<br /><em>yang bekerja.</em></h2></div><p>{activeJourney === "distributor" ? "Anda memilih jalur bulk order. Pilih produk utama untuk mulai diskusi volume dan spesifikasinya." : "Pilih produk sesuai kebutuhan area dan karakter proyek Anda. Setiap kartu punya jalur lanjut ke penawaran."}</p></div>
          <div className="product-grid">
            {products.map((product) => (
              <button className={`product-card${activeProduct === product.id ? " active" : ""}${product.id === "barrier" ? " is-bestseller" : ""}`} key={product.id} onClick={() => setActiveProduct(product.id)}>
                <div className="product-card-top">{product.id === "barrier" ? <BestSellerBadge /> : <span>{product.eyebrow}</span>}<span className="card-arrow"><ArrowUpRight /></span></div>
                <ProductVisual image={getProductVariant(catalogProducts.find(item => item.id === product.catalogId)!, homeVariantIds[product.catalogId]).image} title={product.title} />
                <div className="product-card-copy"><h3>{product.title}</h3><p>{product.desc}</p><div className="product-highlight-list">{product.highlights.map((item) => <span key={item}>✓ {item}</span>)}</div><div className="product-spec"><span>Rentang</span><strong>{product.spec}</strong></div></div>
              </button>
            ))}
          </div>
          <div className="product-detail"><div className="detail-kicker">PRODUK TERPILIH</div><div><h3>{currentProduct.title}</h3><p>{currentProduct.desc}</p><div className="product-detail-tags">{currentProduct.highlights.map((item) => <span key={item}>{item}</span>)}</div><ProductVariants product={currentCatalogProduct} variant={currentVariant} onChange={id => setHomeVariantIds(previous => ({ ...previous, [currentCatalogProduct.id]: id }))} /></div><a className="button button-dark" href={`/katalog/?produk=${currentCatalogProduct.id}&varian=${currentVariant.id}`}>Detail & semua model <ArrowUpRight /></a></div>
        </div>
      </section>

      <section className="section about-section" id="tentang">
        <div className="container about-grid">
          <div className="section-intro">
            <div className="eyebrow">KENAPA ROAD BARRIER INDONESIA</div>
            <h2>Produsen yang memahami kebutuhan lapangan.</h2>
            <p>Trijaya Indoplast bergerak di bidang alat safety dengan produk yang dibuat di Cikande untuk mendukung proyek publik maupun swasta di Indonesia.</p>
            <a className="text-link" href="#kontak">Kenal lebih dekat <ArrowUpRight /></a>
          </div>
          <div className="feature-list">
            {aboutFeatures.map((feature, index) => <button type="button" className={activeFeature === index ? "feature-card active" : "feature-card"} key={feature.title} onMouseEnter={() => setActiveFeature(index)} onFocus={() => setActiveFeature(index)} onClick={() => setActiveFeature(index)} aria-pressed={activeFeature === index}><span className="feature-number">{String(index + 1).padStart(2, "0")}</span><div><h3>{feature.title}</h3><p>{feature.description}</p></div><span className="feature-icon">↗</span></button>)}
          </div>
        </div>
      </section>

      <section className="fit-section" id="fit-check">
        <div className="container">
          <div className="fit-heading"><div><div className="eyebrow light">THE ROAD BARRIER FIT CHECK</div><h2>Temukan konfigurasi yang pas <em>untuk proyek Anda.</em></h2></div><p>Pilih kebutuhan proyek Anda, lalu isi wilayahnya. Semua jawaban akan masuk ke pesan WhatsApp agar tim kami bisa membantu dengan lebih tepat.</p></div>
          <div className="fit-shell">
            <div className="fit-panel">
              <div className="fit-progress" aria-label={`Pertanyaan ${fitStep + 1} dari ${fitStepCount}`}><span>CEK KEBUTUHAN / {String(fitStep + 1).padStart(2, "0")}</span><span>{String(fitStep + 1).padStart(2, "0")} <i style={{ width: `${((fitStep + 1) / fitStepCount) * 60}px` }} /> {String(fitStepCount).padStart(2, "0")}</span></div>
              <div className="fit-question" aria-live="polite"><span className="fit-question-number">0{fitStep + 1}</span><div><h3>{isRegionStep ? "Wilayah proyek Anda?" : fitQuestions[fitStep].label}</h3><p>{isRegionStep ? "Tulis kota/kabupaten dan provinsi agar kami bisa membantu kebutuhan serta pengirimannya." : fitQuestions[fitStep].helper}</p></div></div>
              {isRegionStep ? (
                <div className="fit-region">
                  <label htmlFor="fit-region">Kota/kabupaten dan provinsi <span aria-hidden="true">*</span></label>
                  <input ref={regionInputRef} id="fit-region" name="region" type="text" autoComplete="address-level2" placeholder="Contoh: Bekasi, Jawa Barat" maxLength={120} required value={fitRegion} aria-invalid={regionError} aria-describedby={regionError ? "fit-region-error fit-region-note" : "fit-region-note"} onChange={(event) => { setFitRegion(event.target.value); setRegionError(false); }} />
                  {regionError && <p className="fit-region-error" id="fit-region-error" role="alert">Isi kota/kabupaten dan provinsi terlebih dahulu.</p>}
                  <p className="fit-region-note" id="fit-region-note">Jawaban dan wilayah Anda akan terisi di WhatsApp. Periksa pesannya, lalu tekan Kirim untuk menghubungi tim kami.</p>
                  <details className="fit-message-preview"><summary>Lihat ringkasan pesan</summary><p>{fitMessage}</p></details>
                </div>
              ) : <div className="fit-options">{fitQuestions[fitStep].options.map((option) => { const current = fitAnswers[fitQuestions[fitStep].key]; return <button className={current === option.id ? "fit-option active" : "fit-option"} key={option.id} onClick={() => chooseFit(option.id)}><span className="fit-radio" /><span><strong>{option.label}</strong><small>{option.note}</small></span><ArrowUpRight /></button>; })}</div>}
              <div className="fit-nav"><button onClick={() => setFitStep((current) => Math.max(0, current - 1))} disabled={fitStep === 0}>← Kembali</button>{isRegionStep ? <a className="fit-consult-link" href={fitWhatsAppHref} target="_blank" rel="noreferrer" onClick={prepareFitContact}>Lanjut ke WhatsApp <ArrowUpRight /></a> : <button onClick={() => setFitStep((current) => Math.min(fitQuestions.length, current + 1))}>Lanjut →</button>}</div>
            </div>
            <div className="fit-result" aria-live="polite"><div className="result-orbit orbit-one" /><div className="result-orbit orbit-two" /><div className="result-topline"><span>RECOMMENDED SETUP</span><b>LIVE MATCH</b></div><div className="result-visual"><ProductVisual image={fitVariant.image} title={`${fitProduct.title} — ${fitVariant.label}`} /></div><div className="result-copy"><div className="result-context">{fitProject.label} <span>·</span> {fitArea.label} <span>·</span> {fitVolume.label}</div><h3>{fitProduct.title}</h3><p>{fitProduct.desc}</p><div className="result-tags"><span>✓ Produk relevan</span><span>✓ Bisa dikonsultasikan</span></div><ProductVariants product={fitCatalogProduct} variant={fitVariant} onChange={id => setHomeVariantIds(previous => ({ ...previous, [fitCatalogProduct.id]: id }))} /><a className="button button-red" href={fitWhatsAppHref} target="_blank" rel="noreferrer" onClick={prepareFitContact}>Konsultasi sekarang <ArrowUpRight /></a></div></div>
          </div>
        </div>
      </section>

      <section className="section usecase-section">
        <div className="container usecase-grid">
          <div className="usecase-copy"><div className="eyebrow light">DIBUAT UNTUK KONDISI NYATA</div><h2>Safety bukan sekadar produk. <em>Itu bagian dari alur kerja.</em></h2><p>Road Barrier Indonesia membantu tim memilih perlengkapan yang pas untuk situasi di lapangan, dari pekerjaan jalan hingga area publik.</p><div className="usecase-points"><span><Check /> Mudah dipindahkan</span><span><Check /> Visibilitas tinggi</span><span><Check /> Cocok untuk bulk order</span></div><a className="button button-red" href="#kontak">Diskusikan proyek <ArrowUpRight /></a></div>
          <div className="usecase-panel"><div className="usecase-tabs">{[["konstruksi","Konstruksi"],["jalan","Pekerjaan jalan"],["publik","Area publik"]].map(([id,label]) => <button className={activeUseCase===id?"active":""} key={id} onClick={()=>{setActiveUseCase(id);setActiveJourney(id)}}>{label}</button>)}</div><div className="usecase-scene"><div className="scene-road" /><div className="scene-lines" /><div className="scene-barriers"><span /><span /><span /><span /></div><div className="scene-label"><small>USE CASE / 0{activeUseCase === "konstruksi" ? "1" : activeUseCase === "jalan" ? "2" : "3"}</small><strong>{activeUseCase === "konstruksi" ? "Work zone yang lebih teratur" : activeUseCase === "jalan" ? "Pengaturan lalu lintas sementara" : "Membatasi area dengan jelas"}</strong></div></div></div>
        </div>
      </section>

      <section className="section process-section"><div className="container"><div className="section-heading-row process-heading"><div><div className="eyebrow">CARA KERJA</div><h2>Dari kebutuhan<br /><em>jadi solusi.</em></h2></div><p>Alur komunikasi yang ringkas agar tim Anda bisa fokus menyelesaikan proyek.</p></div><div className="process-grid"><div><span>01</span><h3>Konsultasi</h3><p>Ceritakan tipe area, volume, dan timeline proyek.</p></div><div><span>02</span><h3>Pilih produk</h3><p>Kami bantu arahkan spesifikasi yang paling pas.</p></div><div><span>03</span><h3>Penawaran</h3><p>Dapatkan estimasi kebutuhan dan harga untuk pengadaan.</p></div><div><span>04</span><h3>Proyek jalan</h3><p>Produk siap mendukung safety di lapangan.</p></div></div></div></section>

      <section className="section insight-section" id="insight"><div className="container"><div className="section-heading-row"><div><div className="eyebrow">INSIGHT UNTUK PROYEK</div><h2>Lebih siap sebelum<br /><em>turun ke lapangan.</em></h2><p className="insight-source">Arsip artikel Road Barrier Indonesia</p></div><a className="text-link" href="/pelajari-lebih-lanjut/news/">Lihat semua artikel <ArrowUpRight /></a></div><div className="article-grid">{articles.map((article, index) => <a className={index === 0 ? "article-card featured" : "article-card"} href={article.href} key={article.title}><div className="article-image"><img src={article.image} alt="" loading="lazy" /><span className="article-tag">{index < 2 ? "TERBARU" : "INSIGHT"}</span></div><div className="article-meta">{article.meta}</div><h3>{article.title}</h3><span className="read-more">Baca artikel <ArrowUpRight /></span></a>)}</div></div></section>

      <section className="cta-section" id="kontak"><div className="container cta-inner"><div><div className="eyebrow light">SIAP MEMULAI?</div><h2>Butuh road barrier<br /><em>untuk proyek Anda?</em></h2></div><div className="cta-right"><p>Ceritakan kebutuhan Anda. Tim kami siap membantu dari spesifikasi sampai penawaran.</p><div className="cta-actions"><a className="button button-light" href="https://wa.me/6281310697112" target="_blank" rel="noreferrer">Chat via WhatsApp <ArrowUpRight /></a><a className="button button-ghost" href={legacySiteUrl}>Pelajari Lebih Lanjut <ArrowUpRight /></a></div><span className="contact-note">Respon pada jam kerja · 08.00—17.00 WIB</span></div></div></section>

      <footer className="site-footer"><div className="container footer-grid"><div className="footer-brand"><a className="brand" href="#home"><img src={logoUrl} alt="Road Barrier Indonesia" /><span><strong>ROAD BARRIER</strong><small>INDONESIA</small></span></a><p>Road safety equipment untuk proyek yang lebih tertib, terlihat, dan aman.</p></div><div><h4>Menu utama</h4><a href="#tentang">Tentang Kami</a><a href="/katalog">Produk</a><a href="#insight">News</a><a href="#kontak">Contact Person</a></div><div><h4>Contact person</h4><a href="mailto:roadbarrierindonesia@gmail.com">roadbarrierindonesia@gmail.com</a><a href="tel:081310697112">0813 1069 7112 · Erwin</a><a href="tel:087776713715">0877 7671 3715 · Budi</a><a href="https://wa.me/628133200200" target="_blank" rel="noreferrer">0813 3200 200 · Retno</a></div><div className="footer-contact"><span>Mulai dari kebutuhan kecil.</span><strong>Selesaikan proyek<br />dengan lebih aman.</strong><a className="footer-arrow" href="#kontak"><ArrowUpRight /></a></div></div><div className="container footer-bottom"><span>© 2026 Road Barrier Indonesia. All Rights Reserved.</span><span>Showcase concept · Built for B2B lead generation</span></div></footer>

    </main>
  );
}
