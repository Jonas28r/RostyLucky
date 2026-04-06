// --- CONFIGURACIÓN INICIAL ROSTYLUCKY ---
const tg = window.Telegram.WebApp;
tg.expand(); // Abre la app a pantalla completa

let balance = 0.000000;
let energy = 0;
let miningRate = 0.00000001; // Lo que gana por segundo
let isMining = true;

// --- CARGAR DATOS DEL USUARIO DE TELEGRAM ---
const userData = tg.initDataUnsafe.user;
if (userData) {
    document.getElementById('user-name').innerText = userData.first_name;
    // Si tiene foto, la ponemos, si no, dejamos el círculo con la inicial
    if (userData.photo_url) {
        document.getElementById('user-photo').innerHTML = `<img src="${userData.photo_url}" class="rounded-full w-full h-full object-cover">`;
    }
}

// --- LÓGICA DEL TAP-TAP (CARGADOR) ---
function handleTap() {
    // Protección simple Anti-Bot manual
    energy++;
    document.getElementById('energy-count').innerText = energy;
    
    // Feedback visual al tocar
    const tapArea = document.getElementById('tap-area');
    tapArea.style.transform = "scale(0.95)";
    setTimeout(() => tapArea.style.transform = "scale(1)", 100);

    // Desbloquear Ruleta al llegar a 100
    if (energy >= 100) {
        const btnRuleta = document.getElementById('btn-ruleta');
        btnRuleta.classList.remove('opacity-50');
        btnRuleta.classList.add('border-purple-500', 'shadow-[0_0_15px_rgba(168,85,247,0.5)]');
    }
}

// --- LÓGICA DE LA RULETA (PREMIOS REALES) ---
function openRoulette() {
    if (energy < 100) {
        tg.showAlert("⚡ ¡Energía insuficiente! Necesitas 100 puntos de Tap-Tap.");
        return;
    }

    // Aquí llamaríamos al anuncio de Adsterra (Pop-under o Interstitial)
    // simulamos un pequeño retraso para que parezca que carga el anuncio
    tg.showConfirm("¿Quieres girar la ruleta ahora?", (confirm) => {
        if (confirm) {
            ejecutarGiro();
        }
    });
}

function ejecutarGiro() {
    const random = Math.random() * 100;
    let premio = 0;

    // Probabilidades balanceadas para ganar dinero real
    if (random < 70) premio = 0; // 70% Nada
    else if (random < 90) premio = 0.001; // 20% Bronce
    else if (random < 98) premio = 0.01;  // 8% Plata
    else if (random < 99.8) premio = 0.1; // 1.8% Oro
    else premio = 1.0; // 0.2% Jackpot

    balance += premio;
    energy = 0; // Reset energía

    // Actualizar Interfaz
    document.getElementById('balance').innerText = balance.toFixed(6);
    document.getElementById('energy-count').innerText = "0";
    document.getElementById('btn-ruleta').classList.add('opacity-50');

    if (premio > 0) {
        tg.HapticFeedback.notificationOccurred('success');
        alert(`¡Felicidades! Ganaste $${premio} USDT`);
    } else {
        alert("¡Casi! Sigue intentando.");
    }
}

// --- LÓGICA DE MINERÍA (PASIVO) ---
setInterval(() => {
    if (isMining) {
        balance += miningRate;
        document.getElementById('balance').innerText = balance.toFixed(6);
        
        // Actualizar contador de minería visual
        let displayMining = parseFloat(document.getElementById('mining-display').innerText);
        document.getElementById('mining-display').innerText = (displayMining + miningRate).toFixed(8);
    }
}, 1000);

// --- POTENCIADOR (BOOST) CON ANUNCIO ---
function showAdAndBoost() {
    tg.showConfirm("Mira un video publicitario para duplicar tu velocidad de minería por 5 minutos", (ok) => {
        if (ok) {
            // AQUÍ PEGAS TU LINK DE ADSTERRA DIRECTO O VIDEO
            window.open("TU_LINK_DE_ADSTERRA_AQUÍ", "_blank");
            
            miningRate *= 2; // Duplica velocidad
            setTimeout(() => {
                miningRate /= 2; // Vuelve a la normalidad
                alert("El Boost ha terminado.");
            }, 300000); // 5 minutos
        }
    });
}
