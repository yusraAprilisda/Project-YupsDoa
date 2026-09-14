// ---------- Konfigurasi provinsi dan kota ----------
const namaProvinsiShalat = "Jawa Barat";
const namaKotaShalat = "Kota Bandung";

// Daftar 5 waktu sholat yang mau ditampilkan. 
const daftarWaktuShalat = [
  { keys: ["subuh"], label: "Subuh", icon: "brightness_3" },
  { keys: ["dzuhur", "zuhur"], label: "Dzuhur", icon: "wb_sunny" },
  { keys: ["ashar", "asar"], label: "Ashar", icon: "wb_twilight" },
  { keys: ["maghrib"], label: "Maghrib", icon: "nights_stay" },
  { keys: ["isya", "isha"], label: "Isya", icon: "dark_mode" },
];

// ---------- Fungsi bantu kecil ----------
// Mengambil elemen kartu tempat jadwal sholat akan ditampilkan.
// Dipecah jadi function sendiri supaya tidak perlu menulis ulang
// pake document.getElementById(...) karna berulang-ulang di banyak tempat
function getKartuJadwalShalat() {
  return document.getElementById("jadwal-shalat-card");
}

// Mengambil jam sebuah waktu sholat dari data 1 hari, dengan mencoba beberapa kemungkinan nama field 
function ambilJamShalat(dataHari, keys) {     
  for (const key of keys) {
    if (dataHari[key]) return dataHari[key];
  }
  return "-";
}

// Mengubah 1 jam (format teks "HH:MM") jadi total menit sejak jam 00:00,
// supaya gampang dibandingkan besar-kecilnya dengan jam sekarang
function jamKeMenit(jamText) {
  // "04:32".split(":") menghasilkan ["04", "32"], lalu mengubah keduanya jadi angka: [4, 32]. 
  const [jam, menit] = jamText.split(":").map(Number);      // .map(Number) mengubah keduanya jadi angka: [4, 32]. Baris ini langsung membongkar
  // Ubah jam+menit jadi 1 angka tunggal biar gampang dibandingkan (misal 04:32 jadi 4*60+32 = 272 menit sejak tengah malam)
  return jam * 60 + menit;
}

// buat ngambil dta tanggal hari ini
function formatTanggalHariIni() {   
  const hariIni = new Date();       // new Date() tanpa parameter = tanggal & jam SAAT INI
  return hariIni.toLocaleDateString("id-ID", {    // toLocaleDateString dengan locale "id-ID" otomatis menerjemahkan nama hari & bulan ke Bahasa Indonesia 
    weekday: "long", 
    day: "numeric",  
    month: "long",   
    year: "numeric", 
  });
}

// ---------- Mengambil data jadwal solat dari API ----------
function ambilJadwalShalat() {
  const sekarang = new Date();
  const bulan = sekarang.getMonth() + 1; // getMonth() mulai dari 0 (Jan=0), jadi +1
  const tahun = sekarang.getFullYear();

  return fetch("https://equran.id/api/v2/shalat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      provinsi: namaProvinsiShalat,
      kabkota: namaKotaShalat,
      bulan: bulan,
      tahun: tahun,
    }),
  })
    .then((response) => response.json())
    .then((hasil) => {
      // "jadwal" berisi array data untuk setiap hari dalam 1 bulan itu.
      const jadwalSebulan = (hasil.data && hasil.data.jadwal) || [];

      // Format tanggal hari ini dalam bentuk "yyyy-mm-dd", untuk dicocokkan dengan field "tanggal_lengkap" di data API
      const todayStr = sekarang.toISOString().slice(0, 10);

      // field "tanggal" dari API EQuran.id berupa angka, buka teks tanggal.
      const dataHariIni = jadwalSebulan.find((item) =>
        String(item.tanggal_lengkap || "").includes(todayStr)
      );

      return dataHariIni || jadwalSebulan[0] || null;
    });
}

// ---------- Menentukan sholat yang "sedang ditunggu" ----------
// Membandingkan jam sekarang dengan kelima waktu sholat, lalu menentukan waktu sholat mana yang belum lewat dan paling dekat 
function tentukanShalatBerikutnya(dataHari) {
  const sekarang = new Date();     // Ambil jam & menit SAAT INI dari perangkat user
  const menitSekarang = sekarang.getHours() * 60 + sekarang.getMinutes();   // Ubah jam sekarang jadi total menit sejak tengah malam

  // Looping kelima waktu sholat sesuai urutan array daftarWaktuShalat yg mmg sudah disusun berurutan
  for (const shalat of daftarWaktuShalat) {
    const jamBersih = ambilJamShalat(dataHari, shalat.keys);  

    if (jamBersih === "-") continue; // lewati kalau datanya tidak ada
    const menitShalat = jamKeMenit(jamBersih);      
    if (menitShalat > menitSekarang) {
      return shalat.keys[0];
    }
  }

  return daftarWaktuShalat[0].keys[0];    // daftarWaktuShalat[0] = elemen pertama di array = Subuh
}

