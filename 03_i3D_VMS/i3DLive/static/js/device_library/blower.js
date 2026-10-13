// static/js/device_library/Blower.js

function createBlower(scene, options = {}) {
    const {
        // Main Spatial Layout Dimensions
        deviceWidth = 0.8,   // Total width of the blower front plate / footprint (B in schematic)
        deviceHeight = 0.8,  // Total height from base channel to top plate (H in schematic)
        deviceDepth = 1.0,   // Total longitudinal depth of the unit assembly (L / Lmaxcn)
        devicePosition = { x: 0, y: 0, z: 0 },

        // Colors, Structural Material Aesthetics & Outline Parameters
        deviceColor = 0x111111,     // Industrial dark charcoal/black for main frame & plate
        outlineColor = 0x333333,    // Edge contour line color
        outlineVisible = 'Enable',  // 'Enable' or 'Close' to control structural outlines
        motorColor = 0x445566,      // Finned motor casing accent color
        impellerColor = 0x778899,   // Metal finish for the spinning fan blades

        // Facing Options: 'Front', 'Back', 'Left', 'Right'
        deviceOrientation = 'Front',

        // FLOW SYSTEM / FAN ANIMATION TELEMETRY CONTROLS
        fanEnabled = true,              // Enabler flag matching inrow architecture
        fanStatus = 'OFF',              // 'ON' or 'OFF' - controlled by Zabbix monitor live data
        fanSpeed = 1,                   // Multiplier for rotation speed
        fanColor = 0x778899,
        zbxKey = '',                    // Zabbix item key for fan status string evaluation
        fanOnValue = '1',               // Value that indicates fan is running

        // ===== LIVE MONITORING SYSTEM METADATA =====
        deviceId = '',
        category = 'blower_unit',
        urlLink = '',
        zbxSrvIP = '',
        zbxAPI = '',
        zbxHost = '',
        zbxHostKeys = [],
        zbxHostKeyValues = []
    } = options;

    const blowerGroup = new THREE.Group();
    scene.add(blowerGroup);

    // --- 1. CORE MATERIALS DEFINITIONS ---
    const structuralMat = new THREE.MeshPhongMaterial({
        color: deviceColor,
        shininess: 30,
        flatShading: true
    });

    const motorMat = new THREE.MeshPhongMaterial({
        color: motorColor,
        shininess: 45,
        flatShading: false
    });

    const impellerMat = new THREE.MeshPhongMaterial({
        color: fanColor,
        shininess: 70,
        flatShading: false,
        side: THREE.DoubleSide
    });

    const outlineMat = new THREE.LineBasicMaterial({ 
        color: outlineColor, 
        linewidth: 1 
    });

    // Helper to inject structural contours
    const applyOutline = (mesh, geometry) => {
        if (outlineVisible.toUpperCase() !== 'ENABLE') return;
        const edges = new THREE.EdgesGeometry(geometry);
        const line = new THREE.LineSegments(edges, outlineMat);
        mesh.add(line);
    };

    // --- 2. LOCAL SCALING CALCULATIONS (From Blueprint Layout) ---
    const frameThick = deviceHeight * 0.05;
    const plateThick = deviceWidth * 0.04;
    
    const baseWidth = deviceWidth;
    const baseLength = deviceDepth;
    const frontPlateHeight = deviceHeight - frameThick;
    const intakeRadius = deviceWidth * 0.32; 

    // Sub-group specifically rotated during runtime animation cycles
    const bladeGroup = new THREE.Group();

    // --- 3. COMPILING THE STRUCTURAL ASSEMBLY ---
    
    // A. BASE SUPPORT FRAME CHANNEL
    const frameGroup = new THREE.Group();
    
    const sideRailGeo = new THREE.BoxGeometry(frameThick * 1.5, frameThick, baseLength);
    const leftRail = new THREE.Mesh(sideRailGeo, structuralMat);
    leftRail.position.x = -baseWidth / 2 + (frameThick * 0.75);
    const rightRail = leftRail.clone();
    rightRail.position.x = baseWidth / 2 - (frameThick * 0.75);
    
    const crossRailGeo = new THREE.BoxGeometry(baseWidth - (frameThick * 3), frameThick, frameThick * 1.5);
    const frontCross = new THREE.Mesh(crossRailGeo, structuralMat);
    frontCross.position.z = -baseLength / 2 + (frameThick * 0.75);
    const rearCross = frontCross.clone();
    rearCross.position.z = baseLength / 2 - (frameThick * 0.75);

    frameGroup.add(leftRail, rightRail, frontCross, rearCross);
    frameGroup.children.forEach(rail => applyOutline(rail, rail.geometry));
    frameGroup.position.y = frameThick / 2;
    blowerGroup.add(frameGroup);

    // B. VERTICAL FRONT INTAKE PLATE & BRACKETS
    const plateGroup = new THREE.Group();
    
    const mainPlateShape = new THREE.Shape();
    mainPlateShape.moveTo(-baseWidth / 2, 0);
    mainPlateShape.lineTo(baseWidth / 2, 0);
    mainPlateShape.lineTo(baseWidth / 2, frontPlateHeight);
    mainPlateShape.lineTo(-baseWidth / 2, frontPlateHeight);
    mainPlateShape.lineTo(-baseWidth / 2, 0);

    const holePath = new THREE.Path();
    const centerY = frontPlateHeight / 2; 
    holePath.absarc(0, centerY, intakeRadius, 0, Math.PI * 2, true);
    mainPlateShape.holes.push(holePath);

    const plateExtrudeSettings = { depth: plateThick, bevelEnabled: false };
    const plateGeo = new THREE.ExtrudeGeometry(mainPlateShape, plateExtrudeSettings);
    const mainPlateMesh = new THREE.Mesh(plateGeo, structuralMat);
    mainPlateMesh.position.z = -plateThick; 
    applyOutline(mainPlateMesh, plateGeo);
    plateGroup.add(mainPlateMesh);

    // Bell Mouth Ring Profile
    const ringGeo = new THREE.TorusGeometry(intakeRadius, plateThick * 0.4, 16, 64);
    const bellMouth = new THREE.Mesh(ringGeo, structuralMat);
    bellMouth.position.set(0, centerY, 0);
    applyOutline(bellMouth, ringGeo);
    plateGroup.add(bellMouth);

    // Side Gusset Supports
    const gussetShape = new THREE.Shape();
    gussetShape.moveTo(0, 0);
    gussetShape.lineTo(baseLength * 0.18, 0);
    gussetShape.lineTo(0, frontPlateHeight * 0.5);
    gussetShape.lineTo(0, 0);

    const gussetExtrudeSettings = { depth: 0.012, bevelEnabled: false };
    const gussetGeo = new THREE.ExtrudeGeometry(gussetShape, gussetExtrudeSettings);
    
    const leftGusset = new THREE.Mesh(gussetGeo, structuralMat);
    leftGusset.position.set(-baseWidth / 2 + 0.005, 0, -plateThick);
    leftGusset.rotation.y = -Math.PI / 2;

    const rightGusset = leftGusset.clone();
    rightGusset.position.x = baseWidth / 2 - 0.017;
    
    plateGroup.add(leftGusset, rightGusset);
    plateGroup.position.set(0, frameThick, -baseLength / 2 + plateThick);
    blowerGroup.add(plateGroup);

    // C. ELEVATED MOTOR PEDESTAL BED (H1 Height Mapping)
    const pedestalHeight = centerY - (deviceHeight * 0.12); 
    const pedestalLength = baseLength * 0.5;
    const pedestalWidth = baseWidth * 0.48;

    const pedGeo = new THREE.BoxGeometry(pedestalWidth, pedestalHeight, pedestalLength);
    const pedestalMesh = new THREE.Mesh(pedGeo, structuralMat);
    pedestalMesh.position.set(0, frameThick + (pedestalHeight / 2), baseLength / 2 - (pedestalLength / 2) - frameThick);
    applyOutline(pedestalMesh, pedGeo);
    blowerGroup.add(pedestalMesh);

    // D. HIGH-FIDELITY DRIVE MOTOR
    const motorRadius = deviceWidth * 0.18;
    const motorLength = pedestalLength * 1.05;
    const motorGroup = new THREE.Group();

    // Main finned cylindrical block
    const mainBodyLen = motorLength * 0.75;
    const motorCylinderGeo = new THREE.CylinderGeometry(motorRadius, motorRadius, mainBodyLen, 32);
    const motorBody = new THREE.Mesh(motorCylinderGeo, motorMat);
    motorBody.rotation.x = Math.PI / 2;
    motorBody.position.z = -motorLength * 0.125;
    applyOutline(motorBody, motorCylinderGeo);
    motorGroup.add(motorBody);

    // Tapered Rear Rotor End Cap
    const capLen = motorLength * 0.25;
    const capGeo = new THREE.CylinderGeometry(motorRadius, motorRadius * 0.85, capLen, 32, 1, false, 0, Math.PI * 2);
    const rearCap = new THREE.Mesh(capGeo, motorMat);
    rearCap.rotation.x = Math.PI / 2;
    rearCap.position.z = mainBodyLen / 2;
    applyOutline(rearCap, capGeo);
    motorGroup.add(rearCap);

    // Surface Cooling Heat Sink Fins
    const finHeight = motorRadius * 0.12;
    const finGeo = new THREE.BoxGeometry(0.008, finHeight, mainBodyLen * 0.98);
    for (let i = 0; i < 24; i++) {
        const finAngle = (i / 24) * Math.PI * 2;
        const finMesh = new THREE.Mesh(finGeo, motorMat);
        finMesh.position.set(Math.cos(finAngle) * (motorRadius + finHeight / 2), Math.sin(finAngle) * (motorRadius + finHeight / 2), motorBody.position.z);
        finMesh.rotation.z = finAngle;
        motorGroup.add(finMesh);
    }

    // Top Mounted Rectangular Junction Box & Eye Bolt
    const boxGeo = new THREE.BoxGeometry(motorRadius * 0.6, motorRadius * 0.4, motorRadius * 0.6);
    const junctionBox = new THREE.Mesh(boxGeo, motorMat);
    junctionBox.position.set(0, motorRadius + (motorRadius * 0.2), motorBody.position.z);
    applyOutline(junctionBox, boxGeo);
    motorGroup.add(junctionBox);

    const eyeGeo = new THREE.TorusGeometry(motorRadius * 0.12, 0.008, 8, 24);
    const eyeBolt = new THREE.Mesh(eyeGeo, structuralMat);
    eyeBolt.position.set(0, junctionBox.position.y + (motorRadius * 0.3), motorBody.position.z);
    applyOutline(eyeBolt, eyeGeo);
    motorGroup.add(eyeBolt);

    // Integrated base feet mounts
    const feetGeo = new THREE.BoxGeometry(pedestalWidth * 0.9, motorRadius * 0.2, mainBodyLen);
    const feetMesh = new THREE.Mesh(feetGeo, structuralMat);
    feetMesh.position.set(0, -motorRadius, motorBody.position.z);
    applyOutline(feetMesh, feetGeo);
    motorGroup.add(feetMesh);

    motorGroup.position.set(0, frameThick + pedestalHeight + motorRadius, pedestalMesh.position.z);
    blowerGroup.add(motorGroup);

    // E. RECIPROCATED SCALE-PROPORTIONAL DRIVE SHAFT
    const frontPlateZ = plateGroup.position.z;
    const motorFrontZ = motorGroup.position.z - (motorLength / 2);
    const shaftLength = Math.abs(motorFrontZ - frontPlateZ) - 0.02;
    const shaftRadius = Math.min(deviceWidth, deviceHeight) * 0.025;

    const shaftGeo = new THREE.CylinderGeometry(shaftRadius, shaftRadius, shaftLength, 16);
    const driveShaft = new THREE.Mesh(shaftGeo, impellerMat);
    driveShaft.rotation.x = Math.PI / 2;
    driveShaft.position.set(0, centerY + frameThick, (motorFrontZ + frontPlateZ) / 2);
    applyOutline(driveShaft, shaftGeo);
    blowerGroup.add(driveShaft);

    // F. HIGH-FIDELITY 6-BLADE OPEN FAN PROPELLER ASSEMBLY
    const hubRadius = shaftRadius * 2.2;
    const hubLength = shaftLength * 0.25;
    
    const hubGeo = new THREE.CylinderGeometry(hubRadius, hubRadius, hubLength, 24);
    const fanHub = new THREE.Mesh(hubGeo, impellerMat);
    fanHub.rotation.x = Math.PI / 2;
    bladeGroup.add(fanHub);
    applyOutline(fanHub, hubGeo);

    const totalBlades = 6;
    const maxBladeRadius = intakeRadius * 1.15;
    
    for (let i = 0; i < totalBlades; i++) {
        const bladePivot = new THREE.Group();
        const bladeAngle = (i / totalBlades) * Math.PI * 2;
        
        const bladeShape = new THREE.Shape();
        bladeShape.moveTo(hubRadius, -0.01);
        bladeShape.quadraticCurveTo(maxBladeRadius * 0.4, 0.05, maxBladeRadius * 0.7, 0.08);
        bladeShape.lineTo(maxBladeRadius, 0.12); 
        bladeShape.lineTo(maxBladeRadius, -0.04);
        bladeShape.quadraticCurveTo(maxBladeRadius * 0.5, -1.06, hubRadius, -0.05);
        bladeShape.lineTo(hubRadius, -0.01);

        const bladeExtSettings = { depth: 0.008, bevelEnabled: true, bevelThickness: 0.002, bevelSize: 0.002, bevelSegments: 2 };
        const bladeGeo = new THREE.ExtrudeGeometry(bladeShape, bladeExtSettings);
        
        const bladeMesh = new THREE.Mesh(bladeGeo, impellerMat);
        bladeMesh.rotation.x = Math.PI / 6; 
        bladeMesh.position.z = -0.004;
        applyOutline(bladeMesh, bladeGeo);
        
        bladePivot.add(bladeMesh);
        bladePivot.rotation.z = bladeAngle;
        bladeGroup.add(bladePivot);
    }

    bladeGroup.position.set(0, centerY + frameThick, frontPlateZ + 0.34);
    blowerGroup.add(bladeGroup);


    // --- 4. CARDINAL ORIENTATION DRIVER (SPIN AROUND Y-AXIS) ---
    blowerGroup.position.set(devicePosition.x, devicePosition.y, devicePosition.z);

    const lookDir = deviceOrientation.toUpperCase().trim();
    if (lookDir === 'LEFT') {
        blowerGroup.rotation.y = Math.PI / 2;
    } else if (lookDir === 'RIGHT') {
        blowerGroup.rotation.y = -Math.PI / 2;
    } else if (lookDir === 'BACK') {
        blowerGroup.rotation.y = Math.PI;
    } else {
        blowerGroup.rotation.y = 0; // Default: 'Front'
    }


    // =================================================================
    // 5. TELEMETRY SYNCHRONIZATION RUNTIME (Matching inrow.js architecture)
    // =================================================================
    blowerGroup.bladeGroup = bladeGroup;
    blowerGroup.fanStatus = String(fanStatus).toUpperCase();
    blowerGroup.fanSpeedMultiplier = parseFloat(fanSpeed);
    blowerGroup.zbxKey = zbxKey;
    blowerGroup.fanOnValue = String(fanOnValue);

    blowerGroup.applyLiveData = function(row) {
        if (!row) return;

        // 1. Check Key matching scenarios using global telemetry metrics
        let statusValue = undefined;
        const checkKey = this.zbxKey ? this.zbxKey.trim() : '';

        if (checkKey !== '') {
            if (row.key === checkKey || row.itemkey === checkKey || row.zbxKey === checkKey) {
                statusValue = (row.value !== undefined) ? row.value : row.status;
            } else if (row[checkKey] !== undefined) {
                statusValue = row[checkKey];
            }
        }

        if (statusValue === undefined) {
            if (row.fan_status !== undefined && row.fan_status !== null) statusValue = row.fan_status;
            else if (row.status !== undefined && row.status !== null) statusValue = row.status;
            else if (row.value !== undefined && row.value !== null) statusValue = row.value;
        }

        if (statusValue !== undefined && statusValue !== null) {
            let parsedVal = String(statusValue).trim().toLowerCase();
            let targetOnVal = String(this.fanOnValue).trim().toLowerCase();

            if (parsedVal === targetOnVal || parsedVal === '1' || parsedVal === 'true' || parsedVal === 'on' || parsedVal === 'run') {
                this.fanStatus = 'ON';
            } else {
                this.fanStatus = 'OFF';
            }
        }

        // 2. Synchronize dynamically calculated speed coefficients if delivered by endpoint
        if (row.fan_speed !== undefined) {
            this.fanSpeedMultiplier = parseFloat(row.fan_speed);
        }
    };

    // Runtime Engine Ticker Interface called by the parent context array loop
    blowerGroup.updateFan = function(dt) {
        if (!dt) dt = 0.016;
        if (!fanEnabled) return;

        // Check against internal telemetry memory maps updated via Zabbix
        if (this.fanStatus === 'ON') {
            this.bladeGroup.rotation.z += 10.0 * this.fanSpeedMultiplier * dt;
        }
    };


    // Telemetry and Management Metadata properties allocation
    blowerGroup.deviceMetadata = {
        deviceId, category, urlLink, zbxSrvIP, zbxAPI, zbxHost, zbxHostKeys, zbxHostKeyValues, zbxKey, fanOnValue,
        deviceWidth, deviceHeight, deviceDepth, deviceColor, outlineColor, outlineVisible, deviceOrientation
    };

    blowerGroup.getDeviceMetadata = function() { return this.deviceMetadata; };
    blowerGroup.updateDeviceMetadata = function(m) { Object.assign(this.deviceMetadata, m); };

    return blowerGroup;
}
