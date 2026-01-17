document.addEventListener('DOMContentLoaded', function() {
    // Menjalankan fungsi hitung setiap ada perubahan input di seluruh dokumen
    document.addEventListener('input', function () {
        hitungSemua();
    });
});

function hitungSemua() {
    const lots = ['A', 'B', 'C', 'D'];
    
    // 1. Perhitungan LOT A s/d D (Total FG = Carload 1 + Carload 2)
    lots.forEach(id => {
        const c1 = parseFloat(document.getElementById(`carload_${id}1`).value) || 0;
        const c2 = parseFloat(document.getElementById(`carload_${id}2`).value) || 0;
        const totalFG = c1 + c2;
        document.getElementById(`total_fg_lot${id}`).value = totalFG;
    });

    // 2. Perhitungan Khusus LOT E
    const c1E = parseFloat(document.getElementById('carload_E1').value) || 0;
    const bLayerE = parseFloat(document.getElementById('bag_per_layer_E').value) || 0;
    const layerE = parseFloat(document.getElementById('jumlah_layer_E').value) || 0;
    const recehanE = parseFloat(document.getElementById('bag_recehan_E').value) || 0;
    
    // Rumus Carload 2 Lot E: (Bag per Layer * Jumlah Layer) + Recehan
    const c2E = (bLayerE * layerE) + recehanE;
    document.getElementById('carload_E2').value = c2E;
    
    // Total FG Lot E
    const totalFGE = c1E + c2E;
    document.getElementById('total_fg_lotE').value = totalFGE;

    // 3. Rangkuman Semua LOT (A, B, C, D, E)
    const allLots = ['A', 'B', 'C', 'D', 'E'];
    
    let sumFG = 0;
    let sumRetain = 0;
    let sumSpesimen = 0;
    let sumSampel = 0;
    let sumIntegrity = 0;
    let sumBagPress = 0;
    let sumReject = 0;

    allLots.forEach(id => {
        sumFG += parseFloat(document.getElementById(`total_fg_lot${id}`).value) || 0;
        sumRetain += parseFloat(document.getElementById(`retain_fb_lot${id}`).value) || 0;
        sumSpesimen += parseFloat(document.getElementById(`spesimen_lot${id}`).value) || 0;
        sumSampel += parseFloat(document.getElementById(`sampel_lot${id}`).value) || 0;
        sumIntegrity += parseFloat(document.getElementById(`integrity_seal_lot${id}`).value) || 0;
        sumBagPress += parseFloat(document.getElementById(`bag_press_lot${id}`).value) || 0;
        sumReject += parseFloat(document.getElementById(`total_reject_lot${id}`).value) || 0;
    });

    // Masukkan hasil ke tabel Rangkuman
    document.getElementById('total_fg_semua_lot').value = sumFG;
    document.getElementById('total_retain_fb_semua_lot').value = sumRetain;
    document.getElementById('total_spesimen_semua_lot').value = sumSpesimen;
    document.getElementById('total_sampel_semua_lot').value = sumSampel;
    document.getElementById('total_integrity_seal_semua_lot').value = sumIntegrity;
    document.getElementById('total_bag_press_semua_lot').value = sumBagPress;
    document.getElementById('total_reject_semua_lot').value = sumReject;
    
    // Total Seluruh FG
    document.getElementById('total_seluruh_fg').value = sumFG;

    // 4. Perhitungan Perbedaan (Total Seluruh FG - Batch Size)
    const batchSize = parseFloat(document.getElementById('jumlah_batch_size').value) || 0;
    const perbedaan = sumFG - batchSize;
    document.getElementById('perbedaan').value = perbedaan;
}

// 5. Fungsi Reset Tabel Spesifik
function resetTable(tableId) {
    const table = document.getElementById(tableId);
    if (!table) return;

    // Ambil semua input di dalam tabel tersebut
    const inputs = table.querySelectorAll('input');
    
    // Konfirmasi sebelum hapus
    if (confirm("Hapus semua data pada " + tableId.replace('table_', 'Tabel ') + "?")) {
        inputs.forEach(input => {
            // Kosongkan input, kecuali yang readonly (karena readonly akan terhitung ulang)
            if (!input.readOnly) {
                input.value = "";
            }
        });
        
        // Hitung ulang semua tabel setelah ada data yang dihapus
        hitungSemua();
    }
}
document.addEventListener('DOMContentLoaded', function() {
    // 1. Menjalankan fungsi hitung setiap ada perubahan input
    document.addEventListener('input', function () {
        hitungSemua();
    });

    // 2. Fitur Smart Backspace
    const inputs = document.querySelectorAll('input[type="number"]:not([readonly])');
    
    inputs.forEach((input, index) => {
        input.addEventListener('keydown', function(e) {
            // Jika butang Backspace ditekan DAN kotak input sedang kosong
            if (e.key === 'Backspace' && this.value === '') {
                // Cari input sebelumnya yang tidak readonly
                if (index > 0) {
                    const prevInput = inputs[index - 1];
                    prevInput.focus();
                }
            }
        });
    });
});

