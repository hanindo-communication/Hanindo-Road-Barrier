# Product Explorer 3D — 27 November 2026

Panel Under Construction di Home diganti viewer tiga produk dengan geometri 3D utuh. Pilihan model: Road Barrier 2, Traffic Cone Mathes, dan Stick Cone kepala biasa (bukan Stick Cone 2 kepala cincin).

## Acuan bentuk

Foto asli ada di `assets/drive-products/`, dengan ID Drive dan hash pada manifest di folder yang sama.

| Model | Foto Drive | Detail yang direkonstruksi |
| --- | --- | --- |
| Road Barrier 2 | `RB 2.png` | Badan atas tipis dan alas melebar, tiga cekungan muka, tiga kaki dengan dua bukaan, dua pengait pada setiap sisi yang bertingkat, pin di sisi kanan, reflektor panah kanan dan sudut kuning, tutup pengisian atas. |
| Traffic Cone Mathes | `TC MATHE.png` | Alas persegi bersudut tumpul, badan kerucut, dua pita reflektif melingkar pada bagian atas, leher pendek dan bibir kepala dengan rongga nyata. |
| Stick Cone | `STC.png` | Tiang silindris, dua pita reflektif di atas, alas hitam segi delapan dengan bahu miring, tonjolan pengait kecil di ujung yang memiliki lubang nyata. |

Foto Drive menyediakan satu sudut utama per model. Ini rekonstruksi visual, bukan pemindaian 3D atau model CAD produksi. Detail sisi belakang yang tidak tampak menggunakan kelanjutan bentuk luar yang diperkirakan, tanpa menambahkan logo atau reflektor belakang yang tidak terverifikasi. Teks cetak kecil dan tekstur mikro plastik tidak direplikasi satu per satu. Batas ini ditulis secara singkat di bawah viewer; tombol **Lihat foto asli** memungkinkan pengunjung membandingkan bentuk dengan sumber yang sebenarnya.

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
- `app/Product3DScene.tsx`: kamera, WebGL, OrbitControls, resize, visibilitas, keyboard, serta fallback.
- `app/HeroProductExplorer.tsx` dan `app/product-explorer.css`: pemilihan produk, pembanding foto, kontrol dan layout responsif.
- Viewer Three.js dimuat sebagai chunk terpisah melalui dynamic import.

Jalankan `npm run test:models` dan `npm run build`. Pemeriksaan geometri menggunakan ray casting untuk memastikan kaki tengah RB2 padat, kedua bukaan forklift tetap terbuka, kepala Mathes benar-benar berongga, dan lubang kecil Stick Cone tidak tertutup. Seluruh posisi dan normal mesh diperiksa agar tidak memiliki nilai non-finite.

Preview lokal telah diuji pada desktop dan viewport 390 × 844: ketiga model, kontrol sudut/zoom, mode foto dan kembali ke 3D, drag manual yang mengubah sudut kamera, kontrol keyboard, jeda auto rotate ketika berinteraksi, layout tanpa overflow horizontal, CTA ke `#fit-check`, serta tautan form ke WhatsApp Retno. Tidak ditemukan galat console pada viewer setelah pembaruan shadow map.

Build produksi berhasil dan ketiga model juga terverifikasi pada ekspor statis di port 3000, tanpa galat atau peringatan console. Paket siap unggah: `deployment/roadbarrier-3d-explorer-2026-11-27.zip`.

Status deployment: menunggu login ulang pengguna. Sesi DirectAdmin dan portal Natanetwork sudah kedaluwarsa; portal meminta login serta CAPTCHA. Belum ada unggahan atau ekstraksi paket 3D ini ke hosting.
