"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { catalogCategories, catalogProducts, type CatalogCategory, type CatalogProduct } from "../catalog-data";

const logoUrl = "/logo-roadbarrier-official.png";

const ArrowUpRight = () => (
  <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 15 15 5M7 5h8v8" /></svg>
);

const CategoryIcon = ({ category }: { category: CatalogCategory }) => {
  if (category === "barrier") return <svg viewBox="0 0 40 40" aria-hidden="true"><path d="M6 12h28v15H6zM10 9v21M30 9v21M12 17h16M12 22h16" /><path d="M5 31h30" /></svg>;
  if (category === "cone") return <svg viewBox="0 0 40 40" aria-hidden="true"><path d="m20 8 8 23H12L20 8Z" /><path d="M15 21h10M10 31h20" /><circle cx="20" cy="6" r="2" /></svg>;
  if (category === "stick") return <svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="8" r="3" /><path d="M18 11v20M22 11v20M10 32h20M15 16h10" /></svg>;
  return <svg viewBox="0 0 40 40" aria-hidden="true"><path d="M5 20h30M8 13h24M8 27h24" /><path d="M11 8v24M29 8v24" /><circle cx="20" cy="20" r="3" /></svg>;
};

function ProductArtwork({ product }: { product: CatalogProduct }) {
  return (
    <div className={`catalog-artwork artwork-${product.category}`}>
      <div className="artwork-grid" />
      <span className="artwork-index">{product.id.replace(/[^0-9]/g, "") || "RB"}</span>
      <img src={product.image} alt={product.title} loading="lazy" />
      <span className="artwork-corner artwork-corner-one" />
      <span className="artwork-corner artwork-corner-two" />
    </div>
  );
}

