// dipakai di halaman doa-dzikir.html, dan favorit.html
const favoritKey = "favoritDoaDzikir";  

// Mengambil seluruh daftar favorit dari localStorage
function getFavoritList() {
  try {
    const data = localStorage.getItem(favoritKey);      
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Gagal membaca data favorit:", error);
    return [];
  }
}

// Menyimpan seluruh daftar favorit ke localStorage
function saveFavoritList(list) {
  // Ubah array/objek JavaScript "list" jadi teks JSON dulu, baru disimpan ke localStorage dengan kunci favoritKey
  localStorage.setItem(favoritKey, JSON.stringify(list));
}

// Mengecek apakah sebuah doa/dzikir (berdasarkan id) sudah ada di favorit
function isFavorit(id) {
  const list = getFavoritList();    
  // .some() mengecek apakah ada minimal 1 item di list yang id-nya sama dengan id yang dicari.
  // String dipakai supaya perbandingan id tetap konsisten walau salah satu berupa angka dan satunya berupa teks
  return list.some((item) => String(item.id) === String(id));
}

// Menambah atau menghapus doa/dzikir dari favorit (toggle)
function toggleFavorit(doa) {
  let list = getFavoritList();
  const sudahAda = list.some((item) => String(item.id) === String(doa.id));

  if (sudahAda) {
    // Kalau sudah ada, hapus dari daftar: .filter() bikin list baru yang isinya semua item kecuali yang id-nya sama dengan doa.id
    list = list.filter((item) => String(item.id) !== String(doa.id));
    saveFavoritList(list);
    return false;     
  } else {
    list.push({ ...doa, savedAt: new Date().toISOString() });
    saveFavoritList(list);
    return true;
  }
}

// Menghapus satu item favorit berdasarkan id
function removeFavorit(id) {
  let list = getFavoritList();
  list = list.filter((item) => String(item.id) !== String(id));
  saveFavoritList(list);
}

// Fungsi bantu
function pickField(obj, keys, fallback = "") {
  for (const key of keys) {                       // Looping tiap kemungkinan nama field satu per satu
    if (obj && obj[key] !== undefined && obj[key] !== null && obj[key] !== "") {      
      return obj[key];            
    }
  }
  return fallback;      
}

// Mengambil nilai teks dari sebuah field
function ambilTeks(obj, keys) {
  // ngambil salah satu field dari daftar "keys", pakai fallback null dulu (bukan "") supaya bisa tau kosong atau ngga nemu fieldnya
  const nilai = pickField(obj, keys, null);
  if (nilai === null) return "";                  
  if (typeof nilai === "string") return nilai;     
  // Kalau nilainya berupa objek, berarti datanya berbentuk multi-bahasa, yg dicari ttp bhs indo dengan bbrp kemungkinan nama field
  if (typeof nilai === "object") {
    return pickField(nilai, ["id", "ID", "id_ID", "indonesia", "in", "text", "value"], "");
  }
  return String(nilai);  
}  

// Fungsi utama buat rapiin satu item data mentah dari API jadi
// format yang seragam & mudah dipakai di seluruh halaman (doa-dzikir,favorit, doa harian di home)
function normalizeDoaItem(raw) {
  const id = pickField(raw, ["id", "idDoa", "id_doa", "doa_id", "no", "number"], null);
  const judul = ambilTeks(raw, ["judul", "nama", "title", "namaDoa", "nama_doa", "name"]) || "Tanpa Judul";
  const arab = ambilTeks(raw, ["arab", "ar", "teksArab", "teks_arab", "text_arab", "arabic"]);
  const terjemah = ambilTeks(raw, [
    "artinya", "terjemah", "terjemahan", "arti", "translation", "translate",
    "teksIndonesia", "teks_indonesia", "idn", "id_ID", "indonesia", "translate_id",
    "keterangan", "makna", "meaning"
  ]);
  const sumber = ambilTeks(raw, ["sumber", "referensi", "source", "dalil", "reference"]);
  const grup = ambilTeks(raw, ["grup", "group", "kategori", "category"]);
  let tag = raw && (raw.tag || raw.tags);
  if (!Array.isArray(tag)) tag = tag ? [tag] : [];

  return { id, judul, arab, terjemah, sumber, grup, tag };
}

// satu-satunya pemanggil fungsi ini adalah doa-dzikir.js & favorit.js,
// dan keduanya sudah pasti memuat fav.js lebih dulu.
window.showCustomAlert = function (title, message, namaIkon = 'check_circle') {
  const existingModal = document.getElementById("customModalOverlay");
  if (existingModal) existingModal.remove();

  // Buat Overlay lapisan gelap transparan yang menutupi seluruh layar
  const overlay = document.createElement("div");
  overlay.id = "customModalOverlay";
  overlay.className = "custom-modal-overlay";

  // Buat Kotak Modal
  const modalBox = document.createElement("div");
  modalBox.className = "custom-modal-box";

  const icon = document.createElement("span");
  icon.className = "material-symbols-outlined custom-modal-icon";
  icon.setAttribute("aria-hidden", "true");
  icon.textContent = namaIkon;

  const titleEl = document.createElement("h2");
  titleEl.className = "custom-modal-title";
  titleEl.textContent = title;

  const msgEl = document.createElement("p");
  msgEl.className = "custom-modal-message";
  msgEl.textContent = message;

  const btnEl = document.createElement("button");
  btnEl.className = "custom-modal-btn";
  btnEl.type = "button";
  btnEl.textContent = "Tutup";

  // Fungsi bantu untuk menutup & menghapus modal dari halaman
  function tutupModal() {
    overlay.remove();
  }

  btnEl.addEventListener("click", tutupModal);

  // Kalau area gelap di luar kotak modal yang diklik, modal juga ikut tertutup.
  // event.target dicek supaya klik di dlm kotak modal (misal klik teks pesan) tidak ikut menutup modal secara tidak sengaja
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) tutupModal();
  });

  // menyusun semua elemen
  modalBox.appendChild(icon);
  modalBox.appendChild(titleEl);
  modalBox.appendChild(msgEl);
  modalBox.appendChild(btnEl);

  // .lalu kotak modal dimasukkan ke dalam overlay (lapisan gelap)
  overlay.appendChild(modalBox);

  // overlay-nya ditempelkan ke <body> supaya modal benar-benar tampil di layar 
  document.body.appendChild(overlay);
}
