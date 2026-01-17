document.addEventListener('DOMContentLoaded', function() {
    document.addEventListener('input', hitungSemua);

    // Navigasi Backspace Otomatis
    const inputs = document.querySelectorAll('input[type="number"]:not([readonly])');
    inputs.forEach((input, index) => {
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Backspace' && this.value === '') {
                if (index > 0) {
                    const prevInput = inputs[index - 1];
                    e.preventDefault();
                    prevInput.focus();
                }
            }
        });
    });
});

function resetTable(tableId) {
    const table = document.getElementById(tableId);
    if (table) {
        table.querySelectorAll('input').forEach(input => input.value = '');
        hitungSemua();
    }
}

function hitungSemua() {
    const lots = ['A', 'B', 'C', 'D', 'E'];
    const factor = 0.142;

    // --- 1. PERHITUNGAN LOT A s/d D ---
    ['A', 'B', 'C', 'D'].forEach(id => {
        const c1 = parseFloat(document.getElementById(`carload_${id}1`).value) || 0;
        const c2 = parseFloat(document.getElementById(`carload_${id}2`).value) || 0;
        document.getElementById(`total_fg_lot${id}`).value = c1 + c2;
    });

    // --- 2. PERHITUNGAN LOT E ---
    const c1E = parseFloat(document.getElementById('carload_E1').value) || 0;
    const bLayerE = parseFloat(document.getElementById('bag_per_layer_E').value) || 0;
    const layerE = parseFloat(document.getElementById('jumlah_layer_E').value) || 0;
    const recehanE = parseFloat(document.getElementById('bag_recehan_E').value) || 0;
    const c2E = (bLayerE * layerE) + recehanE;
    document.getElementById('carload_E2').value = c2E;
    document.getElementById('total_fg_lotE').value = c1E + c2E;

    // --- 3. RANGKUMAN SEMUA LOT ---
    let sumFG = 0, sumRetain = 0, sumSpesimen = 0, sumSampel = 0, sumIntegrity = 0, sumBagPress = 0, sumReject = 0;
    lots.forEach(id => {
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
    document.getElementById('perbedaan').value = sumFG - (parseFloat(document.getElementById('jumlah_batch_size').value) || 0);

    // --- 4. REKONSILIASI MATERIAL ---
    const vP = {
        fg: parseFloat(document.getElementById('jumlah_allfg_port').value) || 0,
        s: parseFloat(document.getElementById('jumlah_sampel_port').value) || 0,
        sp: parseFloat(document.getElementById('jumlah_spesimen_port').value) || 0,
        pr: parseFloat(document.getElementById('total_rejectpr_port').value) || 0,
        bk: parseFloat(document.getElementById('total_rejectbk_port').value) || 0
    };

    // Konversi Port ke Film (0.142)
    document.getElementById('jumlah_allFG_film').value = (vP.fg * factor).toFixed(3);
    document.getElementById('jumlah_sampel_film').value = (vP.s * factor).toFixed(3);
    document.getElementById('jumlah_spesimen_film').value = (vP.sp * factor).toFixed(3);
    document.getElementById('total_rejectpr_film').value = (vP.pr * factor).toFixed(3);
    document.getElementById('total_rejectbk_film').value = (vP.bk * factor).toFixed(3);

    // Sisa Teoritis
    ['film', 'port', 'cap'].forEach(t => {
        const std = parseFloat(document.getElementById(`jumlah_standar_${t}`).value) || 0;
        const fg = parseFloat(document.getElementById(t === 'film' ? `jumlah_allFG_${t}` : `jumlah_allfg_${t}`).value) || 0;
        const s = parseFloat(document.getElementById(`jumlah_sampel_${t}`).value) || 0;
        const sp = parseFloat(document.getElementById(`jumlah_spesimen_${t}`).value) || 0;
        const pr = parseFloat(document.getElementById(`total_rejectpr_${t}`).value) || 0;
        const bk = parseFloat(document.getElementById(`total_rejectbk_${t}`).value) || 0;
        const ll = parseFloat(document.getElementById(`total_rejectll_${t}`).value) || 0;
        const fkm = parseFloat(document.getElementById(`fkm_${t}`).value) || 0;
        const akt = parseFloat(document.getElementById(`sisa_aktual_${t}`).value) || 0;

        const teoritis = fkm + std - (fg + s + sp + pr + bk + ll);
        document.getElementById(`sisa_teoritis_${t}`).value = teoritis.toFixed(t === 'film' ? 3 : 0);
        document.getElementById(`selisih_${t}`).value = (teoritis - akt).toFixed(t === 'film' ? 3 : 0);
    });

    // --- 5. BERITA ACARA PEMUSNAHAN ---
    lots.forEach(lot => {
        const ipcFillPort = parseFloat(document.getElementById(`total_reject_lot${lot}`).value) || 0;
        const lainyaPort = parseFloat(document.getElementById(`reject_lainya_lot${lot}_port`).value) || 0;
        
        // Update Port Side
        document.getElementById(`reject_ipc_filling_lot${lot}_reject_port`).value = ipcFillPort;
        const totalPortLot = ipcFillPort + lainyaPort;
        document.getElementById(`reject_total_lot${lot}_port`).value = totalPortLot;

        // Update Film Side (Konversi Otomatis)
        const ipcFillFilm = ipcFillPort * factor;
        const lainyaFilm = lainyaPort * factor;
        document.getElementById(`reject_ipc_filling_lot${lot}_reject_fb`).value = ipcFillFilm.toFixed(3);
        document.getElementById(`reject_lainya_lot${lot}_fb_film`).value = lainyaFilm.toFixed(3);
        document.getElementById(`reject_total_lot${lot}_fb_film`).value = (ipcFillFilm + lainyaFilm).toFixed(3);
    });

    // Total Horizontal Berita Acara
    let totalBaPort = 0, totalBaFilm = 0;
    lots.forEach(lot => {
        totalBaPort += parseFloat(document.getElementById(`reject_total_lot${lot}_port`).value) || 0;
        totalBaFilm += parseFloat(document.getElementById(`reject_total_lot${lot}_fb_film`).value) || 0;
    });
    document.getElementById('reject_total_port').value = totalBaPort;
    document.getElementById('reject_total_fb_film').value = totalBaFilm.toFixed(3);

    // Selisih Akhir Berita Acara
    const prbkllPort = (parseFloat(vP.pr) + parseFloat(vP.bk) + (parseFloat(document.getElementById('total_rejectll_port').value) || 0));
    document.getElementById('reject_prbkll_port').value = prbkllPort;
    document.getElementById('selisih_port').value = totalBaPort - prbkllPort;

    const prbkllFilm = (parseFloat(document.getElementById('total_rejectpr_film').value) || 0) + 
                       (parseFloat(document.getElementById('total_rejectbk_film').value) || 0) + 
                       (parseFloat(document.getElementById('total_rejectll_film').value) || 0);
    document.getElementById('reject_prbkll_fb_film').value = prbkllFilm.toFixed(3);
    document.getElementById('selisih_fb_film').value = (totalBaFilm - prbkllFilm).toFixed(3);
}
