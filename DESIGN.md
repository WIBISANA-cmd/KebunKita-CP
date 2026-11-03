# Arah Desain Kebun Kita

Sumber arah: gambar referensi dari pemilik. Pemilik meminta tampilan sama persis, sehingga komposisi, warna, dan bentuk mengikuti gambar tersebut.

Dial: ENERGY 3 / RHYTHM 3 / MOTION 3

## Warna

Semua warna disampling dari gambar referensi.

| Token | Nilai | Peran |
| --- | --- | --- |
| `forest` | `#003a3c` | Permukaan gelap dan warna teks utama |
| `pine` | `#206444` | Hijau tengah pada gradasi dan ikon |
| `lime` | `#afe154` | Sisi terang gradasi |
| `spark` | `#c3f649` | Aksen tombol utama dan garis judul |
| `mint` | `#e7f7e8` | Latar lembut untuk lingkaran ikon dan daftar |
| `slate` | `#5f6b80` | Teks sekunder |
| `carrot` | `#f5822a` | Tubuh wortel pada preloader dan kursor, tidak dipakai untuk teks atau tombol |

## Alasan keputusan

- **Warna hijau dan lime:** mengikuti referensi dan cocok dengan toko sayur.
- **Plus Jakarta Sans:** huruf buatan Indonesia dengan bentuk yang paling dekat dengan judul di referensi.
- **Tema terang tetap:** referensi hanya mendefinisikan satu tema, dan pengunjung membaca informasi toko di siang hari.
- **Kapsul dan gelombang:** motif identitas yang berulang, datang dari referensi.
- **Variasi kartu:** kartu hijau dan putih membedakan dua kelompok barang, foto kapsul menjadi titik fokus.
- **Panah pada tombol:** semua tombol utama membawa pengunjung ke tempat lain, seperti di referensi.
- **Ikon buatan sendiri:** wortel, karung, panci, dan keranjang menggambarkan isi toko secara langsung.
- **Bayangan:** hanya dipakai pada kartu putih, dialog, dan header saat digulir untuk menandai lapisan.

## Motion

| Elemen | Gerak | Tujuan |
| --- | --- | --- |
| Halaman | Smooth scroll Lenis | Parallax terasa halus |
| Gelombang, foto, daun | Parallax berbeda kecepatan | Memberi kedalaman tiap section |
| Daun di hero | Mengikuti pointer | Respons langsung terhadap pengunjung |
| Foto kapsul | Terbuka dari tengah | Mengarahkan mata ke foto saat masuk layar |
| Judul | Baris naik dari balik mask | Urutan baca jelas |
| Ikon | Garis tergambar | Mengenalkan isi kartu dan langkah |
| Kartu layanan | Miring mengikuti mouse | Menandai kartu bisa ditindak |
| Foto kategori | Zoom keluar saat digulir | Menarik perhatian ke daftar produk |
| Preloader | Wortel naik dari tanah mengikuti persentase, tirai terangkat dengan tepi gelombang | Menunjukkan kemajuan muat, lalu menyerahkan ke hero tanpa sambungan terlihat |
| Kursor wortel | Ujung menempel tepat di pointer, badan dan daun mengayun mengikuti kecepatan | Identitas toko, tanpa mengorbankan ketepatan klik |

Tidak ada animasi yang berulang tanpa henti, kecuali daun wortel di preloader yang menjadi tanda proses muat masih berjalan. Kursor hanya berkedip sekali setelah mouse berhenti. Semua gerak dekoratif mati saat `prefers-reduced-motion: reduce` aktif.

Animasi hero menunggu `useEntranceReady`, supaya baris judul dan foto kapsul terbuka bersamaan dengan tirai, bukan di belakangnya.

## Pola yang dipertahankan atas keputusan pemilik

Kapsul, panah tombol, gradasi hijau, tiga langkah dengan ikon bulat, dan daun melayang ditandai oleh antislop, tetapi dipertahankan karena pemilik meminta tampilan sama persis.

Teks putih pada gradasi tetap harus lolos WCAG AA, jadi sisi lime pada kartu hijau, banner, dan CTA ditahan di luar area teks.

## Placeholder

- Ikon daun pada logo bersifat sementara sampai logo asli diunggah di Sanity.
- Semua foto adalah foto stok, bukan foto toko. Sumbernya ada di `public/images/CREDITS.md`.
- Daftar barang adalah contoh dan ditandai demikian di website.