function hitungSemua() {
    const lots = ['A', 'B', 'C', 'D'];
    
    // 1. Perhitungan LOT A s/d D (Total FG = Carload 1 + Carload 2)
    lots.forEach(id => {
        const c1 = parseFloat(document.getElementById(`carload_${id}1`).value) || 0;
        const c2 = parseFloat(document.getElementById(`carload_${id}2`).value) || 0;
        const totalFG = c1 + c2;
        document.getElementById(`total_fg_lot${id}`).value = totalFG;
    });

    // 2. Perhitungan Khusus LOT E
    const c1E = parseFloat(document.getElementById('carload_E1').value) || 0;
    const bLayerE = parseFloat(document.getElementById('bag_per_layer_E').value) || 0;
    const layerE = parseFloat(document.getElementById('jumlah_layer_E').value) || 0;
    const recehanE = parseFloat(document.getElementById('bag_recehan_E').value) || 0;
    
    const c2E = (bLayerE * layerE) + recehanE;
    document.getElementById('carload_E2').value = c2E;
    
    const totalFGE = c1E + c2E;
    document.getElementById('total_fg_lotE').value = totalFGE;

    // 3. Rangkuman Semua LOT (A, B, C, D, E)
    const allLots = ['A', 'B', 'C', 'D', 'E'];
    
    let sumFG = 0, sumRetain = 0, sumSpesimen = 0, sumSampel = 0, 
        sumIntegrity = 0, sumBagPress = 0, sumReject = 0;

    allLots.forEach(id => {
        sumFG += parseFloat(document.getElementById(`total_fg_lot${id}`).value) || 0;
        sumRetain += parseFloat(document.getElementById(`retain_fb_lot${id}`).value) || 0;
        sumSpesimen += parseFloat(document.getElementById(`spesimen_lot${id}`).value) || 0;
        sumSampel += parseFloat(document.getElementById(`sampel_lot${id}`).value) || 0;
        sumIntegrity += parseFloat(document.getElementById(`integrity_seal_lot${id}`).value) || 0;
        sumBagPress += parseFloat(document.getElementById(`bag_press_lot${id}`).value) || 0;
        sumReject += parseFloat(document.getElementById(`total_reject_lot${id}`).value) || 0;
    });

    document.getElementById('total_fg_semua_lot').value = sumFG;
    document.getElementById('total_retain_fb_semua_lot').value = sumRetain;
    document.getElementById('total_spesimen_semua_lot').value = sumSpesimen;
    document.getElementById('total_sampel_semua_lot').value = sumSampel;
    document.getElementById('total_integrity_seal_semua_lot').value = sumIntegrity;
    document.getElementById('total_bag_press_semua_lot').value = sumBagPress;
    document.getElementById('total_reject_semua_lot').value = sumReject;
    document.getElementById('total_seluruh_fg').value = sumFG;

    const batchSize = parseFloat(document.getElementById('jumlah_batch_size').value) || 0;
    document.getElementById('perbedaan').value = sumFG - batchSize;
}

function resetTable(tableId) {
    const table = document.getElementById(tableId);
    if (!table) return;
    const inputs = table.querySelectorAll('input');
    
    if (confirm("Hapus semua data pada " + tableId.replace('table_', 'Tabel ') + "?")) {
        inputs.forEach(input => {
            if (!input.readOnly) {
                input.value = "";
            }
        });
        hitungSemua();
    }
}
document.addEventListener('DOMContentLoaded', function() {
    // 1. Menjalankan fungsi hitung setiap ada perubahan input
    document.addEventListener('input', function () {
        hitungSemua();
    });

    // 2. Fitur Smart Backspace dengan kursor di posisi akhir
    const inputs = document.querySelectorAll('input[type="number"]:not([readonly])');
    
    inputs.forEach((input, index) => {
        input.addEventListener('keydown', function(e) {
            // Jika tombol Backspace ditekan DAN kotak input sedang kosong
            if (e.key === 'Backspace' && this.value === '') {
                // Cari input sebelumnya yang tidak readonly
                if (index > 0) {
                    const prevInput = inputs[index - 1];
                    e.preventDefault(); // Mencegah perilaku default backspace
                    prevInput.focus();
                    
                    // Memastikan kursor berada di akhir teks
                    const val = prevInput.value;
                    prevInput.value = '';
                    prevInput.value = val;
                }
            }
        });
    });
});

