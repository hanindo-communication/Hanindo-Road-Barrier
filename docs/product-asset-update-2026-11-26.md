# Pembaruan produk — 26 November 2026

Sumber: [folder Produk Trijaya](https://drive.google.com/drive/folders/1nUbKYZBrspCSrM7Vz8FVz1JIk5ev7_wh). Seluruh 19 gambar telah diperiksa secara visual. Folder berisi foto, tanpa tabel ukuran, berat, material, atau kapasitas isi.

Katalog berisi **11 model / 15 pilihan foto**: 6 Road Barrier, 3 Traffic Cone, dan 2 Stick Cone. Varian dikelompokkan dalam kartu model yang sama. Label reflektor Mathes mendeskripsikan foto; kode SKU dan ketersediaan harus dikonfirmasi ke sales.

| Model | Pilihan dalam kartu | Berkas Drive yang dipakai | Perubahan |
| --- | --- | --- | --- |
| Road Barrier 2 | Merah; Putih | `RB 2.png`; `RB 2 White.png` | Foto asli kedua warna, tetap pertama dengan penanda best seller. Warna pada detail mengikuti pilihan. |
| Road Barrier Mathes | Reflektor putih; Panah satu arah; Panah dua arah | `RBM.png`; `RB Mathes.png`; `RB Mathes panah.png` | Ketiga tampilan dalam satu kartu; foto dan pesan penawaran mengikuti pilihan. |
| Road Barrier 1 | Merah; Putih | `RB 1.png`; `RB 1 white.png` | Kedua warna dalam satu kartu, spesifikasi warna berubah sesuai pilihan. |
| Road Barrier 3 | Merah | `RB 3.png` | Mengganti cutout lama dengan foto asli Drive. |
| Road Barrier 4 | Standar | `RB 4.png` | Ditambahkan menggunakan foto model asli dengan tiga alur vertikal. Ukuran dan berat: konfirmasi sales. |
| Road Barrier 5 | Standar | `5. RB5.png` | Ditambahkan menggunakan foto model oranye dengan bukaan tengah. Ukuran dan berat: konfirmasi sales. |
| Traffic Cone Mathes | Standar | `TC MATHE.png` | Foto Mathes dengan dua pita reflektif dan bentuk puncak sesuai sumber. |
| Traffic Cone 50 | Standar | `TC50.png` | Foto asli Drive, mempertahankan bentuk alas dan reflektor. |
| Traffic Cone 75 | Standar | `TC75.png` | Foto asli Drive, mempertahankan bentuk alas dan reflektor. |
| Stick Cone | Standar | `STC.png` | Foto model kepala biasa dan alas hitam. |
| Stick Cone 2 | Standar | `STC 2.png` | Foto model kepala cincin dan alas hitam. |

## Empat gambar pendukung

- `RB1.jpg`: komposisi RB1 merah dan putih; tidak dibuat sebagai produk tambahan.
- `rb11.png`: susunan tiga RB1 putih; tidak dianggap sebagai varian baru atau paket jual tiga unit.
- `RB 4 1.png`: gambar RB4 resolusi 500 × 500; dipakai sebagai referensi pembanding. Foto `RB 4.png` memiliki resolusi lebih baik.
- `STC1.png`: gambar Stick Cone kepala biasa beresolusi 500 × 500; foto `STC.png` dipilih sebagai aset utama.

Seluruh berkas asli, ID Drive, URL sumber, ukuran file, serta hash SHA-256 disimpan dalam `assets/drive-products/manifest.json`. Pemetaan foto keluaran ada di `outputs.json` pada folder yang sama.

## Batas informasi spesifikasi

- Angka ukuran/berat sembilan model lama tetap berasal dari arsip website, dan ditandai sebagai spesifikasi arsip yang perlu dikonfirmasi. Angka tersebut tidak diklaim berasal dari foto Drive.
- Tidak ada angka ukuran/berat untuk RB4/RB5 yang ditambahkan berdasarkan tebakan. Material dan kapasitas pemberat keduanya juga belum diklaim.
- Lebar Stick Cone “76 cm” dari data lama tidak ditampilkan karena belum ada bukti ukuran pendukung dalam folder ini.
- Klaim kapasitas RB2 “80 L” pada Home dihapus dari ringkasan karena tidak didukung aset baru ini.
- RB4/RB5 sebelumnya dihapus karena tidak ditemukan di katalog website lama. Keduanya kini memiliki foto yang jelas dari folder yang diberikan pengguna. Foto RB2 tidak digunakan lagi sebagai ilustrasi pengganti.

## Perilaku aplikasi

- Pemilihan warna/reflektor memperbarui foto kartu, foto detail, label pilihan, serta pesan penawaran WhatsApp.
- Pilihan bertahan ketika membuka/menutup detail dan ketika berpindah filter kategori.
- Home menggunakan foto Drive terbaru. Pilihan RB2 merah/putih di Home terbawa ke detail katalog.
- Jumlah model dan pilihan dihitung dari data katalog, termasuk bagian Home.
- Semua 15 aset keluaran memakai WebP transparan 800 × 800. Batas objek dipaskan ke area 640 × 640 dan diberi padding yang sama, tanpa mengubah proporsi produk atau reflektor.
- URL detail dan kategori produk lama mengarah ke katalog terbaru. File arsip aslinya tetap tersimpan di `legacy-mirror/pages`.
- Form “Cek kebutuhan mu” tetap mengarah ke Retno (`0813 3200 200`), dan turut membawa varian yang dipilih. Pilihan warna di Home tersinkron dengan rekomendasi form. CTA penawaran katalog mempertahankan kontak sebelumnya (Erwin); pesannya sekarang menyertakan varian.

## Reproduksi dan verifikasi

```sh
npm run products:prepare
npm run build
python scripts/make_app_update_zip.py
```

Build produksi berhasil. Preview diuji pada desktop dan viewport 390 × 844: pilihan Mathes, warna RB2, detail warna putih, filter 6/3/2 model, tautan Home yang membawa varian, URL produk lama, gambar Stick Cone, serta template WhatsApp varian. Tidak ditemukan galat console pada katalog. Semua 15 gambar keluaran diperiksa dimensinya dan transparansinya.

ZIP pembaruan mencakup aplikasi, gambar produk, dan pengalihan URL produk lama; aset arsip lain tidak ditimpa.

## Deployment live

Pembaruan **sudah diterapkan pada 26 November 2026** melalui Chrome profil Road Barrier dan DirectAdmin Natanetwork. Paket `roadbarrier-app-update-2026-11-26.zip` berhasil diunggah lalu diekstrak dengan opsi Merge and overwrite ke `/domains/roadbarrierindonesia.com/public_html/`. DirectAdmin menampilkan “Archive extracted successfully”. Kendala koneksi Chrome pada percobaan sebelumnya sudah teratasi.

- Aplikasi yang diterapkan berasal dari commit `8ecf898a52bbb82d51e850329d2d52d309c4a584`.
- SHA-256 ZIP: `8ed6e7cc538c3a8b8174619734bef57d89e9c65af072b1c13e0a9cfbe0c0ed4a`.
- [Katalog live](https://roadbarrierindonesia.com/katalog/) menampilkan 11 model / 15 pilihan; RB2 tetap pertama sebagai best seller.
- Pergantian foto Mathes panah dua arah, pilihan putih RB1/RB2, detail varian, dan nama varian dalam tautan penawaran terverifikasi melalui UI live.
- Filter Traffic Cone menampilkan 3 model, filter Stick Cone 2 model, dan URL detail lama RB4 membuka detail terbaru di katalog.
- Pada Home, pilihan RB2 putih memperbarui foto rekomendasi form. Wilayah kosong tetap divalidasi; setelah wilayah diisi, template WhatsApp ke Retno berisi wilayah, semua jawaban kebutuhan, dan pilihan putih. Pemeriksaan tidak mengirim pesan WhatsApp.
- Seluruh 15 file WebP produk live berhasil dimuat melalui HTTP 200 dan hash-nya sama dengan file hasil build lokal. Tidak ditemukan galat console pada katalog live.
