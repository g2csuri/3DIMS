// static/js/device_library/eductLineV1.js


function createEduct(scene, options = {}) {
    const {
        // Main Spatial Layout Dimensions
        deviceWidth = 0.3,   // Horizontal width of the rectangular educt profile
        deviceHeight = 0.2,  // Vertical height of the rectangular educt profile
        deviceDepth = 2.5,   // Total length of the main core educt body
        devicePosition = { x: 0, y: 2.4, z: 0 },

        // Colors, Structural Material Aesthetics & Outline Parameters
        deviceColor = 0xb0c4de,     // Brighter metallic sheet metal (Light Steel Blue/Silver)
        outlineColor = 0x333333,    // Default dark outline color
        outlineVisible = 'Enable',  // 'Enable' to show structural edge contours

        // Options: 'Horizontal_FrontBack', 'Horizontal_LeftRight', 'Vertical'
        ductOrientation = 'Horizontal_FrontBack',

        // =================================================================
        // ===== FRONT END SHORTENED ROUTING REGISTRY =====
        // =================================================================
        F_D1_Sts = 'Close',
        F_D1_H = 0,
        F_D1_V = 90,
        F_D1_L = 1.2,
        F_D2_Sts = 'Close',
        F_D2_H = 90,
        F_D2_V = 0,
        F_D2_L = 0.8,
        F_D3_Sts = 'Close',
        F_D3_H = 90,
        F_D3_V = -45,
        F_D3_L = 0.5,

        // =================================================================
        // ===== REAR END SHORTENED ROUTING REGISTRY =====
        // =================================================================
        R_D1_Sts = 'Close',
        R_D1_H = 180,
        R_D1_V = 0,
        R_D1_L = 1.5,
        R_D2_Sts = 'Close',
        R_D2_H = 180,
        R_D2_V = -90,
        R_D2_L = 0.5,
        R_D3_Sts = 'Close',
        R_D3_H = 270,
        R_D3_V = 0,
        R_D3_L = 0.5,

        // =================================================================
        // ===== ELECTRICAL BUS DUCT EXTENSIONS =====
        // =================================================================
        // 1. Plug-In-Box Configuration
        numPlugInBoxes = 1,                 // Total count
        plugInBoxInterval = 1.0,            // Spacing interval in meters
        plugInBoxWidth = 0.35,
        plugInBoxHeight = 0.45,
        plugInBoxDepth = 0.25,
        plugInBoxPosition = 'Below',       // Options: 'Front', 'Back', 'Below', 'Above'

        // 2. End-Feed-Unit Configuration
        enableEndFeedRight = 'Close',       // 'Enable' or 'Close'
        enableEndFeedLeft = 'Close',        // 'Enable' or 'Close'
        endFeedWidth = 0.6,
        endFeedHeight = 0.5,
        endFeedDepth = 0.6,

        // 3. FACE TEXTURES - EMPTY DEFAULTS FOR EDITOR OVERRIDES
        plugInBoxTextures = {
            pfront: ' ',
            pback: ' '
        },

        endFeedTextures = {
            efront: ' ',
            eback: ' '
        },

        // 4. Ceiling Support Screws / Threaded Rods
        enableHangingScrews = 'Close',     // 'Enable' or 'Close'
        numHangingScrews = 2,              // Total hanging rods distributed across length
        screwLength = 1.5
    } = options;

    const eductGroup = new THREE.Group();
    scene.add(eductGroup);

    const normalizedOrientation = ductOrientation.toUpperCase();
    const normalizedBoxPosition = plugInBoxPosition.toUpperCase();

    // Texture Loader Utility
    const loader = new THREE.TextureLoader();

    // --- SEPARATE MATERIAL BUILDER: PLUG-IN BOX TEXTURES ---
    const createPlugInBoxMaterials = (texMap, fallbackColor) => {
        const defaultMat = new THREE.MeshStandardMaterial({ 
            color: fallbackColor, 
            roughness: 0.3, 
            metalness: 0.2 
        });

        const hasFrontTex = texMap && typeof texMap.pfront === 'string' && texMap.pfront.trim() !== '';
        const hasBackTex = texMap && typeof texMap.pback === 'string' && texMap.pback.trim() !== '';

        return [
            defaultMat, // +X (Right)
            defaultMat, // -X (Left)
            defaultMat, // +Y (Top)
            defaultMat, // -Y (Bottom)
            // +Z (Front)
            hasFrontTex ? new THREE.MeshStandardMaterial({ map: loader.load(texMap.pfront.trim()), roughness: 0.3 }) : defaultMat,
            // -Z (Back)
            hasBackTex ? new THREE.MeshStandardMaterial({ map: loader.load(texMap.pback.trim()), roughness: 0.3 }) : defaultMat
        ];
    };

    // --- SEPARATE MATERIAL BUILDER: END-FEED UNIT TEXTURES ---
    const createEndFeedMaterials = (texMap, fallbackColor) => {
        const defaultMat = new THREE.MeshStandardMaterial({ 
            color: fallbackColor, 
            roughness: 0.3, 
            metalness: 0.2 
        });

        const hasFrontTex = texMap && typeof texMap.efront === 'string' && texMap.efront.trim() !== '';
        const hasBackTex = texMap && typeof texMap.eback === 'string' && texMap.eback.trim() !== '';

        return [
            defaultMat, // +X (Right)
            defaultMat, // -X (Left)
            defaultMat, // +Y (Top)
            defaultMat, // -Y (Bottom)
            // +Z (Front)
            hasFrontTex ? new THREE.MeshStandardMaterial({ map: loader.load(texMap.efront.trim()), roughness: 0.3 }) : defaultMat,
            // -Z (Back)
            hasBackTex ? new THREE.MeshStandardMaterial({ map: loader.load(texMap.eback.trim()), roughness: 0.3 }) : defaultMat
        ];
    };

    // --- 1. BRIGHT GALVANIZED STEEL EDUCT MATERIAL ---
    const eductMat = new THREE.MeshStandardMaterial({
        color: deviceColor,
        roughness: 0.3,
        metalness: 0.2
    });

    const outlineMat = new THREE.LineBasicMaterial({
        color: outlineColor,
        linewidth: 1
    });

    const hardwareMat = new THREE.MeshStandardMaterial({
        color: 0x888888,
        metalness: 0.5,
        roughness: 0.3
    });

    // --- HELPER FACTORY: GENERATES FLANGES WITH BOLTS EVERY 1 METER ---
    const attachIndustrialFlanges = (mesh, runLength) => {
        const thick = 0.02;
        const border = 0.03;

        const marks = [0];
        let runningMark = 1.0;
        while (runningMark < runLength - 0.05) {
            marks.push(runningMark);
            runningMark += 1.0;
        }
        marks.push(runLength);

        marks.forEach((pos) => {
            const flangeGeo = new THREE.BoxGeometry(deviceWidth + border, thick, deviceHeight + border);
            const flangeMesh = new THREE.Mesh(flangeGeo, eductMat);

            flangeMesh.position.y = pos - (runLength / 2);
            mesh.add(flangeMesh);

            if (outlineVisible.toUpperCase() === 'ENABLE') {
                const fEdges = new THREE.EdgesGeometry(flangeGeo);
                const fOutline = new THREE.LineSegments(fEdges, outlineMat);
                flangeMesh.add(fOutline);
            }

            const boltGeo = new THREE.BoxGeometry(0.015, thick * 1.4, 0.015);
            const wHalf = (deviceWidth + border) / 2 - 0.01;
            const hHalf = (deviceHeight + border) / 2 - 0.01;

            const offsets = [
                {x: wHalf, z: hHalf}, {x: -wHalf, z: hHalf},
                {x: wHalf, z: -hHalf}, {x: -wHalf, z: -hHalf}
            ];

            offsets.forEach(offset => {
                const bolt = new THREE.Mesh(boltGeo, eductMat);
                bolt.position.set(offset.x, 0, offset.z);
                flangeMesh.add(bolt);
            });
        });
    };

    // --- HELPER FACTORY: ADDS DYNAMIC OUTLINE CONTOURS TO TARGETS ---
    const applyOutline = (mesh, geometry) => {
        if (outlineVisible.toUpperCase() !== 'ENABLE') return;
        const edges = new THREE.EdgesGeometry(geometry);
        const line = new THREE.LineSegments(edges, outlineMat);
        mesh.add(line);
    };

    // --- 2. MAIN CORE EDUCT GENERATION ---
    const staticBaseGeo = new THREE.BoxGeometry(deviceWidth, deviceDepth, deviceHeight);
    const staticBaseEduct = new THREE.Mesh(staticBaseGeo, eductMat);
    applyOutline(staticBaseEduct, staticBaseGeo);
    attachIndustrialFlanges(staticBaseEduct, deviceDepth);

    if (normalizedOrientation === 'HORIZONTAL_FRONTBACK') {
        staticBaseEduct.rotation.x = Math.PI / 2;
    } else if (normalizedOrientation === 'HORIZONTAL_LEFTRIGHT') {
        staticBaseEduct.rotation.z = Math.PI / 2;
    } else if (normalizedOrientation === 'VERTICAL') {
        staticBaseEduct.rotation.set(0, 0, 0);
    }
    eductGroup.add(staticBaseEduct);

    // --- 3. 3-STAGE RECTANGULAR MITERED CYLINDRICAL ROUTING ENGINE ---
    const buildAngularBranch = (parentX, parentY, parentZ, horizDeg, vertDeg, branchLength) => {
        const theta = (horizDeg * Math.PI) / 180;
        const phi = (vertDeg * Math.PI) / 180;

        const dirX = Math.cos(phi) * Math.sin(theta);
        const dirY = Math.sin(phi);
        const dirZ = Math.cos(phi) * Math.cos(theta);

        const upVector = new THREE.Vector3(0, 1, 0);
        const directionVector = new THREE.Vector3(dirX, dirY, dirZ).normalize();
        const branchQuaternion = new THREE.Quaternion().setFromUnitVectors(upVector, directionVector);

        // STAGE A: CYLINDRICAL ELBOW JOINT
        const jointRadius = deviceWidth / 2;
        const jointHeight = deviceHeight * 0.9;

        const jointGeo = new THREE.CylinderGeometry(jointRadius, jointRadius, jointHeight, 32);
        const jointMesh = new THREE.Mesh(jointGeo, eductMat);

        jointMesh.position.set(parentX, parentY, parentZ);
        jointMesh.quaternion.copy(branchQuaternion);
        jointMesh.rotateX(Math.PI / 2);

        applyOutline(jointMesh, jointGeo);
        eductGroup.add(jointMesh);

        // STAGE B: RIGID LINEAR EXTENSION SEGMENT
        const branchGeo = new THREE.BoxGeometry(deviceWidth, branchLength, deviceHeight);
        const branchMesh = new THREE.Mesh(branchGeo, eductMat);

        const targetTipX = parentX + dirX * branchLength;
        const targetTipY = parentY + dirY * branchLength;
        const targetTipZ = parentZ + dirZ * branchLength;

        branchMesh.position.set(
            (parentX + targetTipX) / 2,
            (parentY + targetTipY) / 2,
            (parentZ + targetTipZ) / 2
        );
        branchMesh.quaternion.copy(branchQuaternion);

        applyOutline(branchMesh, branchGeo);
        attachIndustrialFlanges(branchMesh, branchLength);
        eductGroup.add(branchMesh);

        return { x: targetTipX, y: targetTipY, z: targetTipZ };
    };

    const processTerminalEductline = (isFrontEnd, d1Sts, d1H, d1V, d1L, d2Sts, d2H, d2V, d2L, d3Sts, d3H, d3V, d3L) => {
        const halfLengthPos = deviceDepth / 2;
        const directionSign = isFrontEnd ? 1 : -1;
        let startX = 0, startY = 0, startZ = 0;

        if (normalizedOrientation === 'HORIZONTAL_FRONTBACK')   startZ = halfLengthPos * directionSign;
        else if (normalizedOrientation === 'HORIZONTAL_LEFTRIGHT') startX = halfLengthPos * directionSign;
        else if (normalizedOrientation === 'VERTICAL')             startY = halfLengthPos * directionSign;

        if (d1Sts.toUpperCase() !== 'ENABLE') {
            const capGeo = new THREE.BoxGeometry(deviceWidth, 0.005, deviceHeight);
            const cap = new THREE.Mesh(capGeo, eductMat);
            cap.position.set(startX, startY, startZ);

            if (normalizedOrientation === 'HORIZONTAL_FRONTBACK')   cap.rotation.x = Math.PI / 2;
            else if (normalizedOrientation === 'HORIZONTAL_LEFTRIGHT') cap.rotation.z = Math.PI / 2;
            else if (normalizedOrientation === 'VERTICAL')             cap.rotation.set(0, 0, 0);

            applyOutline(cap, capGeo);
            eductGroup.add(cap);
            return;
        }

        const stage1Tip = buildAngularBranch(startX, startY, startZ, d1H, d1V, d1L);

        if (d2Sts.toUpperCase() === 'ENABLE') {
            const stage2Tip = buildAngularBranch(stage1Tip.x, stage1Tip.y, stage1Tip.z, d2H, d2V, d2L);

            if (d3Sts.toUpperCase() === 'ENABLE') {
                buildAngularBranch(stage2Tip.x, stage2Tip.y, stage2Tip.z, d3H, d3V, d3L);
            }
        }
    };

    // Compile Front and Rear HVAC Distribution branch lines
    processTerminalEductline(true, F_D1_Sts, F_D1_H, F_D1_V, F_D1_L, F_D2_Sts, F_D2_H, F_D2_V, F_D2_L, F_D3_Sts, F_D3_H, F_D3_V, F_D3_L);
    processTerminalEductline(false, R_D1_Sts, R_D1_H, R_D1_V, R_D1_L, R_D2_Sts, R_D2_H, R_D2_V, R_D2_L, R_D3_Sts, R_D3_H, R_D3_V, R_D3_L);

    // =================================================================
    // 4. ELECTRICAL BUS DUCT ADDITIONS
    // =================================================================

    // A. PLUG-IN BOX PLACEMENT
    const maxAllowedBoxes = Math.round(deviceDepth);
    const validBoxCount = Math.min(Math.max(0, parseInt(numPlugInBoxes) || 0), maxAllowedBoxes);

    if (validBoxCount > 0) {
        const plugBoxMaterials = createPlugInBoxMaterials(plugInBoxTextures, deviceColor);
        const plugBoxGeo = new THREE.BoxGeometry(plugInBoxWidth, plugInBoxHeight, plugInBoxDepth);

        const totalSpan = (validBoxCount - 1) * plugInBoxInterval;
        const startOffset = -totalSpan / 2;

        for (let i = 0; i < validBoxCount; i++) {
            const offsetPos = startOffset + (i * plugInBoxInterval);
            const plugBoxMesh = new THREE.Mesh(plugBoxGeo, plugBoxMaterials);

            let posX = 0, posY = 0, posZ = 0;

            // Compute offset based on duct orientation and chosen position face
            if (normalizedOrientation === 'HORIZONTAL_FRONTBACK') {
                posZ = offsetPos;
                switch (normalizedBoxPosition) {
                    case 'ABOVE':
                        posY = deviceHeight / 2 + plugInBoxHeight / 2;
                        break;
                    case 'BELOW':
                        posY = -(deviceHeight / 2 + plugInBoxHeight / 2);
                        break;
                    case 'FRONT':
                        posX = deviceWidth / 2 + plugInBoxDepth / 2;
                        break;
                    case 'BACK':
                        posX = -(deviceWidth / 2 + plugInBoxDepth / 2);
                        break;
                }
            } else if (normalizedOrientation === 'HORIZONTAL_LEFTRIGHT') {
                posX = offsetPos;
                switch (normalizedBoxPosition) {
                    case 'ABOVE':
                        posY = deviceWidth / 2 + plugInBoxHeight / 2;
                        break;
                    case 'BELOW':
                        posY = -(deviceWidth / 2 + plugInBoxHeight / 2);
                        break;
                    case 'FRONT':
                        posZ = deviceHeight / 2 + plugInBoxDepth / 2;
                        break;
                    case 'BACK':
                        posZ = -(deviceHeight / 2 + plugInBoxDepth / 2);
                        break;
                }
            } else { // VERTICAL
                posY = offsetPos;
                switch (normalizedBoxPosition) {
                    case 'ABOVE':
                        posZ = deviceHeight / 2 + plugInBoxDepth / 2;
                        break;
                    case 'BELOW':
                        posZ = -(deviceHeight / 2 + plugInBoxDepth / 2);
                        break;
                    case 'FRONT':
                        posX = deviceWidth / 2 + plugInBoxWidth / 2;
                        break;
                    case 'BACK':
                        posX = -(deviceWidth / 2 + plugInBoxWidth / 2);
                        break;
                }
            }

            plugBoxMesh.position.set(posX, posY, posZ);
            applyOutline(plugBoxMesh, plugBoxGeo);
            eductGroup.add(plugBoxMesh);
        }
    }

    // B. END-FEED-UNIT PLACEMENT (LEFT & RIGHT TERMINAL ENDS)
    const endFeedMaterials = createEndFeedMaterials(endFeedTextures, deviceColor);
    const endFeedGeo = new THREE.BoxGeometry(endFeedWidth, endFeedHeight, endFeedDepth);

    if (String(enableEndFeedRight).toUpperCase() === 'ENABLE') {
        const rightFeedMesh = new THREE.Mesh(endFeedGeo, endFeedMaterials);
        const halfDepth = deviceDepth / 2 + endFeedDepth / 2;

        if (normalizedOrientation === 'HORIZONTAL_FRONTBACK') {
            rightFeedMesh.position.set(0, 0, halfDepth);
        } else if (normalizedOrientation === 'HORIZONTAL_LEFTRIGHT') {
            rightFeedMesh.position.set(halfDepth, 0, 0);
        } else { // VERTICAL
            rightFeedMesh.position.set(0, halfDepth, 0);
        }

        applyOutline(rightFeedMesh, endFeedGeo);
        eductGroup.add(rightFeedMesh);
    }

    if (String(enableEndFeedLeft).toUpperCase() === 'ENABLE') {
        const leftFeedMesh = new THREE.Mesh(endFeedGeo, endFeedMaterials);
        const halfDepth = -(deviceDepth / 2 + endFeedDepth / 2);

        if (normalizedOrientation === 'HORIZONTAL_FRONTBACK') {
            leftFeedMesh.position.set(0, 0, halfDepth);
        } else if (normalizedOrientation === 'HORIZONTAL_LEFTRIGHT') {
            leftFeedMesh.position.set(halfDepth, 0, 0);
        } else { // VERTICAL
            leftFeedMesh.position.set(0, halfDepth, 0);
        }

        applyOutline(leftFeedMesh, endFeedGeo);
        eductGroup.add(leftFeedMesh);
    }

    // C. CEILING HANGING SCREWS / SUPPORT RODS
    if (String(enableHangingScrews).toUpperCase() === 'ENABLE') {
        const count = Math.max(1, parseInt(numHangingScrews) || 1);
        const rodRadius = 0.008; // 8mm industrial threaded rod
        const rodGeo = new THREE.CylinderGeometry(rodRadius, rodRadius, screwLength, 12);

        const step = deviceDepth / (count + 1);
        const startPos = -deviceDepth / 2;

        for (let i = 1; i <= count; i++) {
            const currentOffset = startPos + (i * step);

            [-deviceWidth / 2, deviceWidth / 2].forEach(xSide => {
                const rodMesh = new THREE.Mesh(rodGeo, hardwareMat);

                if (normalizedOrientation === 'HORIZONTAL_FRONTBACK') {
                    rodMesh.position.set(xSide, screwLength / 2 + deviceHeight / 2, currentOffset);
                } else if (normalizedOrientation === 'HORIZONTAL_LEFTRIGHT') {
                    rodMesh.position.set(currentOffset, screwLength / 2 + deviceWidth / 2, xSide);
                } else { // VERTICAL
                    rodMesh.position.set(xSide, currentOffset, screwLength / 2);
                }

                eductGroup.add(rodMesh);
            });
        }
    }

    eductGroup.position.set(devicePosition.x, devicePosition.y, devicePosition.z);
/*
    // Metadata properties allocation
    eductGroup.deviceMetadata = {
        deviceWidth, deviceHeight, deviceDepth, deviceColor, outlineColor, outlineVisible, ductOrientation,

        // Plug-In Box Metadata
        numPlugInBoxes: validBoxCount, plugInBoxInterval, plugInBoxWidth, plugInBoxHeight, plugInBoxDepth,
        plugInBoxPosition, plugInBoxTextures,

        // End-Feed-Unit Metadata
        enableEndFeedRight, enableEndFeedLeft, endFeedWidth, endFeedHeight, endFeedDepth,
        endFeedTextures,

        // Ceiling Support Screws
        enableHangingScrews, numHangingScrews, screwLength,

        // Front End Trackers
        F_D1_Sts, F_D1_H, F_D1_V, F_D1_L,
        F_D2_Sts, F_D2_H, F_D2_V, F_D2_L,
        F_D3_Sts, F_D3_H, F_D3_V, F_D3_L,

        // Rear End Trackers
        R_D1_Sts, R_D1_H, R_D1_V, R_D1_L,
        R_D2_Sts, R_D2_H, R_D2_V, R_D2_L,
        R_D3_Sts, R_D3_H, R_D3_V, R_D3_L
    };

    eductGroup.getDeviceMetadata = function() { return this.deviceMetadata; };
    eductGroup.updateDeviceMetadata = function(m) { Object.assign(this.deviceMetadata, m); };
*/
    return eductGroup;
}
