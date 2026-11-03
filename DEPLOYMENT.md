# Deployment ke VPS dengan Docker dan Dokploy

Panduan ini memasang website Kebun Kita di VPS sendiri. Dokploy membangun image dari `Dockerfile` di repo, menjalankannya sebagai container, lalu Traefik bawaan Dokploy mengurus domain dan sertifikat HTTPS.

## File yang dipakai

| File | Fungsi |
| --- | --- |
| `Dockerfile` | Build multi-stage. Hasil akhirnya hanya berisi server standalone Next.js, berjalan sebagai user non-root di port 3000 |
| `.dockerignore` | Mencegah `.env`, `node_modules`, dan `.next` lokal ikut masuk image |
| `docker-compose.yml` | Untuk uji lokal atau VPS tanpa Dokploy |
| `app/api/health/route.ts` | Endpoint `/api/health` untuk `HEALTHCHECK` container |
| `next.config.ts` | `output: "standalone"` |

## Hal penting sebelum mulai

**Variabel `NEXT_PUBLIC_*` dibaca saat build, bukan saat container jalan.** Nilainya ditanam ke JavaScript ketika `next build`. Kalau nilainya diubah, aplikasi harus di-deploy ulang (build ulang), restart saja tidak cukup.

| Variabel | Kapan dipakai | Tempat di Dokploy |
| --- | --- | --- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Build | Build-time Arguments |
| `NEXT_PUBLIC_SANITY_DATASET` | Build | Build-time Arguments |
| `NEXT_PUBLIC_SITE_URL` | Build | Build-time Arguments |
| `SANITY_API_READ_TOKEN` | Runtime | Environment Variables |
| `SANITY_REVALIDATE_SECRET` | Runtime | Environment Variables |

**Konten diambil dari Sanity saat build.** Halaman beranda di-prerender saat build, jadi Sanity harus bisa dijangkau dari VPS selama build. Setelah itu, webhook Sanity memperbarui cache selama container berjalan. Cache hasil webhook disimpan di container, jadi setelah container di-restart atau dibuat ulang, website bisa kembali menampilkan konten saat build terakhir sampai ada publish berikutnya. Kalau ini terjadi, klik **Redeploy** di Dokploy untuk build ulang dengan konten terbaru.

## 1. Siapkan VPS

Kebutuhan minimum:

- Ubuntu 22.04 atau 24.04 (Debian juga didukung Dokploy)
- RAM 2 GB, disk 30 GB
- Port 22, 80, 443, dan 3000 terbuka (3000 untuk panel Dokploy)
- Akses root atau user dengan `sudo`

Build Next.js bersama Sanity Studio cukup berat. Di VPS dengan RAM 2 GB atau kurang, tambahkan swap agar build tidak gagal karena kehabisan memori:

```bash
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
free -h
```

Perbarui sistem:

```bash
sudo apt update && sudo apt upgrade -y
```

## 2. Arahkan domain ke VPS

Di pengelola DNS domain, buat record berikut (ganti `kebunkita.id` dengan domain Anda dan `203.0.113.10` dengan IP VPS):

| Tipe | Nama | Nilai |
| --- | --- | --- |
| A | `@` | `203.0.113.10` |
| A | `www` | `203.0.113.10` |
| A | `panel` | `203.0.113.10` (opsional, untuk panel Dokploy) |

Kalau memakai Cloudflare, set ke **DNS only** (awan abu-abu) dulu sampai sertifikat Let's Encrypt terbit. Setelah itu boleh diubah ke Proxied dengan mode SSL **Full (strict)**.

Cek DNS sudah mengarah ke VPS:

```bash
dig +short kebunkita.id
```

## 3. Pasang Dokploy

Jalankan sebagai root di VPS. Pastikan port 80, 443, dan 3000 belum dipakai aplikasi lain, misalnya Nginx atau Apache:

```bash
curl -sSL https://dokploy.com/install.sh | sh
```

Skrip ini memasang Docker, mengaktifkan Docker Swarm, lalu menjalankan Dokploy dan Traefik.

