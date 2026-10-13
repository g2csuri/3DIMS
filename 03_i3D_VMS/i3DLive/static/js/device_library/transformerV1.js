// static/js/device_library/transformerV1.js

function createTransformerV1(scene, options = {}) {
    const {
        // Master Boundary Dimensions for the Transformer Plant Assembly
        deviceWidth = 2.40,
        deviceHeight = 1.95,
        deviceDepth = 1.55,
        devicePosition = { x: 0, y: 0, z: 0 },

        // Camera Position
        camPosition = { x: 0, y: 0.6, z: 0.46 },

        // ===== INDEPENDENT COLOR VARIABLES SECTION =====
        deviceColor = 0xF1F5F9,       // Body of the transformer (Light gray near white)
        finUnitColor = 0xCBD5E1,      // Color of the fin units
        bushingColor = 0x5C3A21,      // Color of the ceramic disk insulators (Dark Brown)
        controlBoxColor = 0xE2E8F0,   // Color of the rear control box panel
        frameColor = 0x475569,        // Color of the structural pipes/triangle rods & base supports
        copperColor = 0xD97706,       // Color of the output terminal tips
        deviceoutlineColor = 0x94A3B8,
        hardwareColor = 0x64748B,      // Color for dense structural flange bolts, nuts, and pins

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
        text = "Transformer-V1",
        textPosition = { x: 0, y: -0.4, z: 0.55 },
        textColor = 0x0f172a,
        textSize = 0.065,
        textFont = 'Arial',
        textCanvasBgColor = 0xE2E8F0,
        textbgSize = { width: 0.65, height: 0.16 },

        // Heavy Base Foundation Skids
        standHeight = 0.12,
        //standColor = 0x1E293B,
        standColor = 0x000000,

        // MODULAR COOLING FIN GEOMETRY CONFIGURATION
        coolingFinUnits = 3,          // Separate radiator block units on Left & Right sides
        platesPerUnit = 58,           // Number of parallel fin plates tightly packed per unit
        coolingFinUnitWidth = 0.95,   // Width of the fin unit span along the sides
        finPlateWidth = 0.28,         // Profile depth extension of individual plates
        finPlateDepth = 0.012,        // Thickness profile of a single plate

        // GLOBAL CONFIGURABLE POSITIONAL OFFSETS FOR FIN PLATES W.R.T SUPPORT RODS
        finOffsetX = 0.00,            // Horizontal adjustment along the X axis
        finOffsetY = 0.00,            // Vertical adjustment along the Y axis
        finOffsetZ = 0.00,            // Depth adjustment along the Z axis

        // UNIFORM CERAMIC DISK VARIABLES
        bushingDiskCount = 5,         // Total customizable stacked disks
        bushingDiskRadius = 0.12,     // Constant uniform radius for all disks
        bushingDiskSpacing = 0.068,   // Fixed vertical space step interval between disks
        bushingDiskHeight = 0.030,    // Thickness height of each separate disk
        bushingCenterRodWidth = 0.024, // Global adjustable variable for the continuous terminal inner core rod diameter

        // GLOBAL ELEVATED CYLINDER VARIABLES
        cylinderLength = 0.85,         // Global customizable length size for the front vessel tank
        cylinderRadius = 0.16,         // Global radius size for the cylinder body
        cylinderElevatedHeight = 0.22, // Vertical gap elevation parameter over the top cover plate deck surface
        cylinderFrontOffset = 0.30,    // Forward horizontal displacement offset pushing towards front profile border

        // ===== LIVE MONITORING SYSTEM METADATA =====
        deviceId = '',
        category = 'power',
        urlLink = '',
        zbxSrvIP = '',
        zbxAPI = '',
        zbxHost = '',
        zbxHostKeys = [],
        zbxHostKeyValues = []

    } = options;

    const loader = new THREE.TextureLoader();

    // Master Transformer Assembly Mesh Object Group Anchor
    const transformerV1Group = new THREE.Group();
    transformerV1Group.position.set(devicePosition.x, devicePosition.y + (deviceHeight / 2) + standHeight, devicePosition.z);
    scene.add(transformerV1Group);

    const trackedTransformerMeshes = [];

    function registerOriginalColorState(mesh, targetHexColor) {
        mesh.userData = mesh.userData || {};
        mesh.userData.isTransformerComponent = true;
        mesh.userData.originalColor = new THREE.Color(targetHexColor);
        mesh.userData.isInteractive = true;
        mesh.userData.parentDevice = transformerV1Group;
        trackedTransformerMeshes.push(mesh);
    }

    // =================================================================
    // BASE SKID RAILS
    // =================================================================
    const foundationGroup = new THREE.Group();
    const bracketSpacingX = deviceWidth * 0.32;
    const bracketWidth = 0.14;
    const bracketLength = deviceDepth * 1.05;

    [-1, 1].forEach((sideSign) => {
        const bracketMesh = new THREE.Mesh(
            new THREE.BoxGeometry(bracketWidth, standHeight, bracketLength),
            //new THREE.MeshStandardMaterial({ color: standColor, metalness: 0.7, roughness: 0.3 })
            new THREE.MeshStandardMaterial({ color: 0xFFFFFF, metalness: 0.7, roughness: 0.3 })
        );
        //bracketMesh.position.set(bracketSpacingX * sideSign, -deviceHeight / 2 - standHeight / 2, 0);
        bracketMesh.position.set(bracketSpacingX * sideSign/2, -deviceHeight / 2 - standHeight / 2, 0);
        bracketMesh.castShadow = true;
        bracketMesh.receiveShadow = true;
        registerOriginalColorState(bracketMesh, standColor);
        foundationGroup.add(bracketMesh);
    });
    transformerV1Group.add(foundationGroup);


    // =================================================================
    // MAIN TRANSFORMER TANK MAIN BODY
    // =================================================================
    const tankWidth = deviceWidth * 0.50; 
    const tankHeight = deviceHeight * 0.72;
    const tankDepth = deviceDepth * 0.75;
    
    const tankGeom = new THREE.BoxGeometry(tankWidth, tankHeight, tankDepth);
    const tankMat = new THREE.MeshStandardMaterial({ color: deviceColor, roughness: 0.3, metalness: 0.2 });
    const tankMesh = new THREE.Mesh(tankGeom, tankMat);
    tankMesh.position.set(0, -deviceHeight / 2 + tankHeight / 2, 0);
    tankMesh.castShadow = true;
    tankMesh.receiveShadow = true;
    registerOriginalColorState(tankMesh, deviceColor);
    transformerV1Group.add(tankMesh);


    // =================================================================
    // MID-BODY CHAMBER BRACKET RIM WITH HIGH-DENSITY NUTS
    // =================================================================
    const flangeThickness = 0.04;
    const flangeOutset = 0.09; 
    const bracketFlangeGeom = new THREE.BoxGeometry(tankWidth + flangeOutset, flangeThickness, tankDepth + flangeOutset);
    const flangeMat = new THREE.MeshStandardMaterial({ color: deviceColor, roughness: 0.3, metalness: 0.2 });
    const bracketFlangeMesh = new THREE.Mesh(bracketFlangeGeom, flangeMat);
    
    const midlineY = tankMesh.position.y;
    bracketFlangeMesh.position.set(0, midlineY, 0);
    bracketFlangeMesh.castShadow = true;
    registerOriginalColorState(bracketFlangeMesh, deviceColor);
    transformerV1Group.add(bracketFlangeMesh);

    // Nut/Bolt fasteners
    const nutGeom = new THREE.CylinderGeometry(0.013, 0.013, 0.048, 6);
    const hardwareMat = new THREE.MeshStandardMaterial({ color: hardwareColor, metalness: 0.7, roughness: 0.2 });

    const generateHardwareRimBolts = () => {
        const boltCountW = 18; 
        const boltCountD = 22; 
        const halfFlangeW = (tankWidth + flangeOutset - 0.02) / 2;
        const halfFlangeD = (tankDepth + flangeOutset - 0.02) / 2;

        for (let i = 0; i < boltCountW; i++) {
            const fraction = (i / (boltCountW - 1)) * 2 - 1;
            const xPos = fraction * halfFlangeW;
            [-halfFlangeD, halfFlangeD].forEach((zOffset) => {
                const nut = new THREE.Mesh(nutGeom, hardwareMat);
                nut.position.set(xPos, midlineY + flangeThickness / 2, zOffset);
                registerOriginalColorState(nut, hardwareColor);
                transformerV1Group.add(nut);
            });
        }
        for (let i = 1; i < boltCountD - 1; i++) {
            const fraction = (i / (boltCountD - 1)) * 2 - 1;
            const zPos = fraction * halfFlangeD;
            [-halfFlangeW, halfFlangeW].forEach((xOffset) => {
                const nut = new THREE.Mesh(nutGeom, hardwareMat);
                nut.position.set(xOffset, midlineY + flangeThickness / 2, zPos);
                registerOriginalColorState(nut, hardwareColor);
                transformerV1Group.add(nut);
            });
        }
    };
    generateHardwareRimBolts();


    // =================================================================
    // TOP SIDE MAINTENANCE COVER ACCESS PLATE WITH PERIMETER NUTS
    // =================================================================
    const absoluteTankTopY = tankMesh.position.y + tankHeight / 2;
    const coverPlateThickness = 0.025;
    const coverPlateGeom = new THREE.BoxGeometry(tankWidth * 1.04, coverPlateThickness, tankDepth * 1.04);
    const coverPlateMesh = new THREE.Mesh(coverPlateGeom, flangeMat);
    coverPlateMesh.position.set(0, absoluteTankTopY + coverPlateThickness / 2, 0);
    coverPlateMesh.castShadow = true;
    registerOriginalColorState(coverPlateMesh, deviceColor);
    transformerV1Group.add(coverPlateMesh);

    const generateTopCoverPlateNuts = () => {
        const topBoltCountW = 14;
        const topBoltCountD = 16;
        const boundX = (tankWidth * 1.02) / 2;
        const boundZ = (tankDepth * 1.02) / 2;
        const targetTopY = absoluteTankTopY + coverPlateThickness;

        for (let i = 0; i < topBoltCountW; i++) {
            const pct = (i / (topBoltCountW - 1)) * 2 - 1;
            const xCoord = pct * boundX;
            [-boundZ, boundZ].forEach((zCoord) => {
                const nut = new THREE.Mesh(nutGeom, hardwareMat);
                nut.position.set(xCoord, targetTopY, zCoord);
                registerOriginalColorState(nut, hardwareColor);
                transformerV1Group.add(nut);
            });
        }
        for (let i = 1; i < topBoltCountD - 1; i++) {
            const pct = (i / (topBoltCountD - 1)) * 2 - 1;
            const zCoord = pct * boundZ;
            [-boundX, boundX].forEach((xCoord) => {
                const nut = new THREE.Mesh(nutGeom, hardwareMat);
                nut.position.set(xCoord, targetTopY, zCoord);
                registerOriginalColorState(nut, hardwareColor);
                transformerV1Group.add(nut);
            });
        }
    };
    generateTopCoverPlateNuts();


    // =================================================================
    // REAR CONTROL BOX CABINET (Opposite side is plain front)
    // =================================================================
    const controlBoxGeom = new THREE.BoxGeometry(tankWidth * 0.70, tankHeight * 0.80, 0.16);
    const controlBoxMat = new THREE.MeshStandardMaterial({ color: controlBoxColor, roughness: 0.4, metalness: 0.2 });
    const controlBoxMesh = new THREE.Mesh(controlBoxGeom, controlBoxMat);
    controlBoxMesh.position.set(0, tankMesh.position.y - 0.02, -tankDepth / 2 - 0.08);
    controlBoxMesh.castShadow = true;
    registerOriginalColorState(controlBoxMesh, controlBoxColor);
    //transformerV1Group.add(controlBoxMesh);


    // =================================================================
    // BOTH SIDES FIN UNITS UPDATED INWARD Symmetrically
    // =================================================================
    const finHeight = tankHeight * 0.85;
    const finMat = new THREE.MeshStandardMaterial({ color: finUnitColor, metalness: 0.3, roughness: 0.4 });
    const rodMat = new THREE.MeshStandardMaterial({ color: frameColor, metalness: 0.5, roughness: 0.3 });

    const edgeSafetyBuffer = 0.08; 
    const availableSpanZ = tankDepth - (edgeSafetyBuffer * 2);
    const startUnitZ = -availableSpanZ / 2;
    const unitStepZ = coolingFinUnits > 1 ? availableSpanZ / (coolingFinUnits - 1) : 0;
    const plateStepX = platesPerUnit > 1 ? coolingFinUnitWidth / (platesPerUnit - 1) : 0;

    // Continuous 2D Shape profile for the corrugated plate structure
    const halfW = finPlateWidth / 2;
    const halfH = finHeight / 2;
    const taperDeltaY = finHeight * 0.06; 

    const plateShape = new THREE.Shape();
    plateShape.moveTo(-halfW, -halfH + taperDeltaY);
    plateShape.lineTo(-halfW, halfH - taperDeltaY);
    plateShape.lineTo(-halfW + 0.03, halfH); 
    plateShape.lineTo(halfW - 0.03, halfH);
    plateShape.lineTo(halfW, halfH - taperDeltaY);
    plateShape.lineTo(halfW, -halfH + taperDeltaY);
    plateShape.lineTo(halfW - 0.03, -halfH); 
    plateShape.lineTo(-halfW + 0.03, -halfH);
    plateShape.closePath();

    const extrudeSettings = { depth: finPlateDepth, bevelEnabled: false };
    const basePlateGeom = new THREE.ExtrudeGeometry(plateShape, extrudeSettings);
    basePlateGeom.center();
    basePlateGeom.rotateY(Math.PI / 2); 

    const patternCount = 5;
    const patternGeom = new THREE.BoxGeometry(finPlateDepth * 1.3, 0.015, finPlateWidth * 0.72);
    const patternMat = new THREE.MeshStandardMaterial({ color: finUnitColor, roughness: 0.5, metalness: 0.2 });

    const sideDirections = [
        // BOTH SIDES SET INWARD Symmetrically: Grows inward from tank walls to keep corner borders clear
        { isLeft: true,  baseX: -tankWidth / 2 + 0.02, sign: 1,  outsetShift: -finPlateWidth / 2 },
        { isLeft: false, baseX: tankWidth / 2 - 0.02,  sign: -1, outsetShift: finPlateWidth / 2 }
    ];

    sideDirections.forEach((side) => {
        for (let u = 0; u < coolingFinUnits; u++) {
            const currentUnitCenterZ = startUnitZ + (u * unitStepZ);
            
            for (let p = 0; p < platesPerUnit; p++) {
                const growthOffset = p * plateStepX;
                // Native relative coordinates with respect to supporting rods
                const nativeX = side.baseX + (growthOffset * side.sign) + side.outsetShift;
                const nativeY = tankMesh.position.y;
                const nativeZ = currentUnitCenterZ;

                const singlePlateCompositeGroup = new THREE.Group();

                const structuralPlateMesh = new THREE.Mesh(basePlateGeom, finMat);
                structuralPlateMesh.castShadow = true;
                registerOriginalColorState(structuralPlateMesh, finUnitColor);
                singlePlateCompositeGroup.add(structuralPlateMesh);

                for (let k = 0; k < patternCount; k++) {
                    const yOffset = ((k / (patternCount - 1)) * 2 - 1) * (halfH * 0.65);
                    const embossLine = new THREE.Mesh(patternGeom, patternMat);
                    embossLine.position.set(0, yOffset, 0);
                    embossLine.castShadow = true;
                    registerOriginalColorState(embossLine, finUnitColor);
                    singlePlateCompositeGroup.add(embossLine);
                }

                // Global variables applied directly to the individual plate clusters
                singlePlateCompositeGroup.position.set(
                    nativeX + finOffsetX, 
                    nativeY + finOffsetY, 
                    nativeZ + finOffsetZ
                );
                transformerV1Group.add(singlePlateCompositeGroup);
            }

            // Collector pipes supporting the current radiator pack block
            const supportRodLength = coolingFinUnitWidth + 0.02;
            const rodGeom = new THREE.CylinderGeometry(0.016, 0.016, supportRodLength, 12);
            rodGeom.rotateZ(Math.PI / 2);

            const rodCenterX = side.baseX + ((supportRodLength / 2) * side.sign) + side.outsetShift;

            const upperRod = new THREE.Mesh(rodGeom, rodMat);
            upperRod.position.set(rodCenterX, tankMesh.position.y + finHeight / 2 - 0.03, currentUnitCenterZ);
            registerOriginalColorState(upperRod, frameColor);
            transformerV1Group.add(upperRod);

            const lowerRod = new THREE.Mesh(rodGeom, rodMat);
            lowerRod.position.set(rodCenterX, tankMesh.position.y - finHeight / 2 + 0.03, currentUnitCenterZ);
            registerOriginalColorState(lowerRod, frameColor);
            transformerV1Group.add(lowerRod);
        }
    });


    // =================================================================
    // HOUSING BRACKETS & CYLINDER ELEVATED HOUSING ASSEMBLY
    // =================================================================
    const cylinderZPos = tankDepth / 2 - (0.50 - cylinderFrontOffset);
    const cylinderYPos = absoluteTankTopY + coverPlateThickness + cylinderRadius + cylinderElevatedHeight;

    const frontCylinderGeom = new THREE.CylinderGeometry(cylinderRadius, cylinderRadius, cylinderLength, 24);
    frontCylinderGeom.rotateZ(Math.PI / 2);

    const frontCylinderMesh = new THREE.Mesh(frontCylinderGeom, tankMat);
    frontCylinderMesh.position.set(0, cylinderYPos, cylinderZPos);
    frontCylinderMesh.castShadow = true;
    registerOriginalColorState(frontCylinderMesh, deviceColor);
    transformerV1Group.add(frontCylinderMesh);

    const mountOffset = cylinderLength * 0.28;
    const mountSides = [-1, 1];

    mountSides.forEach((sideSign) => {
        const housingBracketGroup = new THREE.Group();
        housingBracketGroup.position.set(mountOffset * sideSign, absoluteTankTopY + coverPlateThickness, cylinderZPos);

        const baseBlock = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.02, 0.16), rodMat);
        baseBlock.position.set(0, 0.01, 0);
        registerOriginalColorState(baseBlock, frameColor);
        housingBracketGroup.add(baseBlock);

        const legHeight = cylinderElevatedHeight + cylinderRadius;
        const towerStrut = new THREE.Mesh(new THREE.BoxGeometry(0.035, legHeight, 0.04), rodMat);
        towerStrut.position.set(0, legHeight / 2, 0);
        towerStrut.castShadow = true;
        registerOriginalColorState(towerStrut, frameColor);
        housingBracketGroup.add(towerStrut);

        const clampRingGeom = new THREE.CylinderGeometry(cylinderRadius + 0.012, cylinderRadius + 0.012, 0.035, 24, 1, true);
        clampRingGeom.rotateZ(Math.PI / 2);
        const clampRingMesh = new THREE.Mesh(clampRingGeom, rodMat);
        clampRingMesh.position.set(0, cylinderElevatedHeight + cylinderRadius, 0);
        registerOriginalColorState(clampRingMesh, frameColor);
        housingBracketGroup.add(clampRingMesh);

        transformerV1Group.add(housingBracketGroup);
    });


    // =================================================================
    // CERAMIC DISKS WITH CONTINUOUS CONDUCTING INTERNAL CENTER RODS
    // =================================================================
    const bushingCount = 3;
    const bushingSpacing = tankWidth / (bushingCount + 1);

    for (let b = 0; b < bushingCount; b++) {
        const posX = -tankWidth / 2 + (bushingSpacing * (b + 1));
        const bushingGroup = new THREE.Group();
        bushingGroup.position.set(posX, absoluteTankTopY + coverPlateThickness, -tankDepth * 0.12);

        let runningY = 0;

        for (let d = 0; d < bushingDiskCount; d++) {
            const diskGeom = new THREE.CylinderGeometry(bushingDiskRadius, bushingDiskRadius, bushingDiskHeight, 20);
            const diskMat = new THREE.MeshStandardMaterial({ color: bushingColor, roughness: 0.4, metalness: 0.1 });
            const diskMesh = new THREE.Mesh(diskGeom, diskMat);

            diskMesh.position.y = runningY + bushingDiskHeight / 2;

            registerOriginalColorState(diskMesh, bushingColor);
            bushingGroup.add(diskMesh);

            runningY += bushingDiskSpacing;
        }

        const totalStackHeightReached = runningY + 0.06;
        const continuousRodGeom = new THREE.CylinderGeometry(bushingCenterRodWidth / 2, bushingCenterRodWidth / 2, totalStackHeightReached, 16);
        const continuousRodMat = new THREE.MeshStandardMaterial({ color: copperColor, metalness: 0.8, roughness: 0.2 });
        const continuousRodMesh = new THREE.Mesh(continuousRodGeom, continuousRodMat);
        continuousRodMesh.position.y = totalStackHeightReached / 2;
        registerOriginalColorState(continuousRodMesh, copperColor);
        bushingGroup.add(continuousRodMesh);

        const terminalGeom = new THREE.CylinderGeometry(bushingCenterRodWidth / 2 + 0.004, bushingCenterRodWidth / 2 + 0.004, 0.03, 12);
        const terminalMesh = new THREE.Mesh(terminalGeom, continuousRodMat);
        terminalMesh.position.y = totalStackHeightReached + 0.015;
        registerOriginalColorState(terminalMesh, copperColor);
        bushingGroup.add(terminalMesh);

        transformerV1Group.add(bushingGroup);
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
        textLabelMesh.position.set(textPosition.x, textPosition.y, textPosition.z + tankDepth / 2 + 0.01);
        transformerV1Group.add(textLabelMesh);
    })();


    // Orientation Alignment Matrix Config
    switch (orientation.toUpperCase()) {
        case 'BACK':  transformerV1Group.rotation.y = Math.PI; break;
        case 'LEFT':  transformerV1Group.rotation.y = Math.PI / 2;  break;
        case 'RIGHT': transformerV1Group.rotation.y = -Math.PI / 2; break;
        case 'FRONT':
        default:      transformerV1Group.rotation.y = 0;            break;
    }

    // Default Hover Interactivity System Allocations
    transformerV1Group.userData = {
        isCurrentlyHovered: false,
        hoverColor: new THREE.Color(0x3182CE)
    };

    // Frame Core Refresh Thread loop handler
    transformerV1Group.updateFan = function(dt) {
        const isHovered = this.userData.isCurrentlyHovered;
        const currentHoverColor = this.userData.hoverColor;

        trackedTransformerMeshes.forEach(mesh => {
            if (mesh.material && mesh.userData && mesh.userData.originalColor) {
                if (isHovered) {
                    mesh.material.color.copy(currentHoverColor);
                } else {
                    mesh.material.color.copy(mesh.userData.originalColor);
                }
            }
        });
    };

    // Live telemetry data update allocations mapping
    transformerV1Group.applyLiveData = function(row) {
        if (!row) return;
    };

    transformerV1Group.deviceMetadata = {
        deviceId: deviceId,
        category: category,
        urlLink: urlLink,
        zbxSrvIP: zbxSrvIP,
        zbxAPI: zbxAPI,
        zbxHost: zbxHost,
        zbxHostKeys: [...zbxHostKeys],
        zbxHostKeyValues: [...zbxHostKeyValues]
    };

    transformerV1Group.getDeviceMetadata = function() { return this.deviceMetadata; };
    transformerV1Group.updateDeviceMetadata = function(m) { Object.assign(this.deviceMetadata, m); };

    return transformerV1Group;
}
