

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
let isFetchingNetbox = false;


// static/js/06_netbox_com.js

async function convertSvgToImage(proxyUrl) {

    // We fetch the text first to ensure we have the modified SVG from the proxy
    const resp = await fetch(proxyUrl);
    const svgText = await resp.text();

    // Create a Blob. This is critical for rendering internal images in a Canvas
    const svgBlob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
            const canvas = document.createElement('canvas');
            // NetBox SVGs are high-detail; use a large canvas for clarity
            canvas.width = img.width || 500;
            canvas.height = img.height || 1500;

            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            URL.revokeObjectURL(url);
            resolve(canvas);
        };
        img.onerror = (err) => {
            //console.error("SVG Inner Image Load Error:", err);
            reject(err);
        };
        img.src = url;
    });

}



window.applyNetboxElevations = async function(rackGroup) {
    // 1. Validate Metadata
    const meta = rackGroup.deviceMetadata;
    if (!meta || !meta.NBFront) {
        //console.warn("[NetBox] No metadata found for rack:", rackGroup.name);
        return;
    }

    const apiToken = meta.NBAPI;
    const refreshSeconds = 10;     ///// New


    // --- 2. LIVE DATA FETCHING FOR HOVER POPUP ---
    // Extract Rack ID and NetBox base URL from the provided URL string
    try {
        	const urlParts = meta.NBFront.split('/');
        	const rackID = urlParts[urlParts.length - 3];
        	
        	// Extract NetBox base URL - handle both with and without http:// prefix
        	// Case 1: "http://148.113.5.163:5010/api/..." -> urlParts = ["http:", "", "148.113.5.163:5010", "api", ...]
        	// Case 2: "148.113.5.163:5010/api/..." -> urlParts = ["148.113.5.163:5010", "api", "dcim", ...]
        	let netboxIP;
        	if (meta.NBFront.startsWith('http://') || meta.NBFront.startsWith('https://')) {
        	    // URL has protocol - extract it properly
        	    netboxIP = `${urlParts[0]}//${urlParts[2]}`;
        	} else {
        	    // URL has no protocol - first part is the host:port, add http://
        	    netboxIP = `http://${urlParts[0]}`;
        	}

	        // Fetch live stats (U height, usage, name) from NetBox API
        	const runUpdate = async () => {

	        // Pass Zabbix credentials from rack metadata for power/cooling data
	        // zbxHost is the actual Zabbix host name configured in containerroom.js
	        const info = await rack_information(rackID, apiToken, netboxIP, meta.zbxSrvIP, meta.zbxAPI, meta.zbxHost);
        		if (info) {
          	  		// Attach data directly to the group so Raycaster can find it on hover
            			rackGroup.userData.netboxStats = info;
            			rackGroup.userData.isNetBoxRack = true;
            			//console.log(`%c[NetBox] Live stats attached to ${rackGroup.name}`, "color: #00ff00;");
        		}
		};
	await runUpdate();
	setInterval(runUpdate, refreshSeconds * 1000);

	} catch (e) {
        //console.error("[NetBox] Failed to fetch hover information:", e);
    	}


    //console.log(`%c[DEBUG-FRONTEND] Starting NetBox overlay for: ${rackGroup.name}`, "color: #00ff00; font-weight: bold;");

    // 3. Prepare URLs for Image Rendering
    const prepareUrl = (url) => {
        try {
            let u = new URL(url);
            u.searchParams.set('view', 'images'); // Ensures server faceplates are visible
            u.searchParams.set('render', 'svg');
            return u.toString();
        } catch (e) {
            let separator = url.includes('?') ? '&' : '?';
            return `${url}${separator}view=images&render=svg`;
        }
    };

    const frontUrl = prepareUrl(meta.NBFront);
    const rearUrl = meta.NBRear ? prepareUrl(meta.NBRear) : null;

    // 4. Find the Rack Mesh inside the group
    let targetMesh = null;
    rackGroup.traverse((child) => {
        if (child.isMesh && child.geometry.type === "BoxGeometry") {
            targetMesh = child;
        }
    });

    if (!targetMesh) {
        //console.error("[DEBUG-FRONTEND] Could not find BoxGeometry mesh in rackGroup.");
        return;
    }

    // 5. Ensure material is an array for multi-side texturing
    if (!Array.isArray(targetMesh.material)) {
        const baseMat = targetMesh.material.clone();
        targetMesh.material = [
            baseMat.clone(), baseMat.clone(), baseMat.clone(),
            baseMat.clone(), baseMat.clone(), baseMat.clone()
        ];
    }

    // 6. Function to fetch, bake, and apply the SVG texture
    const superimpose = async (url, faceIndex, offsetPos) => {
        const proxyPath = `/api/netbox/proxy?url=${encodeURIComponent(url)}&token=${encodeURIComponent(apiToken)}`;

        try {
            const response = await fetch(proxyPath);
            const svgText = await response.text();

            if (!svgText.includes('<svg')) {
                //console.error(`[NetBox] Invalid SVG for face ${faceIndex}`);
                return;
            }

            const texture = await new Promise((resolve, reject) => {
                const img = new Image();
                const encodedSvg = btoa(unescape(encodeURIComponent(svgText)));
                img.src = "data:image/svg+xml;base64," + encodedSvg;

                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = 1024; // High res for sharp server images
                    canvas.height = 2048;
                    const ctx = canvas.getContext('2d');

                    ctx.fillStyle = "white"; // NetBox background
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                    const tex = new THREE.CanvasTexture(canvas);
                    tex.colorSpace = THREE.SRGBColorSpace;
                    tex.anisotropy = 16;
                    resolve(tex);
                };
                img.onerror = (e) => reject(e);
            });

            if (faceIndex === 5) { // Flip rear face
                texture.repeat.set(-1, 1);
                texture.offset.set(1, 0);
            }

            // Apply to main mesh side
            const mat = targetMesh.material[faceIndex];
            mat.map = texture;
            mat.color.setHex(0xffffff);
            mat.needsUpdate = true;

            // Create high-resolution Overlay Plane
            const planeGeo = new THREE.PlaneGeometry(0.65, 1.85);
            const planeMat = new THREE.MeshBasicMaterial({
                map: texture,
                transparent: true,
                side: THREE.DoubleSide,
                polygonOffset: true,
                polygonOffsetFactor: -1,
                polygonOffsetUnits: -1
            });

            const overlayPlane = new THREE.Mesh(planeGeo, planeMat);
            overlayPlane.position.set(offsetPos.x, offsetPos.y, offsetPos.z);
            rackGroup.add(overlayPlane);

        } catch (err) {
            //console.error(`[NetBox] Error processing face ${faceIndex}:`, err);
        }
    };

    // 7. Execute Front and Rear loads
    await Promise.all([
        superimpose(frontUrl, 4, { x: 0, y: 0, z: 0.51 }),
        rearUrl ? superimpose(rearUrl, 5, { x: 0, y: 0, z: -0.51 }) : Promise.resolve()
    ]);

    //console.log(`%c[DEBUG-FRONTEND] Finished processing: ${rackGroup.name}`, "color: #00ff00; font-weight: bold;");
};


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// ==========================================
// 1. DCIM MODULE
// ==========================================