function hitungSemua() {
    const lots = ['A', 'B', 'C', 'D'];
    
    // 1. Perhitungan LOT A s/d D (Total FG = Carload 1 + Carload 2)
    lots.forEach(id => {
        const c1 = parseFloat(document.getElementById(`carload_${id}1`).value) || 0;
        const c2 = parseFloat(document.getElementById(`carload_${id}2`).value) || 0;
        const totalFG = c1 + c2;
        document.getElementById(`total_fg_lot${id}`).value = totalFG;
    });

    // 2. Perhitungan Khusus LOT E
    const c1E = parseFloat(document.getElementById('carload_E1').value) || 0;
    const bLayerE = parseFloat(document.getElementById('bag_per_layer_E').value) || 0;
    const layerE = parseFloat(document.getElementById('jumlah_layer_E').value) || 0;
    const recehanE = parseFloat(document.getElementById('bag_recehan_E').value) || 0;
    
    // Rumus Carload 2 Lot E: (Bag per Layer * Jumlah Layer) + Recehan
    const c2E = (bLayerE * layerE) + recehanE;
    document.getElementById('carload_E2').value = c2E;
    
    // Total FG Lot E
    const totalFGE = c1E + c2E;
    document.getElementById('total_fg_lotE').value = totalFGE;

    // 3. Rangkuman Semua LOT (A, B, C, D, E)
    const allLots = ['A', 'B', 'C', 'D', 'E'];
    
    let sumFG = 0;
    let sumRetain = 0;
    let sumSpesimen = 0;
    let sumSampel = 0;
    let sumIntegrity = 0;
    let sumBagPress = 0;
    let sumReject = 0;

    allLots.forEach(id => {
        sumFG += parseFloat(document.getElementById(`total_fg_lot${id}`).value) || 0;
        sumRetain += parseFloat(document.getElementById(`retain_fb_lot${id}`).value) || 0;
        sumSpesimen += parseFloat(document.getElementById(`spesimen_lot${id}`).value) || 0;
        sumSampel += parseFloat(document.getElementById(`sampel_lot${id}`).value) || 0;
        sumIntegrity += parseFloat(document.getElementById(`integrity_seal_lot${id}`).value) || 0;
        sumBagPress += parseFloat(document.getElementById(`bag_press_lot${id}`).value) || 0;
        sumReject += parseFloat(document.getElementById(`total_reject_lot${id}`).value) || 0;
    });

    // Masukkan hasil ke tabel Rangkuman
    document.getElementById('total_fg_semua_lot').value = sumFG;
    document.getElementById('total_retain_fb_semua_lot').value = sumRetain;
    document.getElementById('total_spesimen_semua_lot').value = sumSpesimen;
    document.getElementById('total_sampel_semua_lot').value = sumSampel;
    document.getElementById('total_integrity_seal_semua_lot').value = sumIntegrity;
    document.getElementById('total_bag_press_semua_lot').value = sumBagPress;
    document.getElementById('total_reject_semua_lot').value = sumReject;
    
    // Total Seluruh FG
    document.getElementById('total_seluruh_fg').value = sumFG;

    // 4. Perhitungan Perbedaan (Total Seluruh FG - Batch Size)
    const batchSize = parseFloat(document.getElementById('jumlah_batch_size').value) || 0;
    const perbedaan = sumFG - batchSize;
    document.getElementById('perbedaan').value = perbedaan;
}

// 5. Fungsi Reset Tabel Spesifik
function resetTable(tableId) {
    const table = document.getElementById(tableId);
    if (!table) return;

    // Ambil semua input di dalam tabel tersebut
    const inputs = table.querySelectorAll('input');
    
    // Konfirmasi sebelum hapus
    if (confirm("Hapus semua data pada " + tableId.replace('table_', 'Tabel ') + "?")) {
        inputs.forEach(input => {
            // Kosongkan input, kecuali yang readonly (karena readonly akan terhitung ulang)
            if (!input.readOnly) {
                input.value = "";
            }
        });
        
        // Hitung ulang semua tabel setelah ada data yang dihapus
        hitungSemua();
    }
}