# Product Explorer 3D — 27 November 2026

Panel Home dan detail katalog menyediakan 11 model 3D dengan 15 varian, mengikuti daftar `catalogProducts`. Home memiliki pilihan kategori, dropdown seluruh model, dan pilihan warna/reflektor. Viewer di modal katalog mengikuti produk serta varian yang dipilih; renderer hanya dibuat saat detail dibuka.

## Acuan bentuk

Foto asli ada di `assets/drive-products/`, dengan ID Drive dan hash pada manifest di folder yang sama.

| Model | Foto Drive | Detail yang direkonstruksi |
| --- | --- | --- |
| Road Barrier 2 | `RB 2.png` | Badan atas tipis dan alas melebar, tiga cekungan muka, tiga kaki dengan dua bukaan, dua pengait pada setiap sisi yang bertingkat, pin di sisi kanan, reflektor panah kanan dan sudut kuning, tutup pengisian atas. |
| Traffic Cone Mathes | `TC MATHE.png` | Alas persegi bersudut tumpul, badan kerucut, dua pita reflektif melingkar pada bagian atas, leher pendek dan bibir kepala dengan rongga nyata. |
| Stick Cone | `STC.png` | Tiang silindris, dua pita reflektif di atas, alas hitam segi delapan dengan bahu miring, tonjolan pengait kecil di ujung yang memiliki lubang nyata. |

| Road Barrier 1 | `RB 1.png`, `RB 1 white.png` | Cekungan lingkaran dan dua pasang alur chevron, badan bawah miring, kaki dan pengait, plastik merah/putih serta warna reflektor mengikuti varian. |
| Road Barrier Mathes | `RBM.png`, `RB Mathes.png`, `RB Mathes panah.png` | Lima panel atas miring, dua alur bawah, tiga kaki; reflektor putih / pita panah satu arah / pita panah dua arah. |
| Road Barrier 3 | `RB 3.png` | Alur chevron besar atas, reflektor panah kiri, tiga cekungan vertikal bawah. |
| Road Barrier 4 | `RB 4.png` | Tiga alur panjang dengan ujung bulat, dua takikan atas, pengait ganda dan reflektor panah. |
| Road Barrier 5 | `5. RB5.png` | Badan oranye, dua cekungan silang, bukaan tengah yang menembus badan, dua panel panah bawah. |
| Traffic Cone 50/75 | `TC50.png`, `TC75.png` | Proporsi badan masing-masing, alas persegi tebal, satu pita reflektif, ujung kecil berongga. |
| Stick Cone 2 | `STC 2.png` | Alas hitam segi delapan, cincin sambungan, pita perak atas dan pita kuning tengah, kepala cincin dengan lubang nyata. |

Foto Drive menyediakan satu sudut utama per model. Ini rekonstruksi visual, bukan pemindaian 3D atau model CAD produksi. Atas permintaan pemilik, cekungan badan, reflektor panah, dan reflektor sudut RB2 diulang pada belakang sehingga tampilannya mengikuti depan. Pola belakang ini merupakan arahan visual pemilik, bukan hasil verifikasi foto belakang. Teks cetak kecil dan tekstur mikro plastik tidak direplikasi satu per satu. Viewer menyebutkan bahwa model dibuat berdasarkan foto produk; tombol **Lihat foto asli** memungkinkan pengunjung membandingkan bentuk dengan sumber yang sebenarnya.

## Interaksi

- Drag mouse atau satu jari untuk melihat sekeliling produk; pinch dua jari atau tombol ± untuk zoom.
- Tombol Depan, Samping, Belakang, dan Reset membantu pengguna berpindah sudut dengan jelas.
- Canvas mendukung tombol panah, +/−, dan Home saat fokus. Tombol eksternal juga dapat digunakan lewat keyboard.
- Putar otomatis hanya aktif jika pengguna menyalakannya; interaksi manual menghentikannya. Tidak ada gerakan otomatis pada saat pertama dibuka.
- Wheel mouse tetap menggulir halaman. Rendering berhenti ketika viewer tidak berada di sekitar viewport atau tab disembunyikan; frame diam tidak terus digambar ulang.
- Foto asli menjadi fallback jika WebGL tidak tersedia. Resource GPU dibersihkan ketika viewer ditutup atau berganti ke tampilan foto.

## CTA konsultasi

Tombol utama hero kini **Konsultasi Kebutuhan Anda**, berlatar emas dengan tulisan gelap dan animasi kilau/halo yang halus. Tombol Lihat Produk menjadi tombol sekunder. Petunjuk di bawah CTA menjelaskan bahwa kebutuhan serta wilayah diisi sebelum berkonsultasi lewat WhatsApp Retno. Preferensi reduced motion menonaktifkan animasi CTA.

## Source dan verifikasi

- `app/three/product-models.ts`: konstruksi geometri, material, dan pelepasan resource.
- `app/three/road-environment.ts`: aspal bertekstur prosedural, marka jalan, bahu dan tepi rumput; lingkungan terpisah dari model agar pergantian produk tidak mengubah skala framing. Tidak memakai gambar eksternal.
- `app/Product3DScene.tsx`: kamera, WebGL, OrbitControls, resize, visibilitas, keyboard, serta fallback.
- `app/HeroProductExplorer.tsx` dan `app/product-explorer.css`: pemilihan produk, pembanding foto, kontrol dan layout responsif.
- Viewer Three.js dimuat sebagai chunk terpisah melalui dynamic import.

