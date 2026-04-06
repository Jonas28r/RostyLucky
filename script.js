// --- VARIABLES DE CONTROL DE TIEMPO ---
let miningTimeLeft = 0; // Segundos restantes de minería
const TRES_HORAS = 10800; // 3 horas en segundos

// --- FUNCIÓN PARA ACTIVAR/BOOST DE MINERÍA ---
function showAdAndBoost() {
    tg.showConfirm("Mira un anuncio para ACTIVAR el Minero por 3 HORAS ☁️", (ok) => {
        if (ok) {
            // AQUÍ PEGAS TU DIRECT LINK DE ADSTERRA
            window.open("https://TU_LINK_DIRECTO_AQUI", "_blank");
            
            isMining = true;
            miningTimeLeft = TRES_HORAS; // Resetear el reloj a 3 horas
            
            tg.HapticFeedback.notificationOccurred('success');
            tg.showAlert("✅ ¡Minería Activada por 3 horas!");
        }
    });
}

// --- CICLO DE ACTUALIZACIÓN (CADA SEGUNDO) ---
setInterval(() => {
    if (isMining && miningTimeLeft > 0) {
        // 1. Aumentar el balance real
        balance += miningRate;
        document.getElementById('balance').innerText = balance.toFixed(6);
        
        // 2. Actualizar el contador visual de la tarjeta de minería
        let currentDisplay = parseFloat(document.getElementById('mining-display').innerText);
        document.getElementById('mining-display').innerText = (currentDisplay + miningRate).toFixed(8);
        
        // 3. Restar tiempo al reloj
        miningTimeLeft--;

        // 4. Actualizar la barra de progreso visual (de 100% a 0%)
        let porcentajeRestante = (miningTimeLeft / TRES_HORAS) * 100;
        document.getElementById('mining-bar').style.width = porcentajeRestante + "%";

        // 5. Si el tiempo se acaba, detener todo
        if (miningTimeLeft <= 0) {
            isMining = false;
            tg.showAlert("⚠️ El minero se ha detenido. ¡Mira un anuncio para reactivarlo!");
            document.getElementById('mining-bar').style.width = "0%";
        }
    }
}, 1000);
