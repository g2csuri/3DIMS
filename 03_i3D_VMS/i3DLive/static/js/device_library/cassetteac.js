/*
 * cassetteac.js
 * Generates a Ceiling Cassette AC unit with Bottom Texture mapping
 */
function createCassetteAC(scene, options = {}) {
    const {
        // Main Dimensions
        deviceWidth = 0.9,
        deviceHeight = 0.25, 
        deviceDepth = 0.9,
        devicePosition = { x: 0, y: 3.0, z: 0 },

        // Colors & Aesthetics
        deviceColor = 0xffffff,
        deviceoutlineColor = 0x000000,

        // FACE TEXTURES (Bottom is the critical one for Cassette)
        faceTextures = {
            front: '/static/js/device_library/textures/Cassette_Bottom.png'
        },

        // ===== GENERAL DEVICE PROPERTIES FOR LIVE DATA =====
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
    const cassetteGroup = new THREE.Group();
    scene.add(cassetteGroup);

    // --- MATERIALS ---
    const bodyMat = new THREE.MeshStandardMaterial({ color: deviceColor, roughness: 0.4 });

    // --- 1. THE CHASSIS (Hidden in the ceiling) ---
    const chassisGeo = new THREE.BoxGeometry(deviceWidth * 0.8, deviceHeight, deviceDepth * 0.8);
    const chassis = new THREE.Mesh(chassisGeo, bodyMat);
    chassis.position.y = deviceHeight / 2;
    chassis.castShadow = true;
    cassetteGroup.add(chassis);

    // --- 2. THE FACEPLATE WITH BOTTOM TEXTURE ---
    const faceplateGeo = new THREE.BoxGeometry(deviceWidth, 0.04, deviceDepth);
    
    // Array of 6 materials (order: +X, -X, +Y, -Y, +Z, -Z)
    // index 3 (-Y) is the BOTTOM face
    const faceplateMaterials = [
        new THREE.MeshStandardMaterial({ color: deviceColor }), // +X
        new THREE.MeshStandardMaterial({ color: deviceColor }), // -X
        new THREE.MeshStandardMaterial({ color: deviceColor }), // +Y
        // BOTTOM FACE (-Y)
        faceTextures.front ? new THREE.MeshStandardMaterial({ map: loader.load(faceTextures.front) })
                            : new THREE.MeshStandardMaterial({ color: deviceColor }),
        new THREE.MeshStandardMaterial({ color: deviceColor }), // +Z
        new THREE.MeshStandardMaterial({ color: deviceColor })  // -Z
    ];

    const faceplate = new THREE.Mesh(faceplateGeo, faceplateMaterials);
    faceplate.position.y = 0; // Flush with ceiling level
    faceplate.receiveShadow = true;
    cassetteGroup.add(faceplate);

    // --- 3. OUTLINE (From Electrical Panel reference) ---
    const edges = new THREE.EdgesGeometry(faceplateGeo);
    const outlineMat = new THREE.LineBasicMaterial({
        color: deviceoutlineColor,
        transparent: true,
        opacity: 0.5
    });
    const outline = new THREE.LineSegments(edges, outlineMat);
    faceplate.add(outline);

    // --- FINAL TRANSFORMS ---
    cassetteGroup.position.set(devicePosition.x, devicePosition.y, devicePosition.z);

    // =================================================================
    // NEW DEVICE METADATA STORAGE (Mirroring Electrical Panel)
    // =================================================================
    cassetteGroup.deviceMetadata = {
        deviceId: deviceId,
        category: category,
        urlLink: urlLink,
        zbxSrvIP: zbxSrvIP,                      // Zabbix server IP
        zbxAPI: zbxAPI,
        zbxHost: zbxHost,
        zbxHostKeys: [...zbxHostKeys],
        zbxHostKeyValues: [...zbxHostKeyValues]
    };

    // Callback for Interaction
    cassetteGroup.callback = function() {
        if (urlLink && urlLink !== 'undefined' && urlLink !== '') {
            window.open(urlLink, '_blank');
        }
    };

    // Helper methods (Mirroring your EP structure)
    cassetteGroup.getDeviceMetadata = function() {
        return this.deviceMetadata;
    };

    return cassetteGroup;
}
