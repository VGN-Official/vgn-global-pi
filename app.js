// =================================================================
// 🌐 GLOBAL MATRIX EMERGENCIES SCHEMA CONFIGURATION
// =================================================================
const VGN_EMBEDDED_SCHEMA = {
  "vgn_framework_version": "2.0.0-global",
  "supported_regions": {
    "NG-BAU": {
      "region_name": "Bauchi State, Nigeria",
      "currency": "NGN",
      "routing_medium": "SMS",
      "sectors": {
        "bauchi_metropolitan": {
          "dispatch_unit": "Central HQ (Yandoka Road)",
          "gateway_node": "+2348151849417",
          "local_hazards": ["Market Fire", "LPG Outbreak", "Structural Incident"]
        },
        "aleri_sector": {
          "dispatch_unit": "Alkaleri Command Outpost",
          "gateway_node": "+2348150000000",
          "local_hazards": ["Agro Field Alert", "Grazing Reserve Conflict"]
        }
      }
    },
    "ML-MOP": {
      "region_name": "Mopti Region, Mali (Sahel Zone)",
      "currency": "XOF",
      "routing_medium": "SMS",
      "sectors": {
        "bandiagara_sector": {
          "dispatch_unit": "Bandiagara Rural Civil Protection",
          "gateway_node": "+22370000000",
          "local_hazards": ["Agro Corridor Incursion", "Critical Supply Chain Ambush"]
        }
      }
    },
    "SO-GED": {
      "region_name": "Gedo Region, Somalia",
      "currency": "SOS",
      "routing_medium": "SMS",
      "sectors": {
        "bardera_sector": {
          "dispatch_unit": "Bardera Community Safety Hub",
          "gateway_node": "+25261000000",
          "local_hazards": ["Resource Point Conflict", "Remote Telemetry Distress"]
        }
      }
    },
    "CO-NSA": {
      "region_name": "Norte de Santander, Colombia",
      "currency": "COP",
      "routing_medium": "SMS_GATEWAY",
      "sectors": {
        "catatumbo_sector": {
          "dispatch_unit": "Catatumbo Rural Civil Defense",
          "gateway_node": "+57300000000",
          "local_hazards": ["Terrain Displacement Alert", "Agricultural Hub Fire"]
        }
      }
    }
  }
};

// ==========================================
// 🌐 VGN GLOBAL SYSTEMS ARCHITECTURE CORE
// ==========================================
let isSent = false;
let countdown;
let timeLeft = 3;

let currentGlobalSchema = VGN_EMBEDDED_SCHEMA;
let activeRegionData = null;
let currentPioneerUsername = "Standalone Operator";

// 1. DYNAMIC LOCATION SCHEMA INITIALIZER
function initializeVgnGlobalEngine(regionCode = "NG-BAU") {
    try {
        currentGlobalSchema = VGN_EMBEDDED_SCHEMA;
        activeRegionData = currentGlobalSchema.supported_regions[regionCode];
        console.log(`VGN Engine Active: Optimized for ${activeRegionData.region_name}`);

    renderDynamicUIComponents();
    updateArmedStatusDisplay();
        
        return true; 
    } catch (error) {
        console.error("VGN Critical: Configuration injection failed:", error);
        document.getElementById('statusMsg').innerText = "CRITICAL CONFIGURATION ERROR";
        return false;
    }
}

// Dynamically inject the active region's sectors into your HTML dropdown selector
function renderDynamicUIComponents() {
    const lgaSelector = document.getElementById('lgaSelector');
    if (!lgaSelector || !activeRegionData) return;
    
lgaSelector.innerHTML = "";
    
 Object.keys(activeRegionData.sectors).forEach(sectorKey => {
        const sector = activeRegionData.sectors[sectorKey];
        const option = document.createElement('option');
        option.value = sectorKey;

        const cleanSectorName = sectorKey.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase());
        option.text = `${cleanSectorName} (${sector.dispatch_unit})`;
        lgaSelector.appendChild(option);
    });
}

function updateArmedStatusDisplay() {
    const statusMsg = document.getElementById('statusMsg');
    let savedSectorZone = localStorage.getItem('vgn_active_lga');
    
    if (savedSectorZone && activeRegionData && activeRegionData.sectors[savedSectorZone]) {
        statusMsg.innerHTML = `SYSTEM ARMED: ${savedSectorZone.toUpperCase()} SECTOR ON ALERT`;
    } else {
       const lgaModal = document.getElementById('lgaModal');
       if (lgaModal) setTimeout(() => { lgaModal.classList.add('active'); }, 600);
    }
}

// 2. CROSS-PLATFORM SYSTEM TELEMETRY PAYLOAD ROUTER
const vgnGlobalPayloadGenerator = (targetGateway, telemetryPayload) => {
const cleanNode = targetGateway.replace(/\s+/g, '');
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const operatorSymbol = isIOS ? ';' : '?';
const serializedData = encodeURIComponent(telemetryPayload);
    
    return `sms:${cleanNode}${operatorSymbol}body=${serializedData}`;
};

