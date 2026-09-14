// penyimpanan feedback ke localstorage
const feedbackKey = "feedbackList";

// Mengambil seluruh daftar feedback yang sudah tersimpan
function getFeedbackList() {
  try {
    const data = localStorage.getItem(feedbackKey);     
    return data ? JSON.parse(data) : [];      
  } catch (error) {
    console.error("Gagal membaca data feedback:", error);
    return [];
  }
}

// Menambahkan satu feedback baru ke daftar yang sudah ada, lalu menyimpan ulang seluruh daftarnya ke localStorage
function simpanFeedback(feedbackBaru) {
  const list = getFeedbackList();   // ngambil daftar feedback yang sudah ada sebelumnya
  list.push(feedbackBaru);
  // Ubah array jadi teks JSON dulu, trus disimpan ke localStorage dengan kunci feedbackKey
  localStorage.setItem(feedbackKey, JSON.stringify(list));
}

// Pola nomor HP Indonesia yang dianggap valid
const phonePattern = /^(0|\+62)8[0-9]{8,11}/;
const phoneInput = document.getElementById("phone");
const phoneError = document.getElementById("phone-error");

phoneInput.addEventListener("input", function () {
  const bersih = phoneInput.value.replace(/[^0-9+]/g, "");
  if (bersih !== phoneInput.value) {
    phoneInput.value = bersih;
  }
  phoneError.textContent = "";
});

// Fungsi bantu: mengecek apakah nomor HP yang diketik user sudah sesuai format.
// Pakai exec supaya bisa ambil match[0], lalu dibandingkan panjangnya dengan string aslinya
function nomorHpValid(nilai) {
  const terima = nilai.trim();
  const match = phonePattern.exec(terima);
  return match !== null && match[0].length === terima.length;
}

// feedback saat di submit
document
  .getElementById("feedback-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();      

    // mencegah submit kalau ada kolom yang masih kosong. Jadi di sini kita tinggal ambil nilai tiap kolomnya
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const phone = phoneInput.value;
    const message = document.getElementById("message").value;

    // validasi format saat mengisi
    if (!nomorHpValid(phone)) {
      phoneError.textContent =
        "Nomor HP tidak valid. Contoh yang benar: 081234567890";
      phoneInput.focus(); // otomatis arahkan fokus balik ke kolom yang salah
      return; 
    }

    // nyusun semua nilai tadi jadi satu objek feedback, ditambah waktu submit-nya (savedAt), sama seperti pola "savedAt" di data favorit
    simpanFeedback({
      name: name,
      email: email,
      phone: phone,
      message: message,
      savedAt: new Date().toISOString(),
    });

    document.getElementById("form-response").textContent =
      "Thank you for your feedback, " + name + "!";
    document.getElementById("feedback-form").reset();
  });