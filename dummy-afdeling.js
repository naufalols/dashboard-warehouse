function generateDummyTransactions(count = 300) {
    const materials = [{
            kode: '40006686',
            desc: 'AMONIA LIQUIDA 20%',
            item_text: 'Pemupukan'
        },
        {
            kode: '40005992',
            desc: 'TALCUM POWDER',
            item_text: 'Perawatan TBM'
        },
        {
            kode: '40001234',
            desc: 'UREA PRILL',
            item_text: 'Pemupukan'
        },
        {
            kode: '40007890',
            desc: 'KAPUR DOLOMIT',
            item_text: 'Perawatan Tanah'
        },
        {
            kode: '40004567',
            desc: 'HERBISIDA GRAMOXONE',
            item_text: 'Pengendalian Gulma'
        }
    ];

    const afdelingList = [
        'F.11.0001.K.25', 'F.11.0002.K.25', 'F.11.0003.K.25',
        'F.11.0004.K.25', 'F.11.0005.K.25', 'F.11.0006.K.25',
        'F.11.0007.K.25', 'F.11.0008.K.25', 'F.11.0009.K.25'
    ];

    const penerimaList = ['Cucun Sugiarto', 'Darmolo', 'Operator A', 'Operator B', 'Operator C', 'Mandor A', 'Mandor B'];

    // Stok sementara untuk mencegah minus
    const stock = {};
    materials.forEach(m => stock[m.kode] = 0);

    const transactions = [];

    for (let i = 1; i <= count; i++) {
        const material = materials[Math.floor(Math.random() * materials.length)];

        // Tentukan tanggal random 2025
        const date = `2025-${String(Math.ceil(Math.random() * 12)).padStart(2, '0')}-${String(Math.ceil(Math.random() * 28)).padStart(2, '0')}`;

        // Generate qty 20–500
        let qty = Math.floor(Math.random() * 500) + 20;

        // Tentukan jenis transaksi
        let type = ['IN', 'USE'][Math.floor(Math.random() * 3)];

        // Jika stok tidak cukup → paksa jadi IN
        if (type !== 'IN' && stock[material.kode] < qty) {
            type = 'IN';
        }

        // Update stok
        if (type === 'IN') {
            stock[material.kode] += qty;
        } else {
            stock[material.kode] -= qty; // dijamin tidak minus
        }

        transactions.push({
            id: i,
            date: date,
            type: type,
            kode: material.kode,
            desc: material.desc,
            qty: qty,
            afdeling: type === 'IN' ? '' : afdelingList[Math.floor(Math.random() * afdelingList.length)],
            penerima: type === 'IN' ? '' : penerimaList[Math.floor(Math.random() * penerimaList.length)],
            item_text: type === 'IN' ? 'Penerimaan' : material.item_text
        });
    }

    return transactions;
}

function getMaterialInByDate(transactions) {
    const result = {};

    transactions
        .filter(t => t.type === 'IN')
        .forEach(t => {
            if (!result[t.date]) {
                result[t.date] = [];
            }
            result[t.date].push({
                kode: t.kode,
                desc: t.desc,
                qty: t.qty,
                item_text: t.item_text
            });
        });

    return result;
}

