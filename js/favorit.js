// Elemen wadah utama tempat semua kartu favorit ditampilkan
const favoritListDiv = document.getElementById("list-favorit");

let dataFavorit = []; // Menyimpan seluruh data favorit yang sedang ditampilkan

// Fungsi utama buat memuat & menampilkan daftar favorit
function muatFavorit() {
  dataFavorit = getFavoritList().sort((a, b) => {
    return new Date(b.savedAt || 0) - new Date(a.savedAt || 0);
  });
  renderFavoritList(dataFavorit);   // Tampilkan hasil urutan tadi ke halaman
}

// Fungsi buat menggambar/render daftar favorit 
function renderFavoritList(list) {
  favoritListDiv.replaceChildren();   

  if (list.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-message";

    // Ikon hati kosong
    const icon = document.createElement("span");
    icon.className = "material-symbols-outlined";
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = "favorite_border";
    empty.appendChild(icon);

    // Teks penjelasan kalau belum ada favorit
    const teks = document.createElement("p");
    teks.textContent = "Belum ada Doa atau Dzikir yang disimpan.";
    empty.appendChild(teks);

    // Link ajakan buat menjelajahi halaman Doa & Dzikir
    const link = document.createElement("a");
    link.href = "../html/doa-dzikir.html";
    link.textContent = "Jelajahi Doa & Dzikir sekarang";
    empty.appendChild(link);

    favoritListDiv.appendChild(empty);
    return;       // Hentikan fungsi di sini, nggak usah lanjut bikin kartu apapun lagi
  }

  // Kalau datanya ada isinya, looping tiap item favorit satu per satu.
  list.forEach((item) => {
    const el = createFavoritItem(item);       // buat satu kartu utuh dari data item ini
    favoritListDiv.appendChild(el);           // Tempelkan kartu ke wadah utama di halaman
  });
}

// Fungsi buat membangun SATU kartu favorit lengkap (judul, teks arab, latin, arti, sumber, dan tombol-tombol aksi), berdasarkan 1 objek "item"
function createFavoritItem(item) {
  // Bingkai utama kartu
  const el = document.createElement("div");
  el.classList.add("container");

  // Judul doa/dzikirnya
  const title = document.createElement("h3");
  title.textContent = item.judul;
  el.appendChild(title);

  // Kalau item ini punya kategori/grup, tampilkan label kecilnya
  if (item.grup) {
    const badge = document.createElement("span");
    badge.classList.add("grup-badge");
    badge.textContent = item.grup;
    el.appendChild(badge);
  }

  // Kalau ada teks Arab-nya, tampilkan dengan pengaturan khusus teks Arab
  if (item.arab) {
    const arab = document.createElement("p");
    arab.classList.add("arabic-text");
    arab.setAttribute("lang", "ar");
    arab.setAttribute("dir", "rtl");
    arab.textContent = item.arab;
    el.appendChild(arab);
  }

  // Bagian terjemahan/arti 
  const terjemah = document.createElement("p");
  terjemah.classList.add("arti-text");
  terjemah.textContent = item.terjemah
    ? "Artinya: " + item.terjemah
    : "Artinya: (terjemahan belum tersedia dari sumber data)";
  el.appendChild(terjemah);

  // info sumber/referensinya
  if (item.sumber) {
    const sumber = document.createElement("p");
    sumber.classList.add("sumber-text");
    sumber.textContent = "Sumber: " + item.sumber;
    el.appendChild(sumber);
  }

  // Baris berisi ikon aksi, hapus dari favorit
  const actionRow = document.createElement("div");
  actionRow.classList.add("copy-send-container");

  // Ikon hapus kalau diklik, item ini dihapus dari daftar favorit.
  const iconHapus = document.createElement("span");
  iconHapus.className = "material-symbols-outlined icon-hapus";
  iconHapus.setAttribute("aria-hidden", "true");
  iconHapus.textContent = "delete";
  iconHapus.title = "Hapus dari Favorit";
  iconHapus.addEventListener("click", () => {
    removeFavorit(item.id);           // Hapus data ini dari localStorage lewat fungsi di fav.js
    showCustomAlert("Dihapus!", "\"" + item.judul + "\" dihapus dari Favorit.", "delete");    // Muat ulang seluruh daftar favorit, supaya kartu yang baru dihapus
    muatFavorit();
  });

  actionRow.appendChild(iconHapus);    
  el.appendChild(actionRow);            

  return el;          
}

// Scroll to top, mengatur kapan tombol itu muncul/hilang & aksi saat diklik
const scrollToTopButton = document.getElementById("scroll-to-top");
scrollToTopButton.addEventListener("click", () =>
  window.scrollTo({ top: 0, behavior: "smooth" })
);

// Menentukan kapan tombol scroll-to-top ditampilkan/disembunyikan
window.addEventListener("scroll", () => {
  scrollToTopButton.classList.toggle("show", window.scrollY > 300);
});

muatFavorit();