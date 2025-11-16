// Load navbar


// Load Modal
// fetch('modal.html')
//     .then(res => res.text())
//     .then(html => document.getElementById('modal').innerHTML = html);

/*********************
 Master data (fixed)
**********************/
const masterAfdelings = [{
        code: 'F.11.0001.K.25',
        name: 'AFD01 - Beji Timur'
    },
    {
        code: 'F.11.0002.K.25',
        name: 'AFD02 - Dermolo'
    },
    {
        code: 'F.11.0003.K.25',
        name: 'AFD03 - Ngandong'
    },
    {
        code: 'F.11.0004.K.25',
        name: 'AFD04 - Balong Barat'
    },
    {
        code: 'F.11.0005.K.25',
        name: 'AFD05 - Kaliwuluh'
    }, // optional
    {
        code: 'F.11.0006.K.25',
        name: 'AFD06 - Bonolenggi'
    } // optional
];

const masterKegiatan = [
    'Pemupukan',
    'Penanaman',
    'Perawatan TBM',
    'Penyemprotan',
    'Panen',
    'Perbaikan Jalan',
    'Lain-lain'
];

/*********************
 Sample transaksi
 type: 'IN' | 'OUT' | 'USE'
**********************/
let transactions = generateDummyTransactions(500);

let nextId = 8;

/*********************
  UI references
**********************/
const $tb = document.getElementById('tb-transactions');
const $filterAfdeling = document.getElementById('filter-afdeling');
const $filterMaterial = document.getElementById('filter-material');
const $topMaterialList = document.getElementById('top-material-list');
const $afdelingCards = document.getElementById('afdeling-cards');

/*********************
  Populate selects / inits
**********************/
function populateMasters() {
    // afdelings selects
    const selectsAf = document.querySelectorAll('select[name="afdeling"]');
    selectsAf.forEach(s => {
        s.innerHTML = '<option value="">Pilih Afdeling...</option>';
        masterAfdelings.forEach(a => s.innerHTML += `<option value="${a.code}">${a.name}</option>`);
    });

    // kegiatan selects
    const kegiatanSelects = document.querySelectorAll('select[name="item_text"], select[name="kegiatan"]');
    kegiatanSelects.forEach(s => {
        s.innerHTML = '<option value="">Pilih Kegiatan...</option>';
        masterKegiatan.forEach(k => s.innerHTML += `<option value="${k}">${k}</option>`);
    });

    // filter-afdeling
    $filterAfdeling.innerHTML = '<option value="">Semua Afdeling</option>';
    masterAfdelings.forEach(a => $filterAfdeling.innerHTML += `<option value="${a.code}">${a.name}</option>`);
}

