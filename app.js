// 1. GLOBAL STATE MATRIX
let isSent = false;
let countdown;
let timeLeft = 3;

/// UPDATED COMPREHENSIVE CONTROL GRID REGISTRY
const BauchiSecurityRegistry = {
    state_hq: { unit: "Bauchi State Command Headquarters", dispatch: "08151849417" },
    lgas: {
        // --- BAUCHI SOUTH DISTRICT ---
        "bauchi": { unit: "Capital Control Room Desk", dispatch: "08151849417" },
        "toro": { unit: "Toro Axis Command Desk", dispatch: "08127162434" },
        "alkaleri": { unit: "Alkaleri Divisional Link", dispatch: "08151849417" },
        "bogoro": { unit: "Bogoro Operational Link", dispatch: "07031961762" },
        "dass": { unit: "Dass Divisional Link", dispatch: "08050404039" },
        "kirfi": { unit: "Kirfi Sector Link", dispatch: "08151849417" },
        "tafawa_balewa": { unit: "Tafawa Balewa Control Desk", dispatch: "08127162434" },

        // --- BAUCHI CENTRAL DISTRICT ---
        "misau": { unit: "Misau Zonal Control Desk", dispatch: "08151849417" },
        "ningi": { unit: "Ningi Axis Command Desk", dispatch: "08151849417" },
        "dambam": { unit: "Dambam Sector Link", dispatch: "07031961762" },
        "darazo": { unit: "Darazo Operational Desk", dispatch: "08050404039" },
        "ganjuwa": { unit: "Ganjuwa Divisional Link", dispatch: "08151849417" },
        "warji": { unit: "Warji Sector Link", dispatch: "08151849417" },

        // --- BAUCHI NORTH DISTRICT ---
        "katagum": { unit: "Azare Zonal Command Control", dispatch: "08084763669" },
        "gamawa": { unit: "Gamawa Sector Link", dispatch: "08084763669" },
        "giade": { unit: "Giade Operational Link", dispatch: "07031961762" },
        "itas_gadau": { unit: "Itas/Gadau Divisional Link", dispatch: "08084763669" },
        "jamaare": { unit: "Jama'are Division Control Desk", dispatch: "08084763669" },
        "shira": { unit: "Shira Sector Link", dispatch: "08050404039" },
        "zaki": { unit: "Zaki Border Sector Link", dispatch: "08151849417" }
    }
};

const smsUrlBuilder = (number, body) => {
    const cleanNumber = number.replace(/\s+/g, '');
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const separator = isIOS ? ';' : '?';
    const encodedBody = encodeURIComponent(body);
    return `sms:${cleanNumber || "+2348151849417"}${separator}body=${encodedBody}`;
};

const showSmsButton = (body, specificLgaNumber) => {
    const statusMsg = document.getElementById('statusMsg');
    const c2 = localStorage.getItem('vgn_contact2') || "";

    let buttonsHTML = `<div style="margin-top:15px;">`;
    buttonsHTML += `
        <a href="${smsUrlBuilder(specificLgaNumber, body)}" style="background: #d32f2f; display:block; padding: 22px; color: white; border-radius: 15px; text-decoration: none; font-weight: bold; text-align: center; margin-bottom:15px; border-bottom: 5px solid #b71c1c; font-size: 1.1em;">
           🚨 DISPATCH ENCRYPTED COMPASS LOGS NOW
        </a>`;

    if (c2) {
        buttonsHTML += `
            <a href="${smsUrlBuilder(c2, body)}" style="background: #455A64; display:block; padding: 20px; color: white; border-radius: 15px; text-decoration: none; font-weight: bold; text-align: center; border-bottom: 5px solid #263238;">
                🛡️ Alert Secondary Backup Unit 
            </a>`;
    }

    buttonsHTML += `</div>`;
    statusMsg.innerHTML = buttonsHTML;
};

window.stopAll = () => {
    if (confirm("Do you want to stop siren and reset App?")) {
        const siren = document.getElementById('sirenAudio');
        if (siren) { siren.pause(); siren.currentTime = 0; }
        if (navigator.vibrate) navigator.vibrate(0);
        isSent = false;
        location.reload(); 
    }
};

