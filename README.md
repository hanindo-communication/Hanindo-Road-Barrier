# Hanindo Road Barrier

Showcase Next.js untuk Road Barrier Indonesia dengan fokus pada pengalaman B2B, product discovery, dan lead generation.

## Menjalankan

```bash
npm install
npm run dev
```

Preview awal dibuat dari website existing Road Barrier Indonesia, lalu dikembangkan dengan hero visual, journey chooser, product selector, dan Road Barrier Fit Check.

## Website lama

Homepage baru berada di `/`. Salinan website WordPress lama berada di `/pelajari-lebih-lanjut/`, termasuk halaman produk, artikel, kategori, arsip, dan halaman kontak. Gambar, font, CSS, dan JavaScript yang berasal dari domain lama disimpan di `public/legacy-assets/`. Build menghasilkan file statis di `out/` yang dapat diunggah ke hosting DirectAdmin tanpa server Node.js. `predev` dan `prebuild` menyalin halaman arsip dari `legacy-mirror/pages/` ke `public/pelajari-lebih-lanjut/`.

Salinan ini dibuat pada 24 September 2026 dari halaman publik yang tersedia saat itu. Untuk memperbaruinya sebelum peluncuran, jalankan:

```bash
python scripts/mirror_legacy.py
python scripts/mirror_legacy.py --fill-linked
python scripts/mirror_legacy.py --repair-assets
python scripts/mirror_legacy.py --audit
```

Form kontak pada salinan membuka WhatsApp dengan pesan yang diisi pengunjung karena layanan pengiriman form WordPress tidak ikut dipindahkan. Model 3D Sketchfab tetap memakai embed dari Sketchfab.

## Deployment saat ini

Pada 25 September 2026, ekspor statis diunggah ke `roadbarrierindonesia.com` melalui DirectAdmin NATANETWORK. Beranda baru dilayani dari `public_html/index.html`; arsip situs lama dilayani dari `public_html/pelajari-lebih-lanjut/`. WordPress lama (file dan database) tetap ada di hosting. DNS dan email tidak diubah.

Backup akun hosting tersedia di `/backups/backup-Sep-25-2026-1.tar.zst`. Folder `/domains/roadbarrierindonesia.com/static-deploy-first-extract-20260925/` menyimpan hasil ekstraksi pertama yang dipindahkan keluar dari webroot, beserta ZIP deployment. Jangan hapus backup ini sebelum ada kebijakan retensi yang jelas.

Untuk update berikutnya, jalankan `npm run build` lalu `python scripts/make_deploy_zip.py`. Unggah isi ZIP ke `public_html` dengan mempertahankan izin direktori `755` dan file `644`; verifikasi halaman `/`, `/katalog/`, dan `/pelajari-lebih-lanjut/` beserta CSS/JS/gambarnya setelah ekstraksi. Skrip membuat ZIP dengan izin Unix yang sesuai untuk hosting ini.

Pembaruan 28 September 2026: tombol WhatsApp melayang pada halaman aplikasi baru dan favicon logo Road Barrier. Tombol mengarah ke nomor WhatsApp yang sama dengan CTA situs (`0813 1069 7112`).

Pembaruan 30 September 2026: referensi tahun 2008 di halaman utama dihapus, kartu produk utama memakai foto resmi dari arsip website lama, dan kontak WhatsApp Retno (`0813 3200 200`) ditambahkan ke footer halaman utama serta katalog.

Pembaruan 6 Oktober 2026: seluruh tag pelacakan, termasuk Google Tag Manager, Google Ads, Google Analytics, dan event conversion, dihapus dari website agar pemasangan tagging dapat dimulai kembali dari awal.

Pembaruan 14 Oktober 2026: tombol WhatsApp melayang kembali menampilkan pilihan tiga contact person—Budi (`0877 7671 3715`), Erwin (`0813 1069 7112`), dan Retno (`0813 3200 200`)—sebelum membuka chat WhatsApp.


Pembaruan 25 November 2026:
- Judul tab aplikasi dan arsip diawali “Water Barrier & Traffic Safety Equipment”.
- Katalog menampilkan 9 produk terverifikasi (4 Road Barrier, 3 Traffic Cone, 2 Stick Cone); Tipe 4 dan 5 yang tidak ada pada katalog resmi dihapus. Road Barrier 2 tampil pertama sebagai best seller.
- Foto produk memakai latar transparan dan kanvas seragam 800 × 800. Sumber cutout tersimpan di `assets/product-cutouts/`; jalankan `node scripts/prepare-transparent-products.mjs` untuk menghasilkan ulang aset WebP di `public/products/`. Foto asli tetap ada di arsip.
- Keunggulan dan pilihan kebutuhan memakai carousel dengan swipe, drag, panah, indikator, dan keyboard. Auto slide setiap 5 detik; jeda saat hover/fokus/interaksi, dan tunggu 8 detik setelah interaksi selesai. Carousel di luar viewport/tab tidak aktif berhenti; tersedia kontrol jeda/putar. Preferensi reduced motion menonaktifkan auto slide secara default.
- Form “Cek kebutuhan mu” menambahkan wilayah kota/kabupaten dan provinsi. Semua jawaban serta wilayah masuk ke template WhatsApp Retno (`0813 3200 200`); pengunjung tetap menekan Kirim di WhatsApp. Wilayah kosong divalidasi sebelum membuka WhatsApp.
- Urutan kontak WhatsApp melayang: Retno, Budi, Erwin. Konfigurasi GTM yang sudah ada pada versi kerja dipertahankan.