async function processDCIM(rackID, apiToken, netboxIP, rackData) {
    try {
        let allUnits = [];
        // netboxIP already contains protocol (http:// or https://), don't add it again
        let nextUrl = `${netboxIP}/api/dcim/racks/${rackID}/elevation/`;

        // 1. Fetch ALL pages (Handling the pagination you see in the log)
        while (nextUrl) {
            const proxyUrl = `/api/netbox/proxy?url=${encodeURIComponent(nextUrl)}&token=${encodeURIComponent(apiToken)}`;
            const resp = await fetch(proxyUrl);
            const data = await resp.json();

            const pageResults = Array.isArray(data) ? data : (data.results || []);
            allUnits = allUnits.concat(pageResults);

            // Move to next page if it exists
            nextUrl = data.next || null;
        }

        //console.log(`Total items fetched for Rack ${rackData.name}:`, allUnits.length); for debugging

        const totalRackU = parseInt(rackData.u_height) || 42;
        const occupiedFullUnits = new Set();
        const uniqueDevices = new Map();

        // 2. Process all slots (including 0.5U increments)
        allUnits.forEach(slot => {
            if (slot.occupied === true || slot.device !== null) {
                // Convert "U18.5" or 18.5 or "18" into the integer 18
                // We use Math.floor to group 18.0 and 18.5 into the same 1U space
                const rawName = slot.name.replace(/[^\d.]/g, ''); // Remove 'U' or other chars
                const uNumber = Math.floor(parseFloat(rawName));
                
                if (!isNaN(uNumber)) {
                    occupiedFullUnits.add(uNumber);
                }

                // Track unique devices for the count
                if (slot.device && slot.device.id) {
                    if (!uniqueDevices.has(slot.device.id)) {
                        const h = slot.device.device_type?.u_height || slot.device.u_height || 1;
                        uniqueDevices.set(slot.device.id, parseInt(h));
                    }
                }
            }
        });

        // 3. Final Calculations
        // Size of the Set is the number of unique 1U spaces that have at least one occupied half-slot
        const finalOccupiedCount = occupiedFullUnits.size; 
        const freeUnitsCount = totalRackU - finalOccupiedCount;

        const occupiedPct = totalRackU > 0 ? ((finalOccupiedCount / totalRackU) * 100).toFixed(1) + "%" : "0%";
        const freePct = totalRackU > 0 ? ((freeUnitsCount / totalRackU) * 100).toFixed(1) + "%" : "0%";

        return {
            u_total: totalRackU,
            u_occupied_pct: occupiedPct,
            u_free_pct: freePct,
            dev_count: rackData.device_count || uniqueDevices.size,
            raw_debug_html: `
                <b>${rackData.name}</b><br>
                Occupied: ${finalOccupiedCount}U (${occupiedPct})<br>
                Free: ${freeUnitsCount}U
            `
        };

    } catch (err) {
        // [Web Console Log] DCIM pagination/processing error
        // console.error("[DCIM] Pagination/Processing Error:", err);
        return { u_total: 42, u_occupied_pct: "0%", u_free_pct: "100%", dev_count: 0 };
    }
}


