# 📖 Web Portal Doa & Dzikir Harian

Aplikasi web interaktif bertema Islami yang menyajikan kumpulan doa harian, dzikir, konten video panduan/edukasi, serta fitur penanda doa favorit. Proyek ini dibangun menggunakan web stack fundamental (**HTML5, CSS3, dan JavaScript Modern**) dengan struktur modular yang rapi dan responsif.

---

## 📑 Daftar Isi
1. [Fitur Utama](#-fitur-utama)
2. [Struktur Proyek](#-struktur-proyek)
3. [Penjelasan Halaman & Fungsionalitas](#-penjelasan-halaman--fungsionalitas)
4. [Teknologi yang Digunakan](#-teknologi-yang-digunakan)
5. [Panduan Instalasi & Menjalankan](#-panduan-instalasi--menjalankan)
6. [Catatan Teknis & Pengembangan](#-catatan-teknis--pengembangan)
7. [Penulis](#-penulis)

---

## ✨ Fitur Utama

- **🕌 Beranda Dinamis (`index.html`)**: Menyambut pengguna dengan tampilan elegan, logo utama, perkenalan portal, serta navigasi cepat ke menu-menu inti.
- **📿 Kumpulan Doa & Dzikir (`doa-dzikir.html`)**: Memuat daftar doa dan bacaan dzikir dengan teks Arab, transliterasi Latin, dan terjemahan bahasa Indonesia. Dilengkapi kontrol interaktif untuk menandai doa sebagai favorit.
- **⭐ Fitur Favorit (`favorit.html`)**: Mengelola dan menampilkan doa-doa yang disimpan oleh pengguna secara lokal di browser (`localStorage`), sehingga data tetap tersimpan saat halaman ditutup atau dimuat ulang.
- **🎥 Galeri Video Edukasi (`video.html`)**: Pemutar video multimedia interaktif yang dilengkapi video pengantar/intro untuk pembelajaran doa dan dzikir secara visual.
- **ℹ️ Halaman Tentang Pengembang (`about.html`)**: Informasi pengembang, latar belakang proyek, visi pengembangan web Islami, dan kontak informasi.
- **📱 Desain Responsif & Estetik**: Tampilan bersih, ramah pengguna, dan nyaman diakses dari berbagai ukuran layar (desktop, tablet, hingga mobile).

---

## 📂 Struktur Proyek

```plaintext
YUSRA_APRILISDA_SIREGAR/
│
├── index.html                  # Halaman Beranda / Landing Page Utama
│
├── assets/                     # Berkas Multimedia & Aset Grafis
│   ├── gambar1.jpg             # Aset ilustrasi visual / konten pendukung
│   ├── intro.mp4               # Video intro panduan multimedia
│   └── logo-utama.jpg          # Logo identitas utama web portal
│
├── css/                        # Lembar Gaya (Stylesheets)
│   ├── style.css               # Gaya global (typography, resets, navbar, footer)
│   ├── index.css               # Gaya khusus halaman beranda
│   ├── doa-dzikir.css          # Gaya kartu doa, font kaligrafi arab, & badge
│   ├── favorit.css             # Gaya antarmuka daftar doa favorit
│   ├── video.css               # Gaya pemutar video dan layout grid multimedia
│   └── about.css               # Gaya kartu profil dan tata letak halaman tentang
│
├── html/                       # Halaman Menu Tambahan
│   ├── doa-dzikir.html         # Halaman katalog doa & bacaan dzikir
│   ├── favorit.html            # Halaman penampung doa-doa favorit tersimpan
│   ├── video.html              # Halaman galeri multimedia & pemutar video
│   └── about.html              # Halaman profil pembuat dan deskripsi proyek
│
└── js/                         # Logika & Interaktivitas (JavaScript)
    ├── index.js                # Interaktivitas beranda & animasi elemen
    ├── doa-dzikir.js           # Pengambilan data doa, filter, & tombol suka/favorit
    ├── favorit.js              # Penanganan data tersimpan di LocalStorage & render list
    ├── fav.js                  # Skrip pembantu manajemen status item favorit
    ├── about.js                # Interaktivitas kartu informasi & navigasi
    └── video.js                # Pengontrol pemutaran media & interaksi video
```

---

## 🖥️ Penjelasan Halaman & Fungsionalitas

| Halaman | Berkas HTML | Berkas CSS Terkait | Berkas JS Terkait | Keterangan |
| :--- | :--- | :--- | :--- | :--- |
| **Beranda** | `index.html` | `style.css`, `index.css` | `index.js` | Halaman pendaratan utama dengan navigasi lengkap dan spotlight konten unggulan. |
| **Doa & Dzikir** | `html/doa-dzikir.html` | `style.css`, `doa-dzikir.css` | `doa-dzikir.js` | Menyajikan bacaan dengan teks arab dan arti; menyediakan aksi simpan ke favorit. |
| **Favorit** | `html/favorit.html` | `style.css`, `favorit.css` | `favorit.js`, `fav.js` | Membaca daftar item yang disukai pengguna dari penyimpanan lokal peramban. |
| **Video** | `html/video.html` | `style.css`, `video.css` | Kontrol bawaan / script | Memutar video edukatif dan intro panduan tata cara doa/dzikir. |
| **About** | `html/about.html` | `style.css`, `about.css` | `about.js` | Berisi biografi pembuat, tujuan pembuatan website, dan kredensial. |

---

## 🛠️ Teknologi yang Digunakan

- **HTML5**: Semantik dokumen terstruktur (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<video>`, `<footer>`).
- **CSS3**: Tata letak modular, Flexbox, CSS Grid, media query responsif, dan styling kartu modern.
- **JavaScript (ES6+)**:
  - Manipulasi DOM dinamis.
  - Event Handling & interaktivitas tombol.
  - Web Storage API (`localStorage`) untuk menyimpan daftar doa favorit tanpa backend database.

---

## 🚀 Panduan Instalasi & Menjalankan

Aplikasi web ini berbasis klien murni (*client-side only*), sehingga dapat dijalankan langsung tanpa instalasi dependensi atau konfigurasi server khusus:

1. **Clone atau Unduh Direktori**:
   Pastikan seluruh folder `YUSRA_APRILISDA_SIREGAR/` telah tersimpan di komputer Anda.

2. **Jalankan Secara Langsung**:
   - Buka direktori proyek.
   - Klik dua kali pada berkas `index.html` untuk langsung membukanya di browser web pilihan Anda (Google Chrome, Mozilla Firefox, Microsoft Edge, Safari).

3. **(Opsional) Menggunakan Live Server di VS Code**:
   - Buka folder proyek di Visual Studio Code.
   - Instal ekstensi **Live Server**.
   - Klik kanan pada `index.html` dan pilih **"Open with Live Server"** untuk pengujian dengan fitur *hot-reload*.

---

## 📌 Catatan Teknis & Pengembangan

- **Path Resolusi File**: Semua berkas diatur dengan jalur relatif (`relative paths`). Pastikan struktur subfolder `assets/`, `css/`, `html/`, dan `js/` tidak diubah agar tautan gambar, video, skrip, dan gaya tetap sinkron.
- **Penyimpanan Lokal**: Fitur favorit memanfaatkan `localStorage` browser. Jika cache atau data penjelajahan dihapus, daftar doa favorit akan ter-reset ke kondisi awal.
- **Dukungan Media**: Video `intro.mp4` memerlukan browser modern yang mendukung format MP4/H.264 (standar di semua browser masa kini).

---

## 👤 Penulis

- **Nama**: Yusra Aprilisda Siregar
- **Proyek**: Web Portal Doa & Dzikir Harian