// ---------- Membangun tampilan (DOM) ----------
// Membuat satu "tile" kecil buat 1 waktu sholat, isinya ikon + nama sholat + jamnya. "aktif" menandai apakah tile ini perlu disorot khusus 
function buatTileWaktuShalat(shalat, jamTampil, aktif) {
  // Bingkai luar 1 tile
  const tile = document.createElement("div");
  // Kalau aktif bernilai true, tambahkan class active supaya CSS memberi tampilan yang lebih menonjol cuma buat tile ini
  tile.className = "shalat-tile" + (aktif ? " active" : "");

  const icon = document.createElement("span");
  icon.className = "material-symbols-outlined";
  icon.setAttribute("aria-hidden", "true");     
  icon.textContent = shalat.icon;
  tile.appendChild(icon);

  // Nama sholatnya
  const label = document.createElement("span");
  label.className = "shalat-label";
  label.textContent = shalat.label;
  tile.appendChild(label);

  // Jam sholatnya
  const jam = document.createElement("span");
  jam.className = "shalat-jam";
  jam.textContent = jamTampil;
  tile.appendChild(jam);

  return tile;       
}

// Menyusun seluruh isi kartu jadwal sholat. baris tanggal di atas, lalu grid berisi 5 tile waktu sholat di bawahnya
function renderJadwalShalat(dataHari) {
  const kartu = getKartuJadwalShalat();
  if (!kartu) return;

  if (!dataHari) {
    tampilkanErrorJadwalShalat();
    return;
  }

  // Cari tahu dulu sholat mana yang perlu disorot sebagai berikutnya
  const shalatBerikutnya = tentukanShalatBerikutnya(dataHari);

  kartu.replaceChildren(); //mengosongkan isi kartu

  // Baris tanggal hari ini di bagian paling atas kartu
  const tanggal = document.createElement("p");
  tanggal.className = "shalat-tanggal";
  tanggal.textContent = formatTanggalHariIni();
  kartu.appendChild(tanggal);

  // Wadah grid buat menampung kelima tile waktu sholat
  const grid = document.createElement("div");
  grid.className = "shalat-grid";

  // Looping kelima waktu sholat, bikin 1 tile untuk masing-masing, lalu tempelkan ke dalam grid
  daftarWaktuShalat.forEach((shalat) => {
    const jamTampil = ambilJamShalat(dataHari, shalat.keys);    // Ambil jam tampilnya dari data API (dengan fallback beberapa nama field)
    const aktif = shalat.keys[0] === shalatBerikutnya;          // Cek apakah waktu sholat ini yang sedang jadi "sholat berikutnya"
    grid.appendChild(buatTileWaktuShalat(shalat, jamTampil, aktif));      // Bikin tile-nya, lalu tempelkan langsung ke grid
  });

  kartu.appendChild(grid);  // memasukkan grid nya ke dalam kartu
}

// Menampilkan pesan error di dalam kartu, dipakai kalau proses ambil data dari API gagal 
function tampilkanErrorJadwalShalat() {
  const kartu = getKartuJadwalShalat();
  if (!kartu) return;

  kartu.replaceChildren();

  const pesan = document.createElement("p");
  pesan.className = "empty-message";
  pesan.textContent =
    "Jadwal sholat sedang tidak dapat dimuat. Silakan coba lagi nanti.";
  kartu.appendChild(pesan);
}

// ---------- Fungsi utama ----------
// Fungsi utama yang menghubungkan semuanya: ambil data dari API, lalu tampilkan ke kartu 
function muatJadwalShalat() {
  const kartu = getKartuJadwalShalat();
  if (!kartu) return;

  ambilJadwalShalat()
    .then((dataHariIni) => {
      renderJadwalShalat(dataHariIni);      // setelah datanya siap, menampilkan ke kartu
    })
    .catch((error) => {                     // .catch() menangkap SEMUA error di sepanjang rantai .then() di atas
      console.error("Gagal memuat jadwal sholat:", error);
      tampilkanErrorJadwalShalat();
    });
}
document.addEventListener("DOMContentLoaded", muatJadwalShalat);