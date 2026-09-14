// ========================= ELEMEN DOM ==================================
// Elemen <div> utama tempat semua tampilan (kategori/daftar/detail) digambar ulang
const ddContent = document.getElementById("dd-content");
// Elemen <input> tempat user mengetik kata kunci pencarian
const searchInput = document.getElementById("search-input");
// Elemen wadah (biasanya <div>) yang membungkus tombol tab "Doa" dan "Wirid"
const ddTabs = document.getElementById("dd-tabs");

// ========================= VARIABEL GLOBAL ======================
// data yang disimpan sementara di memori browser selama halaman terbuka, dan bisa berubah-ubah seiring interaksi user.
let dataDoa = []; 
let dataDzikir = [];  
let tabAktif = "doa"; 
const kataKunciDzikir = ["dzikir", "zikir", "wirid", "tasbih"];

/* menentukan dzikir atau bukan, berdasarkan isi field grup, judul, dan tag.
   Dipakai untuk memisahkan data mentah API menjadi 2 kelompok besar, dataDoa vs dataDzikir.*/
function termasukDzikir(doa) {
  const grup = (doa.grup || "").toLowerCase();
  const judul = (doa.judul || "").toLowerCase();
  const tagGabungan = (doa.tag || []).join(" ").toLowerCase();

  // ngecek apakah ada minimal satu kata kunci dzikir yang nyangkut di salah satu dari grup, judul, atau tagGabungan
  return kataKunciDzikir.some(
    (kw) => grup.includes(kw) || judul.includes(kw) || tagGabungan.includes(kw)
  );
}

/* Mengambil (fetch) seluruh data doa/dzikir dari API publik eQuran.id*/
function getDataFromAPI() {
  const apiUrl = "https://equran.id/api/doa";   
  return fetch(apiUrl)   
    .then((response) => response.json())
    .then((res) => {       
      const rawList = Array.isArray(res) ? res : (res.data || []);  
      const semuaItem = rawList.map(normalizeDoaItem);        

      // ngosongin dataDoa & dataDzikir, lalu loop semuaItem, setiap item langsung dimasukkan ke kelompok yang sesuai
      dataDoa = [];
      dataDzikir = [];
      semuaItem.forEach((item) => {
        if (termasukDzikir(item)) {
          dataDzikir.push(item);
        } else {
          dataDoa.push(item);
        }
      });
    })
    .catch((error) => {     // nyari error di sepanjang rantai .then() di atas
      console.error("Gagal mengambil data doa/dzikir:", error);
      dataDoa = [];
      dataDzikir = [];
    });
}

/* Fungsi kecil bantu yang mengembalikan array data mana yang harus dipakai, tergantung tab apa yang sedang aktif dibuka user.*/
function dataTabAktif() {
  return tabAktif === "dzikir" ? dataDzikir : dataDoa;
}

// ========================= GRID KATEGORI hal1=======================
/* Menampilkan tampilan paling awwal yang dilihat user saat membuka tab doadzikir kotak-kotak kategori beserta jumlah bacaan */
function tampilkanKategori() {
  ddContent.replaceChildren();    
  const list = dataTabAktif();   

  // kalau datanya kosong, tampilkan pesan kosong lalu hentikan fungsi
  if (list.length === 0) {
    const empty = document.createElement("p");          
    empty.className = "empty-message";                    
    empty.textContent = "Data tidak ditemukan.";           
    ddContent.appendChild(empty);                          
    return;                                               
  }

  // kelompokkan item berdasarkan grup, sambil menghitung jumlahnya
  // Map = struktur data mirip objek {key: value}, tapi lebih fleksibel untuk dipakai sebagai penghitung
  const petaKategori = new Map();
  list.forEach((item) => {
    const namaGrup = item.grup || "Lainnya";      

    // Kalau nama grup ini belum pernah dicatat di Map, mulai hitungannya dari 0
    if (!petaKategori.has(namaGrup)) {
      petaKategori.set(namaGrup, 0);
    }

    // nambah hitungan grup ini sebanyak 1 (karena ketemu 1 item lagi)
    petaKategori.set(namaGrup, petaKategori.get(namaGrup) + 1);
  });

  // nyiapin wadah <div> grid untuk menampung semua kartu kategori
  const grid = document.createElement("div");
  grid.className = "dd-kategori-grid";

  // loop semua kategori di dalam Map, sambil memberi nomor urut
  let nomor = 1;                                  
  petaKategori.forEach((jumlah, namaGrup) => {
    const card = buatKartuKategori(nomor, namaGrup, jumlah);   // bikin 1 kartu
    grid.appendChild(card);                                    // tempel ke grid
    nomor++;                                                   // naikkan nomor untuk kartu berikutnya
  });

  ddContent.appendChild(grid);    
}

