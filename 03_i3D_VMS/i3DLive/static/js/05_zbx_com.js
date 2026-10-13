/**
 * 05_zabbix_connectivity.js
 */

let popupTimer = null;
let countdownInterval = null;
let timeLeft = 15;
let isPinned = false;

//function showLivePopup(x, y, data) {
function showLivePopup(x, y, data) {
    x=10, y=10;
    closePopup(); 

    const popup = document.createElement('div');
    popup.id = 'live-data-popup';
    Object.assign(popup.style, {
        position: 'fixed', left: `${x}px`, top: `${y}px`,
        width: '320px', background: 'rgba(10, 15, 25, 0.98)',
        color: '#fff', border: '1px solid #3b82f6', borderRadius: '8px',
        padding: '12px', zIndex: '10000', fontFamily: 'sans-serif',
        boxShadow: '0 12px 40px rgba(0,0,0,0.7)', borderLeft: '4px solid #3b82f6'
    });

    popup.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; border-bottom:1px solid #334155; padding-bottom:6px;">
            <span style="font-weight:bold; color:#60a5fa; font-size:14px;">${data.zbxHost}</span>
            <div style="display:flex; align-items:center;">
                <span id="popup-timer" style="font-family:monospace; margin-right:10px; color:#94a3b8; font-size:12px;">15s</span>
                <button id="popup-pin" style="background:none; border:none; cursor:pointer; font-size:16px;" title="Pin">📌</button>
                <button id="popup-close" style="background:none; border:none; color:#ef4444; cursor:pointer; font-size:20px; margin-left:8px; line-height:1;">&times;</button>
            </div>
        </div>
        <div id="popup-content" style="font-size:12px; max-height:300px; overflow-y:auto; scrollbar-width: thin;">
            <div style="color:#60a5fa; text-align:center; padding:10px;">Requesting Data...</div>
        </div>
    `;

    document.body.appendChild(popup);

    const pinBtn = document.getElementById('popup-pin');
    pinBtn.onclick = () => {
        isPinned = !isPinned;
        if (isPinned) {
            pinBtn.innerHTML = '📍';
            document.getElementById('popup-timer').innerText = "PAUSED";
            clearInterval(countdownInterval);
        } else {
            pinBtn.innerHTML = '📌';
            timeLeft = 15;
            startCountdown();
        }
    };

    document.getElementById('popup-close').onclick = closePopup;

    fetchZabbixLive(data);
    timeLeft = 15;
    isPinned = false;
    startCountdown();
}

function startCountdown() {
    clearInterval(countdownInterval);
    countdownInterval = setInterval(() => {
        if (!isPinned) {
            timeLeft--;
            document.getElementById('popup-timer').innerText = timeLeft + "s";
            if (timeLeft <= 0) closePopup();
        }
    }, 1000);
}

function closePopup() {
    const p = document.getElementById('live-data-popup');
    if (p) p.remove();
    clearInterval(countdownInterval);
}


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


/**
 * NEW: Global Observer Logic
 * This scans the scene every 3 seconds for new devices with Zabbix metadata
 */
function startZabbixGlobalObserver() {
    setInterval(() => {
        if (typeof scene === 'undefined') return;

        scene.traverse((node) => {
            // If device has Zabbix metadata AND isn't already being tracked
            if (node.deviceMetadata && node.deviceMetadata.zbxHost && !node.userData.isZabbixTracked) {
                // [Web Console Log] Auto-detection of new Zabbix devices
                // console.log(`[ZBX-OBSERVER] Auto-detecting Zabbix Device: ${node.deviceMetadata.zbxHost}`);
                setupDynamicZabbixHover(node);
            }
        });
    }, 3000); // Check for new devices every 3 seconds
}


// Helper function to normalize zbxSrvIP to full URL format
// Accepts: "http://148.113.5.163:8080", "https://148.113.5.163", "148.113.5.163:8080", "148.113.5.163"
// Returns: Full URL ready for API endpoint (e.g., "http://148.113.5.163:8080")
function normalizeZabbixURL(srvIP) {
    if (!srvIP) return '';
    srvIP = srvIP.trim();
    
    // If already has protocol, return as-is
    if (srvIP.startsWith('http://') || srvIP.startsWith('https://')) {
        return srvIP;
    }
    
    // Default to http:// if no protocol specified
    return 'http://' + srvIP;
}

async function setupDynamicZabbixHover(deviceGroup) {
    deviceGroup.userData.isZabbixTracked = true;
    
    const meta = deviceGroup.deviceMetadata;
    const refreshMs = 15000;

    const fetchData = async () => {
        const host = meta.zbxHost;
        const api = meta.zbxAPI;
        const srv = normalizeZabbixURL(meta.zbxSrvIP);

        try {
            const url = `/api/zabbix?host=${encodeURIComponent(host)}&api=${encodeURIComponent(api)}&srv_ip=${encodeURIComponent(srv)}`;
            const response = await fetch(url);
            if (!response.ok) return;

            const result = await response.json();

            if (result && result.items && Array.isArray(result.items)) {
                deviceGroup.userData.zabbixStats = {
                    name: host,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                    items: result.items.map(item => {
                        const rawVal = (item.lastvalue !== undefined && item.lastvalue !== null) ? item.lastvalue.toString() : "N/A";
                        let mappedVal = "---";

                        // [Web Console Log] Valuemap verification - warns if backend missing selectValueMap: "extend"
                        // if (!item.valuemap) {
                        //     console.warn(`[ZBX-DATA] Data Error: No valuemap found for ${item.name}. Verify backend selectValueMap: "extend"`);
                        // }

                        // Value Mapping Lookup Logic - EXACT REPLICA OF zbxpy.py logic
                        if (item.valuemap && item.valuemap.mappings) {
                            const mappings = Array.isArray(item.valuemap.mappings) ? item.valuemap.mappings : [];
                            
                            for (let i = 0; i < mappings.length; i++) {
                                let m = mappings[i];
                                // Use == for loose comparison (matches Python's behavior for string vs number)
                                if (m.value == rawVal) {
                                    mappedVal = m.newvalue;
                                    break;
                                }
                            }
                        }

                        const finalDisplay = (mappedVal !== "---") ? mappedVal : rawVal;
                        // console.log(`ITEM: ${item.name.padEnd(20)} | RAW: ${rawVal.padEnd(5)} | MAPPED: ${mappedVal.padEnd(15)} | FINAL: ${finalDisplay}`);

                        return {
                            name: item.name,
                            key: item.key_ || '',
                            lastvalue: finalDisplay,
                            rawValue: rawVal,
                            units: item.units || ''
                        };
                    })
                };
            }
        } catch (e) {
            // [Web Console Log] Hover popup data fetch error
            // console.error("[ZBX-HOVER] Hover Fetch Fail:", host, e);
        }
    };

    fetchData();
    setInterval(fetchData, refreshMs);
}


async function fetchZabbixLive(data) {
    const container = document.getElementById('popup-content');
    const host = data.zbxHost || "EnergyMeter_1";
    const token = data.zbxAPI;
    const srvURL = normalizeZabbixURL(data.zbxSrvIP);

    // Color scheme for value mapping names (case-insensitive)
    // ON, Device Missing, ByPass = Bright Yellow (#ffff00)
    // Alarm = Bright Red (#ff0000)
    // All others = White (#ffffff)
    
    // Function to determine color based on display value text
    function getValueColor(displayVal) {
        // Convert to lowercase for case-insensitive comparison
        const val = String(displayVal).toLowerCase().trim();
        
        console.log("[v0] getValueColor called with:", displayVal, "-> lowercase:", val);
        
        // Check for Alarm - Bright Red
        if (val === 'alarm' || val.includes('alarm')) {
            console.log("[v0] Matched ALARM -> Red");
            return '#ff0000';
        }
        
        // Check for ON - Bright Yellow (exact match only since 'on' can be part of other words)
        if (val === 'on') {
            console.log("[v0] Matched ON -> Yellow");
            return '#ffff00';
        }
        
        // Check for Device Missing - Bright Yellow
        if (val === 'device missing' || val === 'devicemissing' || val.includes('device missing') || val.includes('missing')) {
            console.log("[v0] Matched DEVICE MISSING -> Yellow");
            return '#ffff00';
        }
        
        // Check for ByPass - Bright Yellow
        if (val === 'bypass' || val === 'by pass' || val === 'by-pass' || val.includes('bypass')) {
            console.log("[v0] Matched BYPASS -> Yellow");
            return '#ffff00';
        }
        
        // Default - White for all other values
        console.log("[v0] No match -> White");
        return '#ffffff';
    }

    try {
        // Fetch items
        const url = `/api/zabbix?host=${encodeURIComponent(host)}&api=${encodeURIComponent(token)}&srv_ip=${encodeURIComponent(srvURL)}`;
        console.log("[v0] fetchZabbixLive URL:", url);
        const response = await fetch(url);
        if (!response.ok) throw new Error("Server Error");

        const result = await response.json();
        console.log("[v0] Zabbix API result:", result);
        if (!result.items) return;

        let html = "";
        result.items.forEach(item => {
            let displayValue = item.lastvalue;
            
            console.log("[v0] Processing item:", item.name, "lastvalue:", item.lastvalue, "valuemap:", item.valuemap);
            
            // Apply Value Mapping - Zabbix API returns it as 'valuemap' with 'mappings' array
            // Check multiple possible property names for compatibility
            const valueMap = item.valuemap || item.value_map || item.valueMap;
            if (valueMap) {
                console.log("[v0] Found valueMap:", valueMap);
                // Check for mappings array (could be 'mappings' or 'mapping')
                const mappings = valueMap.mappings || valueMap.mapping || [];
                console.log("[v0] Mappings:", mappings);
                if (Array.isArray(mappings) && mappings.length > 0) {
                    const match = mappings.find(m => String(m.value) === String(item.lastvalue));
                    if (match && match.newvalue) {
                        console.log("[v0] Value mapped from", item.lastvalue, "to", match.newvalue);
                        displayValue = match.newvalue;
                    }
                }
            }

            // Determine color based on displayValue (mapped name)
            const valueColor = getValueColor(displayValue);
            console.log("[v0] Final displayValue:", displayValue, "color:", valueColor);

            html += `
                <div style="display:flex; justify-content:space-between; padding:6px 0; border-bottom:1px solid #1e293b">
                    <div style="display:flex; flex-direction:column">
                        <span style="color:#94a3b8; font-size:11px;">${item.name}</span>
                    </div>
                    <span style="color:${valueColor}; font-weight:bold; font-family:monospace; align-self:center;">
                        ${displayValue} ${item.units || ''}
                    </span>
                </div>`;
        });
        container.innerHTML = html;
    } catch (err) {
        console.log("[v0] fetchZabbixLive error:", err);
        container.innerHTML = `<div style="color:#f87171;">${err.message}</div>`;
    }
}


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Start the observer automatically
startZabbixGlobalObserver();

// Start the monitors
startGlobalTriggerMonitor();
startGlobalFanMonitor();


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



// static/js/05_zbx_com.js

async function startGlobalTriggerMonitor() {
    // [Web Console Log] Global trigger monitor startup
    // console.log("[ZBX-TRIGGER] Global Trigger Monitor: Active (Fetching All Triggers)");

    setInterval(async () => {
        // 1. Map all 3D devices by their zbxHost for quick lookup
        const deviceMap = {};
        scene.traverse(node => {
            if (node.deviceMetadata && node.deviceMetadata.zbxHost) {
                deviceMap[node.deviceMetadata.zbxHost] = node;
            }
        });

        const trackedHosts = Object.keys(deviceMap);
        if (trackedHosts.length === 0) return;

        // Use metadata from any device to get connection info
        // NOTE: This uses credentials from the first device for the trigger query
        // All devices should ideally share the same Zabbix server for trigger monitoring
        const meta = deviceMap[trackedHosts[0]].deviceMetadata;
        const srvURL = normalizeZabbixURL(meta.zbxSrvIP);
        const api = meta.zbxAPI;

        try {
            // Fetch all triggers for the tracked hosts
            const url = `/api/zabbix?mode=triggers&api=${encodeURIComponent(api)}&srv_ip=${encodeURIComponent(srvURL)}&host=${encodeURIComponent(trackedHosts.join(','))}`;
            const resp = await fetch(url);
            if (!resp.ok) return;
            
            const data = await resp.json();
            
            // If no triggers at all, reset ALL devices to HEALTHY state
            if (!data.result || data.result.length === 0) {
                trackedHosts.forEach(hostName => {
                    const deviceNode = deviceMap[hostName];
                    if (deviceNode && typeof deviceNode.setLEDState === 'function') {
                        deviceNode.setLEDState('HEALTHY');
                    }
                });
                return;
            }

            // 2. Group triggers by Hostname
            const triggersByHost = {};
            data.result.forEach(trigger => {
                const priority = parseInt(trigger.priority);
                if (priority >= 2 && priority <= 5) {
                    const hostName = trigger.hosts[0].host; // Technical host name
                    if (!triggersByHost[hostName]) triggersByHost[hostName] = [];
                    triggersByHost[hostName].push(trigger);
                }
            });

            // 3. Update LED state and show alerts for each device
            // First, reset all devices to HEALTHY (green) state
            trackedHosts.forEach(hostName => {
                const deviceNode = deviceMap[hostName];
                if (deviceNode && typeof deviceNode.setLEDState === 'function') {
                    // If no triggers for this host, set to HEALTHY
                    if (!triggersByHost[hostName] || triggersByHost[hostName].length === 0) {
                        deviceNode.setLEDState('HEALTHY');
                    }
                }
            });
            
            // Now process hosts with triggers
            Object.keys(triggersByHost).forEach(hostName => {
                const deviceNode = deviceMap[hostName];
                const hostTriggers = triggersByHost[hostName];
                
                if (deviceNode && hostTriggers.length > 0) {
                    // Update LED state based on highest priority trigger
                    // Priority: 4-5 = ALARM (Red), 2-3 = WARNING (Yellow)
                    // Higher priority number = more severe
                    const maxPriority = Math.max(...hostTriggers.map(t => parseInt(t.priority)));
                    
                    if (typeof deviceNode.setLEDState === 'function') {
                        if (maxPriority >= 4) {
                            // High (4) or Disaster (5) = ALARM (Red)
                            deviceNode.setLEDState('ALARM');
                        } else if (maxPriority >= 2) {
                            // Warning (2) or Average (3) = WARNING (Yellow)
                            deviceNode.setLEDState('WARNING');
                        }
                    }
                    
                    showTriggerAlert(deviceNode, hostTriggers);
                }
            });
        } catch (err) {
            // [Web Console Log] Trigger monitor sync error
            // console.error("[ZBX-TRIGGER] Trigger Monitor Sync Error:", err);
        }
    }, 10000);
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//######################################################################################################################################


// Add Blinking CSS
if (!document.getElementById('zbx-blink-css')) {
    const style = document.createElement('style');
    style.id = 'zbx-blink-css';
    style.innerHTML = `
        @keyframes alarm-box-blink {
            0% { outline: 3px solid #fff; }
            50% { outline: 3px solid transparent; }
            100% { outline: 3px solid #fff; }
        }
        .zbx-alarm-active {
            animation: alarm-box-blink 0.5s infinite;
        }
    `;
    document.head.appendChild(style);
}

// Track active alerts using a Set for proper stacking
const activeAlerts = new Set();

function showTriggerAlert(deviceNode, triggers) {
    if (!triggers || triggers.length === 0) return;

    const visibleName = triggers[0].hosts[0].name;
    const alertId = `alert-${visibleName.replace(/\s+/g, '-')}`;

    // Priority Map for Labels and Colors
    const severityMap = {
        "2": { label: "Warning", color: "#facc15" },
        "3": { label: "Average", color: "#fb923c" },
        "4": { label: "High", color: "#f87171" },
        "5": { label: "Disaster", color: "#ff4444" }
    };

    // Check if alert already exists for this device to prevent overlapping beeps
    if (document.getElementById(alertId)) return;

    // Trigger Beep
    playAlarmBeep_1();

    // Add to active alerts and get current index
    activeAlerts.add(alertId);
    const alertIndex = Array.from(activeAlerts).indexOf(alertId);

    const alertBox = document.createElement('div');
    alertBox.id = alertId;
    alertBox.className = 'zbx-alarm-active';

    // Style the main container (Gray Background, Bold Text)
    Object.assign(alertBox.style, {
        position: 'fixed',
        padding: '12px',
        background: '#2b2b2b',
        color: '#ffffff',
        fontWeight: 'bold',
        borderRadius: '5px',
        fontSize: '12px',
        zIndex: String(10000 + alertIndex),
        minWidth: '280px',
        maxWidth: '350px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.7)',
        fontFamily: 'monospace',
        pointerEvents: 'none'
    });

    // Generate trigger list: [Severity] Trigger Description with Value
    const triggerLines = triggers.map(t => {
        const sev = severityMap[t.priority] || { label: "Unknown", color: "#fff" };
        // Get the value from the trigger's items if available
        let triggerValue = '';
        if (t.items && t.items.length > 0) {
            const item = t.items[0];
            if (item.lastvalue !== undefined && item.lastvalue !== '') {
                triggerValue = ` [${item.lastvalue}${item.units ? ' ' + item.units : ''}]`;
            }
        }
        return `
            <div style="margin-top:8px; padding-top:6px; border-top:1px solid #444; color:${sev.color}; line-height:1.4;">
                <span style="background:rgba(0,0,0,0.3); padding:1px 4px; border-radius:3px;">
                    [${sev.label.toUpperCase()}]
                </span> 
                ${t.description}<span style="color:#88ccff; font-weight:normal;">${triggerValue}</span>
            </div>`;
    }).join('');

    // Create thin white pointer line element (will be positioned dynamically)
    alertBox.innerHTML = `
        <div style="font-size:14px; color:#fff; border-bottom:2px solid #555; padding-bottom:5px;">
            DEVICE: ${visibleName.toUpperCase()}
        </div>
        <div>
            ${triggerLines}
        </div>
        <div class="alert-pointer-line" style="position:absolute; width:2px; background:#ffffff; bottom:0; left:50%; transform:translateX(-50%);"></div>
    `;

    document.body.appendChild(alertBox);


    // 3D Projection logic with vertical stacking
    function updatePos() {
        if (!alertBox.parentElement) return;
        const vector = new THREE.Vector3();
        deviceNode.getWorldPosition(vector);
        vector.y += 1.0; 
        vector.project(camera);

        const deviceScreenX = (vector.x * 0.5 + 0.5) * window.innerWidth;
        const deviceScreenY = (vector.y * -0.5 + 0.5) * window.innerHeight;

        // Calculate vertical stacking offset - stack one above the other
        const currentIndex = Array.from(activeAlerts).indexOf(alertId);
        const alertHeight = alertBox.offsetHeight || 100;
        const verticalGap = 20; // Gap between stacked alerts
        const verticalOffset = currentIndex * (alertHeight + verticalGap);

        // Position alert centered above device, stacked vertically
        const alertX = deviceScreenX - alertBox.offsetWidth / 2;
        const alertY = deviceScreenY - alertBox.offsetHeight - 50 - verticalOffset;

        alertBox.style.left = `${alertX}px`;
        alertBox.style.top = `${alertY}px`;
        alertBox.style.zIndex = String(10000 + currentIndex);
        
        // Update pointer line to connect alert to device
        const pointerLine = alertBox.querySelector('.alert-pointer-line');
        if (pointerLine) {
            // Calculate line height from bottom of alert box to device position
            const lineHeight = verticalOffset + 50;
            pointerLine.style.height = `${lineHeight}px`;
            pointerLine.style.bottom = `-${lineHeight}px`;
        }
        
        requestAnimationFrame(updatePos);
    }
    updatePos();

    // Auto-remove and remove from active alerts set
    setTimeout(() => {
        alertBox.remove();
        activeAlerts.delete(alertId);
    }, 5000);
}

/*
// Audio helper for the beep sound
function playAlarmBeep_1() {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.type = 'square'; 
        oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); 
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        gainNode.gain.setValueAtTime(1.05, audioCtx.currentTime);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.15); 
    } catch (e) {
        console.log("Audio notice: Click once on the page to enable alarm sounds.");
    }
}

//
// Plays a double-beep siren pattern: 
// Beep (0.15s) -> Short Gap (0.1s) -> Beep (0.15s) -> Long Pause
//
function playSirenPattern() {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        
        // Use a helper to create a single pulse
        const createPulse = (startTime) => {
            const osc = audioCtx.createOscillator();
            const lfo = audioCtx.createOscillator();
            const lfoGain = audioCtx.createGain();
            const gainNode = audioCtx.createGain();

            // Siren Waveform Setup
            osc.type = 'square';
            osc.frequency.setValueAtTime(600, startTime);
            
            // LFO for the "Wail" effect
            lfo.type = 'triangle';
            lfo.frequency.setValueAtTime(150, startTime); // Faster wail for short beeps
            lfoGain.gain.setValueAtTime(150, startTime);
            
            lfo.connect(lfoGain);
            lfoGain.connect(osc.frequency);
            
            osc.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            // Volume Envelope (Quick Fade)
            gainNode.gain.setValueAtTime(0, startTime);
            gainNode.gain.linearRampToValueAtTime(0.1, startTime + 0.02);
            gainNode.gain.linearRampToValueAtTime(0, startTime + 0.15);

            lfo.start(startTime);
            osc.start(startTime);
            lfo.stop(startTime + 1.15);
            osc.stop(startTime + 1.15);
        };

        const now = audioCtx.currentTime;
        
        // Schedule: Pulse 1 -- Pulse 2 -- (Gap/Pause)
        createPulse(now);          // First Beep
        createPulse(now + 0.25);   // Second Beep (Starts after first beep + gap)

    } catch (e) {
        console.log("Audio notice: Browser blocked sound. Click once on the page.");
    }
}

function playSiren_1() {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        
        // The main sound source
        const mainOscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        // The "Wail" controller (LFO)
        const lfo = audioCtx.createOscillator();
        const lfoGain = audioCtx.createGain();

        // 1. Configure Main Sound (The "Voice")
        mainOscillator.type = 'square'; // Aggressive wave format
        mainOscillator.frequency.setValueAtTime(440, audioCtx.currentTime); // Base frequency

        // 2. Configure the Siren "Slide" (The Modulation)
        lfo.type = 'triangle';
        lfo.frequency.setValueAtTime(2, audioCtx.currentTime); // How fast it wails (2 times per second)
        lfoGain.gain.setValueAtTime(200, audioCtx.currentTime); // How high/low the pitch slides

        // 3. Connect LFO to Frequency (This creates the siren wail)
        lfo.connect(lfoGain);
        lfoGain.connect(mainOscillator.frequency);

        // 4. Output Connections
        mainOscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        // Volume Envelope
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1.5);

        // Start and Stop
        lfo.start();
        mainOscillator.start();
        
        // Stop after 1.5 seconds of wailing
        lfo.stop(audioCtx.currentTime + 1.5);
        mainOscillator.stop(audioCtx.currentTime + 1.5);
        
    } catch (e) {
        console.log("Audio notice: Browser blocked sound. Click anywhere on the layout once.");
    }
}


function playSiren_2() {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        
        // The main sound source
        const mainOscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        // The "Wail" controller (LFO)
        const lfo = audioCtx.createOscillator();
        const lfoGain = audioCtx.createGain();

        // 1. Configure Main Sound (The "Voice")
        mainOscillator.type = 'square'; // Aggressive wave format
        mainOscillator.frequency.setValueAtTime(440, audioCtx.currentTime); // Base frequency

        // 2. Configure the Siren "Slide" (The Modulation)
        lfo.type = 'triangle';
        lfo.frequency.setValueAtTime(3, audioCtx.currentTime); // How fast it wails (2 times per second)
        lfoGain.gain.setValueAtTime(100, audioCtx.currentTime); // How high/low the pitch slides

        // 3. Connect LFO to Frequency (This creates the siren wail)
        lfo.connect(lfoGain);
        lfoGain.connect(mainOscillator.frequency);

        // 4. Output Connections
        mainOscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        // Volume Envelope
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1.5);

        // Start and Stop
        lfo.start();
        mainOscillator.start();
        
        // Stop after 1.5 seconds of wailing
        lfo.stop(audioCtx.currentTime + 2.5);
        mainOscillator.stop(audioCtx.currentTime + 2.5);
        
    } catch (e) {
        console.log("Audio notice: Browser blocked sound. Click anywhere on the layout once.");
    }
}


*/


// Example of how to call the updated backend function
async function updateDeviceMetrics(device) {
    const metadata = device.deviceMetadata;
    
    const payload = {
        hostnames: [metadata.zbxHost], // The Zabbix Host Name
        keys: metadata.zbxHostKeys,    // Array of keys
        srv_ip: metadata.zbxSrvIP,     // ✅ Picked from your device variables
        api_token: metadata.zbxAPI     // ✅ Picked from your device variables
    };

    const response = await fetch('/api/zabbix/get_metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    
    const data = await response.json();
    // Update your 3D labels with data...
}


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// FAN STATUS MONITOR - Similar to Trigger Monitor
// Monitors zbxKey for devices with fan animation and updates fanStatus based on fanOnValue
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

async function startGlobalFanMonitor() {
    
    setInterval(async () => {
        // Find all devices with fan configuration (zbxKey and fanOnValue set)
        // MUST also check for updateFan function to ensure we find the correct object
        const fanDevices = [];
        scene.traverse(node => {
            // Check if device has fan configuration AND the updateFan function
            if (node.zbxKey && node.zbxKey !== '' && 
                node.fanOnValue !== undefined && node.fanOnValue !== '' &&
                node.deviceMetadata && node.deviceMetadata.zbxHost &&
                node.updateFan) {  // Critical: must have the animation function
                fanDevices.push(node);
            }
        });

        if (fanDevices.length === 0) return;

        // Process each fan device
        for (const device of fanDevices) {
            try {
                const meta = device.deviceMetadata;
                const srvURL = normalizeZabbixURL(meta.zbxSrvIP);
                const api = meta.zbxAPI;
                const host = meta.zbxHost;
                const zbxKey = device.zbxKey;
                const fanOnValue = String(device.fanOnValue).toUpperCase().trim();

                // Fetch items for this host
                const url = `/api/zabbix?host=${encodeURIComponent(host)}&api=${encodeURIComponent(api)}&srv_ip=${encodeURIComponent(srvURL)}`;
                const resp = await fetch(url);
                if (!resp.ok) continue;

                const result = await resp.json();
                if (!result.items || result.items.length === 0) continue;

                // Find the item matching zbxKey
                const fanItem = result.items.find(item => item.key_ === zbxKey);
                if (fanItem) {
                    // Get raw value from Zabbix
                    const rawZabbixVal = String(fanItem.lastvalue || '').toUpperCase().trim();
                    
                    // Get value mapping string if available
                    // Zabbix returns valuemap with mappings array containing {value, newvalue}
                    let mappedValue = rawZabbixVal;
                    if (fanItem.valuemap && fanItem.valuemap.mappings) {
                        const mapping = fanItem.valuemap.mappings.find(
                            m => String(m.value).toUpperCase().trim() === rawZabbixVal
                        );
                        if (mapping && mapping.newvalue) {
                            mappedValue = String(mapping.newvalue).toUpperCase().trim();
                        }
                    }
                    
                    // Compare with fanOnValue - check BOTH raw value AND mapped value
                    // User can enter either "1" (raw) or "ON" (mapped) in fanOnValue field
                    if (rawZabbixVal === fanOnValue || mappedValue === fanOnValue) {
                        device.fanStatus = 'ON';
                    } else {
                        device.fanStatus = 'OFF';
                    }
                }
            } catch (e) {
                // Silent fail for individual device errors
            }
        }
    }, 10000); // Check every 10 seconds (same as trigger monitor)
}
