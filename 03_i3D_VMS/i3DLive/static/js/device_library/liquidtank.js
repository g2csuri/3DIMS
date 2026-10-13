// static/js/device_library/LiquidTank.js

function createLiquidTank(scene, options = {}) {
    const {
        // CYLINDER BASE DIMENSIONS
        deviceRadius = 0.6,
        deviceHeight = 1.8,
        devicePosition = { x: 0, y: 0.6, z: 0.46 },
        deviceColor = 0xCCCCCC,      // Industrial Grey/Metallic finish
        deviceoutlineColor = 0x000000,
        orientation = 'Front',

        // A) DOMES (TOP & BOTTOM) - Use 'Enable' or 'Disable'
        enableTopDome = 'Enable',    // 'Enable' or 'Disable'
        enableBottomDome = 'Enable', // 'Enable' or 'Disable'
        domeDepth = 0.3,             // Height/Depth of dome curve
        domeColor = 0xCCCCCC,

        // B) TOP CYLINDRICAL MANHOLE / LID - Use 'Enable' or 'Disable'
        enableLid = 'Enable',        // 'Enable' or 'Disable'
        lidDiameter = 0.35,
        lidHeight = 0.12,
        lidColor = 0x999999,
        lidPosition = { x: 0.2, y: 0.25, z: 0.15 },
        lidTilt = 0,                 // Manual override/additive rotation in radians (optional)

        // C) 4 STAND RODS (LEGS AT BOTTOM) - Use 'Enable' or 'Disable'
        enableStand = 'Enable',      // 'Enable' or 'Disable'
        standLegHeight = 0.8,
        standLegDiameter = 0.08,
        standColor = 0x666666,
        standPosition = { x: 0, y: 0, z: 0 }, // Relative position offset for the entire stand assembly

        // D) PRESSURE RELEASE VALVE - Use 'Enable' or 'Disable'
        enablePressureValve = 'Enable', // 'Enable' or 'Disable'
        valveDiameter = 0.08,
        valveColor = 0x222222,
        valvePosition = { x: 0, y: 0.28, z: -0.1 },

        // LABEL TEXT PROPERTIES
        text = "LIQUID TANK",
        textPosition = { x: 0, y: 0, z: 0.61 },
        textColor = 0x000000,
        textSize = 0.12,
        textFont = 'Arial',
        textCanvasBgColor = 0xFFFFFF,
        textbgSize = { width: 0.7, height: 0.22 },

        // GENERAL DEVICE PROPERTIES FOR LIVE DATA
        deviceId = '',
        category = 'electrical',
        urlLink = '',
        zbxSrvIP = '',
        zbxAPI = '',
        zbxHost = ''
    } = options;

    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    const tankMaterial = new THREE.MeshStandardMaterial({
        color: typeof deviceColor === 'number' ? deviceColor : 0xCCCCCC,
        roughness: 0.4,
        metalness: 0.3
    });

    // === 1. CYLINDER BODY ===
    const cylinderGeometry = new THREE.CylinderGeometry(deviceRadius, deviceRadius, deviceHeight, 32);
    const cylinder = new THREE.Mesh(cylinderGeometry, tankMaterial);
    cylinder.castShadow = true;
    cylinder.receiveShadow = true;
    mainGroup.add(cylinder);

    // Helper function to check 'Enable' vs 'Disable'
    const parseEnabled = (val) => String(val).toUpperCase() === 'ENABLE';

    // === A) TOP & BOTTOM DOMES ===
    if (parseEnabled(enableTopDome)) { // Options: 'Enable' or 'Disable'
        const topDomeGeo = new THREE.SphereGeometry(deviceRadius, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
        const topDome = new THREE.Mesh(topDomeGeo, tankMaterial);
        topDome.scale.set(1, domeDepth / deviceRadius, 1);
        topDome.position.y = deviceHeight / 2;
        cylinder.add(topDome);
    }

    if (parseEnabled(enableBottomDome)) { // Options: 'Enable' or 'Disable'
        const bottomDomeGeo = new THREE.SphereGeometry(deviceRadius, 32, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
        const bottomDome = new THREE.Mesh(bottomDomeGeo, tankMaterial);
        bottomDome.scale.set(1, domeDepth / deviceRadius, 1);
        bottomDome.position.y = -deviceHeight / 2;
        cylinder.add(bottomDome);
    }

    // === B) TOP CYLINDRICAL LID / MANHOLE ===
    if (parseEnabled(enableLid)) { // Options: 'Enable' or 'Disable'
        const lidGroup = new THREE.Group();
        const neckRadius = lidDiameter / 2;

        const neckGeo = new THREE.CylinderGeometry(neckRadius, neckRadius, lidHeight, 24);
        const lidMat = new THREE.MeshStandardMaterial({ color: lidColor, roughness: 0.5, metalness: 0.2 });
        const neckMesh = new THREE.Mesh(neckGeo, lidMat);
        lidGroup.add(neckMesh);

        const capGeo = new THREE.CylinderGeometry(neckRadius * 1.15, neckRadius * 1.15, lidHeight * 0.4, 24);
        const capMesh = new THREE.Mesh(capGeo, lidMat);
        capMesh.position.y = lidHeight / 2 + (lidHeight * 0.2);
        lidGroup.add(capMesh);

        lidGroup.position.set(
            lidPosition.x,
            deviceHeight / 2 + (domeDepth * 0.6) + lidPosition.y,
            lidPosition.z
        );

        // --- DYNAMIC TILT BASED ON DISTANCE FROM DOME CENTER ---
        // Radial distance from cylinder center axis (0, 0)
        const distFromCenter = Math.sqrt(lidPosition.x * lidPosition.x + lidPosition.z * lidPosition.z);
        // Normalize distance (0 at center, 1 at edge of cylinder)
        const normalizedDist = Math.min(distFromCenter / deviceRadius, 1.0);
        
        // Dynamic tilt angle increases as Lid approaches dome edge
        const dynamicTiltAngle = normalizedDist * (Math.PI / 4) + lidTilt;

        if (distFromCenter > 0) {
            // Direction vector pointing outwards from center to lid position
            const dirX = lidPosition.x / distFromCenter;
            const dirZ = lidPosition.z / distFromCenter;

            // Rotate lid away from dome center to align naturally with dome curvature
            lidGroup.rotation.x = -dirZ * dynamicTiltAngle;
            lidGroup.rotation.z = dirX * dynamicTiltAngle;
        }

        cylinder.add(lidGroup);
    }

    // === C) 4 STAND RODS (BOTTOM LEGS) ===
    if (parseEnabled(enableStand)) { // Options: 'Enable' or 'Disable'
        const standGroup = new THREE.Group();
        const legRadius = standLegDiameter / 2;
        const legGeo = new THREE.CylinderGeometry(legRadius, legRadius, standLegHeight, 16);
        const legMat = new THREE.MeshStandardMaterial({ color: standColor, roughness: 0.6, metalness: 0.5 });

        const bottomY = -deviceHeight / 2 - (parseEnabled(enableBottomDome) ? domeDepth * 0.5 : 0) - (standLegHeight / 2);
        
        // ENSURE LEGS STAY STRICTLY INSIDE THE TANK DIAMETER:
        // Leg center distance = Radius - Leg Radius - Safety Margin
        const maxLegOffset = Math.max(0.05, deviceRadius - legRadius * 1.8 - 0.02);
        const legOffset = maxLegOffset * Math.SQRT1_2; // Equal X and Z offset for 4 corners

        const legPositions = [
            { x: legOffset, z: legOffset },
            { x: -legOffset, z: legOffset },
            { x: legOffset, z: -legOffset },
            { x: -legOffset, z: -legOffset }
        ];

        legPositions.forEach(pos => {
            const leg = new THREE.Mesh(legGeo, legMat);
            leg.position.set(pos.x, bottomY, pos.z);
            leg.castShadow = true;
            standGroup.add(leg);

            // Foot Plate Flanges
            const footGeo = new THREE.CylinderGeometry(legRadius * 1.5, legRadius * 1.5, 0.02, 16);
            const foot = new THREE.Mesh(footGeo, legMat);
            foot.position.y = -standLegHeight / 2;
            leg.add(foot);
        });

        // Apply adjustable Stand Position offsets (x, y, z)
        standGroup.position.set(standPosition.x, standPosition.y, standPosition.z);
        cylinder.add(standGroup);
    }

    // === D) PRESSURE RELEASE VALVE ===
    if (parseEnabled(enablePressureValve)) { // Options: 'Enable' or 'Disable'
        const valveGroup = new THREE.Group();
        const vRadius = valveDiameter / 2;
        const vMat = new THREE.MeshStandardMaterial({ color: valveColor, roughness: 0.3, metalness: 0.7 });

        const stemGeo = new THREE.CylinderGeometry(vRadius, vRadius, 0.15, 16);
        const stem = new THREE.Mesh(stemGeo, vMat);
        valveGroup.add(stem);

        const wheelGeo = new THREE.TorusGeometry(vRadius * 1.5, vRadius * 0.3, 8, 16);
        const wheel = new THREE.Mesh(wheelGeo, vMat);
        wheel.rotation.x = Math.PI / 2;
        wheel.position.y = 0.08;
        valveGroup.add(wheel);

        valveGroup.position.set(
            valvePosition.x,
            deviceHeight / 2 + domeDepth + valvePosition.y,
            valvePosition.z
        );
        cylinder.add(valveGroup);
    }

    // === ORIENTATION ROTATION ===
    switch (String(orientation).toUpperCase()) {
        case 'BACK':
            cylinder.rotation.y = Math.PI;
            break;
        case 'LEFT':
            cylinder.rotation.y = Math.PI / 2;
            break;
        case 'RIGHT':
            cylinder.rotation.y = -Math.PI / 2;
            break;
        case 'FRONT':
        default:
            cylinder.rotation.y = 0;
            break;
    }

    // === LABEL TEXT ===
    if (text) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        canvas.width = textbgSize.width * 1000;
        canvas.height = textbgSize.height * 1000;

        const parsedBgColor = typeof textCanvasBgColor === 'number'
            ? '#' + textCanvasBgColor.toString(16).padStart(6, '0')
            : textCanvasBgColor;

        const parsedTextColor = typeof textColor === 'number'
            ? '#' + textColor.toString(16).padStart(6, '0')
            : textColor;

        context.fillStyle = parsedBgColor;
        context.fillRect(0, 0, canvas.width, canvas.height);

        context.fillStyle = parsedTextColor;
        context.font = `bold ${textSize * 1000}px ${textFont}, Arial, sans-serif`;
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(text, canvas.width / 2, canvas.height / 2);

        const textTexture = new THREE.CanvasTexture(canvas);
        textTexture.needsUpdate = true;

        const textMaterial = new THREE.MeshBasicMaterial({
            map: textTexture,
            transparent: true,
            side: THREE.DoubleSide
        });

        const textPlane = new THREE.Mesh(
            new THREE.PlaneGeometry(textbgSize.width, textbgSize.height),
            textMaterial
        );
        textPlane.position.set(textPosition.x, textPosition.y, textPosition.z);
        cylinder.add(textPlane);
    }

    mainGroup.position.set(devicePosition.x, devicePosition.y, devicePosition.z);

    return mainGroup;
}