/* Membuat 1 kartu kategori (kotak kecil) yang berisi nomor urut, nama kategori, dan jumlah bacaan di kategori tersebut*/
function buatKartuKategori(nomor, namaGrup, jumlah) {
  // elemen pembungkus utama kartu
  const card = document.createElement("div");
  card.className = "dd-kategori-card";

  // badge nomor urut kategori (misal "1", "2", dst)
  const badgeNomor = document.createElement("div");
  badgeNomor.className = "dd-kategori-nomor";
  badgeNomor.textContent = nomor;
  card.appendChild(badgeNomor);

  // wadah vertikal untuk nama kategori + jumlah bacaan
  const teks = document.createElement("div");
  teks.className = "dd-kategori-teks";

  // nama kategori, misalnya "Doa Harian"
  const judul = document.createElement("span");
  judul.className = "dd-kategori-judul";
  judul.textContent = namaGrup;
  teks.appendChild(judul);

  // teks kecil di bawah nama kategori, menunjukkan jumlah bacaan
  const sub = document.createElement("span");
  sub.className = "dd-kategori-jumlah";
  sub.textContent = jumlah + " Bacaan";
  teks.appendChild(sub);

  // tempelkan wadah teks (judul + jumlah) ke dalam kartu
  card.appendChild(teks);

  // saat kartu ini diklik, pindah ke hal2 ke kategori doa berikutnya
  card.addEventListener("click", () => tampilkanDaftarItem(namaGrup));

  // mengembalikan elemen kartu yang sudah jadi, siap ditempel ke grid
  return card;
}

/* Membuat tombol "Kembali" yang dipakai bersama di hal2 dan hal3*/
function buatTombolKembali(label, onClick) {
  // wadah pembungkus tombol
  const backWrapper = document.createElement("div");
  backWrapper.className = "dd-back-btn-wrapper";

  // elemen tombolnya
  const backButton = document.createElement("button");
  backButton.className = "dd-back-btn";

  // ikon panah kembali 
  const iconKembali = document.createElement("span");
  iconKembali.className = "material-symbols-outlined";
  iconKembali.setAttribute("aria-hidden", "true");  
  iconKembali.textContent = "arrow_back";           

  // tempelkan ikon ke dalam tombol
  backButton.appendChild(iconKembali);

  // nambah teks label setelah ikon (createTextNode = buat teks polos, bukan elemen HTML)
  backButton.appendChild(document.createTextNode(" " + label));

  // buat aksi klik sesuai fungsi yang dikirim lewat parameter onClick
  backButton.addEventListener("click", onClick);

  // tempelkan tombol ke wadah pembungkusnya
  backWrapper.appendChild(backButton);

  // mengembalikan elemen wadah, siap ditempel ke halaman oleh pemanggil
  return backWrapper;
}