Untuk pembaruan hosting, buat ZIP dengan timestamp file terkini dan izin Unix `755` untuk direktori / `644` untuk file. Hindari timestamp ZIP default 1980 karena server dapat tetap menyajikan versi lama. Build, verifikasi preview, unggah dan ekstrak ke `public_html`, lalu periksa kembali halaman live. Folder `deployment/` menyimpan ZIP serta screenshot verifikasi lokal dan tidak masuk Git; source, cutout, dan skrip reproduksi masuk Git.

Untuk update aplikasi tanpa menimpa arsip/asset lama, jalankan npm run build lalu python scripts/make_app_update_zip.py. Untuk ekspor penuh termasuk arsip, gunakan python scripts/make_deploy_zip.py.

Pembaruan 26 November 2026:
- Aset produk diganti dengan foto asli dari folder Drive Produk Trijaya: 11 model dengan 15 pilihan foto. RB Mathes memiliki tiga pilihan reflektor; RB1/RB2 memiliki pilihan merah/putih dalam satu kartu. RB2 tetap best seller pertama.
- RB4/RB5 ditambahkan kembali karena foto model aslinya kini tersedia. Ukuran/berat keduanya menunggu konfirmasi. Spesifikasi arsip model lain diberi keterangan sumber; lebar Stick Cone 76 cm yang belum terverifikasi tidak ditampilkan.
- Foto, warna detail, dan pesan penawaran katalog mengikuti varian pilihan. Home, jumlah model, dan URL produk lama diselaraskan. Form kebutuhan tetap mengarah ke Retno.
- Foto kartu katalog diperbesar sekitar 20% melalui ruang gambar yang lebih tinggi dan inset yang lebih kecil. Semua model dan varian tetap memakai aturan ukuran bersama, proporsi asli, dan kanvas transparan yang sama.
- Sumber asli dan manifest: `assets/drive-products/`. Reproduksi WebP transparan: `npm run products:prepare`. Cutout sebelumnya pada `assets/product-cutouts/` hanya menjadi arsip versi lama.
- [Laporan per produk, pemetaan semua 19 berkas, dan batas spesifikasi](docs/product-asset-update-2026-11-26.md).
- Status: diterapkan ke hosting Natanetwork pada 26 November 2026 menggunakan `roadbarrier-app-update-2026-11-26.zip`. Home, katalog, pilihan varian, pengalihan URL produk lama, serta template form ke Retno terverifikasi live. Semua 15 gambar produk live cocok byte-per-byte dengan hasil build.

ZIP `make_app_update_zip.py` kini menyertakan pengalihan halaman produk lama di `pelajari-lebih-lanjut/produk/` dan `produk_utama/`, agar tautan lama menampilkan katalog terkini. Halaman berita, kontak, dan aset arsip lainnya tetap dikecualikan.

Pembaruan 27 November 2026:
- Panel Under Construction pada Home diganti Product Explorer 3D untuk RB2, Traffic Cone Mathes, dan Stick Cone. Mendukung drag, zoom, pilihan sudut, putar otomatis opsional, serta pembanding foto asli Drive.
- Bentuk mengikuti foto yang tersedia; pola depan RB2 diulang di belakang sesuai arahan pemilik. Lingkungan 3D berupa jalan beraspal dengan marka dan bayangan. Model merupakan rekonstruksi visual, bukan CAD produksi. [Acuan model, interaksi, dan verifikasi](docs/product-3d-explorer.md).
- CTA utama hero menjadi “Konsultasi Kebutuhan Anda” dengan warna emas, animasi halus, dan petunjuk alur form ke Retno.
- Pemeriksaan geometri: `npm run test:models`; build: `npm run build`.

- Status 3D dan CTA: live pada 27 November 2026, diunggah melalui Chrome profil road barrier dengan paket `roadbarrier-3d-road-2026-11-27.zip`. Ketiga model, sisi belakang RB2, kontrol 3D, latar jalan dan tautan form ke Retno terverifikasi di produksi.