export default function CatalogPage() {
  const [activeCategory, setActiveCategory] = useState<CatalogCategory>("all");
  const [selectedProduct, setSelectedProduct] = useState<CatalogProduct | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const visibleProducts = useMemo(() => {
    if (activeCategory === "all") return catalogProducts;
    return catalogProducts.filter((product) => product.category === activeCategory);
  }, [activeCategory]);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedProduct(null);
    };
    if (!selectedProduct) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [selectedProduct]);

  const selectCategory = (category: CatalogCategory) => {
    setActiveCategory(category);
    window.setTimeout(() => document.getElementById("catalog-grid")?.scrollIntoView({ behavior: "smooth", block: "start" }), 20);
  };

  return (
    <main className="catalog-page">
      <div className="topbar">
        <div className="container topbar-inner">
          <span><i className="status-dot" /> Supplier road safety equipment untuk kebutuhan proyek</span>
          <span className="topbar-right">Katalog resmi · Konsultasi spesifikasi · Pengiriman Indonesia</span>
        </div>
      </div>

      <header className="site-header catalog-header">
        <div className="container nav-wrap">
          <Link className="brand" href="/" aria-label="Road Barrier Indonesia">
            <img src={logoUrl} alt="Road Barrier Indonesia" />
            <span><strong>ROAD BARRIER</strong><small>INDONESIA</small></span>
          </Link>
          <button className="menu-toggle" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? "Tutup menu" : "Buka menu"} aria-expanded={menuOpen} aria-controls="catalog-navigation">{menuOpen ? "×" : "☰"}</button>
          <nav id="catalog-navigation" className={menuOpen ? "main-nav open" : "main-nav"}>
            <Link href="/" onClick={() => setMenuOpen(false)}>Home</Link>
            <a href="#catalog-grid" onClick={() => setMenuOpen(false)}>Katalog</a>
            <a href="https://roadbarrierindonesia.com/news/" target="_blank" rel="noreferrer" onClick={() => setMenuOpen(false)}>News</a>
            <a href="https://wa.me/6281310697112" target="_blank" rel="noreferrer" onClick={() => setMenuOpen(false)}>Contact Person</a>
          </nav>
          <a className="nav-cta" href="https://wa.me/6281310697112" target="_blank" rel="noreferrer">Minta Penawaran <ArrowUpRight /></a>
        </div>
      </header>

      <section className="catalog-hero">
        <div className="catalog-hero-pattern" />
        <div className="container catalog-hero-inner">
          <div className="catalog-hero-copy">
            <div className="catalog-breadcrumb"><Link href="/">Home</Link><b>/</b><span>Product Catalogue</span></div>
            <div className="eyebrow light">OFFICIAL PRODUCT RANGE · 09 SKU</div>
            <h1>Semua perlengkapan<br /><em>traffic safety.</em></h1>
            <p>Bandingkan 4 Road Barrier, 3 Traffic Cone, dan 2 Stick Cone berdasarkan dimensi, bobot, kapasitas, fitur, serta kecocokannya di lapangan.</p>
            <div className="catalog-hero-facts"><span><strong>4</strong> water barrier</span><span><strong>3</strong> traffic cone</span><span><strong>2</strong> stick cone</span></div>
            <div className="catalog-hero-actions">
              <a className="button button-red" href="#catalog-grid">Explore catalogue <ArrowUpRight /></a>
              <Link className="button button-ghost" href="/#home">Kembali ke 3D preview <ArrowUpRight /></Link>
            </div>
          </div>
          <div className="catalog-hero-card">
            <div className="catalog-hero-card-top"><span>RANGE / 2026</span><span>COOL MONKEY</span></div>
            <div className="catalog-hero-art"><div className="catalog-hero-ring ring-one" /><div className="catalog-hero-ring ring-two" /><img src={catalogProducts[0].image} alt="Road Barrier Mathes" /></div>
            <div className="catalog-hero-card-bottom"><div><small>FEATURED MODEL</small><strong>Road Barrier Mathes</strong></div><span>01 / 09</span></div>
          </div>
        </div>
      </section>

      <section className="catalog-section" id="catalog-grid">
        <div className="container">
          <div className="catalog-section-heading">
            <div><div className="eyebrow">EXPLORE PRODUCT RANGE</div><h2>Temukan model yang<br /><em>pas di lapangan.</em></h2></div>
            <p>Daftar produk dikurasi dari katalog Road Barrier Indonesia. Buka detail untuk melihat ukuran, bobot, dan kapasitas yang tersedia.</p>
          </div>

          <div className="catalog-decision-guide" aria-label="Panduan memilih kategori produk">
            <div className="catalog-guide-intro"><span>PILIH BERDASARKAN FUNGSI</span><strong>Mulai dari apa yang perlu diamankan.</strong></div>
            <button onClick={() => selectCategory("barrier")}><small>PEMBATAS FISIK</small><strong>Road Barrier</strong><p>Untuk membentuk batas area yang stabil. Ringan saat kosong, dapat diisi hingga 80 L, dan disambung antar-unit.</p><span>Lihat 4 model →</span></button>
            <button onClick={() => selectCategory("cone")}><small>ARAH & PERINGATAN</small><strong>Traffic Cone</strong><p>Untuk mengalihkan jalur dan menandai bahaya dengan warna terang serta pemantul cahaya.</p><span>Lihat 3 model →</span></button>
            <button onClick={() => selectCategory("stick")}><small>AKSES & TITIK BATAS</small><strong>Stick Cone</strong><p>Untuk pembatas samping jalan, entrance, parkir, atau titik akses yang perlu penanda vertikal.</p><span>Lihat 2 model →</span></button>
          </div>

          <div className="catalog-category-rail" role="tablist" aria-label="Filter kategori produk">
            {catalogCategories.map((category) => (
              <button className={activeCategory === category.id ? "catalog-category active" : "catalog-category"} key={category.id} onClick={() => selectCategory(category.id)} role="tab" aria-selected={activeCategory === category.id}>
                <span className="catalog-category-icon"><CategoryIcon category={category.id} /></span>
                <span className="catalog-category-copy"><strong>{category.label}</strong><small>{category.note}</small></span>
                <ArrowUpRight />
              </button>
            ))}
          </div>

          <div className="catalog-result-bar"><span><strong>{String(visibleProducts.length).padStart(2, "0")}</strong> model ditampilkan</span><span className="catalog-result-note">Official product selection <i /> Road Barrier Indonesia</span></div>
          <div className="catalog-product-grid">
            {visibleProducts.map((product, index) => (
              <article className={`catalog-product-card accent-${product.accent}`} key={product.id}>
                <div className="catalog-card-top"><span>{product.eyebrow}</span><span>{String(index + 1).padStart(2, "0")}</span></div>
                <ProductArtwork product={product} />
                <div className="catalog-card-copy">
                  <div className="catalog-card-category">{product.categoryLabel}</div>
                  <h3>{product.title}</h3>
                  <span className="catalog-card-rule" />
                  <p>{product.description}</p>
                  <div className="catalog-card-specs">{product.specs.slice(0, 2).map((spec) => <span key={spec.label}><small>{spec.label}</small><strong>{spec.value}</strong></span>)}</div>
                  <button className="catalog-view-more" onClick={() => setSelectedProduct(product)}>Lihat spesifikasi <ArrowUpRight /></button>
                </div>
              </article>
            ))}
          </div>

          <div className="catalog-cta-strip"><div><span className="eyebrow">BUTUH BANTUAN MEMILIH?</span><h3>Diskusikan ukuran, volume,<br /><em>dan kebutuhan proyek.</em></h3></div><a className="button button-dark" href="https://wa.me/6281310697112" target="_blank" rel="noreferrer">Chat dengan tim kami <ArrowUpRight /></a></div>
        </div>
      </section>

      <section className="catalog-footnote"><div className="container"><span>ROAD SAFETY / PRODUCT CATALOGUE</span><p>Spesifikasi di halaman ini mengikuti informasi produk yang dipublikasikan Road Barrier Indonesia. Untuk stok, harga, dan kebutuhan custom, hubungi tim untuk konfirmasi terbaru.</p><Link className="text-link" href="/">Kembali ke halaman utama <ArrowUpRight /></Link></div></section>

      {selectedProduct && <div className="catalog-detail-backdrop" role="dialog" aria-modal="true" aria-labelledby="catalog-detail-title" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedProduct(null); }}>
        <div className="catalog-detail-modal">
          <div className="catalog-detail-media"><ProductArtwork product={selectedProduct} /></div>
          <div className="catalog-detail-copy">
            <div className="catalog-detail-top"><span className="eyebrow">{selectedProduct.categoryLabel} / {selectedProduct.eyebrow}</span><button className="catalog-detail-close" onClick={() => setSelectedProduct(null)} aria-label="Tutup detail produk">×</button></div>
            <h2 id="catalog-detail-title">{selectedProduct.title}</h2>
            <p>{selectedProduct.description}</p>
            <div className="catalog-decision-note"><span>KENAPA PILIH MODEL INI</span><p>{selectedProduct.decisionNote}</p></div>
            <h3 className="catalog-detail-subtitle">Spesifikasi resmi</h3>
            <div className="catalog-spec-table">{selectedProduct.specs.map((spec) => <div key={spec.label}><span>{spec.label}</span><strong>{spec.value}</strong></div>)}</div>
            <div className="catalog-detail-columns">
              <div><h3>Keunggulan</h3><ul>{selectedProduct.benefits.map((benefit) => <li key={benefit}>{benefit}</li>)}</ul></div>
              <div><h3>Cocok untuk</h3><div className="catalog-usecase-tags">{selectedProduct.useCases.map((useCase) => <span key={useCase}>{useCase}</span>)}</div></div>
            </div>
            <div className="catalog-price-note"><strong>Harga mengikuti kebutuhan proyek.</strong><span>Tipe, jumlah, lokasi kirim, dan kebutuhan branding/stiker memengaruhi penawaran akhir.</span></div>
            <div className="catalog-detail-actions"><a className="button button-red" href={`https://wa.me/6281310697112?text=${encodeURIComponent(`Halo Road Barrier Indonesia, saya ingin konsultasi ${selectedProduct.title}. Mohon info harga, stok, dan opsi pengiriman.`)}`} target="_blank" rel="noreferrer">Minta penawaran <ArrowUpRight /></a><a className="catalog-official-link" href={selectedProduct.officialUrl} target="_blank" rel="noreferrer">Lihat sumber resmi <ArrowUpRight /></a></div>
          </div>
        </div>
      </div>}

      <footer className="site-footer"><div className="container footer-grid"><div className="footer-brand"><Link className="brand" href="/"><img src={logoUrl} alt="Road Barrier Indonesia" /><span><strong>ROAD BARRIER</strong><small>INDONESIA</small></span></Link><p>Road safety equipment untuk proyek yang lebih tertib, terlihat, dan aman.</p></div><div><h4>Menu utama</h4><Link href="/">Home</Link><a href="#catalog-grid">Katalog</a><a href="https://roadbarrierindonesia.com/news/" target="_blank" rel="noreferrer">News</a></div><div><h4>Hubungi kami</h4><a href="mailto:roadbarrierindonesia@gmail.com">roadbarrierindonesia@gmail.com</a><a href="tel:081310697112">0813 1069 7112 · Erwin</a></div><div className="footer-contact"><span>Mulai dari kebutuhan kecil.</span><strong>Selesaikan proyek<br />dengan lebih aman.</strong><a className="footer-arrow" href="https://wa.me/6281310697112" target="_blank" rel="noreferrer"><ArrowUpRight /></a></div></div><div className="container footer-bottom"><span>© 2026 Road Barrier Indonesia. All Rights Reserved.</span><span>Official product catalogue · Built for B2B lead generation</span></div></footer>
    </main>
  );
}