Buka `http://IP_VPS:3000`, lalu buat akun admin. Lakukan ini segera karena siapa pun yang membuka halaman itu lebih dulu bisa membuat akun admin.

Opsional, agar panel memakai HTTPS: buka **Settings > Web Server**, isi domain `panel.kebunkita.id`, aktifkan HTTPS dengan Let's Encrypt, lalu akses panel lewat domain tersebut. Setelah itu tutup port 3000 di firewall penyedia VPS (security group atau cloud firewall). UFW saja tidak cukup karena port yang dibuka Docker melewati aturan UFW.

## 4. Hubungkan GitHub

1. Di Dokploy, buka **Settings > Git > GitHub**, lalu klik **Create GitHub App**.
2. Ikuti alur di GitHub, lalu install app tersebut ke repo `KebunKita-CP`.
3. Kembali ke Dokploy dan pastikan provider GitHub muncul.

Kalau repo publik, langkah ini bisa dilewati dan repo diisi lewat provider **Git** dengan URL HTTPS.

## 5. Buat aplikasi

1. **Projects > Create Project**, beri nama `Kebun Kita`.
2. Di dalam project, **Create Service > Application**, beri nama `web`.
3. Tab **General**, bagian Provider:
   - Provider: **GitHub**
   - Repository: `KebunKita-CP`
   - Branch: branch produksi, misalnya `main`
   - Build Path: `/`
4. Bagian **Build Type**:
   - Pilih **Dockerfile**
   - Docker File: `Dockerfile`
   - Docker Context Path: `.`
5. Klik **Save**.

## 6. Isi variabel

Buat secret webhook terlebih dulu:

```bash
openssl rand -hex 32
```

Di tab **Environment**:

**Environment Variables** (runtime):

```env
SANITY_API_READ_TOKEN=token_viewer_dari_sanity
SANITY_REVALIDATE_SECRET=hasil_openssl_di_atas
```

**Build-time Arguments**:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=project_id_sanity
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SITE_URL=https://kebunkita.id
```

Kosongkan `NEXT_PUBLIC_SANITY_PROJECT_ID` jika Sanity belum siap. Website akan memakai konten bawaan dari `lib/fallback-content.ts`.

Klik **Save**.

## 7. Pasang domain dan HTTPS

Tab **Domains > Add Domain**:

| Kolom | Nilai |
| --- | --- |
| Host | `kebunkita.id` |
| Path | `/` |
| Container Port | `3000` |
| HTTPS | Aktif |
| Certificate | Let's Encrypt |

Untuk `www`, tambahkan domain kedua dengan host `www.kebunkita.id`, lalu di **Advanced > Redirects** pilih preset dari www ke non-www agar hanya ada satu alamat utama. Alamat utama ini harus sama dengan `NEXT_PUBLIC_SITE_URL`.

## 8. Deploy tanpa downtime

Image sudah membawa `HEALTHCHECK` ke `/api/health`, dan Docker Swarm memakainya untuk menilai container baru sehat atau tidak.

Agar container lama baru dimatikan setelah container baru sehat, buka **Advanced > Swarm Settings > Update Config** dan isi:

```json
{
  "Parallelism": 1,
  "Delay": 10000000000,
  "FailureAction": "rollback",
  "Order": "start-first"
}
```

Dengan pengaturan ini, deploy yang gagal health check akan kembali ke versi sebelumnya.

## 9. Deploy

1. Klik **Deploy** di kanan atas.
2. Pantau tab **Deployments** untuk log build. Build pertama butuh beberapa menit.
3. Setelah selesai, cek dari komputer Anda:

   ```bash
   curl https://kebunkita.id/api/health
   # {"status":"ok"}
   ```

4. Buka `https://kebunkita.id` dan `https://kebunkita.id/studio`.

**Auto deploy:** dengan provider GitHub, setiap push ke branch yang dipilih otomatis memicu deploy. Bisa dimatikan lewat opsi Autodeploy di tab General. Untuk provider Git biasa, salin URL webhook dari tab **Deployments** ke **Settings > Webhooks** di GitHub.

## 10. Hubungkan Sanity ke domain produksi

Di https://www.sanity.io/manage, buka project Kebun Kita:

