# 🏭 Monitoring Gudang Agrikultur

Aplikasi Web Sederhana untuk monitoring stok material di Gudang Induk, Afdeling, dan Pabrik.  
Dibuat dengan **HTML, CSS, JavaScript, Bootstrap, dan AdminLTE** (tanpa backend).  
Data dummy & transaksi disimpan menggunakan **LocalStorage**.

Cocok untuk demo, prototipe, dan deployment cepat di **Vercel**.

---

## 📁 Struktur Folder


📦 root-folder/
│
├── add-materials.html      → Form tambah material
├── index.html              → Dashboard utama
├── list-material.html      → Halaman list stok & list transaksi
├── modal.html              → Optional: template modal
├── navbar.html             → Navbar yang di-load via fetch()
│
├── dummy.js                → Generator data dummy (IN / OUT / USE)
├── style.js                → Script khusus UI / interaksi
├── style.css               → Custom styling
│
└── README.md               → Dokumentasi project


---

## 🚀 Fitur Utama

### 🔹 Dashboard Monitoring
- Statistik cepat: masuk, keluar, pemakaian, top afdeling, top material.
- Card afdeling/pabrik (scroll horizontal).
- Modal detail material.

### 🔹 Manajemen Material
- Tambah material dari halaman `add-materials.html`.
- Validasi input.
- Disimpan otomatis ke localStorage.

### 🔹 List Stok Material
`list-material.html` menampilkan:
- Daftar stok setiap material.
- Perhitungan stok (IN – OUT – USE).
- Warna indikator stok rendah.
- Tombol Export CSV.

### 🔹 Riwayat Transaksi
- Tabel riwayat lengkap: tanggal, kode, qty, jenis transaksi, afdeling, penerima.

---

## 🛠 Teknologi

- **Bootstrap 4.6**
- **AdminLTE 3.2**
- **Vanilla JavaScript**
- **LocalStorage**
- **FontAwesome**

---

## ▶ Cara Menjalankan di Local

1. Clone repository:  
   ```bash
   git clone https://github.com/USERNAME/monitoring-gudang.git
   ```

2. Masuk folder:
   ```bash
   cd monitoring-gudang
   ```

3. Buka file HTML langsung:
   - `index.html` (dashboard)
   - `list-material.html`
   - `add-materials.html`

Tidak perlu server — semua berjalan di browser.