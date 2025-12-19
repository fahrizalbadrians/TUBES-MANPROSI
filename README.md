# GOSYANDU


## 1) Import Database 

1. Buka MySQL phpMyAdmin dan create database baru namanya "gosyandu"
2. **Import** file database jangan lupa

## 2) Jalankan Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```


## 3) Jalankan Frontend

```bash
cd frontend
npm install
npm run dev

## 4) Akun Demo

Password demo untuk keduanya: **Password123!**

- **Pegawai**: `pegawai@gosyandu.com`
- **Masyarakat**: `lihat di database user udah dibuat beberapa, tambahin ya`

> Requirement: daftar sebagai **Pegawai** wajib memakai email domain `@gosyandu.com` (sudah divalidasi di frontend & backend).

## 5) Flow Utama (Frontend ↔ Backend ↔ DB)

### A. Pencatatan Dasar (Pegawai)
Menu: **Pencatatan Dasar**
- Balita (tabel `children`)
- Ibu Hamil (tabel `pregnant_mothers`)
- Lansia (tabel `elderly`)

**PENTING:** Agar data tampil saat login **Masyarakat**, pegawai harus memilih akun warga pada field:
- Balita → **Akun Orang Tua (Masyarakat)** → menyimpan `children.parent_id`
- Ibu Hamil → **Akun Masyarakat** → menyimpan `pregnant_mothers.user_id`
- Lansia → **Akun Masyarakat** → menyimpan `elderly.user_id`

### B. Pemeriksaan / Penimbangan (Pegawai)
Menu: **Penimbangan & Pemeriksaan**
- Menyimpan ke tabel `measurements`
- Jika ada anomali (TD tinggi/rendah, gula tinggi/rendah, kolesterol tinggi, atau balita terindikasi stunting) → otomatis membuat notifikasi ke:
  - Pegawai (created_by)
  - Masyarakat terkait (parent_id / user_id)

### C. Riwayat Pemeriksaan (Pegawai & Masyarakat)
Menu: **Riwayat & Pemeriksaan**
- Balita: riwayat pemeriksaan + riwayat imunisasi + riwayat PMT + jadwal imunisasi (jatuh tempo)
- Ibu Hamil/Lansia: riwayat pemeriksaan

### D. Pengingat Imunisasi
- Jadwal imunisasi wajib tersedia dari tabel `vaccine_types` dan `vaccine_schedules`.
- Ditampilkan di:
  - **Dashboard Tumbuh Kembang Balita**
  - **Riwayat & Pemeriksaan**

Status jadwal:
- UPCOMING / SOON / DUE (jatuh tempo) / OVERDUE (terlambat) / DONE

Jika status **DUE** atau **OVERDUE**, backend otomatis membuat notifikasi (dedup 7 hari agar tidak spam).

### E. Edukasi
- Pegawai dapat posting Artikel/Poster/Video
- Masyarakat dapat melihat

### F. Konsultasi Privat
- Masyarakat membuat thread konsultasi privat
- Pegawai dapat melihat & membalas (thread bisa di-assign)