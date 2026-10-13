// static/js/device_library/GasReleaseCylinder.js

function createGasReleaseCylinder(scene, options = {}) {
    const {
        // CYLINDER dimensions
        deviceRadius = 0.2,
        deviceHeight = 1.8,
        devicePosition = { x: 0, y: 0.6, z: 0.46 },

        // Camera Position
        camPosition = { x: 0, y: 0.6, z: 0.46 },

        // CYLINDER properties (plain color, no metallic)
        deviceColor = 0xFF0000,
        deviceoutlineColor = 0x000000,

        // ORIENTATION
        orientation = 'Front',

        // LABEL text properties
        text = "CO2",
        textPosition = { x: 0, y: 1.5, z: -0.16 },
        textColor = 0xffffff,
        textSize = 0.12,
        textFont = 'Arial',
        textCanvasBgColor = 0x111111,
        textbgSize = { width: 0.7, height: 0.22 },

        // DOME (top cap) properties
        domeRadius = 0.2,
        domeHeight = 0.18,
        domeColor = 0xFF0000,
        domePosition = { x: 0, y: 0, z: 0 },

        // KNOB properties
        knobRadius = 0.08,
        knobHeight = 0.16,
        knobColor = 0x000000,
        knobPosition = { x: 0, y: 0.25, z: 0 },

        // GAUGE properties
        gaugeRadius = 0.08,
        gaugeThickness = 0.02,
        gaugeColor = 0x333333,
        gaugeGlassColor = 0x333333,
        gaugeNeedleColor = 0xFF0000,
        gaugePosition = { x: 0.13, y: 0.25, z: -0.04 },

        // STAND properties
        standRadius = 0.2,
        standHeight = 0.16,
        standColor = 0x444444,

        // ===== GENERAL DEVICE PROPERTIES FOR LIVE DATA =====
        deviceId = '',
        category = 'electrical',
        urlLink = '',
        zbxSrvIP = '',
        zbxAPI = '',
        zbxHost = '',
        zbxHostKeys = [],
        zbxHostKeyValues = []

    } = options;

    // === STAND ===
    const standGeometry = new THREE.CylinderGeometry(standRadius, standRadius, standHeight, 24);
    const standMaterial = new THREE.MeshStandardMaterial({
        color: standColor,
        roughness: 0.9,
        metalness: 0.0
    });
    const stand = new THREE.Mesh(standGeometry, standMaterial);
    stand.position.set(0, -deviceHeight / 2 - standHeight / 2, 0);
    stand.castShadow = true;
    stand.receiveShadow = true;

    // === CYLINDER BODY (plain color) ===
    const cylinderGeometry = new THREE.CylinderGeometry(deviceRadius, deviceRadius, deviceHeight, 32);
    const cylinderMaterial = new THREE.MeshStandardMaterial({
        color: deviceColor,
        roughness: 0.9,
        metalness: 0.0   // ✅ no metallic effect
    });
    const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
    cylinder.position.y = standHeight;   // cylinder sits on stand
    cylinder.castShadow = true;
    cylinder.receiveShadow = true;
    scene.add(cylinder);

    // Attach stand to cylinder
    cylinder.add(stand);

    // Cylinder outline
    const cylinderEdges = new THREE.EdgesGeometry(cylinderGeometry);
    const outlineMaterial = new THREE.LineBasicMaterial({
        color: deviceoutlineColor,
        linewidth: 2,
        transparent: true,
        opacity: 0.8
    });
    const outline = new THREE.LineSegments(cylinderEdges, outlineMaterial);
    //cylinder.add(outline);

    // === DOME (top cap resting on cylinder) ===
    const domeGeometry = new THREE.SphereGeometry(domeRadius, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const domeMaterial = new THREE.MeshStandardMaterial({
        color: domeColor,
        roughness: 0.8,
        metalness: 0.0
    });
    const dome = new THREE.Mesh(domeGeometry, domeMaterial);

    // Position dome to rest nicely on top of cylinder
    dome.position.set(
        domePosition.x,
        domePosition.y + deviceHeight / 2, // top of cylinder
        domePosition.z
    );
    dome.castShadow = true;
    dome.receiveShadow = true;
    cylinder.add(dome);

    // === KNOB ===
    const knobGeometry = new THREE.CylinderGeometry(knobRadius, knobRadius, knobHeight, 16);
    const knobMaterial = new THREE.MeshStandardMaterial({
        color: knobColor,
        roughness: 0.4,
        metalness: 0.0
    });
    const knob = new THREE.Mesh(knobGeometry, knobMaterial);
    knob.position.set(
        knobPosition.x,
        knobPosition.y + deviceHeight / 2, // above top
        knobPosition.z
    );
    //knob.rotation.x = Math.PI / 2;
    cylinder.add(knob);

    // === GAUGE ===
    const gaugeGeometry = new THREE.CylinderGeometry(gaugeRadius, gaugeRadius, gaugeThickness, 20);
    const gaugeMaterial = new THREE.MeshStandardMaterial({
        color: gaugeColor,
        roughness: 0.3,
        metalness: 0.0
    });
    const gauge = new THREE.Mesh(gaugeGeometry, gaugeMaterial);
    gauge.position.set(
        gaugePosition.x,
        gaugePosition.y + deviceHeight / 2,
        gaugePosition.z
    );
    gauge.rotation.x = Math.PI / 2;
    cylinder.add(gauge);

    // Gauge glass
    const gaugeGlassGeometry = new THREE.CircleGeometry(gaugeRadius * 0.9, 20);
    const gaugeGlassMaterial = new THREE.MeshStandardMaterial({
        color: gaugeGlassColor,
        transparent: true,
        opacity: 0.75,
        roughness: 0.1,
        metalness: 0.0
    });
    const gaugeGlass = new THREE.Mesh(gaugeGlassGeometry, gaugeGlassMaterial);
    gaugeGlass.rotation.x = -Math.PI / 2;
    gaugeGlass.position.z = gaugeThickness / 2 + 0.001;
    gauge.add(gaugeGlass);

    // Gauge needle
    const needleGeometry = new THREE.BoxGeometry(0.01, gaugeRadius * 0.7, 0.01);
    const needleMaterial = new THREE.MeshStandardMaterial({
        color: gaugeNeedleColor,
        roughness: 0.2,
        metalness: 0.0
    });
    const needle = new THREE.Mesh(needleGeometry, needleMaterial);
    needle.position.set(0, gaugeRadius * 0.35, 0.002);
    needle.rotation.z = -Math.PI / 4;
    gaugeGlass.add(needle);

    // === ORIENTATION ROTATION ===
    switch (orientation.toUpperCase()) {
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
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    const canvasPadding = 20;
    const fontSize = Math.max(32, textSize * 1000);
    canvas.width = textbgSize.width * 1000 + canvasPadding * 2;
    canvas.height = textbgSize.height * 1000 + canvasPadding * 2;

    context.fillStyle = new THREE.Color(textCanvasBgColor).getStyle();
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = new THREE.Color(textColor).getStyle();
    context.font = `bold ${fontSize}px ${textFont}, Arial, sans-serif`;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, canvas.width / 2, canvas.height / 2);

    const textTexture = new THREE.CanvasTexture(canvas);
    textTexture.minFilter = THREE.LinearFilter;
    const textMaterial = new THREE.MeshBasicMaterial({
        map: textTexture,
        transparent: true,
        side: THREE.DoubleSide
    });

    const textPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(textbgSize.width * 0.9, textbgSize.height * 0.9),
        textMaterial
    );
    textPlane.position.set(textPosition.x, textPosition.y, textPosition.z);
    cylinder.add(textPlane);

    return cylinder;
}