// ========================= GRID ITEM DALAM SATU KATEGORI hal2 =======
/* Menampilkan daftar judul-judul doa/dzikir yang ada di dlm satu kategori tertentu. Tampilan ini muncul setelah user mengklik salah satu kartu kategori di hal1.*/
function tampilkanDaftarItem(namaGrup) {
  // ngosongin wadah utama
  ddContent.replaceChildren();

  // tombol kembali ke hal1
  ddContent.appendChild(buatTombolKembali("Kembali ke Kategori", tampilkanKategori));

  // ambil data tab aktif, saring hanya yang grup-nya sesuai kategori terpilih
  const list = dataTabAktif().filter((item) => (item.grup || "Lainnya") === namaGrup);

  // buat grid kartu judul dari list tadi, tempelkan ke halaman
  ddContent.appendChild(buatGridItem(list));

  // scroll halaman ke atas dengan animasi halus
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* Membuat grid berisi kartu-kartu kecil (hanya judulnya saja) dari sebuah array item */
function buatGridItem(list) {
  // wadah grid
  const grid = document.createElement("div");
  grid.className = "grid-view";

  // kalau daftarnya kosong, tampilkan pesan kosong & langsung selesai
  if (list.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-message";
    empty.textContent = "Tidak ada doa/dzikir yang cocok.";
    grid.appendChild(empty);
    return grid;   // kembalikan grid (isinya cuma pesan kosong) lebih awal
  }

  // loop tiap item, buat 1 kartu kecil berisi judul aja
  list.forEach((item) => {
    // elemen pembungkus kartu
    const card = document.createElement("div");
    card.className = "dd-item-card";

    // elemen judul di dalam kartu
    const title = document.createElement("h3");
    title.className = "dd-item-title";
    title.textContent = item.judul;

    // tempelkan judul ke kartu
    card.appendChild(title);

    // saat kartu diklik, pindah ke LEVEL 3 (tampilkan detail lengkap item ini)
    card.addEventListener("click", () => tampilkanDetail(item));

    // tempelkan kartu yang sudah jadi ke dalam grid
    grid.appendChild(card);
  });

  // ngembaliin grid yang sudah lengkap berisi semua kartu
  return grid;
}

// ========================= DETAIL SATU DOA/DZIKIR hal3 ==============
/* Menampilkan isi lengkap dari satu doa/dzikir yang dipilih user */
function tampilkanDetail(item) {
  // kosongin wadah utama
  ddContent.replaceChildren();

  // tombol kembali, balik ke hal2 (daftar item) kategori yang sama Kalau item.grup kosong, dianggap "Lainnya" 
  ddContent.appendChild(
    buatTombolKembali("Kembali", () => tampilkanDaftarItem(item.grup || "Lainnya"))
  );

  // wadah pembungkus kartu detail
  const wrapper = document.createElement("div");
  wrapper.className = "dd-detail-wrapper";

  // buat isi kartu detail lengkapnya
  const kartuDetail = buatKartuDetail(item);

  // tempelkan kartu detail ke wrapper, lalu wrapper ke halaman utama
  wrapper.appendChild(kartuDetail);
  ddContent.appendChild(wrapper);

  // scroll ke atas halaman dengan animasi halus
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* Membangun elemen kartu berisi detail LENGKAP satu doa/dzikir*/
function buatKartuDetail(item) {
  // pembungkus utama kartu detail
  const kotak = document.createElement("div");
  kotak.className = "container";

  // judul doa/dzikirnya
  const judul = document.createElement("h3");
  judul.textContent = item.judul;
  kotak.appendChild(judul);

  // badge kategori, hanya nampil kalau item.grup ada isinya
  if (item.grup) {
    const badge = document.createElement("span");
    badge.className = "grup-badge";
    badge.textContent = item.grup;
    kotak.appendChild(badge);
  }

  // teks Arab, hanya nampil kalau item.arab ada isinya
  if (item.arab) {
    const arab = document.createElement("p");
    arab.className = "arabic-text";
    arab.setAttribute("lang", "ar");   
    arab.setAttribute("dir", "rtl");   
    arab.textContent = item.arab;
    kotak.appendChild(arab);
  }

  // terjemahan/arti sll ada elemen ini (tanpa if), isinya
  const arti = document.createElement("p");
  arti.className = "arti-text";
  arti.textContent = item.terjemah ? "Artinya: " + item.terjemah : "Artinya: (terjemahan belum tersedia dari sumber data)";             
  kotak.appendChild(arti);

  // sumber/referensi, hanya nampil kalau item.sumber ada isinya
  if (item.sumber) {
    const sumber = document.createElement("p");
    sumber.className = "sumber-text";
    sumber.textContent = "Sumber: " + item.sumber;
    kotak.appendChild(sumber);
  }

  // baris aksi, berisi ikon favorit 
  const actionRow = document.createElement("div");
  actionRow.className = "copy-send-container";
  actionRow.appendChild(buatIkonFavoritItem(item));

  // nempelkan baris aksi ke kartu
  kotak.appendChild(actionRow);

  // kembalikan kartu yang sudah lengkap
  return kotak;
}

/* Membuat ikon hati (favorit) yang bisa diklik untuk menambah/menghapus sebuah item dari daftar favorit*/
function buatIkonFavoritItem(item) {
  const sudahFavorit = isFavorit(item.id);
  const icon = document.createElement("span");

  // class ikon berubah tergantung status favorit ("active" ditambahkan kalau sudah favorit)
  icon.className = "material-symbols-outlined icon-favorit" + (sudahFavorit ? " active" : "");
  // sembunyikan dari screen reader
  icon.setAttribute("aria-hidden", "true");
  // ikon hati penuh kalau sudah favorit, hati kosong kalau belum
  icon.textContent = sudahFavorit ? "favorite" : "favorite_border";
  // tooltip yang muncul saat ikon di-hover mouse
  icon.setAttribute("title", "Simpan ke Favorit");
  // aksi saat ikon hati ini diklik user
  icon.addEventListener("click", () => {
    const ditambahkan = toggleFavorit(item);

    icon.textContent = ditambahkan ? "favorite" : "favorite_border";
    icon.classList.toggle("active", ditambahkan);

    // nampilin notifikasi pop-up ke user
    showCustomAlert(
      ditambahkan ? "Ditambahkan!" : "Dihapus!",
      ditambahkan
        ? "\"" + item.judul + "\" berhasil disimpan ke Favorit."
        : "\"" + item.judul + "\" dihapus dari Favorit.",
      ditambahkan ? "favorite" : "favorite_border"
    );
  });

  return icon;
}

// ========================= PENCARIAN =====================================
/* Dijalankan setiap kali user mengetik di kolom pencarian. Kalau kolom
   pencarian TIDAK kosong, tampilan berpindah ke grid hasil search pada tab yang sedang aktif */
function terapkanPencarian() {
  // ambil teks pencarian, bersihkan spasi, samakan ke huruf kecil
  const kataKunci = searchInput.value.trim().toLowerCase();

  if (!kataKunci) {
    tampilkanKategori();
    return;   
  }

  // cari semua item (dari tab aktif, lintas kategori) yang judulnya mengandung kata kunci pencarian
  const hasil = dataTabAktif().filter((item) =>
    item.judul.toLowerCase().includes(kataKunci)
  );

  // kosongkan wadah utama sebelum menampilkan hasil baru
  ddContent.replaceChildren();

  // tampilkan judul kecil "Hasil pencarian untuk ..." di atas grid hasil
  const judulHasil = document.createElement("p");
  judulHasil.className = "empty-message";
  judulHasil.style.padding = "20px 20px 0";
  judulHasil.style.opacity = "0.85";
  // dipakai searchInput.value (bukan kataKunci) supaya huruf besar/kecil yang diketik user tetap tampil apa adanya di label ini
  judulHasil.textContent = "Hasil pencarian untuk \"" + searchInput.value + "\":";
  ddContent.appendChild(judulHasil);

  // tampilkan grid hasil pencarian 
  ddContent.appendChild(buatGridItem(hasil));
}

searchInput.addEventListener("input", terapkanPencarian);

// ========================= TAB "Doa" / "Dzikir" ===========================
/* Menangani perpindahan antara tab "Doa" dan tab "Dzikir".*/
ddTabs.addEventListener("click", (event) => {
  // cari tombol tab terdekat dari titik yang diklik
  const tombol = event.target.closest(".dd-tab");

  if (!tombol) return;
  ddTabs.querySelectorAll(".dd-tab").forEach((btn) => btn.classList.remove("active"));
  tombol.classList.add("active");
  tabAktif = tombol.dataset.tab;
  searchInput.value = "";

  tampilkanKategori();
});

// ngambil elemen tombol scroll-to-top dari HTML
const scrollToTopButton = document.getElementById("scroll-to-top");

// Saat tombol ini diklik, scroll halaman ke posisi paling atas (top: 0) dengan animasi halus (behavior: "smooth")
scrollToTopButton.addEventListener("click", () =>
  window.scrollTo({ top: 0, behavior: "smooth" })
);

// Setiap kali halaman di-scroll, cek posisi scroll saat ini. kalau sudah lebih dari 300px dari atas, tambahkan class "show" ke
// tombol, kalau belum, class "show" dihapus classList.toggle(class, kondisi) otomatis menambah/menghapus class sesuai nilai dari kondisi tersebut
window.addEventListener("scroll", () => {
  scrollToTopButton.classList.toggle("show", window.scrollY > 300);
});

/* Fungsi ini adalahtitik awal point dari seluruh file — yang pertama kali dijalankan saat file JS ini dimuat oleh browser */
function init() {
  getDataFromAPI().then(() => {     
    tampilkanKategori();        
  });
}

init();