# 💍 The Wedding Platform - Website Undangan, Dashboard User & Dashboard Admin

Website pernikahan modern, responsif, dan elegan dengan arsitektur lengkap yang terbagi menjadi:
1. **Undangan Pernikahan Interaktif** (`index.html`)
2. **Dashboard Tamu / User Portal & E-Ticket** (`user-dashboard.html`)
3. **Dashboard Admin & Buku Tamu Digital (QR Scanner)** (`admin.html`)

---

## 🌟 Fitur Utama

### 1. Undangan Digital Interaktif (`index.html`)
- **Fullscreen Cover Envelope**: Efek amplop pembuka dengan nama tamu personalisasi dari URL (e.g. `?to=Nama+Tamu&code=WED-001`).
- **Background Music Player**: Pemutar musik romantis instrumental dengan kontrol piringan hitam (*vinyl disc*).
- **Countdown Timer**: Hitung mundur otomatis menuju hari pernikahan (Hari, Jam, Menit, Detik).
- **Profil Mempelai**: Foto portrait elegan, informasi orang tua, dan tautan media sosial.
- **Kisah Cinta (Love Story)**: Timeline interaktif dari awal bertemu, lamaran, hingga pernikahan.
- **Rincian Acara & Lokasi**: Jadwal Akad Nikah & Resepsi dengan tautan langsung ke **Google Maps** & tombol **Simpan ke Google Calendar**.
- **Galeri Foto Prewedding**: Galeri responsif lengkap dengan modal Lightbox interaktif.
- **Formulir RSVP Terintegrasi**: Konfirmasi kehadiran dan jumlah tamu yang langsung tersinkron ke Dashboard Admin.
- **Untaian Doa & Ucapan**: Dinding ucapan doa restu tamu secara real-time.
- **Amplop Digital & Kado Fisik**: Tanda kasih digital dengan fitur 1-klik salin nomor rekening (BCA, Mandiri) dan alamat pengiriman kado.

### 2. Dashboard Tamu / User Portal (`user-dashboard.html`)
- **Gold VIP E-Ticket Pass**: Kartu pas masuk digital berornamen emas mewah yang siap dicetak (*Print-ready*) atau ditunjukkan di lokasi resepsi.
- **QR Code Check-in Generator**: Barcode / QR Code dinamis unik untuk setiap tamu sebagai tiket masuk.
- **Informasi Reservasi**: Menampilkan alokasi meja (e.g., `VIP-A1`), jumlah alokasi kursi (pax), dan kategori tamu.
- **Ubah Konfirmasi RSVP**: Tamu dapat memperbarui status kehadiran sewaktu-waktu.
- **Susunan Acara (Rundown)**: Panduan jam kegiatan hari-H untuk tamu undangan.
- **Konfirmasi Tanda Kasih**: Form konfirmasi transfer angpao digital yang langsung masuk ke rekap admin.

### 3. Dashboard Admin & Buku Tamu Digital (`admin.html`)
- **5 Metrik KPI Real-Time**:
  1. Total Tamu & Total Pax Kuota.
  2. Jumlah Tamu Konfirmasi Hadir & Pax Terkonfirmasi.
  3. Tamu Belum Merespon (Pending).
  4. Tamu Telah Hadir / Check-in Hari-H.
  5. Total Nominal Amplop Digital Masuk (Rp).
- **Manajemen Tamu (CRUD & Filter)**:
  - Cari tamu berdasarkan nama, kode, atau meja.
  - Filter kategori (*VIP*, *Keluarga*, *Sahabat*, *Teman Kantor*).
  - Filter status kehadiran (*Hadir*, *Tidak Hadir*, *Belum Respon*).
  - Tambah & Edit data tamu undangan.
  - **Generator Link WhatsApp**: 1-klik untuk menghasilkan pesan undangan personal beserta link otomatis ke nomor WhatsApp tamu.
  - **Export to CSV**: Unduh seluruh daftar tamu dan status check-in dalam format spreadsheet.
- **Buku Tamu Digital & QR Scanner (Resepsionis Acara)**:
  - Input cepat kode tamu atau scan QR Code e-ticket.
  - Verifikasi otomatis instan dengan konfirmasi visual (Nama, Meja, Jumlah Pax).
  - Riwayat kedatangan (*Live Check-in Feed*) secara real-time.
- **Moderasi Doa & Ucapan**: Sematkan (*pin*) doa terbaik di bagian atas atau hapus komentar yang tidak sesuai.
- **Catatan Amplop Digital**: Rekapitulasi perolehan tanda kasih.
- **Pengaturan Acara**: Kustomisasi nama pengantin, tanggal, jam, dan lokasi.

---

## 🚀 Cara Menjalankan Website

Aplikasi ini dibuat dengan arsitektur murni tanpa dependensi instalasi yang berat (*Zero-Config*).

### Opsi 1: Langsung Buka di Browser
Cukup klik dua kali atau buka file berikut di browser (Chrome, Edge, Firefox, Safari):
- **`index.html`** untuk melihat Undangan Pernikahan.
- **`user-dashboard.html`** untuk melihat Dashboard Tamu.
- **`admin.html`** untuk melihat Dashboard Admin.

### Opsi 2: Menggunakan Local Web Server (Direkomendasikan)
Gunakan salah satu perintah berikut di terminal:

```bash
# Menggunakan Python
python -m http.server 8000

# Atau menggunakan Node.js npx serve
npx serve
```
Buka browser di: `http://localhost:8000`

---

## 📂 Struktur File

```
website wedding/
├── index.html              # Halaman Undangan Pernikahan Publik
├── user-dashboard.html     # Dashboard Tamu & E-Ticket QR
├── admin.html              # Dashboard Admin & Buku Tamu Resepsionis
├── assets/
│   ├── css/
│   │   └── style.css       # Styling tema mewah, typography & animasi
│   └── js/
│       ├── db.js           # State management & LocalStorage database
│       ├── invitation.js   # Logika halaman undangan, musik & countdown
│       ├── user.js         # Logika dashboard tamu & E-Ticket
│       └── admin.js        # Logika dashboard admin, scanner & ekspor CSV
└── README.md               # Dokumentasi lengkap
```

---

## 💡 Personalisasi Link Undangan Tamu
Format parameter URL untuk membagikan undangan kustom kepada tamu:
- `index.html?to=Nama+Tamu&code=WED-001`
- Contoh: `index.html?to=Bapak+Budi+Santoso&code=WED-001`
Fitur ini juga sudah otomatis dihasilkan di Dashboard Admin melalui tombol WhatsApp!
