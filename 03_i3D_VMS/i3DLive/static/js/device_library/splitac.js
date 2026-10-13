// static/js/device_library/splitac.js

function createIndoorAC(scene, options = {}) {
    const {
        // Main Dimensions
        deviceWidth = 1.0,
        deviceHeight = 0.3,
        deviceDepth = 0.22,
        devicePosition = { x: 0, y: 2.2, z: 0 },

        // Projection / Profile Contour Depths
        frontSlopeDepth = 0.05, // Depth projection at peak relative to top/bottom edges

        // Colors & Aesthetics
        deviceColor = 0xffffff,
        deviceoutlineColor = 0x000000,

        // FACE TEXTURES
        faceTextures = {
            front: '',
            back: '',
            left: '',
            right: '',
            top: '',
            bottom: ''
        },

        // Logic
        orientation = 'FRONT',

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

    const acGroup = new THREE.Group();
    scene.add(acGroup);

    const loader = new THREE.TextureLoader();

    // Base materials
    const defaultBodyMat = new THREE.MeshStandardMaterial({ color: deviceColor, roughness: 0.5 });
    const outlineMat = new THREE.LineBasicMaterial({ color: deviceoutlineColor, transparent: true, opacity: 0.3 });

    // Front & Back texture setup
    const hasFrontTex = faceTextures.front && typeof faceTextures.front === 'string' && faceTextures.front.trim() !== '';
    const frontMat = hasFrontTex
        ? new THREE.MeshStandardMaterial({ map: loader.load(faceTextures.front.trim()), roughness: 0.5 })
        : defaultBodyMat;

    const backMat = (faceTextures.back && typeof faceTextures.back === 'string' && faceTextures.back.trim() !== '')
        ? new THREE.MeshStandardMaterial({ map: loader.load(faceTextures.back.trim()), roughness: 0.5 })
        : defaultBodyMat;

    // --- 1. FLAT REAR MAIN CHASSIS ---
    const mainDepth = deviceDepth - frontSlopeDepth;
    const mainBodyGeo = new THREE.BoxGeometry(deviceWidth, deviceHeight, mainDepth);
    const mainBodyMesh = new THREE.Mesh(mainBodyGeo, defaultBodyMat);
    mainBodyMesh.position.set(0, 0, -frontSlopeDepth / 2);
    acGroup.add(mainBodyMesh);

    // Main Chassis Edges
    const bodyEdges = new THREE.EdgesGeometry(mainBodyGeo);
    const bodyOutline = new THREE.LineSegments(bodyEdges, outlineMat);
    mainBodyMesh.add(bodyOutline);

    // --- 2. DUAL-SLOPED 3D FRONT PROJECTION MESH WITH CONTINUOUS UVs ---
    // Top slope inward + Bottom slope inward + Central peak
    const frontGeo = new THREE.BufferGeometry();
    const halfW = deviceWidth / 2;
    const halfH = deviceHeight / 2;
    const midH = 0.05; // Slightly offset peak line above center
    const frontZ = mainDepth / 2;
    const projectedZ = frontZ + frontSlopeDepth;

    // 8 Vertices forming 2 angled quad faces (Top sloped + Bottom sloped)
    const vertices = new Float32Array([
        // Upper Sloped Face (Top Recessed to Peak)
        -halfW,  halfH, frontZ,       // 0: Top-Left (Inward)
         halfW,  halfH, frontZ,       // 1: Top-Right (Inward)
        -halfW,   midH, projectedZ,   // 2: Peak-Left (Outward)
         halfW,   midH, projectedZ,   // 3: Peak-Right (Outward)

        // Lower Sloped Face (Peak to Bottom Recessed)
        -halfW, -halfH, frontZ,       // 4: Bottom-Left (Inward)
         halfW, -halfH, frontZ        // 5: Bottom-Right (Inward)
    ]);

    // Triangle indices for the 2 sloped quad faces
    const indices = [
        // Upper Sloped Quad
        0, 2, 1,
        1, 2, 3,

        // Lower Sloped Quad
        2, 4, 3,
        3, 4, 5
    ];

    // Smooth UV mapping across both sloped faces (wraps texture seamlessly from Y = 1 to Y = 0)
    const uvs = new Float32Array([
        0, 1,    1, 1,    // Top Edge
        0, 0.5,  1, 0.5,  // Peak Line
        0, 0,    1, 0     // Bottom Edge
    ]);

    frontGeo.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    frontGeo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
    frontGeo.setIndex(indices);
    frontGeo.computeVertexNormals();

    const frontMesh = new THREE.Mesh(frontGeo, frontMat);
    frontMesh.castShadow = true;
    frontMesh.receiveShadow = true;
    acGroup.add(frontMesh);

    // Outline for front contoured face
    const frontEdges = new THREE.EdgesGeometry(frontGeo);
    const frontOutline = new THREE.LineSegments(frontEdges, outlineMat);
    frontMesh.add(frontOutline);

    // --- 3. CONTOURED SIDE CAP COVERS ---
    // Custom shape matching flat rear and dual-sloped front profile
    const sideShape = new THREE.Shape();
    sideShape.moveTo(-mainDepth / 2, -halfH);                         // Bottom-Back
    sideShape.lineTo(mainDepth / 2, -halfH);                          // Bottom-Front (Inward)
    sideShape.lineTo(mainDepth / 2 + frontSlopeDepth, midH);          // Peak-Front (Outward)
    sideShape.lineTo(mainDepth / 2, halfH);                           // Top-Front (Inward)
    sideShape.lineTo(-mainDepth / 2, halfH);                          // Top-Back
    sideShape.closePath();

    const extrudeSettings = { depth: 0.005, bevelEnabled: false };
    const sideGeo = new THREE.ExtrudeGeometry(sideShape, extrudeSettings);

    const leftMat = (faceTextures.left && typeof faceTextures.left === 'string' && faceTextures.left.trim() !== '')
        ? new THREE.MeshStandardMaterial({ map: loader.load(faceTextures.left.trim()), roughness: 0.5 })
        : defaultBodyMat;

    const rightMat = (faceTextures.right && typeof faceTextures.right === 'string' && faceTextures.right.trim() !== '')
        ? new THREE.MeshStandardMaterial({ map: loader.load(faceTextures.right.trim()), roughness: 0.5 })
        : defaultBodyMat;

    const leftSide = new THREE.Mesh(sideGeo, leftMat);
    leftSide.position.set(-halfW - 0.002, 0, 0);
    leftSide.rotation.y = -Math.PI / 2;
    acGroup.add(leftSide);

    const rightSide = new THREE.Mesh(sideGeo, rightMat);
    rightSide.position.set(halfW + 0.002, 0, 0);
    rightSide.rotation.y = -Math.PI / 2;
    acGroup.add(rightSide);

    // --- FINAL TRANSFORMS ---
    acGroup.position.set(devicePosition.x, devicePosition.y, devicePosition.z);

    switch (orientation.toUpperCase()) {
        case 'BACK':  acGroup.rotation.y = Math.PI; break;
        case 'LEFT':  acGroup.rotation.y = Math.PI / 2; break;
        case 'RIGHT': acGroup.rotation.y = -Math.PI / 2; break;
        case 'FRONT':
        default:      acGroup.rotation.y = 0; break;
    }

    // --- METADATA STORAGE ---
    //acGroup.deviceMetadata = {
    //    deviceId, category, urlLink, zbxSrvIP, zbxAPI, zbxHost,
    //    zbxHostKeys: [...zbxHostKeys],
    //    zbxHostKeyValues: [...zbxHostKeyValues]
    //};

    acGroup.getDeviceMetadata = function() { return this.deviceMetadata; };
    acGroup.updateDeviceMetadata = function(m) { Object.assign(this.deviceMetadata, m); };

    return acGroup;
}
