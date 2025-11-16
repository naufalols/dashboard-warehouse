# 🏭 Monitoring Gudang Agrikultur

Aplikasi Web Sederhana untuk monitoring stok material di Gudang Induk, Afdeling, dan Pabrik.  
Dibuat dengan **HTML, CSS, JavaScript, Bootstrap, dan AdminLTE** (tanpa backend).  
Data dummy & transaksi disimpan menggunakan **LocalStorage**.

Cocok untuk demo, prototipe, dan deployment cepat di **Vercel**.

---

## 📁 Struktur Folder

```
monitoring-gudang/
├── index.html              # Dashboard utama
├── add-materials.html      # Form tambah material
├── list-material.html      # Halaman list stok & transaksi
├── modal.html              # Template modal
├── navbar.html             # Navbar (dimuat via fetch)
├── README.md               # Dokumentasi project
├── css/
│   ├── style.css           # Custom styling
│   └── style-afdeling.css  # Styling khusus Afdeling
├── js/
│   ├── dummy.js            # Generator data dummy (IN/OUT/USE)
│   ├── dummy-afdeling.js   # Generator data dummy Afdeling
│   ├── style.js            # Script UI & interaksi
│   ├── style-afdeling.js   # Script UI Afdeling
│   └── use-materials-afdeling.js  # Fungsi penggunaan material Afdeling
├── index-afdeling.html     # Dashboard Afdeling
├── list-material-afdeling.html  # Daftar material Afdeling
├── navbar-afdeling.html    # Navbar Afdeling
└── use-materials-afdeling.html  # Form penggunaan material Afdeling
```
