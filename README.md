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