const showSmsButton = (body, targetGatewayNumber) => {
    const statusMsg = document.getElementById('statusMsg');
    const c2 = localStorage.getItem('vgn_contact2') || "";

    let buttonsHTML = `<div style="margin-top:15px;">`;
    buttonsHTML += `
        <a href="${vgnGlobalPayloadGenerator(targetGatewayNumber, body)}" style="background: #d32f2f; display:block; padding: 22px; color: white; border-radius: 15px; text-decoration: none; font-weight: bold; text-align: center; margin-bottom:15px; border-bottom: 5px solid #b71c1c; font-size: 1.1em;">
            🚨 DISPATCH ENCRYPTED COMPASS LOGS NOW
        </a>`;

    if (c2) {
        buttonsHTML += `
            <a href="${vgnGlobalPayloadGenerator(c2, body)}" style="background: #455A64; display:block; padding: 20px; color: white; border-radius: 15px; text-decoration: none; font-weight: bold; text-align: center; border-bottom: 5px solid #263238;">
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

// 3. PI APP PLATFORM INTEGRATION WINDOW & APPLICATION EVENT LOOPS
document.addEventListener('DOMContentLoaded', async () => {
    
    const countrySelector = document.getElementById('countrySelector');
    
    if (countrySelector) {
        console.log("[VGN Core] Force-seeding global operational zones...");
        
        countrySelector.innerHTML = `
            <option value="NG-BAU" selected>Bauchi State, Nigeria (NGN)</option>
            <option value="ML-MOP">Mopti Region, Mali (XOF)</option>
            <option value="SO-GED">Gedo Region, Somalia (SOS)</option>
            <option value="CO-NSA">Norte de Santander, Colombia (COP)</option>
        `;

        initializeVgnGlobalEngine("NG-BAU");

        countrySelector.addEventListener('change', async (e) => {
            const chosenRegionCode = e.target.value;
            console.log(`[VGN Global] Re-routing grid parameters to: ${chosenRegionCode}`);
            localStorage.removeItem('vgn_active_lga');
            initializeVgnGlobalEngine(chosenRegionCode);
        });
    } else {
        console.error("[VGN Critical] Could not find 'countrySelector' element in DOM!");
    }

// ==========================================
// 🪙 BULLETPROOF ASYNCHRONOUS PI SDK CORE
// ==========================================
let authAttempts = 0;

async function runSecurePiAuthentication() {
    if (typeof Pi !== 'undefined') {
        console.log("[VGN Core] Pi SDK detected. Initializing handshake...");
        try {
            // Force the runtime engine to fully await SDK context mounting
            await Pi.init({ version: "2.0", sandbox: true });
            
            const runtimeScopes = ['username', 'payments'];
            
            // Execute authentication immediately after successful initialization
            Pi.authenticate(runtimeScopes, (incompletePayment) => {
                console.log("[VGN Core] Resolving pending ledger entries:", incompletePayment);
            }).then((auth) => {
                currentPioneerUsername = auth.user.username;
                console.log(`[VGN Core] Matrix Session Locked. Welcome, Pioneer: ${currentPioneerUsername}`);
                
                // Visual validation hook for the UI banner
                const statusMsg = document.getElementById('statusMsg');
                if (statusMsg) {
                    statusMsg.innerHTML = `<span style="color: #388E3C; font-weight: bold;">🟢 SECURITY LOCK VERIFIED: Welcome, Pioneer ${currentPioneerUsername}</span>`;
                }
            }).catch((authError) => {
                console.error("[VGN Core] Pi Authentication rejected:", authError);
            });

        } catch (initError) {
            console.error("[VGN Core] Pi SDK Initialization failed to mount:", initError);
        }
    } else if (authAttempts < 5) {
        authAttempts++;
        console.warn(`[VGN Core] Script floating outside active Pi context. Retrying attempt ${authAttempts}/5...`);
        setTimeout(runSecurePiAuthentication, 500); // 500ms heartbeat retry
    } else {
        console.warn("[VGN Core] Standalone execution active (Running outside Pi Browser). Fallbacks loaded.");
    }
}

// Fire the sequence on page ready
document.addEventListener('DOMContentLoaded', () => {
    // Keep your global schema engines and UI loading triggers completely intact here!
    initializeVgnGlobalEngine("NG-BAU");
    
    // Fire the fail-safe async authentication sequence
    runSecurePiAuthentication();
});

    // =================================================================
    // PART C: DOM CACHED ELEMENTS & EVENT LISTENERS
    // =================================================================
    const sosButton = document.getElementById('sos-btn');
    const statusMsg = document.getElementById('statusMsg');
    const timerDisplay = document.getElementById('timer');
    const siren = document.getElementById('sirenAudio');
    const stopBtn = document.getElementById('stop-btn');
    const stealthToggle = document.getElementById('stealthToggle');
    const bloodInput = document.getElementById('bloodGroup');
    const allergiesInput = document.getElementById('allergies');
    const triggerChangeZone = document.getElementById('triggerChangeZone');

const lgaModal = document.getElementById('lgaModal');
const confirmLgaBtn = document.getElementById('confirmLgaBtn');
const closeLgaBtn = document.getElementById('closeLgaBtn');
const lgaSelector = document.getElementById('lgaSelector');

    if (triggerChangeZone) {
        triggerChangeZone.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('vgn_active_lga'); 
            if (lgaModal) lgaModal.classList.add('active'); 
        });
    }

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
            siren.play().catch(e => console.log("Audio Stream Blocked by Browser Security Policies"));
            if (navigator.vibrate) navigator.vibrate([500, 200, 500, 200, 500]);
        }
    };

    const startSOS = () => {
        if (isSent) return;
        
        let savedSectorZone = localStorage.getItem('vgn_active_lga');
        if (!savedSectorZone || !activeRegionData || !activeRegionData.sectors[savedSectorZone]) {
            if (lgaModal) lgaModal.classList.add('active');
            return;
        }

        timeLeft = 3;
        if (timerDisplay) timerDisplay.innerText = timeLeft;
        statusMsg.innerText = "Hold for 3 Seconds...";
        
        countdown = setInterval(() => {
            timeLeft--;
            if (timerDisplay) timerDisplay.innerText = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(countdown);
                finishSOS(savedSectorZone); 
            }
        }, 1000);
    };

    const cancelSOS = () => {
        if (isSent) return;
        clearInterval(countdown);
        if (timerDisplay) timerDisplay.innerText = "";
        let savedSectorZone = localStorage.getItem('vgn_active_lga');
        statusMsg.innerText = savedSectorZone ? `SYSTEM ARMED: ${savedSectorZone.toUpperCase()} SECTOR GRID` : "SYSTEM ARMED: READY";
    };

    if (closeLgaBtn) {
        closeLgaBtn.addEventListener('click', () => {
            if (lgaModal) lgaModal.classList.remove('active');
            cancelSOS();
        });
    }

    if (confirmLgaBtn) {
        confirmLgaBtn.addEventListener('click', () => {
            const chosenZone = lgaSelector.value;
            localStorage.setItem('vgn_active_lga', chosenZone);
            if (lgaModal) lgaModal.classList.remove('active');
            statusMsg.innerText = `SYSTEM ARMED: ${chosenZone.toUpperCase()} SECTOR ON ALERT`;
        });
    }

    const finishSOS = (targetSectorKey) => {
        isSent = true;
       const targetCommand = activeRegionData.sectors[targetSectorKey];
       const profileInfo = localStorage.getItem('vgn_blood') || "NOT SET";
       const locationDetails = localStorage.getItem('vgn_allergies') || "NONE SPECIFIED";
       const localHazardsList = targetCommand.local_hazards ? targetCommand.local_hazards.join(', ') : "General Security Hazard";

        statusMsg.innerHTML = `<p style="color: #0b5394; font-weight: bold; text-align: center;">🛰️ Dispatching Telemetry Payload to ${targetCommand.dispatch_unit}...</p>`;

        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const mapUrl = `https://maps.google.com/?q=${lat},${lon}`;

            const smsBody = `🚩 VGN SENTINEL SECURITY MATRIX!
Sector Node: ${targetSectorKey.toUpperCase()}
Dispatch Unit: ${targetCommand.dispatch_unit}
Pioneer Operator: ${currentPioneerUsername}
Profile Context: ${profileInfo}
Specific Location: ${locationDetails}
Identified Threats: ${localHazardsList}
GPS Matrix: ${mapUrl}`;

            showSmsButton(smsBody, targetCommand.gateway_node); 
            window.playSiren();
        }, (err) => {
            const smsBody = `🚩 VGN SENTINEL SECURITY MATRIX!
Sector Node: ${targetSectorKey.toUpperCase()}
Dispatch Unit: ${targetCommand.dispatch_unit}
Pioneer Operator: ${currentPioneerUsername}
Profile Context: ${profileInfo}
Specific Location: ${locationDetails}
Identified Threats: ${localHazardsList}
Status: Signal Degradation / GPS Lost`;
                                
            showSmsButton(smsBody, targetCommand.gateway_node);
            window.playSiren();
        }, { 
            enableHighAccuracy: true, 
            timeout: 8000,
            maximumAge: 0 
        });
    };

if (sosButton) {
        sosButton.addEventListener('mousedown', startSOS);
        sosButton.addEventListener('mouseup', cancelSOS);
        sosButton.addEventListener('touchstart', (e) => { e.preventDefault(); startSOS(); });
        sosButton.addEventListener('touchend', cancelSOS);
    }
    
    if (stopBtn) stopBtn.addEventListener('click', window.stopAll);
});