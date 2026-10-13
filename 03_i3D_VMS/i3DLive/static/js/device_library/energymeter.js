// static/js/device_library/energymeter.js

function createenergymeter(scene, options = {}) {
    const {
        // EM dimensions
        deviceWidth = 0.5,
        deviceHeight = 0.8,
        deviceDepth = 0.1,
        devicePosition = { x: 2.8, y: 1.0, z: -1.44 },

        // EM properties
        deviceColor = 0xFF0000,
        deviceoutlineColor = 0x000000,
        orientation = 'Front',

        // FACE TEXTURES
        faceTextures = {
            front: '/static/js/device_library/textures/Electrical_Panel_1.png',
            back: '/static/js/device_library/textures/EM_front.png'
        },

        // screen properties
        screenEnabled = true,
        screenPosition = { x: 0, y: 0.27, z: 0.051 }, // Slightly in front of face
        screenSize = { width: 0.4, height: 0.22 },
        screenColor = 0x000000,

        // LED 7-SEGMENT PROPERTIES (Integrated from EnergyMeter)
        digitActiveColor = 0x00FF44,
        digitDimColor = 0x002200,

        // ===== GENERAL DEVICE PROPERTIES FOR LIVE DATA =====
        deviceId = '',
        category = 'electrical',
        urlLink = '',
        zbxSrvIP = '192.168.1.133',
        zbxAPI = '',
        zbxHost = '',
        zbxHostKeys = [],      // Keys to fetch from Zabbix
        zbxHostKeyValues = [], // Values to display in rows
        
        // ... (keep highLabel and LED options from your original file)
        ledEnabled = false,
        healthyColor = 0x10ee00,
        warningColor = 0xffff00,
        alarmColor   = 0xff0000,
        ledState = 'HEALTHY'
    } = options;

    const loader = new THREE.TextureLoader();
    const EMGroup = new THREE.Group(); // Use a group to hold everything
    scene.add(EMGroup);

    // --- 1. MATERIALS ---
    const activeMat = new THREE.MeshStandardMaterial({
        color: digitActiveColor,
        emissive: digitActiveColor,
        emissiveIntensity: 3.0
    });

    const dimMat = new THREE.MeshStandardMaterial({
        color: digitDimColor,
        transparent: true,
        opacity: 0.2
    });

    // --- 2. 7-SEGMENT HELPERS ---
    const digitMap = [
        [1, 1, 1, 0, 1, 1, 1], [0, 0, 1, 0, 0, 1, 0], [1, 0, 1, 1, 1, 0, 1],
        [1, 0, 1, 1, 0, 1, 1], [0, 1, 1, 1, 0, 1, 0], [1, 1, 0, 1, 0, 1, 1],
        [1, 1, 0, 1, 1, 1, 1], [1, 0, 1, 0, 0, 1, 0], [1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 0, 1, 1], [0, 0, 0, 0, 0, 0, 0] // 10: Blank
    ];

    function createDigit(scale = 0.5) {
        const group = new THREE.Group();
        const segments = [];
        const thickness = 0.006 * scale;
        const len = 0.035 * scale;
        const off = 0.03 * scale;

        const layout = [
            [0, off * 2, false], [-off, off, true], [off, off, true],
            [0, 0, false], [-off, -off, true], [off, -off, true], [0, -off * 2, false]
        ];

        layout.forEach(pos => {
            const geo = new THREE.CapsuleGeometry(thickness, len, 4, 8);
            const seg = new THREE.Mesh(geo, dimMat);
            seg.position.set(pos[0], pos[1], 0);
            if (!pos[2]) seg.rotation.z = Math.PI / 2;
            group.add(seg);
            segments.push(seg);
        });

        group.setVal = (num) => {
            const bits = digitMap[num] ?? digitMap[10];
            segments.forEach((seg, i) => { seg.material = bits[i] ? activeMat : dimMat; });
        };
        return group;
    }

    // --- 3. MAIN BODY ---
    const geometry = new THREE.BoxGeometry(deviceWidth, deviceHeight, deviceDepth);
    const materials = [
        new THREE.MeshStandardMaterial({ color: deviceColor }), // +X
        new THREE.MeshStandardMaterial({ color: deviceColor }), // -X
        new THREE.MeshStandardMaterial({ color: deviceColor }), // +Y
        new THREE.MeshStandardMaterial({ color: deviceColor }), // -Y
        faceTextures.front ? new THREE.MeshStandardMaterial({ map: loader.load(faceTextures.front) }) : new THREE.MeshStandardMaterial({ color: deviceColor }),
        faceTextures.back ? new THREE.MeshStandardMaterial({ map: loader.load(faceTextures.back) }) : new THREE.MeshStandardMaterial({ color: deviceColor })
    ];

    const EM = new THREE.Mesh(geometry, materials);
    EMGroup.add(EM);

    // --- 4. INTEGRATED SCREEN & DIGITS ---
    if (screenEnabled) {
        const screenGeo = new THREE.PlaneGeometry(screenSize.width, screenSize.height);
        const screenMat = new THREE.MeshBasicMaterial({ color: screenColor });
        const screenMesh = new THREE.Mesh(screenGeo, screenMat);
        screenMesh.position.set(screenPosition.x, screenPosition.y, screenPosition.z);
        EM.add(screenMesh);

        // Create 3 Rows of 4 Digits
        EM.rowGroups = [];
        const rowSpacing = screenSize.height / 3.5;
        const digitSpacing = 0.07;

        for (let r = 0; r < 3; r++) {
            const digitsInRow = [];
            for (let d = 0; d < 4; d++) {
                const digit = createDigit(0.6);
                digit.position.set((d - 1.5) * digitSpacing, (5 - r) * rowSpacing + 10, 0.01);
                screenMesh.add(digit);
                digitsInRow.push(digit);
            }
            EM.rowGroups.push(digitsInRow);
        }
    }

    // --- 5. LIVE DATA UPDATE LOGIC ---
    EM.updateDisplay = function(values) {
        if (!this.rowGroups) return;
        values.forEach((val, rowIndex) => {
            if (rowIndex > 2) return;
            const strVal = Math.round(val).toString().padStart(4, ' ');
            for (let i = 0; i < 4; i++) {
                const char = strVal[i];
                const num = char === ' ' ? 10 : parseInt(char);
                this.rowGroups[rowIndex][i].setVal(num);
            }
        });
    };

    // Override applyLiveData to also update digits
    const originalApplyLiveData = EM.applyLiveData;
    EM.applyLiveData = function(row) {
        if (originalApplyLiveData) originalApplyLiveData.call(this, row);
        
        // If Zabbix sends an array of numbers in 'values'
        if (row.values && Array.isArray(row.values)) {
            this.updateDisplay(row.values);
        }
    };

    // --- 6. EXISTING LOGICS (METADATA, POSITIONING, ROTATION) ---
    // (Re-insert your existing Orientation Switch and Metadata Logic here)
    EMGroup.position.set(devicePosition.x, devicePosition.y, devicePosition.z);
    
    // Switch orientation
    const rotations = { 'BACK': Math.PI, 'LEFT': Math.PI/2, 'RIGHT': -Math.PI/2, 'FRONT': 0 };
    EM.rotation.y = rotations[orientation.toUpperCase()] || 0;

    EM.deviceMetadata = {
        deviceId, category, urlLink, zbxSrvIP, zbxAPI, zbxHost,
        zbxHostKeys: [...zbxHostKeys],
        zbxHostKeyValues: [...zbxHostKeyValues]
    };

    // ... (Keep all your helper methods: getDeviceMetadata, setLEDState, etc.)

    return EM;
}