/*********************
  Render table
**********************/
function renderTable(filter = {}) {
    $tb.innerHTML = '';
    const rows = transactions
        .filter(t => {
            if (filter.afdeling && t.afdeling !== filter.afdeling) return false;
            if (filter.kode && t.kode !== filter.kode) return false;
            if (filter.from && t.date < filter.from) return false;
            if (filter.to && t.date > filter.to) return false;
            return true;
        })
        .sort((a, b) => b.id - a.id);

    rows.forEach(t => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${t.id}</td>
          <td>${t.date}</td>
          <td class="${t.type === 'IN' ? 'masuk' : ''}">${t.type}</td>
          <td>${t.kode}</td>
          <td>${t.desc}</td>
          <td>${t.qty}</td>
          <td>${t.item_text || '-'}</td>
        `;
        tr.style.cursor = 'pointer';
        tr.addEventListener('click', () => showDetailRow(t));
        $tb.appendChild(tr);
    });

    // fill material filter options (unique)
    const uniques = Array.from(new Set(transactions.map(t => t.kode)));
    $filterMaterial.innerHTML = '<option value="">Semua Material</option>';
    uniques.forEach(k => $filterMaterial.innerHTML += `<option value="${k}">${k}</option>`);
}

function showDetailRow(t) {
    const modalHtml = `
        <div><strong>ID:</strong> ${t.id}</div>
        <div><strong>Tanggal:</strong> ${t.date}</div>
        <div><strong>Tipe:</strong> ${t.type}</div>
        <div><strong>Kode:</strong> ${t.kode}</div>
        <div><strong>Material:</strong> ${t.desc}</div>
        <div><strong>Qty:</strong> ${t.qty}</div>
        <div><strong>Afdeling:</strong> ${t.afdeling || '-'}</div>
        <div><strong>Catatan:</strong> ${t.item_text || '-'}</div>
      `;
    const el = document.createElement('div');
    el.innerHTML = `<div class="modal fade show" style="display:block"><div class="modal-dialog modal-md modal-dialog-centered"><div class="modal-content">
        <div class="modal-header"><h5 class="modal-title">Detail Transaksi</h5><button class="btn-close"></button></div>
        <div class="modal-body">${modalHtml}</div>
        <div class="modal-footer"><button class="btn btn-primary">Tutup</button></div>
      </div></div></div>`;
    document.body.appendChild(el);
    const bs = new bootstrap.Modal(el);
    el.querySelectorAll('.btn-close, .btn-primary').forEach(b => b.addEventListener('click', () => {
        bs.hide();
        el.remove();
    }));
    bs.show();
}

/*********************
  Charts
**********************/
let chartTrend, chartBar;

function initCharts() {
    const ctx = document.getElementById('chart-trend').getContext('2d');
    chartTrend = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                    label: 'Masuk',
                    data: [],
                    tension: 0.25,
                    borderWidth: 2,
                    pointRadius: 3,
                    borderColor: '#1e8f3e',
                    backgroundColor: 'rgba(30,143,62,0.08)'
                },
                {
                    label: 'Penggunaan',
                    data: [],
                    tension: 0.25,
                    borderWidth: 2,
                    pointRadius: 3,
                    borderColor: '#c0392b',
                    backgroundColor: 'rgba(192,57,43,0.06)'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top'
                }
            }
        }
    });

    // const ctx2 = document.getElementById('chart-bar').getContext('2d');
    // chartBar = new Chart(ctx2, {
    //     type: 'bar',
    //     data: {
    //         labels: [],
    //         datasets: [{
    //             label: 'Total Keluar',
    //             data: [],
    //             borderRadius: 6
    //         }]
    //     },
    //     options: {
    //         responsive: true,
    //         maintainAspectRatio: false,
    //         plugins: {
    //             legend: {
    //                 display: false
    //             }
    //         }
    //     }
    // });
}

function updateCharts() {
    // trend: last 6 months
    const last6 = getLastNMonths(6);
    const masuk = last6.map(m => sumByMonthAndType(m, 'IN'));
    const keluar = last6.map(m => sumByMonthAndType(m, 'USE'));
    chartTrend.data.labels = last6;
    chartTrend.data.datasets[0].data = masuk;
    chartTrend.data.datasets[1].data = keluar;
    chartTrend.update();

    // bar per afdeling (OUT totals)
    const distro = {};
    masterAfdelings.forEach(a => distro[a.code] = 0);
    transactions.filter(t => t.type === 'USE').forEach(t => {
        if (t.afdeling) distro[t.afdeling] = (distro[t.afdeling] || 0) + t.qty;
    });
    chartBar.data.labels = masterAfdelings.map(a => a.name);
    chartBar.data.datasets[0].data = masterAfdelings.map(a => distro[a.code] || 0);
    chartBar.update();
}

/*********************
  Stats & top lists
**********************/
function updateStats() {
    const monthStart = (new Date()).toISOString().slice(0, 7);
    const statIn = transactions.filter(t => t.type === 'IN' && t.date.slice(0, 7) === monthStart).reduce((s, x) => s + x.qty, 0);
    const statOut = transactions.filter(t => t.type === 'USE' && t.date.slice(0, 7) === monthStart).reduce((s, x) => s + x.qty, 0);
    const today = (new Date()).toISOString().slice(0, 10);
    const statToday = transactions.filter(t => t.date === today).length;

    document.getElementById('stat-in').innerText = statIn;
    document.getElementById('stat-use').innerText = statOut;
    document.getElementById('stat-today').innerText = statToday;

    // top afdeling
    const byAf = {};
    transactions.filter(t => t.type === 'USE').forEach(t => byAf[t.afdeling] = (byAf[t.afdeling] || 0) + t.qty);
    const topAf = Object.entries(byAf).sort((a, b) => b[1] - a[1])[0];
    document.getElementById('stat-top-afdeling').innerText = topAf ? masterAfdelings.find(x => x.code === topAf[0]) ? name || topAf[0] : '-' : '-';

    // top material name
    const byMat = {};
    transactions.filter(t => t.type === 'USE').forEach(t => byMat[t.desc] = (byMat[t.desc] || 0) + t.qty);
    const topMat = Object.entries(byMat).sort((a, b) => b[1] - a[1])[0];
    document.getElementById('stat-top-material').innerText = topMat ? topMat[0] : '-';

    // top materials list (30 hari)
    const cutoff = dateNDaysAgo(30);
    const byMat30 = {};
    transactions.filter(t => t.date >= cutoff && t.type === 'USE').forEach(t => {
        byMat30[t.desc] = (byMat30[t.desc] || 0) + t.qty;
    });
    const sorted = Object.entries(byMat30).sort((a, b) => b[1] - a[1]).slice(0, 6);
    $topMaterialList.innerHTML = '';
    if (sorted.length === 0) $topMaterialList.innerHTML = '<li class="list-group-item">Belum ada distribusi 30 hari</li>';
    sorted.forEach(([mat, qty]) => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        li.innerHTML = `${mat} <span class="badge bg-success rounded-pill">${qty}</span>`;
        $topMaterialList.appendChild(li);
    });
}

/*********************
  Afdeling preview cards
**********************/
function renderAfdelingCards() {
    $afdelingCards.innerHTML = '';
    masterAfdelings.forEach(a => {
        const received = transactions.filter(t => t.type === 'USE' && t.afdeling === a.code).reduce((s, x) => s + x.qty, 0);
        const used = transactions.filter(t => t.type === 'USE' && t.afdeling === a.code).reduce((s, x) => s + x.qty, 0);
        const stok = received - used;
        const last = transactions.filter(t => t.afdeling === a.code).sort((b, c) => c.id - b.id)[0];
        const lastDate = last ? last.date : '-';
        const col = document.createElement('div');
        col.className = 'mb-2';
        col.innerHTML = `
          <div class="d-flex justify-content-between align-items-center p-2" style="border-radius:8px; background:rgba(240,255,240,0.9);">
            <div>
              <div style="font-weight:700">${a.name}</div>
              <div class="mini">${a.code}</div>
            </div>
            <div class="text-end">
              <div class="mini">Sisa Stok</div>
              <div style="font-weight:700">${stok}</div>
              <div class="mini mt-1">Last: ${lastDate}</div>
              <div class="mt-2">
                <button class="btn btn-sm btn-outline-success me-1" onclick="openPakaiModal('${a.code}')">Catat Pakai</button>
                <button class="btn btn-sm btn-success" onclick="showAfdelingDetail('${a.code}')">Detail</button>
              </div>
            </div>
          </div>
        `;
        $afdelingCards.appendChild(col);
    });
}

function showAfdelingDetail(code) {
    const rows = transactions.filter(t => t.afdeling === code).map(t => `<tr><td>${t.date}</td><td>${t.type}</td><td>${t.kode}</td><td>${t.desc}</td><td>${t.qty}</td><td>${t.item_text || ''}</td></tr>`).join('');
    const html = `<div class="table-responsive"><table class="table"><thead><tr><th>Tanggal</th><th>Tipe</th><th>Kode</th><th>Material</th><th>Qty</th><th>Catatan</th></tr></thead><tbody>${rows}</tbody></table></div>`;
    const el = document.createElement('div');
    el.innerHTML = `<div class="modal fade show" style="display:block"><div class="modal-dialog modal-lg modal-dialog-centered"><div class="modal-content">
        <div class="modal-header"><h5 class="modal-title">Riwayat ${code}</h5><button class="btn-close"></button></div>
        <div class="modal-body">${html}</div>
        <div class="modal-footer"><button class="btn btn-primary">Tutup</button></div>
      </div></div></div>`;
    document.body.appendChild(el);
    const bs = new bootstrap.Modal(el);
    el.querySelectorAll('.btn-close, .btn-primary').forEach(b => b.addEventListener('click', () => {
        bs.hide();
        el.remove();
    }));
    bs.show();
}

/*********************
  Utilities
**********************/
function getLastNMonths(n) {
    const arr = [];
    const now = new Date();
    for (let i = n - 1; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const label = d.toLocaleString('id-ID', {
            month: 'short',
            year: 'numeric'
        });
        arr.push(d.toISOString().slice(0, 7)); // yyyy-mm for data keys
    }
    return arr;
}

function sumByMonthAndType(monthKey, type) {
    // monthKey = 'YYYY-MM'
    return transactions.filter(t => t.date.slice(0, 7) === monthKey && t.type === type).reduce((s, x) => s + x.qty, 0);
}

function dateNDaysAgo(n) {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return d.toISOString().slice(0, 10);
}

/*********************
  Forms & events
**********************/
document.getElementById('apply-filters').addEventListener('click', () => {
    const f = {
        from: document.getElementById('filter-from').value || null,
        to: document.getElementById('filter-to').value || null,
        afdeling: document.getElementById('filter-afdeling').value || null,
        kode: document.getElementById('filter-material').value || null
    };
    renderTable(f);
});
document.getElementById('clear-filters').addEventListener('click', () => {
    document.getElementById('filter-from').value = '';
    document.getElementById('filter-to').value = '';
    document.getElementById('filter-afdeling').value = '';
    document.getElementById('filter-material').value = '';
    renderTable({});
});
document.getElementById('btn-refresh').addEventListener('click', () => {
    rerenderAll();
});

// inbound form
document.getElementById('form-inbound').addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = Object.fromEntries(new FormData(e.target).entries());
    transactions.push({
        id: nextId++,
        date: fd.tanggal,
        type: 'IN',
        kode: fd.kode_material,
        desc: fd.deskripsi,
        qty: Number(fd.qty),
        afdeling: '',
        penerima: '',
        item_text: fd.note || ''
    });
    bootstrap.Modal.getInstance(document.getElementById('modal-inbound')).hide();
    rerenderAll();
});

// outbound form
document.getElementById('form-outbound').addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = Object.fromEntries(new FormData(e.target).entries());
    transactions.push({
        id: nextId++,
        date: fd.tanggal,
        type: 'USE',
        kode: fd.kode_material,
        desc: fd.deskripsi,
        qty: Number(fd.qty),
        afdeling: fd.afdeling,
        penerima: fd.penerima,
        item_text: fd.item_text || ''
    });
    bootstrap.Modal.getInstance(document.getElementById('modal-outbound')).hide();
    rerenderAll();
});

// pemakaian form
document.getElementById('form-pakai').addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = Object.fromEntries(new FormData(e.target).entries());
    transactions.push({
        id: nextId++,
        date: fd.tanggal,
        type: 'USE',
        kode: fd.kode_material,
        desc: fd.kode_material,
        qty: Number(fd.qty),
        afdeling: fd.afdeling,
        penerima: '',
        item_text: fd.kegiatan || ''
    });
    bootstrap.Modal.getInstance(document.getElementById('modal-pakai')).hide();
    rerenderAll();
});

// Mode switch (gdg / afd)
// document.getElementById('mode-gudang').addEventListener('click', () => {
//     document.getElementById('page-title').innerText = 'Dashboard Gudang Induk';
//     document.getElementById('mode-gudang').classList.replace('btn-outline-light', 'btn-light');
//     document.getElementById('mode-afdeling').classList.replace('btn-light', 'btn-outline-light');
// });
// document.getElementById('mode-afdeling').addEventListener('click', () => {
//     document.getElementById('page-title').innerText = 'Dashboard Afdeling';
//     document.getElementById('mode-afdeling').classList.replace('btn-outline-light', 'btn-light');
//     document.getElementById('mode-gudang').classList.replace('btn-light', 'btn-outline-light');
// });

// helper to open pakai modal with preselected afdeling
function openPakaiModal(code) {
    const sel = document.querySelector('#modal-pakai select[name="afdeling"]');
    sel.value = code;
    const modal = new bootstrap.Modal(document.getElementById('modal-pakai'));
    modal.show();
}
window.openPakaiModal = openPakaiModal;
window.showAfdelingDetail = showAfdelingDetail;

/*********************
  Render all
**********************/
function rerenderAll() {
    populateMasters();
    renderTable({});
    updateCharts();
    updateStats();
    renderAfdelingCards();
}

// initial
(function init() {
    populateMasters();
    initCharts();
    rerenderAll();
})();

// Dummy Data Contoh
const sampleData = {
    "Afdeling 1": [{
            kode: "40006686",
            nama: "AMONIA LIQUIDA 20%",
            stok: 80,
            unit: "L"
        },
        {
            kode: "40005992",
            nama: "TALCUM POWDER",
            stok: 50,
            unit: "Kg"
        },
        {
            kode: "40006621",
            nama: "FERTILIZER",
            stok: 40,
            unit: "Kg"
        }
    ],
    "Pabrik 1": [{
            kode: "49002811",
            nama: "TURPENTINE LAWS-2",
            stok: 120,
            unit: "L"
        },
        {
            kode: "49002822",
            nama: "FUELWOOD",
            stok: 88,
            unit: "Batang"
        }
    ]
};

function openDetail(unitName) {
    document.getElementById("modalTitle").innerText = `Detail Material – ${unitName}`;

    let tbody = document.getElementById("modalTableBody");
    tbody.innerHTML = ""; // clear

    if (sampleData[unitName]) {
        sampleData[unitName].forEach(item => {
            tbody.innerHTML += `
                    <tr>
                        <td>${item.kode}</td>
                        <td>${item.nama}</td>
                        <td>${item.stok}</td>
                        <td>${item.unit}</td>
                    </tr>`;
        });
    }

    new bootstrap.Modal(document.getElementById('modalDetail')).show();
}