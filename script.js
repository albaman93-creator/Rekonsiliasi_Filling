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
    const factor = 0.142; // Konversi Port ke Film

    // =========================================
    // 1. PERHITUNGAN LOT A s/d D
    // =========================================
    ['A', 'B', 'C', 'D'].forEach(id => {
        const c1 = parseFloat(document.getElementById(`carload_${id}1`)?.value) || 0;
        const c2 = parseFloat(document.getElementById(`carload_${id}2`)?.value) || 0;
        const total = c1 + c2;
        if(document.getElementById(`total_fg_lot${id}`)) {
            document.getElementById(`total_fg_lot${id}`).value = total;
        }
    });

    // =========================================
    // 2. PERHITUNGAN LOT E
    // =========================================
    const c1E = parseFloat(document.getElementById('carload_E1')?.value) || 0;
    const bLayerE = parseFloat(document.getElementById('bag_per_layer_E')?.value) || 0;
    const layerE = parseFloat(document.getElementById('jumlah_layer_E')?.value) || 0;
    const recehanE = parseFloat(document.getElementById('bag_recehan_E')?.value) || 0;
    const c2E = (bLayerE * layerE) + recehanE;
    
    if(document.getElementById('carload_E2')) document.getElementById('carload_E2').value = c2E;
    if(document.getElementById('total_fg_lotE')) document.getElementById('total_fg_lotE').value = c1E + c2E;

    // =========================================
    // 3. RANGKUMAN SEMUA LOT
    // =========================================
    let sumFG = 0, sumRetain = 0, sumSpesimen = 0, sumSampel = 0, sumIntegrity = 0, sumBagPress = 0, sumReject = 0;
    lots.forEach(id => {
        sumFG += parseFloat(document.getElementById(`total_fg_lot${id}`)?.value) || 0;
        sumRetain += parseFloat(document.getElementById(`retain_fb_lot${id}`)?.value) || 0;
        sumSpesimen += parseFloat(document.getElementById(`spesimen_lot${id}`)?.value) || 0;
        sumSampel += parseFloat(document.getElementById(`sampel_lot${id}`)?.value) || 0;
        sumIntegrity += parseFloat(document.getElementById(`integrity_seal_lot${id}`)?.value) || 0;
        sumBagPress += parseFloat(document.getElementById(`bag_press_lot${id}`)?.value) || 0;
        sumReject += parseFloat(document.getElementById(`total_reject_lot${id}`)?.value) || 0;
    });

    setVal('total_fg_semua_lot', sumFG);
    setVal('total_retain_fb_semua_lot', sumRetain);
    setVal('total_spesimen_semua_lot', sumSpesimen);
    setVal('total_sampel_semua_lot', sumSampel);
    setVal('total_integrity_seal_semua_lot', sumIntegrity);
    setVal('total_bag_press_semua_lot', sumBagPress);
    setVal('total_reject_semua_lot', sumReject);
    setVal('total_seluruh_fg', sumFG);
    
    const batchSize = parseFloat(document.getElementById('jumlah_batch_size')?.value) || 0;
    setVal('perbedaan', sumFG - batchSize);

    // =========================================
    // 4. REKONSILIASI MATERIAL (TABEL ATAS)
    // =========================================
    const vP = {
        fg: parseFloat(document.getElementById('jumlah_allfg_port')?.value) || 0,
        s: parseFloat(document.getElementById('jumlah_sampel_port')?.value) || 0,
        sp: parseFloat(document.getElementById('jumlah_spesimen_port')?.value) || 0,
        pr: parseFloat(document.getElementById('total_rejectpr_port')?.value) || 0,
        bk: parseFloat(document.getElementById('total_rejectbk_port')?.value) || 0
    };

    setVal('jumlah_allFG_film', (vP.fg * factor).toFixed(3));
    setVal('jumlah_sampel_film', (vP.s * factor).toFixed(3));
    setVal('jumlah_spesimen_film', (vP.sp * factor).toFixed(3));
    setVal('total_rejectpr_film', (vP.pr * factor).toFixed(3));
    setVal('total_rejectbk_film', (vP.bk * factor).toFixed(3));

    ['film', 'port', 'cap'].forEach(t => {
        const std = parseFloat(document.getElementById(`jumlah_standar_${t}`)?.value) || 0;
        const idFg = t === 'film' ? `jumlah_allFG_${t}` : `jumlah_allfg_${t}`;
        const fg = parseFloat(document.getElementById(idFg)?.value) || 0;
        
        const s = parseFloat(document.getElementById(`jumlah_sampel_${t}`)?.value) || 0;
        const sp = parseFloat(document.getElementById(`jumlah_spesimen_${t}`)?.value) || 0;
        const pr = parseFloat(document.getElementById(`total_rejectpr_${t}`)?.value) || 0;
        const bk = parseFloat(document.getElementById(`total_rejectbk_${t}`)?.value) || 0;
        const ll = parseFloat(document.getElementById(`total_rejectll_${t}`)?.value) || 0;
        const fkm = parseFloat(document.getElementById(`fkm_${t}`)?.value) || 0;
        const akt = parseFloat(document.getElementById(`sisa_aktual_${t}`)?.value) || 0;

        const teoritis = fkm + std - (fg + s + sp + pr + bk + ll);
        const selisih = teoritis - akt;

        setVal(`sisa_teoritis_${t}`, teoritis.toFixed(t === 'film' ? 3 : 0));
        
        if (t === 'port') {
            const els = document.querySelectorAll('#selisih_port');
            if(els[0]) els[0].value = selisih.toFixed(0);
        } else if (t === 'cap') {
            const els = document.querySelectorAll('#selisih_cap');
            if(els[0]) els[0].value = selisih.toFixed(0);
        } else {
            setVal(`selisih_${t}`, selisih.toFixed(t === 'film' ? 3 : 0));
        }
    });

    // =========================================
    // 5. BERITA ACARA & PRODUK (LOGIKA BARU ID)
    // =========================================
    let totalCapIpcFill = 0;
    let totalCapLainya = 0;
    let totalAllRejectProduk = 0;

    lots.forEach(lot => {
        // --- A. DATA SUMBER DARI DETAIL LOT ---
        const bagPress = parseFloat(document.getElementById(`bag_press_lot${lot}`)?.value) || 0;
        const totalRejectLot = parseFloat(document.getElementById(`total_reject_lot${lot}`)?.value) || 0;
        const lainyaPort = parseFloat(document.getElementById(`reject_lainya_lot${lot}_port`)?.value) || 0;
        const lainyaCap = parseFloat(document.getElementById(`reject_lainya_lot${lot}_cap`)?.value) || 0;

        // --- B. ISI TABEL PRODUK (ID BARU) ---
        // 1. Produk IPC = Bag Press
        setVal(`Produk_reject_ipc_lot${lot}_cap`, bagPress);
        
        // 2. Produk Filling = Total Reject Lot
        setVal(`Produk_reject_filling_lot${lot}_cap`, totalRejectLot);

        // Hitung total produk (untuk kolom total reject di tabel produk)
        totalAllRejectProduk += (bagPress + totalRejectLot);

        // --- C. ISI TABEL BERITA ACARA (BAGIAN CAP) ---
        // Logic: Berita Acara IPC+Filling = Produk IPC + Produk Filling
        const capIpcFilling = bagPress + totalRejectLot;
        
        // Isi kolom Reject IPC + Filling (ID: CAP_reject_ipc+filling_lot...)
        setVal(`CAP_reject_ipc+filling_lot${lot}`, capIpcFilling);
        
        // Total per Lot (IPC+Fill + Lainya)
        const totalCapLot = capIpcFilling + lainyaCap;
        setVal(`reject_total_lot${lot}_cap`, totalCapLot);

        // Akumulasi Total Bawah
        totalCapIpcFill += capIpcFilling;
        totalCapLainya += lainyaCap;

        // --- D. UPDATE BERITA ACARA (PORT & FILM - Logic Lama) ---
        setVal(`reject_ipc_filling_lot${lot}_reject_port`, totalRejectLot);
        setVal(`reject_total_lot${lot}_port`, totalRejectLot + lainyaPort);

        const ipcFillFilm = totalRejectLot * factor;
        const lainyaFilm = lainyaPort * factor;
        setVal(`reject_ipc_filling_lot${lot}_reject_fb`, ipcFillFilm.toFixed(3));
        setVal(`reject_lainya_lot${lot}_fb_film`, lainyaFilm.toFixed(3));
        setVal(`reject_total_lot${lot}_fb_film`, (ipcFillFilm + lainyaFilm).toFixed(3));
    });

    // =========================================
    // 6. TOTAL & SELISIH
    // =========================================
    
    // Total CAP (Berita Acara)
    setVal('CAP_reject_ipc+filling_total', totalCapIpcFill); // Total Baris 11
    setVal('reject_lainya_total_reject_cap', totalCapLainya); // Total Baris 12
    setVal('reject_total_cap', totalCapIpcFill + totalCapLainya); // Grand Total Cap

    // Total PRODUK (Paling Bawah)
    setVal('produk_total_reject_all', totalAllRejectProduk);

    // Total Port & Film
    let totalBaPort = 0, totalBaFilm = 0;
    lots.forEach(lot => {
        totalBaPort += parseFloat(document.getElementById(`reject_total_lot${lot}_port`)?.value) || 0;
        totalBaFilm += parseFloat(document.getElementById(`reject_total_lot${lot}_fb_film`)?.value) || 0;
    });
    setVal('reject_total_port', totalBaPort);
    setVal('reject_total_fb_film', totalBaFilm.toFixed(3));

    // Selisih Port
    const prbkllPort = (vP.pr + vP.bk + (parseFloat(document.getElementById('total_rejectll_port')?.value) || 0));
    setVal('reject_prbkll_port', prbkllPort);
    const elsSelisihPort = document.querySelectorAll('#selisih_port');
    if(elsSelisihPort[1]) elsSelisihPort[1].value = totalBaPort - prbkllPort;

    // Selisih Film
    const prFilm = parseFloat(document.getElementById('total_rejectpr_film')?.value) || 0;
    const bkFilm = parseFloat(document.getElementById('total_rejectbk_film')?.value) || 0;
    const llFilm = parseFloat(document.getElementById('total_rejectll_film')?.value) || 0;
    const prbkllFilm = prFilm + bkFilm + llFilm;
    setVal('reject_prbkll_fb_film', prbkllFilm.toFixed(3));
    setVal('selisih_fb_film', (totalBaFilm - prbkllFilm).toFixed(3));

    // Selisih Cap
    const prCap = parseFloat(document.getElementById('total_rejectpr_cap')?.value) || 0;
    const bkCap = parseFloat(document.getElementById('total_rejectbk_cap')?.value) || 0;
    const llCap = parseFloat(document.getElementById('total_rejectll_cap')?.value) || 0;
    const totalPrBkLlCap = prCap + bkCap + llCap;
    setVal('reject_prbkll_cap', totalPrBkLlCap);
    const elsSelisihCap = document.querySelectorAll('#selisih_cap');
    if(elsSelisihCap[1]) elsSelisihCap[1].value = (totalCapIpcFill + totalCapLainya) - totalPrBkLlCap;
}

function setVal(id, value) {
    const el = document.getElementById(id);
    if (el) el.value = value;
}