1. **API > CORS origins > Add CORS origin**: `https://kebunkita.id`, centang **Allow credentials**. Tanpa ini Studio di `/studio` tidak bisa login.
2. **API > Webhooks > Create webhook**:
   - URL: `https://kebunkita.id/api/revalidate`
   - Dataset: `production`
   - Trigger on: Create, Update, Delete
   - HTTP method: POST
   - Secret: sama persis dengan `SANITY_REVALIDATE_SECRET`
3. Uji dengan mengubah teks di Studio lalu publish. Muat ulang website, perubahan seharusnya langsung terlihat. Status pengiriman webhook bisa dilihat di halaman webhook tersebut (attempts log).

## Operasional sehari-hari

| Kebutuhan | Caranya |
| --- | --- |
| Rilis versi baru | Push ke branch produksi, atau klik **Deploy** |
| Mengubah `NEXT_PUBLIC_*` | Ubah di Build-time Arguments, lalu **Deploy** (wajib build ulang) |
| Mengubah token atau secret | Ubah di Environment Variables, lalu **Redeploy** |
| Melihat log aplikasi | Tab **Logs** |
| Memantau CPU dan RAM | Tab **Monitoring** |
| Kembali ke versi lama | Deploy ulang commit sebelumnya (revert di Git lalu push) |
| Membersihkan image lama | **Settings > Server > Clean** di Dokploy, atau `docker system prune -a` di VPS |

Website ini tidak punya database sendiri karena konten tersimpan di Sanity, jadi tidak ada volume yang perlu di-backup dari VPS. Backup konten dilakukan dari Sanity: `npx sanity dataset export production backup.tar.gz`.

## Masalah yang sering muncul

**Build berhenti dengan `Killed` atau `JavaScript heap out of memory`.** RAM kurang. Tambahkan swap (langkah 1). `Dockerfile` membatasi heap Node di 3 GB lewat `NODE_OPTIONS`.

**Website 404 atau `Bad Gateway` setelah deploy.** Pastikan Container Port di tab Domains bernilai `3000`, dan status container sehat di tab Logs. Container mendengarkan di `0.0.0.0:3000` lewat `HOSTNAME=0.0.0.0` di `Dockerfile`, jangan timpa variabel ini.

**Sertifikat HTTPS tidak terbit.** DNS belum mengarah ke VPS, port 80 tertutup, atau Cloudflare masih Proxied. Cek `dig +short domain`, lalu deploy ulang domain tersebut.

**Website masih memakai konten bawaan setelah Sanity diisi.** `NEXT_PUBLIC_SANITY_PROJECT_ID` diisi di Environment Variables, bukan di Build-time Arguments, atau belum di-deploy ulang setelah diisi.

**Studio menampilkan error CORS.** Domain produksi belum ditambahkan di CORS origins Sanity, atau **Allow credentials** belum dicentang.

**Publish di Studio tidak mengubah website.** Cek log webhook di Sanity. Respons `401` berarti secret tidak sama, `500` berarti `SANITY_REVALIDATE_SECRET` belum diisi di Dokploy.

## Uji image di komputer sendiri

Butuh Docker Desktop atau Docker Engine.

```bash
cp .env.example .env    # isi seperlunya
docker compose up -d --build
curl http://localhost:3000/api/health
docker compose down
```

## Tanpa Dokploy

Kalau VPS hanya memakai Docker, `docker-compose.yml` bisa langsung dipakai. Compose membuka port hanya di `127.0.0.1:3000`, jadi pasang reverse proxy di depannya. Contoh dengan Caddy, yang mengurus HTTPS otomatis:

```bash
git clone https://github.com/WIBISANA-cmd/KebunKita-CP.git && cd KebunKita-CP
cp .env.example .env && nano .env
docker compose up -d --build
sudo apt install -y caddy
```

`/etc/caddy/Caddyfile`:

```caddy
kebunkita.id {
    reverse_proxy 127.0.0.1:3000
}

www.kebunkita.id {
    redir https://kebunkita.id{uri} permanent
}
```

```bash
sudo systemctl reload caddy
```

Untuk rilis baru: `git pull && docker compose up -d --build`.