// --- GLOBAL CONFIGURATION ---
const RACK_SETTINGS = {
    TOTAL_POWER_CAPACITY: 50.0, // kW
    REFRESH_SECONDS: 10,
    ZABBIX_HOST_PREFIX: "rack_", // Results in host: rack_1, rack_2
    ZABBIX_BASE_KEYS: {
        temp: ".temp",   // Will become rack1.temp
        rh: ".rh",       // Will become rack1.rh
        power: ".power"  // Will become rack1.power
    }
};

// Helper: Standard Fetch for Zabbix
async function fetchZabbixData(payload) {
    const resp = await fetch('/api/zabbix/get_metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    return resp.ok ? await resp.json() : {};
}


// =================================================
// 2. POWER MODULE (Updated for Rack Host Logic)
// =================================================

async function processPower(zbxHost, rackID, zabbixMetrics) {
    // [Web Console Log] Power module - processes rack power data from Zabbix
    try {
        // Use zbxHost from rack configuration for data lookup
        const hostName = zbxHost;
        const powerKey = `rack${rackID}${RACK_SETTINGS.ZABBIX_BASE_KEYS.power}`;

        // Ensure we handle the value as a Float immediately
        const rawVal = zabbixMetrics[hostName]?.[powerKey];
        const presentLoad = rawVal ? parseFloat(rawVal) : 0.00;

        const totalCapacity = parseFloat(RACK_SETTINGS.TOTAL_POWER_CAPACITY);
        const remainingLoad = totalCapacity - presentLoad;

        return {
            p_total: totalCapacity.toFixed(2),
            p_present: presentLoad.toFixed(2), // Forces 0.00 format
            p_remain: remainingLoad.toFixed(2)
        };
    } catch (err) {
        // [Web Console Log] Power module error
        // console.error("[POWER] Power Module Error:", err);
        return { p_total: "0.00", p_present: "0.00", p_remain: "0.00" };
    }
}


// ==================================================
// 3. COOLING MODULE (Updated for Rack Host Logic)
// ==================================================

async function processCooling(zbxHost, rackID, zabbixMetrics) {
    // [Web Console Log] Cooling module - processes rack temperature and humidity from Zabbix
    try {
        // Use zbxHost from rack configuration for data lookup
        const hostName = zbxHost;
        const tKey = `rack${rackID}${RACK_SETTINGS.ZABBIX_BASE_KEYS.temp}`;
        const hKey = `rack${rackID}${RACK_SETTINGS.ZABBIX_BASE_KEYS.rh}`;

        const hostData = zabbixMetrics[hostName];

        // Check if data exists, then parse to float, then fix to 1 decimal
        const rawT = hostData?.[tKey];
        const rawH = hostData?.[hKey];

        const avgTemp = (rawT !== undefined && rawT !== null) 
            ? parseFloat(rawT).toFixed(2) 
            : "--";
            
        const avgRH = (rawH !== undefined && rawH !== null) 
            ? parseFloat(rawH).toFixed(2) 
            : "--";

        return {
            temp: avgTemp !== "--" ? `${avgTemp}°C` : "--°C",
            rh: avgRH !== "--" ? `${avgRH}%` : "--%"
        };
    } catch (err) {
        // [Web Console Log] Cooling module error
        // console.error("[COOLING] Cooling Module Error:", err);
        return { temp: "--°C", rh: "--%" };
    }
}


// ==========================================
// 4. GENERIC ORCHESTRATOR
// ==========================================
async function rack_information(rackID, apiToken, netboxIP, zbxSrvIP, zbxAPI, zbxHost) {
    // [Web Console Log] Rack information orchestrator - fetches NetBox and Zabbix data
    if (!rackID) return null;

    try {
        // Step 1: Basic NetBox Fetch (Unchanged)
        // Support full URL format for netboxIP
        const normalizedNetboxIP = netboxIP.startsWith('http://') || netboxIP.startsWith('https://') 
            ? netboxIP 
            : `http://${netboxIP}`;
        const baseUrl = `${normalizedNetboxIP}/api/dcim`;
        const [rackResp, devResp] = await Promise.all([
            fetch(`/api/netbox/proxy?url=${encodeURIComponent(`${baseUrl}/racks/${rackID}/`)}&token=${encodeURIComponent(apiToken)}`),
            fetch(`/api/netbox/proxy?url=${encodeURIComponent(`${baseUrl}/devices/?rack_id=${rackID}`)}&token=${encodeURIComponent(apiToken)}`)
        ]);

        const rackData = await rackResp.json();
        const devices = (await devResp.json()).results || [];

        // Step 2: Fetch Zabbix Data - Use zbxHost from rack metadata (NOT hardcoded pattern)
        let zabbixMetrics = {};
        
        // Only fetch Zabbix data if credentials AND zbxHost are provided
        if (zbxSrvIP && zbxAPI && zbxHost) {
            try {
                // Use the actual zbxHost from rack configuration instead of hardcoded pattern
                const hostName = zbxHost;
                const dynamicKeys = [
                    `rack${rackID}${RACK_SETTINGS.ZABBIX_BASE_KEYS.temp}`,
                    `rack${rackID}${RACK_SETTINGS.ZABBIX_BASE_KEYS.rh}`,
                    `rack${rackID}${RACK_SETTINGS.ZABBIX_BASE_KEYS.power}`
                ];

                // [Web Console Log] Zabbix fetch debug info
                // console.log(`[RACK-ZBX] Fetching Zabbix: Host=${hostName}, Keys=`, dynamicKeys, `Server=${zbxSrvIP}`);

                // Normalize Zabbix server URL
                const normalizedZbxIP = zbxSrvIP.startsWith('http://') || zbxSrvIP.startsWith('https://') 
                    ? zbxSrvIP 
                    : `http://${zbxSrvIP}`;

                zabbixMetrics = await fetchZabbixData({
                    hostnames: [hostName],
                    keys: dynamicKeys,
                    srv_ip: normalizedZbxIP,
                    api_token: zbxAPI
                });
            } catch (zErr) {
                // [Web Console Log] Zabbix error
                // console.warn("[RACK-ZBX] Zabbix unavailable - Using defaults:", zErr);
            }
        } else {
            // [Web Console Log] Missing Zabbix credentials
            // console.warn("[RACK-ZBX] No Zabbix credentials/host provided for rack - skipping Zabbix fetch");
        }

        // Step 3: Call generic modules (Updated to pass zbxHost for proper data mapping)
        const [dcim, power, cooling] = await Promise.all([
            processDCIM(rackID, apiToken, netboxIP, rackData),
            processPower(zbxHost, rackID, zabbixMetrics),   // Pass zbxHost for correct key lookup
            processCooling(zbxHost, rackID, zabbixMetrics)  // Pass zbxHost for correct key lookup
        ]);

        // Step 4: Final Assembly (Unchanged)
        return {
            name: rackData.name || "N/A",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            ...dcim,
            ...power,
            ...cooling
        };

    } catch (err) {
        // [Web Console Log] Rack information orchestrator error
        // console.error("[ORCHESTRATOR] Orchestrator Error:", err);
        return null;
    }
}


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function buildTooltipTable(data) {
    // --- 1. IF DATA IS FROM ZABBIX (UPS, PDU, Sensors, FAS Panel) ---
    if (data.items) {
        let rows = "";

        // Process up to 30 items
        data.items.slice(0, 30).forEach(item => {
            // Start with the value stored in the object
            let displayValue = item.lastvalue;

            /**
             * ROBUST MAPPING LOGIC (Safety Fallback)
             * Even if 05_zbx_com.js failed to map it, we check here.
             * This replicates your zbxpy.py logic: if item.valuemap exists, find the match.
             */
            //if (item.valuemap && item.valuemap.mappings && Array.isArray(item.valuemap.mappings)) {
            if (item.valuemap && Array.isArray(item.valuemap.mappings)) {
                const rawValStr = item.lastvalue !== null ? item.lastvalue.toString().trim() : "";
                // Find match using loose equality (==) to match Python's behavior
                const match = item.valuemap.mappings.find(m => m.value == rawValStr);
                if (match) {
                    displayValue = match.newvalue; // Change "0" to "Normal", etc.
                }
            }
            const unit = item.units || '';

            rows += `
                <tr>
                    <td style="border: 1px solid #3b82f6; padding: 2px; color: #94a3b8; font-size:9px;">${item.name}</td>
                    <td style="border: 1px solid #3b82f6; padding: 2px; text-align: right; color: #4ade80; font-weight:bold;">
                        ${displayValue} <span style="font-size:7px; color: #60a5fa;">${unit}</span>
                    </td>
                </tr>`;
        });

        return `
            <div style="font-weight:bold; color:#60a5fa; border-bottom:1px solid #3b82f6; margin-bottom:4px; display:flex; justify-content:space-between; align-items:center;">
                <span>${data.name}</span>
                <span style="font-size:8px; color:#fff;">${data.time}</span>
            </div>
            <table style="width:100%; border-collapse:collapse; font-size:10px;">
                ${rows}
            </table>
        `;
    }

    // --- 2. DATA IS FROM NETBOX (Racks/DCIM) ---
    // If it's not Zabbix data, check for Netbox specific fields
    if (data.u_total !== undefined) {
        return `
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #3b82f6; padding-bottom: 3px; margin-bottom: 5px;">
            <span style="font-weight: bold; font-size: 12px; color: #3b82f6; text-transform: uppercase;">${data.name}</span>
            <span style="font-size: 10px; color: #FFFFFF; font-family: 'Courier New', monospace;">${data.time}</span>
        </div>

        <table style="width: 100%; border-collapse: collapse; font-size: 10px; color: white; font-family: sans-serif;">
            <tr style="background: rgba(59, 130, 246, 0.15);">
                <td colspan="2" style="border: 1px solid #3b82f6; padding: 3px; text-align: center; font-weight: bold; color: #3b82f6; text-transform: uppercase;">Environment</td>
            </tr>
            <tr>
                <td style="border: 1px solid #3b82f6; padding: 3px;">Temperature</td>
                <td style="border: 1px solid #3b82f6; padding: 3px; text-align: right; font-weight: bold;">${data.temp || 'N/A'}</td>
            </tr>
            <tr>
                <td style="border: 1px solid #3b82f6; padding: 3px;">Humidity</td>
                <td style="border: 1px solid #3b82f6; padding: 3px; text-align: right; font-weight: bold;">${data.rh || 'N/A'}</td>
            </tr>

            <tr style="background: rgba(59, 130, 246, 0.15);">
                <td colspan="2" style="border: 1px solid #3b82f6; padding: 3px; text-align: center; font-weight: bold; color: #3b82f6; text-transform: uppercase;">Power Capacity</td>
            </tr>
            <tr>
                <td style="border: 1px solid #3b82f6; padding: 3px;">Total Capacity</td>
                <td style="border: 1px solid #3b82f6; padding: 3px; text-align: right;">${data.p_total || 0} kW</td>
            </tr>
            <tr>
                <td style="border: 1px solid #3b82f6; padding: 3px;">Present Load</td>
                <td style="border: 1px solid #3b82f6; padding: 3px; text-align: right; color: #ffcc00; font-weight: bold;">${data.p_present || 0} kW</td>
            </tr>
            <tr>
                <td style="border: 1px solid #3b82f6; padding: 3px;">Remaining</td>
                <td style="border: 1px solid #3b82f6; padding: 3px; text-align: right; color: #3b82f6; font-weight: bold;">${data.p_remain || 0} kW</td>
            </tr>

            <tr style="background: rgba(59, 130, 246, 0.15);">
                <td colspan="2" style="border: 1px solid #3b82f6; padding: 3px; text-align: center; font-weight: bold; color: #3b82f6; text-transform: uppercase;">U-Space Usage</td>
            </tr>
            <tr>
                <td style="border: 1px solid #3b82f6; padding: 3px;">Total Capacity</td>
                <td style="border: 1px solid #3b82f6; padding: 3px; text-align: right;">${data.u_total} U</td>
            </tr>
            <tr>
                <td style="border: 1px solid #3b82f6; padding: 3px;">Occupied</td>
                <td style="border: 1px solid #3b82f6; padding: 3px; text-align: right;">${data.u_occupied_pct}</td>
            </tr>
            <tr>
                <td style="border: 1px solid #3b82f6; padding: 3px;">Free Space</td>
                <td style="border: 1px solid #3b82f6; padding: 3px; text-align: right; color: #3b82f6;">${data.u_free_pct}</td>
            </tr>
            <tr>
                <td style="border: 1px solid #3b82f6; padding: 3px;">Device Count</td>
                <td style="border: 1px solid #3b82f6; padding: 3px; text-align: right;">${data.dev_count}</td>
            </tr>
        </table>`;
    }

    // --- 3. FALLBACK DEFAULT ---
    return `
        <div style="font-weight:bold; color:#3b82f6; border-bottom:1px solid #3b82f6; margin-bottom:4px;">${data.name}</div>
        <div style="font-size:10px; color:#fff;">No detailed metrics available</div>
    `;
}


