// static/js/device_library/chillerV1.js

function createChillerV1(scene, options = {}) {
    const {
        // Master Boundary Dimensions for the whole Chiller Plant Assembly
        deviceWidth = 1.98,
        deviceHeight = 1.90,
        deviceDepth = 1.50,
        devicePosition = { x: 0, y: 0, z: 0 },

        // Camera Position
        camPosition = { x: 0, y: 0.6, z: 0.46 },

        // Styling properties
        deviceColor = 0xFFFFFF,
        deviceoutlineColor = 0x000000,
        frameColor = 0x2D3748,
        frameThickness = 0.035,
        machineryColor = 0x718096,
        pipeColor = 0x3182CE,

        // ORIENTATION
        orientation = 'Front',

        // FACE TEXTURES (optional) - Solid color unless image paths provided
        faceTextures = {
            front: null,
            back: null,
            left: null,
            right: null,
            top: null
        },

        // Front Identifier Label
        text = "Chiller-V1",
        textPosition = { x: 0, y: -0.2, z: 0.72 },
        textColor = 0xffffff,
        textSize = 0.07,
        textFont = 'Arial',
        textCanvasBgColor = 0x1A202C,
        textbgSize = { width: 0.55, height: 0.16 },

        // Screen parameters
        screenEnabled = false,
        screenPosition = { x: 0, y: 0.5, z: 0.65 },
        screenSize = { width: 0.22, height: 0.22 },
        screenColor = 0x00FF00,
        screenoutlineColor = 0x000000,

        // Base structural platform skid
        standHeight = 0.08,
        standColor = 0x1A202C,

        // ===== HIGH RAISED LABEL OPTIONS =====
        highLabelEnabled = false,
        highText = null,
        highTextPosition = { x: 0, y: 3.5, z: 0.7 },
        highTextbgSize = { width: 0.9, height: 0.25 },
        highTextSize = 0.16,
        highTextColor = 0xffffff,
        highTextCanvasBgColor = 0x222222,
        highLineColor = 0xffff00,
        highLineWidth = 2,
        highDotColor = 0xffff00,
        highDotRadius = 0.03,
        highLabelOrientation = 'CAMERA',

        // ===== STATUS LED OPTIONS =====
        ledEnabled = true,
        ledRadius = 0.015,
        ledHeight = 0.01,
        ledOffset = { x: 0, y: 0, z: 0 },

        healthyColor = 0x10ee00,
        warningColor = 0xffff00,
        alarmColor   = 0xff0000,
        runColor     = 0x0000ff,
        customColor  = 0xffffff,
        ledState = 'HEALTHY',
        ledBlinkPeriod = 1.0,

        // ===== FAN HOUSING OPTIONS =====
        fanEnabled = true,
        fanStatus = 'OFF',
        fanSpeed = 1,
        fanSize = 0.22,
        fanColor = 0xCBD5E0,
        fanHousingColor = 0x2D3748,
        fanMeshColor = 0x4A5568,
        numberOfFans = 2,
        zbxKey = '',
        fanOnValue = '1',
        fanval = [],
        fanmap = [],

        // ===== MODULAR SECTIONS COMPARTMENT COUNT =====
        unitCount = 2,

        // ===== LIVE MONITORING SYSTEM METADATA =====
        deviceId = '',
        category = 'cooling',
        urlLink = '',
        zbxSrvIP = '',
        zbxAPI = '',
        zbxHost = '',
        zbxHostKeys = [],
        zbxHostKeyValues = []

    } = options;

    const loader = new THREE.TextureLoader();

    // Master Chiller Assembly Mesh Object Group Anchor
    const chillerV1Group = new THREE.Group();
    chillerV1Group.position.set(devicePosition.x, devicePosition.y + (deviceHeight / 2) + standHeight, devicePosition.z);
    scene.add(chillerV1Group);

    // Dynamic Module Subdivision Boundaries Management
    const singleUnitWidth = deviceWidth / unitCount;
    const startX = - (deviceWidth / 2) + (singleUnitWidth / 2);
    const allBladeGroups = [];

    // Height Subdivisions based on functional engineering layout
    const baseBlockHeight = deviceHeight * 0.35;
    const upperVHeight = deviceHeight * 0.65;
    const currentBaseCenterY = -deviceHeight / 2 + baseBlockHeight / 2;

    const halfW = deviceWidth / 2;
    const halfH = deviceHeight / 2;
    const halfD = deviceDepth / 2;

    // Tracker list to force state restorations on interactive sweeps mirroring inrow.js
    const trackedChillerV1Meshes = [];

    // Helper function to tag meshes with their standard native color profile
    function registerOriginalColorState(mesh, targetHexColor) {
        mesh.userData = mesh.userData || {};
        mesh.userData.isChillerV1Component = true;
        mesh.userData.originalColor = new THREE.Color(targetHexColor);
        trackedChillerV1Meshes.push(mesh);
    }

    // === MASTER STRUCTURE STAND SKID PLATFORM ===
    const standGeometry = new THREE.BoxGeometry(deviceWidth, standHeight, deviceDepth);
    const standMaterial = new THREE.MeshStandardMaterial({ color: standColor, metalness: 0.5, roughness: 0.5 });
    const standMesh = new THREE.Mesh(standGeometry, standMaterial);
    standMesh.position.y = -deviceHeight / 2 - standHeight / 2;
    standMesh.castShadow = true;
    standMesh.receiveShadow = true;
    registerOriginalColorState(standMesh, standColor);
    chillerV1Group.add(standMesh);

    // =================================================================
    // STRUCTURAL OUTER FRAME BAR WORK (ALL EDGES & CORNERS)
    // =================================================================
    const frameMat = new THREE.MeshStandardMaterial({ color: frameColor, metalness: 0.6, roughness: 0.4 });

    const createFrameBar = (w, h, d, x, y, z) => {
        const geom = new THREE.BoxGeometry(w, h, d);
        const mesh = new THREE.Mesh(geom, frameMat);
        mesh.position.set(x, y, z);
        registerOriginalColorState(mesh, frameColor);
        chillerV1Group.add(mesh);
    };

    // 4 Vertical Corner Structural Pillars
    createFrameBar(frameThickness, deviceHeight, frameThickness, -halfW + frameThickness/2, 0,  halfD - frameThickness/2);
    createFrameBar(frameThickness, deviceHeight, frameThickness,  halfW - frameThickness/2, 0,  halfD - frameThickness/2);
    createFrameBar(frameThickness, deviceHeight, frameThickness, -halfW + frameThickness/2, 0, -halfD + frameThickness/2);
    createFrameBar(frameThickness, deviceHeight, frameThickness,  halfW - frameThickness/2, 0, -halfD + frameThickness/2);

    // Bottom Closed Perimeter Frame Rails
    createFrameBar(deviceWidth, frameThickness, frameThickness, 0, -halfH + frameThickness/2,  halfD - frameThickness/2);
    createFrameBar(deviceWidth, frameThickness, frameThickness, 0, -halfH + frameThickness/2, -halfD + frameThickness/2);
    createFrameBar(frameThickness, frameThickness, deviceDepth, -halfW + frameThickness/2, -halfH + frameThickness/2, 0);
    createFrameBar(frameThickness, frameThickness, deviceDepth,  halfW - frameThickness/2, -halfH + frameThickness/2, 0);

    // Mid-level Belt Rails (At the base block boundary split)
    createFrameBar(deviceWidth, frameThickness, frameThickness, 0, -halfH + baseBlockHeight,  halfD - frameThickness/2);
    createFrameBar(deviceWidth, frameThickness, frameThickness, 0, -halfH + baseBlockHeight, -halfD + frameThickness/2);
    createFrameBar(frameThickness, frameThickness, deviceDepth, -halfW + frameThickness/2, -halfH + baseBlockHeight, 0);
    createFrameBar(frameThickness, frameThickness, deviceDepth,  halfW - frameThickness/2, -halfH + baseBlockHeight, 0);

    // Top Crown Perimeter Frame Rails
    createFrameBar(deviceWidth, frameThickness, frameThickness, 0,  halfH - frameThickness/2,  halfD - frameThickness/2);
    createFrameBar(deviceWidth, frameThickness, frameThickness, 0,  halfH - frameThickness/2, -halfD + frameThickness/2);
    createFrameBar(frameThickness, frameThickness, deviceDepth, -halfW + frameThickness/2,  halfH - frameThickness/2, 0);
    createFrameBar(frameThickness, frameThickness, deviceDepth,  halfW - frameThickness/2,  halfH - frameThickness/2, 0);

    // =================================================================
    // DETAILED BOTTOM MACHINERY (COMPRESSORS, SADDLES & PIPING)
    // =================================================================
    const centralMachineryGroup = new THREE.Group();
    centralMachineryGroup.position.set(0, currentBaseCenterY, 0);
    chillerV1Group.add(centralMachineryGroup);

    // Dual Compressor Cylinders
    const compressorLength = deviceWidth * 0.75;
    const compressorRadius = baseBlockHeight * 0.22;
    const compCylinderGeom = new THREE.CylinderGeometry(compressorRadius, compressorRadius, compressorLength, 24);
    const compCylinderMat = new THREE.MeshStandardMaterial({ color: deviceColor, metalness: 0.6, roughness: 0.4 });
    const domeGeom = new THREE.SphereGeometry(compressorRadius, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2);

    // Compressor A Assembly
    const compressorGroupA = new THREE.Group();
    compressorGroupA.position.set(0, -baseBlockHeight * 0.05, -deviceDepth * 0.22);
    
    const compressorCoreA = new THREE.Mesh(compCylinderGeom, compCylinderMat);
    compressorCoreA.rotation.z = Math.PI / 2;
    registerOriginalColorState(compressorCoreA, deviceColor);
    compressorGroupA.add(compressorCoreA);

    const domeALeft = new THREE.Mesh(domeGeom, compCylinderMat);
    domeALeft.position.x = -compressorLength / 2;
    domeALeft.rotation.z = Math.PI / 2;
    registerOriginalColorState(domeALeft, deviceColor);
    compressorGroupA.add(domeALeft);

    const domeARight = new THREE.Mesh(domeGeom, compCylinderMat);
    domeARight.position.x = compressorLength / 2;
    domeARight.rotation.z = -Math.PI / 2;
    registerOriginalColorState(domeARight, deviceColor);
    compressorGroupA.add(domeARight);
    
    centralMachineryGroup.add(compressorGroupA);

    // Compressor B Assembly
    const compressorGroupB = new THREE.Group();
    compressorGroupB.position.set(0, -baseBlockHeight * 0.05, deviceDepth * 0.22);

    const compressorCoreB = new THREE.Mesh(compCylinderGeom, compCylinderMat);
    compressorCoreB.rotation.z = Math.PI / 2;
    registerOriginalColorState(compressorCoreB, deviceColor);
    compressorGroupB.add(compressorCoreB);

    const domeBLeft = new THREE.Mesh(domeGeom, compCylinderMat);
    domeBLeft.position.x = -compressorLength / 2;
    domeBLeft.rotation.z = Math.PI / 2;
    registerOriginalColorState(domeBLeft, deviceColor);
    compressorGroupB.add(domeBLeft);

    const domeBRight = new THREE.Mesh(domeGeom, compCylinderMat);
    domeBRight.position.x = compressorLength / 2;
    domeBRight.rotation.z = -Math.PI / 2;
    registerOriginalColorState(domeBRight, deviceColor);
    compressorGroupB.add(domeBRight);

    centralMachineryGroup.add(compressorGroupB);

    // Structural Cradle Mount Supports for Compressors
    const cradleMat = new THREE.MeshStandardMaterial({ color: frameColor, metalness: 0.4, roughness: 0.5 });
    const cradleGeom = new THREE.BoxGeometry(0.06, baseBlockHeight * 0.25, baseBlockHeight * 0.5);

    const xOffsets = [-deviceWidth * 0.25, deviceWidth * 0.25];
    xOffsets.forEach(x => {
        const supportA = new THREE.Mesh(cradleGeom, cradleMat);
        supportA.position.set(x, -baseBlockHeight * 0.25, -deviceDepth * 0.22);
        registerOriginalColorState(supportA, frameColor);
        centralMachineryGroup.add(supportA);

        const supportB = new THREE.Mesh(cradleGeom, cradleMat);
        supportB.position.set(x, -baseBlockHeight * 0.25, deviceDepth * 0.22);
        registerOriginalColorState(supportB, frameColor);
        centralMachineryGroup.add(supportB);
    });

    // Interconnecting Piping Infrastructure
    const pipeMat = new THREE.MeshStandardMaterial({ color: pipeColor, metalness: 0.6, roughness: 0.2 });

    // Cross Bridge Linking Main Cylinders
    const bridgePipeGeom = new THREE.CylinderGeometry(0.025, 0.025, deviceDepth * 0.44, 16);
    const bridgePipe = new THREE.Mesh(bridgePipeGeom, pipeMat);
    bridgePipe.rotation.x = Math.PI / 2;
    bridgePipe.position.set(-deviceWidth * 0.1, baseBlockHeight * 0.15, 0);
    registerOriginalColorState(bridgePipe, pipeColor);
    centralMachineryGroup.add(bridgePipe);

    // Vertical Flow Discharge Loops
    const vertPipeGeom = new THREE.CylinderGeometry(0.02, 0.02, baseBlockHeight * 0.3, 16);

    const pipeVertA = new THREE.Mesh(vertPipeGeom, pipeMat);
    pipeVertA.position.set(-deviceWidth * 0.1, baseBlockHeight * 0.3, -deviceDepth * 0.22);
    registerOriginalColorState(pipeVertA, pipeColor);
    centralMachineryGroup.add(pipeVertA);

    const pipeVertB = new THREE.Mesh(vertPipeGeom, pipeMat);
    pipeVertB.position.set(-deviceWidth * 0.1, baseBlockHeight * 0.3, deviceDepth * 0.22);
    registerOriginalColorState(pipeVertB, pipeColor);
    centralMachineryGroup.add(pipeVertB);

    // Plant Control Automation Terminal Cabinet
    const cabinetGeom = new THREE.BoxGeometry(deviceWidth * 0.22, baseBlockHeight * 0.7, 0.15);
    const cabinetMat = new THREE.MeshStandardMaterial({ color: 0xEDF2F7, roughness: 0.4 });
    const unifiedControlCabinet = new THREE.Mesh(cabinetGeom, cabinetMat);
    unifiedControlCabinet.position.set(deviceWidth * 0.25, 0, deviceDepth / 2 - 0.075 - frameThickness);
    registerOriginalColorState(unifiedControlCabinet, 0xEDF2F7);
    centralMachineryGroup.add(unifiedControlCabinet);

    // =================================================================
    // INTEGRATED STATUS LED & METADATA ANIMATION
    // =================================================================
    let dynamicLEDIndicator = null;
    let glowMesh = null;
    let ledMaterial = null;
    let glowMat = null;

    if (ledEnabled) {
        const ledGeometry = new THREE.CylinderGeometry(ledRadius, ledRadius, ledHeight, 16);
        const baseColor = new THREE.Color(healthyColor);

        ledMaterial = new THREE.MeshStandardMaterial({
            color: baseColor,
            emissive: baseColor,
            emissiveIntensity: 0.0,
            transparent: false,
            opacity: 0.3,
            roughness: 0.4,
            metalness: 0.1
        });
        dynamicLEDIndicator = new THREE.Mesh(ledGeometry, ledMaterial);
        dynamicLEDIndicator.rotation.x = Math.PI / 2;

        dynamicLEDIndicator.position.set(ledOffset.x, ledOffset.y, ledOffset.z + 0.075);
        unifiedControlCabinet.add(dynamicLEDIndicator);

        const glowGeom = new THREE.SphereGeometry(ledRadius * 2.0, 16, 16);
        glowMat = new THREE.MeshBasicMaterial({
            color: new THREE.Color(alarmColor),
            transparent: true,
            opacity: 0.0
        });
        glowMesh = new THREE.Mesh(glowGeom, glowMat);
        glowMesh.position.copy(dynamicLEDIndicator.position);
        unifiedControlCabinet.add(glowMesh);
    }

    // =================================================================
    // MODULAR V-SHAPED UNITS (WITH SOLID TOP & SIDE COVER PLATES)
    // =================================================================
    const maxZ = deviceDepth / 2 - frameThickness + 0.03;
    const internalVWidth = singleUnitWidth - 0.02;
    const slantAngle = Math.atan2(upperVHeight, maxZ);
    const slantPlateLength = Math.sqrt(upperVHeight * upperVHeight + maxZ * maxZ);

    const upperPartCenterY = -deviceHeight / 2 + baseBlockHeight + upperVHeight / 2;
    const highEdgeY = -deviceHeight / 2 + baseBlockHeight + upperVHeight;
    const gableMaterial = new THREE.MeshStandardMaterial({ color: deviceColor, roughness: 0.6, metalness: 0.2 });

    for (let u = 0; u < unitCount; u++) {
        const unitOffsetX = startX + (u * singleUnitWidth);

        const unitGroup = new THREE.Group();
        unitGroup.position.x = unitOffsetX;
        chillerV1Group.add(unitGroup);

        // Solid under block construction
        const solidUnderBlockGeom = new THREE.BoxGeometry(singleUnitWidth - 0.01, baseBlockHeight, deviceDepth - frameThickness * 2);
        const solidUnderBlockMat = (u === 0 && faceTextures.left) ? new THREE.MeshStandardMaterial({ map: loader.load(faceTextures.left) }) :
                                   (u === (unitCount - 1) && faceTextures.right) ? new THREE.MeshStandardMaterial({ map: loader.load(faceTextures.right) }) :
                                   new THREE.MeshStandardMaterial({ color: deviceColor, roughness: 0.5 });

        const solidUnderBlockMesh = new THREE.Mesh(solidUnderBlockGeom, solidUnderBlockMat);
        solidUnderBlockMesh.position.y = currentBaseCenterY;
        solidUnderBlockMesh.castShadow = true;
        solidUnderBlockMesh.receiveShadow = true;

        // Solid Structural Top Cover Capping Plate
        const topCapHeight = 0.02;
        const topPlateGeom = new THREE.BoxGeometry(internalVWidth, topCapHeight, maxZ * 2);
        const topPlateMesh = new THREE.Mesh(topPlateGeom, gableMaterial);
        topPlateMesh.position.set(0, highEdgeY - topCapHeight / 2, 0);
        topPlateMesh.castShadow = true;
        registerOriginalColorState(topPlateMesh, deviceColor);
        unitGroup.add(topPlateMesh);

        // Solid Slanted Outer Shield Panels (Front & Rear Sides)
        const sidePanelThickness = 0.015;
        const sidePanelGeom = new THREE.BoxGeometry(internalVWidth, sidePanelThickness, slantPlateLength);

        // Front Facing Solid Enclosure Plate
        const solidFrontSlopePlate = new THREE.Mesh(sidePanelGeom, gableMaterial);
        solidFrontSlopePlate.position.set(0, (-deviceHeight / 2 + baseBlockHeight) + upperVHeight / 2, maxZ / 2);
        solidFrontSlopePlate.rotation.x = -slantAngle;
        registerOriginalColorState(solidFrontSlopePlate, deviceColor);
        unitGroup.add(solidFrontSlopePlate);

        // Rear Facing Solid Enclosure Plate
        const solidRearSlopePlate = new THREE.Mesh(sidePanelGeom, gableMaterial);
        solidRearSlopePlate.position.set(0, (-deviceHeight / 2 + baseBlockHeight) + upperVHeight / 2, -maxZ / 2);
        solidRearSlopePlate.rotation.x = slantAngle;
        registerOriginalColorState(solidRearSlopePlate, deviceColor);
        unitGroup.add(solidRearSlopePlate);

        // Inverted Triangular End Cap Profiles
        const vTriangleShape = new THREE.Shape();
        vTriangleShape.moveTo(-deviceDepth / 2 + frameThickness, upperVHeight);
        vTriangleShape.lineTo(deviceDepth / 2 - frameThickness, upperVHeight);
        vTriangleShape.lineTo(0, frameThickness);
        vTriangleShape.closePath();

        const frontGableGeom = new THREE.ExtrudeGeometry(vTriangleShape, { depth: 0.01, bevelEnabled: false });
        frontGableGeom.center();
        frontGableGeom.rotateY(Math.PI / 2);

        const frontGableMesh = new THREE.Mesh(frontGableGeom, gableMaterial);
        frontGableMesh.position.set(-singleUnitWidth / 2 + 0.01, upperPartCenterY, 0);
        frontGableMesh.castShadow = true;
        registerOriginalColorState(frontGableMesh, deviceColor);
        unitGroup.add(frontGableMesh);

        const backGableMesh = new THREE.Mesh(frontGableGeom, gableMaterial);
        backGableMesh.position.set(singleUnitWidth / 2 - 0.01, upperPartCenterY, 0);
        backGableMesh.castShadow = true;
        registerOriginalColorState(backGableMesh, deviceColor);
        unitGroup.add(backGableMesh);

        // --- RECESSED CONDENSER LOUVER FINS (SITUATED IMMEDIATELY BELOW SOLID COVER PANELS) ---
        const totalFinsPerSide = 48;
        const finLengthX = singleUnitWidth - 0.04; // Recessed slightly inward from end caps
        const finHeightSlat = 0.010;
        const finThicknessSlat = 0.010;

        const finSlatGeom = new THREE.BoxGeometry(finLengthX, finHeightSlat, finThicknessSlat);
        const finSlatMat = new THREE.MeshStandardMaterial({ color: machineryColor, metalness: 0.7, roughness: 0.3 });

        for (let i = 0; i < totalFinsPerSide; i++) {
            const t = (i / (totalFinsPerSide - 1)) * 0.94; // Scale limit to recess safely beneath the capping system
            const currZ = t * maxZ;
            const currY = (-deviceHeight / 2 + baseBlockHeight) + t * upperVHeight - 0.02; // Dropped downward below top cap

            // Right Recessed Slat Row
            const slatRight = new THREE.Mesh(finSlatGeom, finSlatMat);
            slatRight.position.set(0, currY, currZ + 0.015);
            slatRight.rotation.x = -slantAngle;
            registerOriginalColorState(slatRight, machineryColor);
            unitGroup.add(slatRight);

            // Left Recessed Slat Row
            const slatLeft = new THREE.Mesh(finSlatGeom, finSlatMat);
            slatLeft.position.set(0, currY, -currZ - 0.015);
            slatLeft.rotation.x = slantAngle;
            registerOriginalColorState(slatLeft, machineryColor);
            unitGroup.add(slatLeft);
        }

        // --- PROTECTIVE COIL REINFORCEMENT BARS ---
        const wireGridGeom = new THREE.CylinderGeometry(0.002, 0.002, slantPlateLength - 0.04, 8);
        const wireGridMat = new THREE.MeshStandardMaterial({ color: frameColor, metalness: 0.6, roughness: 0.4 });

        const numWireBars = 6;
        for (let b = 0; b < numWireBars; b++) {
            const tX = (b / (numWireBars - 1)) * 2 - 1;
            const currX = tX * (finLengthX / 2);
            const midY = (-deviceHeight / 2 + baseBlockHeight) + upperVHeight / 2 - 0.01;

            // Right face wired grill overlay support
            const wireRight = new THREE.Mesh(wireGridGeom, wireGridMat);
            wireRight.position.set(currX, midY, maxZ / 2 + 0.01);
            wireRight.rotation.x = Math.PI / 2 - slantAngle;
            registerOriginalColorState(wireRight, frameColor);
            unitGroup.add(wireRight);

            // Left face wired grill overlay support
            const wireLeft = new THREE.Mesh(wireGridGeom, wireGridMat);
            wireLeft.position.set(currX, midY, -maxZ / 2 - 0.01);
            wireLeft.rotation.x = -(Math.PI / 2 - slantAngle);
            registerOriginalColorState(wireLeft, frameColor);
            unitGroup.add(wireLeft);
        }

        // =================================================================
        // OVERHEAD EXHAUST FANS ASSEMBLY
        // =================================================================
        if (fanEnabled) {
            const shroudHeight = 0.08;
            const absoluteTopY = highEdgeY + shroudHeight / 2;
            const fanLocationsZ = [halfD - fanSize * 1.65, -halfD + fanSize * 1.65];

            for (let f = 0; f < numberOfFans; f++) {
                const fanComponentGroup = new THREE.Group();
                const targetZ = fanLocationsZ[f];

                // Shroud Ring Wall
                const shroudGeom = new THREE.CylinderGeometry(fanSize + 0.015, fanSize + 0.02, shroudHeight, 32, 1, true);
                const shroudMat = new THREE.MeshStandardMaterial({ color: fanHousingColor, metalness: 0.4, roughness: 0.5, side: THREE.DoubleSide });
                const shroudMesh = new THREE.Mesh(shroudGeom, shroudMat);

                registerOriginalColorState(shroudMesh, fanHousingColor);
                fanComponentGroup.add(shroudMesh);

                // Dynamic Impeller Blade Subgroup Container
                const activeBladeRotationContainer = new THREE.Group();
                activeBladeRotationContainer.position.y = shroudHeight / 2 - 0.015;
                fanComponentGroup.add(activeBladeRotationContainer);

                // Hub Spin Assembly Pin Center
                const structuralHubGeom = new THREE.CylinderGeometry(0.035, 0.035, 0.002, 24);
                const structuralHubMat = new THREE.MeshStandardMaterial({ color: 0x1A202C, metalness: 0.5 });
                const centralAxialHub = new THREE.Mesh(structuralHubGeom, structuralHubMat);

                registerOriginalColorState(centralAxialHub, 0x1A202C);
                activeBladeRotationContainer.add(centralAxialHub);

                // 2D Flat Shaped Blade Geometries
                const engineeredBladeShape = new THREE.Shape();
                engineeredBladeShape.moveTo(0, 0.01);
                engineeredBladeShape.lineTo(fanSize * 0.85, 0.04);
                engineeredBladeShape.quadraticCurveTo(fanSize * 0.95, 0, fanSize * 0.85, -0.04);
                engineeredBladeShape.lineTo(0, -0.01);
                engineeredBladeShape.closePath();

                const bladeExtrusionGeom = new THREE.ShapeGeometry(engineeredBladeShape);
                const preciseBladeMaterial = new THREE.MeshStandardMaterial({
                    color: fanColor,
                    side: THREE.DoubleSide,
                    roughness: 0.4,
                    metalness: 0.1
                });

                const totalBlades = 5;
                for (let b = 0; b < totalBlades; b++) {
                    const propellerBladeMesh = new THREE.Mesh(bladeExtrusionGeom, preciseBladeMaterial);
                    propellerBladeMesh.rotation.x = Math.PI / 2;

                    registerOriginalColorState(propellerBladeMesh, fanColor);

                    const singleBladePivot = new THREE.Group();
                    singleBladePivot.rotation.y = (b / totalBlades) * Math.PI * 2;
                    singleBladePivot.add(propellerBladeMesh);
                    activeBladeRotationContainer.add(singleBladePivot);
                }
                allBladeGroups.push(activeBladeRotationContainer);

                // STATIC DUAL-LAYER GEOMETRIC WIRED MESH PROTECTIVE SHIELD
                const wireGrillShieldGroup = new THREE.Group();
                wireGrillShieldGroup.position.y = shroudHeight / 2;
                const wireMat = new THREE.MeshStandardMaterial({ color: fanMeshColor, metalness: 0.7, roughness: 0.3 });
                const wireRadius = 0.002;

                // Layer A: Concentric Safety Mesh Rings
                const ringRadii = [fanSize * 0.35, fanSize * 0.65, fanSize * 0.95];
                ringRadii.forEach(r => {
                    const meshRing = new THREE.Mesh(new THREE.TorusGeometry(r, wireRadius, 6, 32), wireMat);
                    meshRing.rotation.x = Math.PI / 2;

                    registerOriginalColorState(meshRing, fanMeshColor);
                    wireGrillShieldGroup.add(meshRing);
                });

                // Layer B: Cross Radial Direct Spokes Framework
                const totalSpokesCount = 12;
                const spokeRodGeom = new THREE.CylinderGeometry(wireRadius, wireRadius, fanSize * 2, 8);
                for (let s = 0; s < totalSpokesCount / 2; s++) {
                    const rodMesh = new THREE.Mesh(spokeRodGeom, wireMat);
                    rodMesh.rotation.x = Math.PI / 2;
                    rodMesh.rotation.z = (s / (totalSpokesCount / 2)) * Math.PI;

                    registerOriginalColorState(rodMesh, fanMeshColor);
                    wireGrillShieldGroup.add(rodMesh);
                }
                fanComponentGroup.add(wireGrillShieldGroup);

                fanComponentGroup.position.set(0, absoluteTopY, targetZ);
                unitGroup.add(fanComponentGroup);
            }
        }
    }

    // === FRONT PLANT TEXT IDENTIFIER SIGN ===
    (function () {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const scalar = 1000;

        canvas.width = textbgSize.width * scalar;
        canvas.height = textbgSize.height * scalar;

        ctx.fillStyle = new THREE.Color(textCanvasBgColor).getStyle();
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const renderedFontSize = Math.max(36, textSize * scalar * 0.8);
        ctx.fillStyle = new THREE.Color(textColor).getStyle();
        ctx.font = `bold ${renderedFontSize}px ${textFont}, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, canvas.width / 2, canvas.height / 2);

        const canvasTextureMap = new THREE.CanvasTexture(canvas);
        const textLabelMaterial = new THREE.MeshBasicMaterial({ map: canvasTextureMap, transparent: true, side: THREE.DoubleSide });
        const textLabelMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(textbgSize.width * 0.9, textbgSize.height * 0.9),
            textLabelMaterial
        );
        textLabelMesh.position.set(textPosition.x, textPosition.y, textPosition.z);
        chillerV1Group.add(textLabelMesh);
    })();

    // Apply Global Outer Edges Framework Outline
    const globalEdges = new THREE.EdgesGeometry(new THREE.BoxGeometry(deviceWidth, deviceHeight, deviceDepth));
    const globalOutline = new THREE.LineSegments(globalEdges, new THREE.LineBasicMaterial({ color: deviceoutlineColor, linewidth: 2 }));
    chillerV1Group.add(globalOutline);

    // Orientation Alignment Matrix Config
    switch (orientation.toUpperCase()) {
        case 'BACK':  chillerV1Group.rotation.y = Math.PI;      break;
        case 'LEFT':  chillerV1Group.rotation.y = Math.PI / 2;  break;
        case 'RIGHT': chillerV1Group.rotation.y = -Math.PI / 2; break;
        case 'FRONT':
        default:      chillerV1Group.rotation.y = 0;            break;
    }

    // Default Hover Interactivity System Allocations
    chillerV1Group.userData = {
        isCurrentlyHovered: false,
        hoverColor: new THREE.Color(0x3182CE) // Fallback highlight shade
    };

    // Explicit binding to animation reference tracks
    chillerV1Group.allBladeGroups = allBladeGroups;
    chillerV1Group.fanStatus = String(fanStatus).toUpperCase();
    chillerV1Group.fanSpeedMultiplier = parseFloat(fanSpeed);

    chillerV1Group.led = dynamicLEDIndicator;
    chillerV1Group.ledMaterial = ledMaterial;
    chillerV1Group.ledGlow = glowMesh;
    chillerV1Group.ledGlowMaterial = glowMat;
    chillerV1Group.ledState = ledState.toUpperCase();
    chillerV1Group.blinkTimer = 0;
    chillerV1Group.ledBlinkPeriod = ledBlinkPeriod;

    chillerV1Group.ledColors = {
        HEALTHY: new THREE.Color(healthyColor),
        WARNING: new THREE.Color(warningColor),
        ALARM:   new THREE.Color(alarmColor),
        RUN:     new THREE.Color(runColor),
        CUSTOM:  new THREE.Color(customColor)
    };

    chillerV1Group._getLEDColor = function () {
        return this.ledColors[this.ledState] || this.ledColors.HEALTHY;
    };

    // Frame Core Refresh Thread loop handler
    chillerV1Group.updateFan = function(dt) {
        // Unified Multi-mesh Hover Switch System
        const isHovered = this.userData.isCurrentlyHovered;
        const currentHoverColor = this.userData.hoverColor;

        trackedChillerV1Meshes.forEach(mesh => {
            if (mesh.material && mesh.userData && mesh.userData.originalColor) {
                if (isHovered) {
                    mesh.material.color.copy(currentHoverColor);
                } else {
                    mesh.material.color.copy(mesh.userData.originalColor);
                }
            }
        });

        // 1. Process Fan Rotations
        this.fanSpeedMultiplier = parseFloat(options.fanSpeed || 1.0);
        if (this.fanStatus === 'ON') {
            this.allBladeGroups.forEach(bladeTargetGroup => {
                bladeTargetGroup.rotation.y += 12.0 * this.fanSpeedMultiplier * dt;
            });
        }

        // 2. Process LED Blink Telemetry Updates
        if (this.led && this.ledMaterial) {
            this.blinkTimer += dt;
            const phase = (this.blinkTimer % this.ledBlinkPeriod) / this.ledBlinkPeriod;
            const on = phase < 0.5;

            const c = this._getLEDColor();
            
            // Only force raw material metrics if not inside a cursor hover trigger context
            if (!isHovered) {
                this.ledMaterial.color.copy(c);
            }
            this.ledMaterial.emissive.copy(c);

            if (this.ledState === 'ALARM') {
                const intensity = on ? 2.5 : 0.3;
                const opacity = on ? 0.8 : 0.3;
                const glowOpacity = on ? 0.6 : 0.0;

                this.ledMaterial.emissiveIntensity = intensity;
                this.ledMaterial.opacity = opacity;

                if (this.ledGlowMaterial) {
                    this.ledGlowMaterial.color.copy(c);
                    this.ledGlowMaterial.opacity = glowOpacity;
                    const s = on ? 1.5 : 1.0;
                    this.ledGlow.scale.set(s, s, s);
                }
            } else if (this.ledState === 'WARNING') {
                const intensity = on ? 1.5 : 0.2;
                const opacity = on ? 0.7 : 0.3;

                this.ledMaterial.emissiveIntensity = intensity;
                this.ledMaterial.opacity = opacity;
                if (this.ledGlowMaterial) this.ledGlowMaterial.opacity = 0.0;
            } else {
                const intensity = on ? 1.2 : 0.1;
                const opacity = on ? 0.6 : 0.25;

                this.ledMaterial.emissiveIntensity = intensity;
                this.ledMaterial.opacity = opacity;

                if (this.ledGlowMaterial) {
                    this.ledGlowMaterial.opacity = 0.0;
                    this.ledGlow.scale.set(1, 1, 1);
                }
            }
        }
    };

    chillerV1Group.setLEDState = function (state) {
        this.ledState = String(state || 'HEALTHY').toUpperCase();
    };

    chillerV1Group.zbxKey = zbxKey;
    chillerV1Group.fanOnValue = String(fanOnValue);
    if (!chillerV1Group.fanStatus) {
        chillerV1Group.fanStatus = 'OFF';
    }

    chillerV1Group.applyLiveData = function(row) {
        if (!row) return;

        if (row.state && typeof this.setLEDState === 'function') {
            this.setLEDState(row.state);
        } else if (row.led_state !== undefined) {
            this.setLEDState(row.led_state);
        } else if (row.status !== undefined) {
            this.setLEDState(row.status);
        }

        if (row.fan_status !== undefined) {
            this.fanStatus = row.fan_status.toUpperCase();
            this.fanSpeedMultiplier = row.fan_speed || 1.0;
        }
    };

    chillerV1Group.deviceMetadata = {
        deviceId: deviceId,
        category: category,
        urlLink: urlLink,
        zbxSrvIP: zbxSrvIP,
        zbxAPI: zbxAPI,
        zbxHost: zbxHost,
        zbxHostKeys: [...zbxHostKeys],
        zbxHostKeyValues: [...zbxHostKeyValues]
    };

    chillerV1Group.getDeviceMetadata = function() { return this.deviceMetadata; };
    chillerV1Group.updateDeviceMetadata = function(m) { Object.assign(this.deviceMetadata, m); };

    return chillerV1Group;
}
