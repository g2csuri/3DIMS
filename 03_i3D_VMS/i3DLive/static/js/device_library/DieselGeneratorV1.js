// static/js/device_library/dieselGeneratorV1.js

function createDieselGeneratorV1(scene, options = {}) {
    const {
        // Master Boundary Dimensions for the Large Generator Unit
        deviceWidth = 8.00,
        deviceHeight = 2.50,
        deviceDepth = 3.00,
        devicePosition = { x: 0, y: 0, z: 0 },

        // Structural Steel Base Stand Parameters
        standHeight = 0.30,
        standColor = 0x888888,

        // ===== GLOBAL EXHAUST SYSTEM CONFIGURABLE VARIABLES =====
        exhaustCylinderRadius = 0.22,      // Diameter/radius profile of the silencer tank
        exhaustCylinderLength = 4.50,      // Total span length of the silencer tank 
        exhaustSilencerColor = 0x64748B,   // Color of the silencer main body
        exhaustPipeColor = 0x94A3B8,       // Color of the upward stack and connection pipes

        // ===== INDEPENDENT COLOR VARIABLES SECTION =====
        bodyColor = 0xF8FAFC,              // Weatherproof white/cream color enclosure casing
        panelFrameColor = 0x334155,        // Dark slate color framing for panels and door borders
        louverColor = 0x1E293B,            // Deep charcoal slate for ventilation slats
        hingeColor = 0x0F172A,             // High contrast dark color for door hinges

        // ORIENTATION
        orientation = 'Front',

        // FACE TEXTURES SYSTEM (As implemented in inrow.js)
        faceTextures = {
            front: null,
            back: null,
            left: null,
            right: null,
            top: null
        },

        // Door/Louver Layout Configuration 
        slatCount = 12,

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

    // Master Assembly Group Anchor
    const generatorGroup = new THREE.Group();
    // Calculate precise center point offset over ground plane taking stand height into account
    generatorGroup.position.set(devicePosition.x, devicePosition.y + (deviceHeight / 2) + standHeight, devicePosition.z);
    scene.add(generatorGroup);

    const trackedGeneratorMeshes = [];

    function registerOriginalColorState(mesh, targetHexColor) {
        mesh.userData = mesh.userData || {};
        mesh.userData.isGeneratorComponent = true;
        mesh.userData.originalColor = new THREE.Color(targetHexColor);
        mesh.userData.isInteractive = true;
        mesh.userData.parentDevice = generatorGroup;
        trackedGeneratorMeshes.push(mesh);
    }

    // =================================================================
    // d) BOTTOM BROAD STRUCTURAL STEEL STAND FRAME
    // =================================================================
    const skidGroup = new THREE.Group();
    const skidMaterial = new THREE.MeshStandardMaterial({ color: standColor, metalness: 0.7, roughness: 0.2 });
    
    const frameThickness = 0.20; // Heavier industrial profile for broad frame setup
    
    // Outer Left Channel Rail
    const leftRail = new THREE.Mesh(new THREE.BoxGeometry(frameThickness, standHeight, deviceDepth * 1.02), skidMaterial);
    leftRail.position.set(-deviceWidth / 2 + frameThickness / 2, -deviceHeight / 2 - standHeight / 2, 0);
    leftRail.castShadow = true; leftRail.receiveShadow = true;
    registerOriginalColorState(leftRail, standColor);
    skidGroup.add(leftRail);

    // Outer Right Channel Rail
    const rightRail = new THREE.Mesh(new THREE.BoxGeometry(frameThickness, standHeight, deviceDepth * 1.02), skidMaterial);
    rightRail.position.set(deviceWidth / 2 - frameThickness / 2, -deviceHeight / 2 - standHeight / 2, 0);
    rightRail.castShadow = true; rightRail.receiveShadow = true;
    registerOriginalColorState(rightRail, standColor);
    skidGroup.add(rightRail);

    // Front, Back and Intermittent Support Cross Members
    const crossZPositions = [-deviceDepth / 2 + frameThickness / 2, 0, deviceDepth / 2 - frameThickness / 2];
    crossZPositions.forEach((zPos) => {
        const tieWidth = deviceWidth - (frameThickness * 2);
        const crossTie = new THREE.Mesh(new THREE.BoxGeometry(tieWidth, standHeight, frameThickness), skidMaterial);
        crossTie.position.set(0, -deviceHeight / 2 - standHeight / 2, zPos);
        crossTie.castShadow = true; crossTie.receiveShadow = true;
        registerOriginalColorState(crossTie, standColor);
        skidGroup.add(crossTie);
    });
    generatorGroup.add(skidGroup);


    // =================================================================
    // MAIN ENCLOSURE CASING WITH INDEPENDENT 6-SIDE TEXTURE OVERLAYS
    // =================================================================
    const mainBodyGeom = new THREE.BoxGeometry(deviceWidth, deviceHeight, deviceDepth);
    
    // Assemble distinct materials for each face mapping (Order: +X, -X, +Y, -Y, +Z, -Z)
    const faceKeys = ['right', 'left', 'top', 'bottom', 'front', 'back'];
    const bodyMaterialsArray = faceKeys.map((faceKey) => {
        const matOptions = { color: bodyColor, roughness: 0.4, metalness: 0.1 };
        
        // Dynamically load PNG texture if configured in global map arguments
        if (faceTextures && faceTextures[faceKey]) {
            matOptions.map = loader.load(faceTextures[faceKey]);
        }
        return new THREE.MeshStandardMaterial(matOptions);
    });

    const mainCasingMesh = new THREE.Mesh(mainBodyGeom, bodyMaterialsArray);
    mainCasingMesh.castShadow = true;
    mainCasingMesh.receiveShadow = true;
    
    // Register structural components array mapping for highlighting logic
    mainCasingMesh.userData = { isTransformerComponent: true, isInteractive: true, parentDevice: generatorGroup };
    trackedGeneratorMeshes.push(mainCasingMesh);
    generatorGroup.add(mainCasingMesh);


    // =================================================================
    // a) & b) 4 PAIRS OF DOORS WITH LOUVERS & VISIBLE HINGES (LEFT & RIGHT SIDES)
    // =================================================================
    const sideDoorMat = new THREE.MeshStandardMaterial({ color: bodyColor, roughness: 0.3, metalness: 0.15 });
    const borderFrameMat = new THREE.MeshStandardMaterial({ color: panelFrameColor, roughness: 0.4, metalness: 0.2 });
    const slatMat = new THREE.MeshStandardMaterial({ color: louverColor, roughness: 0.5, metalness: 0.2 });
    const hingeMat = new THREE.MeshStandardMaterial({ color: hingeColor, metalness: 0.8, roughness: 0.2 });

    const totalPairsCount = 4;
    const doorThickness = 0.03;
    const doorHeight = deviceHeight * 0.82;
    
    // Calculate individual door widths to evenly fit across the wide width of the unit
    const doorSectionAvailableWidth = deviceWidth * 0.88;
    const singlePairWidth = doorSectionAvailableWidth / totalPairsCount;
    const individualDoorWidth = (singlePairWidth * 0.92) / 2; // Split pair with spacing clearance

    // Populate symmetrically across Left Face (-Z) and Right Face (+Z) along the main width sides
    [-1, 1].forEach((zSideSign) => {
        const sideGroup = new THREE.Group();
        // Shift outward cleanly to sit completely flush with the depth casing wall skin
        sideGroup.position.set(0, 0, (deviceDepth / 2 + 0.005) * zSideSign);

        for (let p = 0; p < totalPairsCount; p++) {
            // Find continuous linear offset along the X-axis for each pair group block
            const pairCenterX = -doorSectionAvailableWidth / 2 + (singlePairWidth / 2) + (p * singlePairWidth);

            // Create individual Left (-1) and Right (+1) swing assemblies within the current pair block
            [-1, 1].forEach((doorSwingSign) => {
                const individualDoorCenterX = pairCenterX + (individualDoorWidth / 2 + 0.005) * doorSwingSign;

                // Main Door Shell Panel Geometry
                const doorPanel = new THREE.Mesh(new THREE.BoxGeometry(individualDoorWidth, doorHeight, doorThickness), sideDoorMat);
                doorPanel.position.set(individualDoorCenterX, 0, 0);
                doorPanel.castShadow = true;
                registerOriginalColorState(doorPanel, bodyColor);
                sideGroup.add(doorPanel);

                // Framing border trim defining outer layout lines
                const trimThickness = 0.02;
                const boundaryTrim = new THREE.Mesh(new THREE.BoxGeometry(individualDoorWidth - 0.02, doorHeight - 0.02, doorThickness * 1.1), borderFrameMat);
                boundaryTrim.position.set(individualDoorCenterX, 0, 0.001);
                registerOriginalColorState(boundaryTrim, panelFrameColor);
                sideGroup.add(boundaryTrim);

                // b) INTEGRATED AIR VENTILATION GRILLE matrix slats
                const grilleWidth = individualDoorWidth * 0.78;
                const grilleHeight = doorHeight * 0.60;
                
                const backgroundMesh = new THREE.Mesh(new THREE.BoxGeometry(grilleWidth, grilleHeight, doorThickness * 1.2), slatMat);
                backgroundMesh.position.set(individualDoorCenterX, -doorHeight * 0.04, 0.002);
                registerOriginalColorState(backgroundMesh, louverColor);
                sideGroup.add(backgroundMesh);

                const slatStepY = grilleHeight / (slatCount - 1);
                for (let s = 0; s < slatCount; s++) {
                    const slatY = (-doorHeight * 0.04) - (grilleHeight / 2) + (s * slatStepY);
                    const singleSlat = new THREE.Mesh(new THREE.BoxGeometry(grilleWidth, 0.015, doorThickness * 1.3), slatMat);
                    singleSlat.position.set(individualDoorCenterX, slatY, 0.003);
                    singleSlat.rotation.x = -0.3; // Angular louver slope deflection pattern
                    registerOriginalColorState(singleSlat, louverColor);
                    sideGroup.add(singleSlat);
                }

                // a) VISIBLE MECHANICAL DOOR HINGES (Positioned along the pivoting outer edge)
                const hingeRadius = 0.016;
                const hingeHeight = 0.08;
                const hingeXPos = individualDoorCenterX + (individualDoorWidth / 2) * -doorSwingSign;

                [-1, 1].forEach((hingeVerticalSign) => {
                    const hingeCylinder = new THREE.Mesh(new THREE.CylinderGeometry(hingeRadius, hingeRadius, hingeHeight, 12), hingeMat);
                    hingeCylinder.position.set(hingeXPos, (doorHeight * 0.35) * hingeVerticalSign, doorThickness / 2);
                    hingeCylinder.castShadow = true;
                    registerOriginalColorState(hingeCylinder, hingeColor);
                    sideGroup.add(hingeCylinder);
                });
            });
        }
        //generatorGroup.add(sideGroup);
    });


    // =================================================================
    // c) PARALLEL TOP EXHAUST SILENCER CYLINDER SYSTEM
    // =================================================================
    const topExhaustGroup = new THREE.Group();
    const silencerMaterial = new THREE.MeshStandardMaterial({ color: exhaustSilencerColor, metalness: 0.6, roughness: 0.3 });
    const pipeMaterial = new THREE.MeshStandardMaterial({ color: exhaustPipeColor, metalness: 0.8, roughness: 0.15 });

    const absoluteTopSurfaceY = deviceHeight / 2;

    // Main Silencer Core Tank (Configured parallel to the main horizontal Width axis)
    const mainSilencerMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(exhaustCylinderRadius, exhaustCylinderRadius, exhaustCylinderLength, 24),
        silencerMaterial
    );
    mainSilencerMesh.rotation.z = Math.PI / 2; // Aligns the cylinder parallel to the width axis
    mainSilencerMesh.position.set(0, absoluteTopSurfaceY + exhaustCylinderRadius + 0.15, 0);
    mainSilencerMesh.castShadow = true;
    registerOriginalColorState(mainSilencerMesh, exhaustSilencerColor);
    topExhaustGroup.add(mainSilencerMesh);

    // Heavy Structural Saddle Mount Supports
    const saddleCount = 2;
    for (let m = 0; m < saddleCount; m++) {
        const saddleX = -exhaustCylinderLength / 3 + (m * (exhaustCylinderLength / 1.5));
        const saddleBracket = new THREE.Mesh(
            new THREE.BoxGeometry(0.12, exhaustCylinderRadius + 0.15, exhaustCylinderRadius * 2.2),
            borderFrameMat
        );
        saddleBracket.position.set(saddleX, absoluteTopSurfaceY + (exhaustCylinderRadius + 0.15) / 2, 0);
        registerOriginalColorState(saddleBracket, panelFrameColor);
        topExhaustGroup.add(saddleBracket);
    }

    // Two parallel feed pipes linking generator body core up into silencer base
    [-1, 1].forEach((pipeSign) => {
        const connectionPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.16, 16), pipeMaterial);
        connectionPipe.position.set((exhaustCylinderLength * 0.25) * pipeSign, absoluteTopSurfaceY + 0.08, 0);
        registerOriginalColorState(connectionPipe, exhaustPipeColor);
        topExhaustGroup.add(connectionPipe);
    });

    // Protruded Vertical Exhaust Stack Pipe (Projecting upwards near the left side edge)
    const upperStackHeight = 0.70;
    const stackRadius = 0.075;
    const verticalStackPipe = new THREE.Mesh(
        new THREE.CylinderGeometry(stackRadius, stackRadius, upperStackHeight, 16),
        pipeMaterial
    );
    verticalStackPipe.position.set(-exhaustCylinderLength * 0.38, mainSilencerMesh.position.y + exhaustCylinderRadius + upperStackHeight / 2, 0);
    verticalStackPipe.castShadow = true;
    registerOriginalColorState(verticalStackPipe, exhaustPipeColor);
    topExhaustGroup.add(verticalStackPipe);

    // Weather protective sloped rain cap shield piece
    const weatherShieldCap = new THREE.Mesh(new THREE.CylinderGeometry(stackRadius * 1.15, stackRadius * 1.15, 0.04, 16), pipeMaterial);
    weatherShieldCap.position.set(-exhaustCylinderLength * 0.38, mainSilencerMesh.position.y + exhaustCylinderRadius + upperStackHeight, 0);
    weatherShieldCap.rotation.z = 0.35; // Angled rain cap slice deflection
    registerOriginalColorState(weatherShieldCap, exhaustPipeColor);
    topExhaustGroup.add(weatherShieldCap);

    generatorGroup.add(topExhaustGroup);


    // =================================================================
    // ORIENTATION MAPPING AND THREAD INTERACTIVITY HANDLERS
    // =================================================================
    switch (orientation.toUpperCase()) {
        case 'BACK':  generatorGroup.rotation.y = Math.PI; break;
        case 'LEFT':  generatorGroup.rotation.y = Math.PI / 2;  break;
        case 'RIGHT': generatorGroup.rotation.y = -Math.PI / 2; break;
        case 'FRONT':
        default:      generatorGroup.rotation.y = 0;            break;
    }

    // Hover Selection Highlighting Parameters
    generatorGroup.userData = {
        isCurrentlyHovered: false,
        hoverColor: new THREE.Color(0x3B82F6)
    };

    // Global component frame animation/color update loop handler
    generatorGroup.updateFan = function(dt) {
        const isHovered = this.userData.isCurrentlyHovered;
        const currentHoverColor = this.userData.hoverColor;

        trackedGeneratorMeshes.forEach(mesh => {
            if (mesh.material) {
                if (Array.isArray(mesh.material)) {
                    mesh.material.forEach((mat) => {
                        if (mat.userData && mat.userData.originalColor) {
                            mat.color.copy(isHovered ? currentHoverColor : mat.userData.originalColor);
                        } else if (mesh.userData && mesh.userData.originalColor) {
                            // System backup default material loop fallback color mapping
                            mat.color.copy(isHovered ? currentHoverColor : mesh.userData.originalColor);
                        }
                    });
                } else if (mesh.userData && mesh.userData.originalColor) {
                    mesh.material.color.copy(isHovered ? currentHoverColor : mesh.userData.originalColor);
                }
            }
        });
    };

    generatorGroup.applyLiveData = function(row) {
        if (!row) return;
    };

    // Telemetry and Management Metadata properties allocation
    generatorGroup.deviceMetadata = {
        deviceId: deviceId,
        category: category,
        urlLink: urlLink,
        zbxSrvIP: zbxSrvIP,
        zbxAPI: zbxAPI,
        zbxHost: zbxHost,
        zbxHostKeys: [...zbxHostKeys],
        zbxHostKeyValues: [...zbxHostKeyValues]
    };

    generatorGroup.getDeviceMetadata = function() { return this.deviceMetadata; };
    generatorGroup.updateDeviceMetadata = function(m) { Object.assign(this.deviceMetadata, m); };

    return generatorGroup;
}
