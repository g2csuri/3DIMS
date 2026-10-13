// static/js/device_library/createDamper.js

function createDamper(scene, options = {}) {
    const {
        // Core structural bounding metrics (W, H, and 400mm Depth from blueprints)
        deviceWidth = 1.0,   // "W" dimension in layout drawings
        deviceHeight = 1.0,  // "H" dimension in layout drawings
        deviceDepth = 0.4,   // Standardized 400mm sleeve depth mapping
        devicePosition = { x: 0, y: 0, z: 0 },

        // Explicit number of blades control (e.g., 4, 6, 8). If null, auto-calculates.
        numberOfFins = null, 

        // Material Aesthetics, Metal Alloys & Outlines
        frameColor = 0xA0A5A9,      // Galvanized steel frame color
        bladeColor = 0xB5B9BC,      // Interlocking 3-V type blades material
        actuatorColor = 0x333333,   // Motor housing unit (Default dark gray industrial finish)
        outlineColor = 0x555555,    // Edge line contour highlighting
        outlineVisible = 'Enable',  // 'Enable' or 'Close' to control line overlays

        // Facing Orientation: 'Front', 'Back', 'Left', 'Right'
        deviceOrientation = 'Front',

        // ===== SYSTEM ANIMATION STATE CONTROL MAPPED TO GLOBAL ENGINE =====
        damperEnabled = true,           // Master animation state toggle
        fanStatus = 'OFF',              // MAPPED: 'ON' means Open / 'OFF' means Closed to match global loop
        fanSpeed = 1.0,                 // Multiplier for rotation speed (acting as transition speed here)
        zbxKey = '',                    // Zabbix item monitoring lookup reference key (e.g., 'status.damper')
        damperOnValue = '1',            // Target status value that forces a fully 'OPEN' state (e.g., '1' or 'open')

        // ===== DATA REPOSITORY AND ASSET IDENTIFIERS =====
        deviceId = '',
        category = 'hvac_control',
        urlLink = '',
        zbxSrvIP = '',
        zbxAPI = '',
        zbxHost = '',
        zbxHostKeys = [],
        zbxHostKeyValues = []
    } = options;

    const damperGroup = new THREE.Group();
    scene.add(damperGroup);

    // --- 1. CORE PIPELINE METALS & INDEPENDENT MATERIALS ---
    const frameMat = new THREE.MeshStandardMaterial({
        color: frameColor,
        roughness: 0.4,
        metalness: 0.8,
        side: THREE.DoubleSide
    });

    const bladeMat = new THREE.MeshStandardMaterial({
        color: bladeColor,
        roughness: 0.3,
        metalness: 0.85,
        side: THREE.DoubleSide
    });

    const actuatorMat = new THREE.MeshPhongMaterial({
        color: actuatorColor,
        shininess: 40
    });

    const mechanicalHardwareMat = new THREE.MeshStandardMaterial({
        color: 0x666666,
        roughness: 0.5,
        metalness: 0.7
    });

    const outlineMat = new THREE.LineBasicMaterial({
        color: outlineColor,
        linewidth: 1
    });

    // Helper: Attaches clean engineering vector lines to surfaces
    const applyOutline = (mesh, geometry) => {
        if (outlineVisible.toUpperCase() !== 'ENABLE') return;
        const edges = new THREE.EdgesGeometry(geometry);
        const line = new THREE.LineSegments(edges, outlineMat);
        mesh.add(line);
    };

    // --- 2. STRUCTURAL CONSTRUCTION (SLEEVE AND COLLAR HOUSING) ---
    const frameThick = 0.04; // Outer flange lip depth border
    const internalDepth = deviceDepth - 0.002;

    const outerCasingShape = new THREE.Shape();
    outerCasingShape.moveTo(-deviceWidth / 2, -deviceHeight / 2);
    outerCasingShape.lineTo(deviceWidth / 2, -deviceHeight / 2);
    outerCasingShape.lineTo(deviceWidth / 2, deviceHeight / 2);
    outerCasingShape.lineTo(-deviceWidth / 2, deviceHeight / 2);
    outerCasingShape.closePath();

    const innerHoleCutout = new THREE.Path();
    innerHoleCutout.moveTo(-deviceWidth / 2 + frameThick, -deviceHeight / 2 + frameThick);
    innerHoleCutout.lineTo(deviceWidth / 2 - frameThick, -deviceHeight / 2 + frameThick);
    innerHoleCutout.lineTo(deviceWidth / 2 - frameThick, deviceHeight / 2 - frameThick);
    innerHoleCutout.lineTo(-deviceWidth / 2 + frameThick, deviceHeight / 2 - frameThick);
    innerHoleCutout.closePath();
    outerCasingShape.holes.push(innerHoleCutout);

    const casingExtSettings = { depth: internalDepth, bevelEnabled: false };
    const casingGeo = new THREE.ExtrudeGeometry(outerCasingShape, casingExtSettings);
    const casingMesh = new THREE.Mesh(casingGeo, frameMat);
    casingMesh.position.z = -internalDepth / 2; // Centralize local origin alignment
    applyOutline(casingMesh, casingGeo);
    damperGroup.add(casingMesh);

    // Front/Back Thin Interlocking Flange Lips
    const lipGeo = new THREE.BoxGeometry(deviceWidth + 0.02, frameThick, 0.01);
    const topLip = new THREE.Mesh(lipGeo, frameMat);
    topLip.position.set(0, deviceHeight / 2 - frameThick / 2, internalDepth / 2);
    damperGroup.add(topLip);

    // --- 3. BLADE ARCHITECTURE BLOCK (3-V COUPLING) ---
    const usableHeight = deviceHeight - (frameThick * 2);
    const usableWidth = deviceWidth - (frameThick * 2);

    const numBlades = (numberOfFins !== null && parseInt(numberOfFins) > 0) 
        ? parseInt(numberOfFins) 
        : Math.max(3, Math.floor(usableHeight / 0.14)); 
        
    const singleBladeHeight = usableHeight / numBlades;
    const bladePivotsArray = [];

    // Form geometric path extrusion modeling the 3-V reinforcement rib system
    const bladeProfileShape = new THREE.Shape();
    const halfH = singleBladeHeight / 2;
    const wThick = 0.006; 

    bladeProfileShape.moveTo(-wThick, -halfH);
    bladeProfileShape.lineTo(wThick, -halfH);
    bladeProfileShape.lineTo(wThick + 0.015, -halfH * 0.4);
    bladeProfileShape.lineTo(wThick, 0);
    bladeProfileShape.lineTo(wThick + 0.015, halfH * 0.4);
    bladeProfileShape.lineTo(wThick, halfH);
    bladeProfileShape.lineTo(-wThick, halfH);
    bladeProfileShape.lineTo(-wThick + 0.015, halfH * 0.4);
    bladeProfileShape.lineTo(-wThick, 0);
    bladeProfileShape.lineTo(-wThick + 0.015, -halfH * 0.4);
    bladeProfileShape.closePath();

    const bladeExtSettings = { depth: usableWidth - 0.01, bevelEnabled: false };
    const bladeBaseGeo = new THREE.ExtrudeGeometry(bladeProfileShape, bladeExtSettings);
    
    bladeBaseGeo.center();
    bladeBaseGeo.rotateY(Math.PI / 2); // Rotate mesh geometry flat (closed orientation position)

    const startY = (usableHeight / 2) - (singleBladeHeight / 2);

    for (let i = 0; i < numBlades; i++) {
        const pivotGroup = new THREE.Group();
        pivotGroup.position.set(0, startY - (i * singleBladeHeight), 0);

        // Core Blade Segment Mesh
        const mainBladeMesh = new THREE.Mesh(bladeBaseGeo, bladeMat);
        applyOutline(mainBladeMesh, bladeBaseGeo);
        pivotGroup.add(mainBladeMesh);

        // Structural Axle Rod (Aligned parallel inside the layout housing profile)
        const axleGeo = new THREE.CylinderGeometry(0.006, 0.006, usableWidth + 0.01, 8);
        const axleMesh = new THREE.Mesh(axleGeo, mechanicalHardwareMat);
        axleMesh.rotation.z = Math.PI / 2; 
        pivotGroup.add(axleMesh);

        // Mechanical Drive Linkage Bracket Component (Parallel inside blade profiles)
        const bracketGeo = new THREE.BoxGeometry(0.01, 0.04, 0.015);
        const bracketMesh = new THREE.Mesh(bracketGeo, mechanicalHardwareMat);
        bracketMesh.position.set(usableWidth / 2 - 0.03, halfH * 0.5, 0.01);
        pivotGroup.add(bracketMesh);

        damperGroup.add(pivotGroup);
        bladePivotsArray.push(pivotGroup);
    }

    // --- 4. MOTORIZED SIDE ACTUATOR BOX & CONTINUOUS LINKAGE BAR ---
    const actuatorW = 0.09;
    const actuatorH = 0.16;
    const actuatorD = 0.14;

    const actGeo = new THREE.BoxGeometry(actuatorW, actuatorH, actuatorD);
    const actuatorMesh = new THREE.Mesh(actGeo, actuatorMat);
    actuatorMesh.position.set(deviceWidth / 2 + actuatorW / 2, 0, 0);
    applyOutline(actuatorMesh, actGeo);
    damperGroup.add(actuatorMesh);

    // Vertical Interconnected Drive Linkage Bar
    const linkageHeight = usableHeight - (singleBladeHeight * 0.5);
    const linkageBarMesh = new THREE.Mesh(new THREE.BoxGeometry(0.006, linkageHeight, 0.015), mechanicalHardwareMat);
    linkageBarMesh.position.set(usableWidth / 2 - 0.03, 0, 0.02);
    damperGroup.add(linkageBarMesh);

    // --- 5. SYSTEM GEOMETRY CARDINAL LOOK ORIENTATION MATRIX ---
    damperGroup.position.set(devicePosition.x, devicePosition.y, devicePosition.z);

    const targetHeading = deviceOrientation.toUpperCase().trim();
    switch (targetHeading) {
        case 'LEFT':  damperGroup.rotation.y = Math.PI / 2;  break;
        case 'RIGHT': damperGroup.rotation.y = -Math.PI / 2; break;
        case 'BACK':  damperGroup.rotation.y = Math.PI;      break;
        case 'FRONT':
        default:      damperGroup.rotation.y = 0;             break;
    }

    // =================================================================
    // 6. RUNTIME TELEMETRY ENGINE (DRIVEN VIA GLOBAL VARIABLE STRATEGY)
    // =================================================================
    damperGroup.bladePivots = bladePivotsArray;
    
    // Core synchronization properties renaming to mirror the fan loop interface perfectly:
    damperGroup.fanStatus = String(fanStatus).toUpperCase(); 
    damperGroup.fanSpeedMultiplier = parseFloat(fanSpeed);
    damperGroup.zbxKey = String(zbxKey).trim();
    damperGroup.fanOnValue = String(damperOnValue).trim(); // Mapping to look for what means "ON" (Open)
    
    damperGroup.currentBladeAngle = 0.0; // Current actual tracking state angle interpolation

    // --- LIVE PARSING STREAM INTERFACE ---
    damperGroup.applyLiveData = function(row) {
        if (!row || !this.zbxKey) return;

        let detectedValue = undefined;

        if (row.key === this.zbxKey || row.itemkey === this.zbxKey || row.zbxKey === this.zbxKey) {
            detectedValue = (row.value !== undefined) ? row.value : row.status;
        } 
        else if (row[this.zbxKey] !== undefined) {
            detectedValue = row[this.zbxKey];
        }

        if (detectedValue !== undefined && detectedValue !== null) {
            let normalizeCheck = String(detectedValue).trim().toLowerCase();
            let assertionValue = String(this.fanOnValue).toLowerCase();

            // If incoming metric equals configured value, target state becomes 'ON' (meaning open)
            if (normalizeCheck === assertionValue || normalizeCheck === 'open' || normalizeCheck === 'true' || normalizeCheck === '1') {
                this.fanStatus = 'ON';
            } else {
                this.fanStatus = 'OFF';
            }
        }
        
        if (row.fan_speed !== undefined) {
            this.fanSpeedMultiplier = parseFloat(row.fan_speed);
        }
    };

    // --- GLOBAL LAYOUT COMPATIBLE ANIMATION LOOP HOOK ---
    // This will now catch your global requestAnimationFrame loop natively.
    damperGroup.updateFan = function(dt) {
        if (!dt) dt = 0.016; 
        if (!damperEnabled) return;

        // Force layout speed calculations
        this.fanSpeedMultiplier = parseFloat(options.fanSpeed || 1.0);

        // Map global variables to localized structural angles:
        // 'ON' = Open 90 degrees (Math.PI / 2) | 'OFF' = Closed 0 degrees flat vertical wall
        const targetAngle = (this.fanStatus === 'ON') ? Math.PI / 2 : 0.0;

        // Transitions run inside a smooth baseline modifier speed calculation
        const transformationSpeed = this.fanSpeedMultiplier * 5.0; 
        const deltaChange = targetAngle - this.currentBladeAngle;

        if (Math.abs(deltaChange) > 0.001) {
            this.currentBladeAngle += Math.sign(deltaChange) * Math.min(Math.abs(deltaChange), transformationSpeed * dt);
            
            // Push angular calculations down to the parallel mesh groups
            this.bladePivots.forEach(pivot => {
                pivot.rotation.x = this.currentBladeAngle;
            });

            // Keep the linkage slide structural bar flush with the rotation transforms
            if (linkageBarMesh) {
                linkageBarMesh.position.z = 0.02 + (0.025 * Math.sin(this.currentBladeAngle));
                linkageBarMesh.position.y = (singleBladeHeight * 0.15) * (1.0 - Math.cos(this.currentBladeAngle));
            }
        }
    };

    damperGroup.deviceMetadata = {
        deviceId, category, urlLink, zbxSrvIP, zbxAPI, zbxHost, zbxHostKeys, zbxHostKeyValues, zbxKey, fanOnValue: damperGroup.fanOnValue,
        deviceWidth, deviceHeight, deviceDepth, frameColor, bladeColor, actuatorColor, deviceOrientation, numberOfFins
    };

    damperGroup.getDeviceMetadata = function() { return this.deviceMetadata; };
    damperGroup.updateDeviceMetadata = function(meta) { Object.assign(this.deviceMetadata, meta); };

    return damperGroup;
}
