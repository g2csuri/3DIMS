// static/js/device_library/chillerV2.js

function createChillerV2(scene, options = {}) {
    const {
        // Master Boundary Dimensions for the Chiller Type 2 Assembly
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

        // FACE TEXTURES (optional)
        faceTextures = {
            front: null,
            back: null,
            left: null,
            right: null,
            top: null
        },

        // Front Identifier Label
        text = "Chiller-V2",
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

    // Master Group Anchor for Chiller V2
    const chillerV2Group = new THREE.Group();
    chillerV2Group.position.set(devicePosition.x, devicePosition.y + (deviceHeight / 2) + standHeight, devicePosition.z);
    scene.add(chillerV2Group);

    // Dynamic registry tracking every child mesh color for unified hover management
    const trackedChillerV2Meshes = [];

    function registerOriginalColorState(mesh, targetHexColor) {
        mesh.userData = mesh.userData || {};
        mesh.userData.originalColor = new THREE.Color(targetHexColor);
        trackedChillerV2Meshes.push(mesh);
    }

    const singleUnitWidth = deviceWidth / unitCount;
    const startX = - (deviceWidth / 2) + (singleUnitWidth / 2);
    const allBladeGroups = [];

    // Structural Splitting Math
    const baseBlockHeight = deviceHeight * 0.35;
    const upperVHeight = deviceHeight * 0.65;
    const currentBaseCenterY = -deviceHeight / 2 + baseBlockHeight / 2;

    const halfW = deviceWidth / 2;
    const halfH = deviceHeight / 2;
    const halfD = deviceDepth / 2;

    // === MASTER STRUCTURE STAND SKID PLATFORM ===
    const standGeometry = new THREE.BoxGeometry(deviceWidth, standHeight, deviceDepth);
    const standMaterial = new THREE.MeshStandardMaterial({ color: standColor, metalness: 0.5, roughness: 0.5 });
    const standMesh = new THREE.Mesh(standGeometry, standMaterial);
    standMesh.position.y = -deviceHeight / 2 - standHeight / 2;
    standMesh.castShadow = true;
    standMesh.receiveShadow = true;
    registerOriginalColorState(standMesh, standColor);
    chillerV2Group.add(standMesh);

    // =================================================================
    // STRUCTURAL OUTER FRAME BAR WORK
    // =================================================================
    const createFrameBar = (w, h, d, x, y, z) => {
        const geom = new THREE.BoxGeometry(w, h, d);
        const frameMat = new THREE.MeshStandardMaterial({ color: frameColor, metalness: 0.6, roughness: 0.4 });
        const mesh = new THREE.Mesh(geom, frameMat);
        mesh.position.set(x, y, z);
        registerOriginalColorState(mesh, frameColor);
        chillerV2Group.add(mesh);
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

    // Mid-level Belt Rails
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
    // EXPOSED LOWER MACHINERY COMPARTMENT
    // =================================================================
    const centralMachineryGroup = new THREE.Group();
    centralMachineryGroup.position.set(0, currentBaseCenterY, 0);
    chillerV2Group.add(centralMachineryGroup);

    const compressorLength = deviceWidth * 0.75;
    const compressorRadius = baseBlockHeight * 0.22;
    const compCylinderGeom = new THREE.CylinderGeometry(compressorRadius, compressorRadius, compressorLength, 24);

    const createCompressorWithDomes = (zOffset) => {
        const compGroup = new THREE.Group();
        compGroup.position.set(0, -baseBlockHeight * 0.05, zOffset);
        
        // [Requirement 2 FIXED]: Main cylinder body matches main deviceColor palette
        const coreMesh = new THREE.Mesh(compCylinderGeom, new THREE.MeshStandardMaterial({ color: deviceColor, metalness: 0.5, roughness: 0.4 }));
        coreMesh.rotation.z = Math.PI / 2;
        registerOriginalColorState(coreMesh, deviceColor);
        compGroup.add(coreMesh);

        const domeGeom = new THREE.SphereGeometry(compressorRadius, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2);
        
        // [Requirement 2 FIXED]: Domes match main deviceColor palette
        const domeLeft = new THREE.Mesh(domeGeom, new THREE.MeshStandardMaterial({ color: deviceColor, metalness: 0.5, roughness: 0.4 }));
        domeLeft.position.x = -compressorLength / 2;
        domeLeft.rotation.z = Math.PI / 2;
        registerOriginalColorState(domeLeft, deviceColor);
        compGroup.add(domeLeft);

        const domeRight = new THREE.Mesh(domeGeom, new THREE.MeshStandardMaterial({ color: deviceColor, metalness: 0.5, roughness: 0.4 }));
        domeRight.position.x = compressorLength / 2;
        domeRight.rotation.z = -Math.PI / 2;
        registerOriginalColorState(domeRight, deviceColor);
        compGroup.add(domeRight);

        centralMachineryGroup.add(compGroup);
    };

    createCompressorWithDomes(-deviceDepth * 0.22);
    createCompressorWithDomes(deviceDepth * 0.22);

    // Mounting Saddles
    const cradleGeom = new THREE.BoxGeometry(0.06, baseBlockHeight * 0.25, baseBlockHeight * 0.5);
    const xOffsets = [-deviceWidth * 0.25, deviceWidth * 0.25];
    xOffsets.forEach(x => {
        const supportA = new THREE.Mesh(cradleGeom, new THREE.MeshStandardMaterial({ color: frameColor, metalness: 0.4, roughness: 0.5 }));
        supportA.position.set(x, -baseBlockHeight * 0.25, -deviceDepth * 0.22);
        registerOriginalColorState(supportA, frameColor);
        centralMachineryGroup.add(supportA);

        const supportB = new THREE.Mesh(cradleGeom, new THREE.MeshStandardMaterial({ color: frameColor, metalness: 0.4, roughness: 0.5 }));
        supportB.position.set(x, -baseBlockHeight * 0.25, deviceDepth * 0.22);
        registerOriginalColorState(supportB, frameColor);
        centralMachineryGroup.add(supportB);
    });

    // Interconnecting Pipes
    const bridgePipeGeom = new THREE.CylinderGeometry(0.025, 0.025, deviceDepth * 0.44, 16);
    const bridgePipe = new THREE.Mesh(bridgePipeGeom, new THREE.MeshStandardMaterial({ color: pipeColor, metalness: 0.6, roughness: 0.2 }));
    bridgePipe.rotation.x = Math.PI / 2;
    bridgePipe.position.set(-deviceWidth * 0.1, baseBlockHeight * 0.15, 0);
    registerOriginalColorState(bridgePipe, pipeColor);
    centralMachineryGroup.add(bridgePipe);

    const vertPipeGeom = new THREE.CylinderGeometry(0.02, 0.02, baseBlockHeight * 0.3, 16);

    const pipeVertA = new THREE.Mesh(vertPipeGeom, new THREE.MeshStandardMaterial({ color: pipeColor, metalness: 0.6, roughness: 0.2 }));
    pipeVertA.position.set(-deviceWidth * 0.1, baseBlockHeight * 0.3, -deviceDepth * 0.22);
    registerOriginalColorState(pipeVertA, pipeColor);
    centralMachineryGroup.add(pipeVertA);

    const pipeVertB = new THREE.Mesh(vertPipeGeom, new THREE.MeshStandardMaterial({ color: pipeColor, metalness: 0.6, roughness: 0.2 }));
    pipeVertB.position.set(-deviceWidth * 0.1, baseBlockHeight * 0.3, deviceDepth * 0.22);
    registerOriginalColorState(pipeVertB, pipeColor);
    centralMachineryGroup.add(pipeVertB);

    // Control Box Cabinet
    const cabinetGeom = new THREE.BoxGeometry(deviceWidth * 0.22, baseBlockHeight * 0.7, 0.15);
    const unifiedControlCabinet = new THREE.Mesh(cabinetGeom, new THREE.MeshStandardMaterial({ color: 0xEDF2F7, roughness: 0.4 }));
    unifiedControlCabinet.position.set(deviceWidth * 0.25, 0, deviceDepth / 2 - 0.075 - frameThickness);
    registerOriginalColorState(unifiedControlCabinet, 0xEDF2F7);
    centralMachineryGroup.add(unifiedControlCabinet);

    // LED Initialization
    let dynamicLEDIndicator = null;
    let glowMesh = null;
    let ledMaterial = null;
    let glowMat = null;

    if (ledEnabled) {
        const ledGeometry = new THREE.CylinderGeometry(ledRadius, ledRadius, ledHeight, 16);
        const baseColor = new THREE.Color(healthyColor);

        ledMaterial = new THREE.MeshStandardMaterial({
            color: baseColor, emissive: baseColor, emissiveIntensity: 0.0,
            transparent: false, opacity: 0.3, roughness: 0.4, metalness: 0.1
        });
        dynamicLEDIndicator = new THREE.Mesh(ledGeometry, ledMaterial);
        dynamicLEDIndicator.rotation.x = Math.PI / 2;
        dynamicLEDIndicator.position.set(ledOffset.x, ledOffset.y, ledOffset.z + 0.075);
        unifiedControlCabinet.add(dynamicLEDIndicator);

        glowMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(alarmColor), transparent: true, opacity: 0.0 });
        glowMesh = new THREE.Mesh(new THREE.SphereGeometry(ledRadius * 2.0, 16, 16), glowMat);
        glowMesh.position.copy(dynamicLEDIndicator.position);
        unifiedControlCabinet.add(glowMesh);
    }

    // =================================================================
    // MODULAR V-SHAPED CONDENSER MODULES (SIDE-WISE VISIBILITY)
    // =================================================================
    const internalVDepth = deviceDepth - (frameThickness * 2);
    const upperPartCenterY = -deviceHeight / 2 + baseBlockHeight + upperVHeight / 2;
    const highEdgeY = -deviceHeight / 2 + baseBlockHeight + upperVHeight;
    const singleUnitExtrudeThickness = singleUnitWidth - 0.02;

    const gableMaterial = new THREE.MeshStandardMaterial({ color: deviceColor, roughness: 0.6, metalness: 0.2 });

    // 1. Solid Top Plates covering the apex gap of the V-shape units
    const topPlateWidth = singleUnitExtrudeThickness;
    const topPlateDepth = internalVDepth;
    const topPlateHeight = 0.02;
    
    // 2. Solid Side Slanted Plates forming a robust physical structural shield
    const maxX = singleUnitExtrudeThickness / 2;
    const slantLength = Math.sqrt(upperVHeight * upperVHeight + maxX * maxX);

    for (let u = 0; u < unitCount; u++) {
        const unitOffsetX = startX + (u * singleUnitWidth);

        const unitGroup = new THREE.Group();
        unitGroup.position.x = unitOffsetX;
        chillerV2Group.add(unitGroup);

        // [Requirement 1 FIXED]: Add Solid Top Protective Capping
        const topPlateGeom = new THREE.BoxGeometry(topPlateWidth, topPlateHeight, topPlateDepth);
        const topPlateMesh = new THREE.Mesh(topPlateGeom, gableMaterial);
        topPlateMesh.position.set(0, highEdgeY - topPlateHeight / 2, 0);
        topPlateMesh.castShadow = true;
        registerOriginalColorState(topPlateMesh, deviceColor);
        unitGroup.add(topPlateMesh);

        // [Requirement 1 FIXED]: Solid Side Panels (Front and Rear Slanted Enclosures)
        const sidePanelGeom = new THREE.BoxGeometry(0.015, slantLength, internalVDepth);
        const slantAngleRad = Math.atan2(upperVHeight, maxX) + 300;

        // Solid Front Slanted Plate
        const solidFrontSlopePlate = new THREE.Mesh(sidePanelGeom, gableMaterial);
        solidFrontSlopePlate.position.set(maxX / 2, (-deviceHeight / 2 + baseBlockHeight) + upperVHeight / 2, 0);
        solidFrontSlopePlate.rotation.z = slantAngleRad;
        registerOriginalColorState(solidFrontSlopePlate, deviceColor);
        unitGroup.add(solidFrontSlopePlate);

        // Solid Rear Slanted Plate
        const solidRearSlopePlate = new THREE.Mesh(sidePanelGeom, gableMaterial);
        solidRearSlopePlate.position.set(-maxX / 2, (-deviceHeight / 2 + baseBlockHeight) + upperVHeight / 2, 0);
        solidRearSlopePlate.rotation.z = -slantAngleRad;
        registerOriginalColorState(solidRearSlopePlate, deviceColor);
        unitGroup.add(solidRearSlopePlate);

        // Outer Left and Right Boundary Flat Panels
        const flatFaceShape = new THREE.Shape();
        flatFaceShape.moveTo(-maxX, upperVHeight);
        flatFaceShape.lineTo(maxX, upperVHeight);
        flatFaceShape.lineTo(0, frameThickness);
        flatFaceShape.closePath();

        const flatExtrudeGeom = new THREE.ExtrudeGeometry(flatFaceShape, { depth: 0.005, bevelEnabled: false });
        flatExtrudeGeom.center();

        const leftOuterPlate = new THREE.Mesh(flatExtrudeGeom, gableMaterial);
        leftOuterPlate.position.set(0, upperPartCenterY, -internalVDepth / 2 + 0.005);
        registerOriginalColorState(leftOuterPlate, deviceColor);
        unitGroup.add(leftOuterPlate);

        const rightOuterPlate = new THREE.Mesh(flatExtrudeGeom, gableMaterial);
        rightOuterPlate.position.set(0, upperPartCenterY, internalVDepth / 2 - 0.005);
        registerOriginalColorState(rightOuterPlate, deviceColor);
        unitGroup.add(rightOuterPlate);

        // --- [Requirement 1 FIXED]: RECESS GRILLS AND FINS DIRECTLY BELOW THE SOLID COVERS ---
        const totalFinsPerSide = 44;
        const finLengthZ = internalVDepth - 0.04;
        const finHeightSlat = 0.010;
        const finThicknessSlat = 0.010;

        const finSlatGeom = new THREE.BoxGeometry(finThicknessSlat, finHeightSlat, finLengthZ);

        for (let i = 0; i < totalFinsPerSide; i++) {
            // Scale interpolation bounds kept slightly inward from the absolute edges
            const t = (i / (totalFinsPerSide - 1)) * 0.92;
            const currX = t * maxX;
            const currY = (-deviceHeight / 2 + baseBlockHeight) + t * upperVHeight - 0.02; // Positioned below top solid plates

            // Front Louver Recessed Grill Row
            const slatFront = new THREE.Mesh(finSlatGeom, new THREE.MeshStandardMaterial({ color: machineryColor, metalness: 0.7, roughness: 0.3 }));
            slatFront.position.set(currX + 0.02, currY, 0);
            slatFront.rotation.z = slantAngleRad + 15 ;
            registerOriginalColorState(slatFront, machineryColor);
            unitGroup.add(slatFront);

            // Rear Louver Recessed Grill Row
            const slatRear = new THREE.Mesh(finSlatGeom, new THREE.MeshStandardMaterial({ color: machineryColor, metalness: 0.7, roughness: 0.3 }));
            slatRear.position.set(-currX - 0.02, currY, 0);
            slatRear.rotation.z = -slantAngleRad;
            registerOriginalColorState(slatRear, machineryColor);
            unitGroup.add(slatRear);
        }

        // --- RECESSED MESH PROTECTIVE GRILL SUPPORT SHIELDS ---
        const wireGridGeom = new THREE.CylinderGeometry(0.002, 0.002, finLengthZ, 8);
        wireGridGeom.rotateX(Math.PI / 2);

        const numWireBars = 5;
        for (let b = 0; b < numWireBars; b++) {
            const tY = (b / (numWireBars - 1)) * 0.90;
            const currY = (-deviceHeight / 2 + baseBlockHeight) + tY * upperVHeight - 0.015;
            const currX = tY * maxX;

            const wireFront = new THREE.Mesh(wireGridGeom, new THREE.MeshStandardMaterial({ color: frameColor, metalness: 0.6, roughness: 0.4 }));
            wireFront.position.set(currX + 0.025, currY, 0);
            registerOriginalColorState(wireFront, frameColor);
            unitGroup.add(wireFront);

            const wireRear = new THREE.Mesh(wireGridGeom, new THREE.MeshStandardMaterial({ color: frameColor, metalness: 0.6, roughness: 0.4 }));
            wireRear.position.set(-currX - 0.025, currY, 0);
            registerOriginalColorState(wireRear, frameColor);
            unitGroup.add(wireRear);
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

                const shroudGeom = new THREE.CylinderGeometry(fanSize + 0.015, fanSize + 0.02, shroudHeight, 32, 1, true);
                const shroudMesh = new THREE.Mesh(shroudGeom, new THREE.MeshStandardMaterial({ color: fanHousingColor, metalness: 0.4, roughness: 0.5, side: THREE.DoubleSide }));
                registerOriginalColorState(shroudMesh, fanHousingColor);
                fanComponentGroup.add(shroudMesh);

                const activeBladeRotationContainer = new THREE.Group();
                activeBladeRotationContainer.position.y = shroudHeight / 2 - 0.015;
                fanComponentGroup.add(activeBladeRotationContainer);

                const centralAxialHub = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.002, 24), new THREE.MeshStandardMaterial({ color: 0x1A202C, metalness: 0.5 }));
                registerOriginalColorState(centralAxialHub, 0x1A202C);
                activeBladeRotationContainer.add(centralAxialHub);

                const engineeredBladeShape = new THREE.Shape();
                engineeredBladeShape.moveTo(0, 0.01);
                engineeredBladeShape.lineTo(fanSize * 0.85, 0.04);
                engineeredBladeShape.quadraticCurveTo(fanSize * 0.95, 0, fanSize * 0.85, -0.04);
                engineeredBladeShape.lineTo(0, -0.01);
                engineeredBladeShape.closePath();

                const bladeExtrusionGeom = new THREE.ShapeGeometry(engineeredBladeShape);
                const preciseBladeMaterial = new THREE.MeshStandardMaterial({ color: fanColor, side: THREE.DoubleSide, roughness: 0.4, metalness: 0.1 });

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

                // Protective Mesh Ring Grids
                const wireGrillShieldGroup = new THREE.Group();
                wireGrillShieldGroup.position.y = shroudHeight / 2;
                const wireRadius = 0.002;

                const ringRadii = [fanSize * 0.35, fanSize * 0.65, fanSize * 0.95];
                ringRadii.forEach(r => {
                    const meshRing = new THREE.Mesh(new THREE.TorusGeometry(r, wireRadius, 6, 32), new THREE.MeshStandardMaterial({ color: fanMeshColor, metalness: 0.7, roughness: 0.3 }));
                    meshRing.rotation.x = Math.PI / 2;
                    registerOriginalColorState(meshRing, fanMeshColor);
                    wireGrillShieldGroup.add(meshRing);
                });

                const totalSpokesCount = 12;
                const spokeRodGeom = new THREE.CylinderGeometry(wireRadius, wireRadius, fanSize * 2, 8);
                for (let s = 0; s < totalSpokesCount / 2; s++) {
                    const rodMesh = new THREE.Mesh(spokeRodGeom, new THREE.MeshStandardMaterial({ color: fanMeshColor, metalness: 0.7, roughness: 0.3 }));
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
        const textLabelMesh = new THREE.Mesh(new THREE.PlaneGeometry(textbgSize.width * 0.9, textbgSize.height * 0.9), textLabelMaterial);
        textLabelMesh.position.set(textPosition.x, textPosition.y, textPosition.z);
        chillerV2Group.add(textLabelMesh);
    })();

    // Apply Global Frame Edge Lines
    const globalEdges = new THREE.EdgesGeometry(new THREE.BoxGeometry(deviceWidth, deviceHeight, deviceDepth));
    const globalOutline = new THREE.LineSegments(globalEdges, new THREE.LineBasicMaterial({ color: deviceoutlineColor, linewidth: 2 }));
    chillerV2Group.add(globalOutline);

    // Orientation Config Matrix Alignment
    switch (orientation.toUpperCase()) {
        case 'BACK':  chillerV2Group.rotation.y = Math.PI;      break;
        case 'LEFT':  chillerV2Group.rotation.y = Math.PI / 2;  break;
        case 'RIGHT': chillerV2Group.rotation.y = -Math.PI / 2; break;
        case 'FRONT':
        default:      chillerV2Group.rotation.y = 0;            break;
    }

    // Runtime Update Metadata Flags
    chillerV2Group.userData = {
        isCurrentlyHovered: false,
        hoverColor: new THREE.Color(0x3182CE) // Default hover highlight fallback
    };

    chillerV2Group.allBladeGroups = allBladeGroups;
    chillerV2Group.fanStatus = String(fanStatus).toUpperCase();
    chillerV2Group.fanSpeedMultiplier = parseFloat(fanSpeed);

    chillerV2Group.led = dynamicLEDIndicator;
    chillerV2Group.ledMaterial = ledMaterial;
    chillerV2Group.ledGlow = glowMesh;
    chillerV2Group.ledGlowMaterial = glowMat;
    chillerV2Group.ledState = ledState.toUpperCase();
    chillerV2Group.blinkTimer = 0;
    chillerV2Group.ledBlinkPeriod = ledBlinkPeriod;

    chillerV2Group.ledColors = {
        HEALTHY: new THREE.Color(healthyColor),
        WARNING: new THREE.Color(warningColor),
        ALARM:   new THREE.Color(alarmColor),
        RUN:     new THREE.Color(runColor),
        CUSTOM:  new THREE.Color(customColor)
    };

    chillerV2Group._getLEDColor = function () {
        return this.ledColors[this.ledState] || this.ledColors.HEALTHY;
    };

    // Frame Execution Loop Refresh Thread
    chillerV2Group.updateFan = function(dt) {
        // [Requirement 3 FIXED]: Unified Hover State Fallback Switch Matrix
        const isHovered = this.userData.isCurrentlyHovered;
        const targetHoverColor = this.userData.hoverColor;

        trackedChillerV2Meshes.forEach(mesh => {
            if (mesh.material && mesh.userData && mesh.userData.originalColor) {
                if (isHovered) {
                    mesh.material.color.copy(targetHoverColor);
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

        // 2. Process LED Signaling Telemetry
        if (this.led && this.ledMaterial) {
            this.blinkTimer += dt;
            const phase = (this.blinkTimer % this.ledBlinkPeriod) / this.ledBlinkPeriod;
            const on = phase < 0.5;

            const c = this._getLEDColor();
            
            // Only update LED emission colors if not currently overriding system colors during a mouse hover event
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

    chillerV2Group.setLEDState = function (state) {
        this.ledState = String(state || 'HEALTHY').toUpperCase();
    };

    chillerV2Group.zbxKey = zbxKey;
    chillerV2Group.fanOnValue = String(fanOnValue);
    if (!chillerV2Group.fanStatus) {
        chillerV2Group.fanStatus = 'OFF';
    }

    chillerV2Group.applyLiveData = function(row) {
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

    chillerV2Group.deviceMetadata = {
        deviceId: deviceId,
        category: category,
        urlLink: urlLink,
        zbxSrvIP: zbxSrvIP,
        zbxAPI: zbxAPI,
        zbxHost: zbxHost,
        zbxHostKeys: [...zbxHostKeys],
        zbxHostKeyValues: [...zbxHostKeyValues]
    };

    chillerV2Group.getDeviceMetadata = function() { return this.deviceMetadata; };
    chillerV2Group.updateDeviceMetadata = function(m) { Object.assign(this.deviceMetadata, m); };

    return chillerV2Group;
}