Jalankan `npm run test:models` dan `npm run build`. Pemeriksaan geometri menggunakan ray casting untuk memastikan cekungan dan reflektor depan/belakang RB2 sama, kaki tengah RB2 padat, kedua bukaan forklift tetap terbuka, kepala Mathes benar-benar berongga, dan lubang kecil Stick Cone tidak tertutup. Seluruh posisi dan normal mesh diperiksa agar tidak memiliki nilai non-finite.

Preview lokal telah diuji pada desktop dan viewport 390 × 844: ketiga model, kontrol sudut/zoom, mode foto dan kembali ke 3D, drag manual yang mengubah sudut kamera, kontrol keyboard, jeda auto rotate ketika berinteraksi, layout tanpa overflow horizontal, CTA ke `#fit-check`, serta tautan form ke WhatsApp Retno. Tidak ditemukan galat console pada viewer setelah pembaruan shadow map.

Pembaruan lingkungan: panggung putih bergaris dihapus. Produk berada di permukaan aspal dengan marka, bahu jalan, bayangan kontak, pencahayaan siang dan kabut jarak jauh. Tampilan foto asli tetap memakai latar netral untuk pembanding.

Status deployment: **live pada 27 November 2026**. Paket `deployment/roadbarrier-3d-road-2026-11-27.zip` (1.350.982 byte) diunggah melalui Chrome profil **road barrier**, DirectAdmin Natanetwork, lalu diekstrak dengan Merge and overwrite ke `/domains/roadbarrierindonesia.com/public_html/`. UI mengonfirmasi upload 100% dan Archive extracted successfully.

Verifikasi produksi: RB2, Traffic Cone Mathes dan Stick Cone berhasil dimuat; belakang RB2 menampilkan tiga cekungan dan reflektor panah; aspal, marka dan bayangan terlihat. Tombol sudut, zoom 1,18×, putar otomatis serta penghentian putaran saat keyboard berinteraksi berhasil diuji. Tidak ada galat/peringatan console dan tidak ada overflow horizontal pada viewport preview. CTA menuju `#fit-check`; href template form tetap `https://wa.me/628133200200` (Retno). Pesan WhatsApp tidak dikirim saat pengujian.

Build produksi dan tes model lulus. Preview: https://roadbarrierindonesia.com/#product-explorer


## Perluasan semua produk dan perbaikan foto

- Registry model harus sama persis dengan katalog. ID tak dikenal melempar error, tidak diam-diam memakai bentuk produk lain.
- Warna RB1/RB2 dan reflektor Mathes berubah di geometri/material serta pembanding foto. Pergantian varian tidak mengubah batas ukuran model dan framing kamera.
- Setiap model dibentuk dari siluet foto sendiri; detail belakang mengikuti pola depan sesuai arahan pemilik sebelumnya. Ini tetap rekonstruksi visual, bukan data CAD dimensi produksi.
- Foto pembanding sekarang diposisikan absolut di dalam ruang yang memiliki batas tinggi dan lebar, dengan `object-fit: contain`. Sebelumnya grid membiarkan tinggi intrinsik 800 × 800 mengikuti lebar panel, sehingga foto meluber dan terpotong oleh stage. Perbaikan berlaku pada Home, detail katalog, dan foto fallback.
- Tes model diperluas ke 11 model/15 varian, warna putih, framing antar-varian, bukaan RB5, cincin Stick Cone 2 dan regresi model awal.


Verifikasi perluasan lokal: semua 11 pilihan model berhasil dimuat melalui dropdown; geometri baru RB1, Mathes, RB3, RB4, RB5, Cone 50/75 dan Stick Cone 2 dibandingkan dengan foto. Foto pembanding semua model berada sepenuhnya di dalam frame; RB2 putih dan Mathes reflektor putih juga diperiksa pada viewport 390 × 844 tanpa overflow horizontal. Pergantian varian di detail katalog mengubah canvas dan foto yang sesuai. Console viewer tidak melaporkan galat/peringatan.

Status perluasan 11 model: **live pada 27 November 2026**. Paket `deployment/roadbarrier-all-products-3d-2026-11-27.zip` (1.355.254 byte; SHA-256 `0fc285dcca84197a97d331598fba2d28309d8b7560628a1bd056bcf7b1304b43`) diunggah melalui **Chrome profil road barrier** dan DirectAdmin Natanetwork ke `/domains/roadbarrierindonesia.com/public_html/`. UI mengonfirmasi upload 100% serta Archive extracted successfully. Build final lulus kompilasi, pemeriksaan tipe, dan ekspor statis.

Pemeriksaan live: seluruh 11 model mencapai status ready; seluruh 15 pilihan foto unik berada sepenuhnya di dalam frame. Detail katalog Mathes membuka varian panah dua arah dari URL; perubahan ke panah satu arah mengubah canvas dan foto, lalu modal dapat ditutup. Tidak ada galat/peringatan console. Form kebutuhan tetap menuju WhatsApp Retno. Tidak ada pesan WhatsApp dikirim saat pengujian.