// 2. MAIN APPLICATION LOGIC LOOP
document.addEventListener('DOMContentLoaded', () => {
    const sosButton = document.getElementById('sos-btn');
    const statusMsg = document.getElementById('statusMsg');
    const timerDisplay = document.getElementById('timer');
    const siren = document.getElementById('sirenAudio');
    const stopBtn = document.getElementById('stop-btn');
    const stealthToggle = document.getElementById('stealthToggle');
    const bloodInput = document.getElementById('bloodGroup');
    const allergiesInput = document.getElementById('allergies');
   const triggerChangeZone = document.getElementById('triggerChangeZone');

if (triggerChangeZone) {
    triggerChangeZone.addEventListener('click', (e) => {
        e.preventDefault(); // Prevents any unexpected form submissions
        
        // Wipe the old location selection from local memory
        localStorage.removeItem('vgn_active_lga'); 
        
        // Unhide the selection popup modal instantly
        const modal = document.getElementById('lgaModal');
        if (modal) {
            modal.classList.add('active'); 
        }
    });
}
    
    // Modal Selectors
    const lgaModal = document.getElementById('lgaModal');
    const confirmLgaBtn = document.getElementById('confirmLgaBtn');
    const closeLgaBtn = document.getElementById('closeLgaBtn');
    const lgaSelector = document.getElementById('lgaSelector');

    // INITIALIZATION: Check if they have already saved their home LGA
    let savedLgaZone = localStorage.getItem('vgn_active_lga');
    
    if (savedLgaZone && BauchiSecurityRegistry.lgas[savedLgaZone]) {
        statusMsg.innerHTML = `SYSTEM ARMED: ${savedLgaZone.toUpperCase()} GRID ON ALERT`;
    } else {
        // If they open the app and have never picked an LGA, pop it open immediately to configure it
        setTimeout(() => { lgaModal.classList.add('active'); }, 600);
    }

    // Load Form Values
    if (stealthToggle) {
        stealthToggle.checked = localStorage.getItem('vgn_stealth_mode') === 'true';
        stealthToggle.addEventListener('change', () => localStorage.setItem('vgn_stealth_mode', stealthToggle.checked));
    }
    if (bloodInput) {
        bloodInput.value = localStorage.getItem('vgn_blood') || '';
        bloodInput.addEventListener('input', () => localStorage.setItem('vgn_blood', bloodInput.value));
    }
    if (allergiesInput) {
        allergiesInput.value = localStorage.getItem('vgn_allergies') || '';
        allergiesInput.addEventListener('input', () => localStorage.setItem('vgn_allergies', allergiesInput.value));
    }

    window.playSiren = () => {
        const isStealth = localStorage.getItem('vgn_stealth_mode') === 'true';
        if (!isStealth && siren) {
            siren.play().catch(e => console.log("Audio Blocked"));
            if (navigator.vibrate) navigator.vibrate([500, 200, 500, 200, 500]);
        }
    };

    const startSOS = () => {
        if (isSent) return;
        
        // Safety Fallback: Double check they have a zone initialized
        savedLgaZone = localStorage.getItem('vgn_active_lga');
        if (!savedLgaZone) {
            lgaModal.classList.add('active');
            return;
        }

        timeLeft = 3;
        timerDisplay.innerText = timeLeft;
        statusMsg.innerText = "Hold for 3 Seconds...";
        
        countdown = setInterval(() => {
            timeLeft--;
            timerDisplay.innerText = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(countdown);
                // Zero friction! It jumps straight to transmission using the stored zone
                finishSOS(savedLgaZone); 
            }
        }, 1000);
    };

    const cancelSOS = () => {
        if (isSent) return;
        clearInterval(countdown);
        timerDisplay.innerText = "";
        savedLgaZone = localStorage.getItem('vgn_active_lga');
        statusMsg.innerText = savedLgaZone ? `SYSTEM ARMED: ${savedLgaZone.toUpperCase()} GRID` : "SYSTEM ARMED: READY";
    };

    // Modal Operations
    closeLgaBtn.addEventListener('click', () => {
        lgaModal.classList.remove('active');
        cancelSOS();
    });

    confirmLgaBtn.addEventListener('click', () => {
        const chosenZone = lgaSelector.value;
        localStorage.setItem('vgn_active_lga', chosenZone); // Save it permanently
        lgaModal.classList.remove('active');
        statusMsg.innerText = `SYSTEM ARMED: ${chosenZone.toUpperCase()} GRID ON ALERT`;
    });

    const finishSOS = (targetLgaKey) => {
        isSent = true;
        const targetCommand = BauchiSecurityRegistry.lgas[targetLgaKey] || BauchiSecurityRegistry.state_hq;
        
        const hostel = localStorage.getItem('vgn_blood') || "NOT SET";
        const studentId = localStorage.getItem('vgn_allergies') || "STAFF";

        statusMsg.innerHTML = `<p style="color: #0b5394; font-weight: bold; text-align: center;">🛰️ Dispatching Telemetry Payload to ${targetCommand.unit}...</p>`;

        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const mapUrl = `https://maps.google.com/?q=${lat},${lon}`;

            const smsBody = `🚩 BAUCHI SENTINEL GRID EMERGENCY!
LGA Zone: ${targetLgaKey.toUpperCase()}
Unit Routing: ${targetCommand.unit}
Citizen Profile: ${hostel}
Location: ${studentId}
GPS Matrix: ${mapUrl}`;

            showSmsButton(smsBody, targetCommand.dispatch); 
            window.playSiren();
        }, (err) => {
            const smsBody = `🚩 BAUCHI SENTINEL GRID EMERGENCY!
LGA Zone: ${targetLgaKey.toUpperCase()}
Unit Routing: ${targetCommand.unit}
Citzen Profile: ${hostel}
Location: ${studentId}
Status: Signal Degradation / GPS Lost`;
                        
            showSmsButton(smsBody, targetCommand.dispatch);
            window.playSiren();
        }, { 
            enableHighAccuracy: true, 
            timeout: 8000,
            maximumAge: 0 
        });
    };

    // User Event Listeners
    sosButton.addEventListener('mousedown', startSOS);
    sosButton.addEventListener('mouseup', cancelSOS);
    sosButton.addEventListener('touchstart', (e) => { e.preventDefault(); startSOS(); });
    sosButton.addEventListener('touchend', cancelSOS);
    
    if (stopBtn) stopBtn.addEventListener('click', window.stopAll);
});