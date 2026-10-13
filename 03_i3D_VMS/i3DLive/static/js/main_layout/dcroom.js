// static/js/main_layout/containerTemplate.js

function dc_room() {
    // ✅ MASTER GROUP - everything lives here
    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    // --- CONTAINER ---
    const container = createRoom(masterGroup, {  // Pass masterGroup instead of scene
        roomType: 'room',
        deviceWidth: 12,
        deviceHeight: 2.5,
        deviceDepth: 10,
        devicePosition: { x: 0, y: 0, z: 0 },
        orientation: 'Front',
        camPosition: { x: 0, y: 0.6, z: 0.46 },

        faceTextures: {
            front: 'none',
            back: 'none',
            right: 'none',
            left: 'none'
        },

        standHeight: 0.3,
        standColor: 0x666666,
        floorTileSize: 3,
        floorTileColor: 0xFFFFFF,
        floorTileLineColor: 0x000000,
        floorTileLineWidth: 0.02,
        ceilingTileSize: 3,
        ceilingTileColor: 0xFFFFFF,
        ceilingTileLineColor: 0x000000,
        ceilingTileLineWidth: 0.02,

        text: 'DC Room',
        labelOrientation: 'Front',
        textPosition: { x: -2.65, y: 2.11, z: -4.95 },
        textColor: 0xffffff,
        textSize: 0.3,
        textFont: 'Arial',
        textCanvasBgColor: 0x222222,
        textbgSize: { width: 2.7, height: 0.3 }


    });
    // No need for container.position.set() - it's auto-parented

    masterGroup.position.set(0, 0, 0);     // Move everything
    // masterGroup.rotation.y = Math.PI / 4;  // Rotate everything  
    // masterGroup.scale.set(0.8, 0.8, 0.8);  // Scale everything


// --- AUTO-GENERATED: precisionac1 from precisionac.js ---
const precisionac1 = createPrecisionAC(masterGroup, {
// pac dimensions
        deviceWidth: 1.1,
        deviceHeight: 2,
        deviceDepth: 0.8,
        devicePosition: { x: -5.55, y: 1, z: -4 },

        // PAC specific logic
        numberOfDoors: 1,

        // Camera Position
        camPosition: { x: 0, y: 0.6, z: 0.46 },

        // pac properties
        deviceColor: 0x4A5568,
        deviceoutlineColor: 0xFFFFFF,

        // ORIENTATION
        orientation: 'Left',

        // FACE TEXTURES (optional)
        faceTextures: {
            front: '/static/js/device_library/textures/precisionac1_front.png',
            back: '/static/js/device_library/textures/pac_front.png'
        },

        // label text properties (front label on door)
        text: 'PAC-1',
        textPosition: { x: 0, y: 1.1, z: 0.4 },
        textColor: 0xffffff,
        textSize: 0.15,
        textFont: 'Arial',
        textCanvasBgColor: 0x222222,
        textbgSize: { width: 0.6, height: 0.2 },

        // screen properties
	screenEnabled: false,  // Default: disabled
        screenPosition: { x: -0.5, y: 0.65, z: 0.42 },
        screenSize: { width: 0.4, height: 0.2 },
        screenColor: 0x00FF00,
        screenoutlineColor: 0x000000,

        // stand properties
        standHeight: 0.1,
        standColor: 0x333333,

        // ===== HIGH RAISED LABEL OPTIONS =====
        highLabelEnabled: false,
        highText: null,
        highTextPosition: { x: 0, y: 3.5, z: 0.8 / 2 + 0.05 },
        highTextbgSize: { width: 0.9, height: 0.25 },
        highTextSize: 0.16,
        highTextColor: 0xffffff,
        highTextCanvasBgColor: 0x222222,
        highLineColor: 0xffff00,
        highLineWidth: 2,
        highDotColor: 0xffff00,
        highDotRadius: 0.03,
        highLabelOrientation: 'CAMERA',
        // NEW: FRONT | BACK | LEFT | RIGHT | CAMERA

        // ===== STATUS LED OPTIONS =====
        ledEnabled: false,  // Default: disabled
        ledRadius: 0.04,
        ledHeight: 0.04,
        //ledOffset = { x: 1.5 / 2 - 0.06, y: -2.0 / 2 + 0.12, z: 0.8 / 2 + 0.01 },
        ledOffset: { x: -0.6, y: 0.85, z: 0.42 },

        healthyColor: 0x10ee00,
        warningColor: 0xffff00,
        alarmColor: 0xff0000,
        runColor: 0x0000ff,
        customColor: 0xffffff,
        ledState: 'HEALTHY',
        // HEALTHY | WARNING | ALARM | RUN | CUSTOM
        ledBlinkPeriod: 1,
        // seconds

	// Fan Animation Variables
        fanEnabled: true,  // Default: disabled
        fanStatus: 'OFF', // 'ON' or 'OFF' - controlled by Zabbix monitor
        fanSpeed: 1,   // Multiplier for rotation speed
        fanSize: 0.3,
        fanColor: 0xCCCCCC,
        fanPosition: { x: 0, y: -0.6, z: 0.41 }, // Center of the unit
        zbxKey: null,      // Zabbix item key for fan status
        fanOnValue: 1,    // Value that indicates fan is ON (can be: 1, ON, 48, etc.)

        // ===== GENERAL DEVICE PROPERTIES FOR LIVE DATA =====
        deviceId: null,
        category: 'electrical',
        urlLink: null,
        zbxSrvIP: null,
        zbxAPI: null,
        zbxHost: null,
        zbxHostKeys: [],
        zbxHostKeyValues: []
});
precisionac1.position.set(-5.55, 1, -4);


// --- AUTO-GENERATED: precisionac2 from precisionac.js ---
const precisionac2 = createPrecisionAC(masterGroup, {
// pac dimensions
        deviceWidth: 1.1,
        deviceHeight: 2,
        deviceDepth: 0.8,
        devicePosition: { x: -5.55, y: 1, z: -2.7 },

        // PAC specific logic
        numberOfDoors: 1,

        // Camera Position
        camPosition: { x: 0, y: 0.6, z: 0.46 },

        // pac properties
        deviceColor: 0x4A5568,
        deviceoutlineColor: 0xFFFFFF,

        // ORIENTATION
        orientation: 'Left',

        // FACE TEXTURES (optional)
        faceTextures: {
            front: '/static/js/device_library/textures/precisionac2_front.png',
            back: '/static/js/device_library/textures/pac_front.png'
        },

        // label text properties (front label on door)
        text: 'PAC-2',
        textPosition: { x: 0, y: 1.1, z: 0.4 },
        textColor: 0xffffff,
        textSize: 0.15,
        textFont: 'Arial',
        textCanvasBgColor: 0x222222,
        textbgSize: { width: 0.6, height: 0.2 },

        // screen properties
	screenEnabled: false,  // Default: disabled
        screenPosition: { x: -0.5, y: 0.65, z: 0.42 },
        screenSize: { width: 0.4, height: 0.2 },
        screenColor: 0x00FF00,
        screenoutlineColor: 0x000000,

        // stand properties
        standHeight: 0.1,
        standColor: 0x333333,

        // ===== HIGH RAISED LABEL OPTIONS =====
        highLabelEnabled: false,
        highText: null,
        highTextPosition: { x: 0, y: 3.5, z: 0.8 / 2 + 0.05 },
        highTextbgSize: { width: 0.9, height: 0.25 },
        highTextSize: 0.16,
        highTextColor: 0xffffff,
        highTextCanvasBgColor: 0x222222,
        highLineColor: 0xffff00,
        highLineWidth: 2,
        highDotColor: 0xffff00,
        highDotRadius: 0.03,
        highLabelOrientation: 'CAMERA',
        // NEW: FRONT | BACK | LEFT | RIGHT | CAMERA

        // ===== STATUS LED OPTIONS =====
        ledEnabled: false,  // Default: disabled
        ledRadius: 0.04,
        ledHeight: 0.04,
        //ledOffset = { x: 1.5 / 2 - 0.06, y: -2.0 / 2 + 0.12, z: 0.8 / 2 + 0.01 },
        ledOffset: { x: -0.6, y: 0.85, z: 0.42 },

        healthyColor: 0x10ee00,
        warningColor: 0xffff00,
        alarmColor: 0xff0000,
        runColor: 0x0000ff,
        customColor: 0xffffff,
        ledState: 'HEALTHY',
        // HEALTHY | WARNING | ALARM | RUN | CUSTOM
        ledBlinkPeriod: 1,
        // seconds

	// Fan Animation Variables
        fanEnabled: true,  // Default: disabled
        fanStatus: 'OFF', // 'ON' or 'OFF' - controlled by Zabbix monitor
        fanSpeed: 1,   // Multiplier for rotation speed
        fanSize: 0.3,
        fanColor: 0xCCCCCC,
        fanPosition: { x: 0, y: -0.6, z: 0.41 }, // Center of the unit
        zbxKey: null,      // Zabbix item key for fan status
        fanOnValue: 1,    // Value that indicates fan is ON (can be: 1, ON, 48, etc.)

        // ===== GENERAL DEVICE PROPERTIES FOR LIVE DATA =====
        deviceId: null,
        category: 'electrical',
        urlLink: null,
        zbxSrvIP: null,
        zbxAPI: null,
        zbxHost: null,
        zbxHostKeys: [],
        zbxHostKeyValues: []
});
precisionac2.position.set(-5.55, 1, -2.7);


// --- AUTO-GENERATED: precisionac3 from precisionac.js ---
const precisionac3 = createPrecisionAC(masterGroup, {
// pac dimensions
        deviceWidth: 1.1,
        deviceHeight: 2,
        deviceDepth: 0.8,
        devicePosition: { x: -5.55, y: 1, z: -1.32 },

        // PAC specific logic
        numberOfDoors: 1,

        // Camera Position
        camPosition: { x: 0, y: 0.6, z: 0.46 },

        // pac properties
        deviceColor: 0x4A5568,
        deviceoutlineColor: 0xFFFFFF,

        // ORIENTATION
        orientation: 'Left',

        // FACE TEXTURES (optional)
        faceTextures: {
            front: '/static/js/device_library/textures/precisionac3_front.png',
            back: '/static/js/device_library/textures/pac_front.png'
        },

        // label text properties (front label on door)
        text: 'PAC-3',
        textPosition: { x: 0, y: 1.1, z: 0.4 },
        textColor: 0xffffff,
        textSize: 0.15,
        textFont: 'Arial',
        textCanvasBgColor: 0x222222,
        textbgSize: { width: 0.6, height: 0.2 },

        // screen properties
	screenEnabled: false,  // Default: disabled
        screenPosition: { x: -0.5, y: 0.65, z: 0.42 },
        screenSize: { width: 0.4, height: 0.2 },
        screenColor: 0x00FF00,
        screenoutlineColor: 0x000000,

        // stand properties
        standHeight: 0.1,
        standColor: 0x333333,

        // ===== HIGH RAISED LABEL OPTIONS =====
        highLabelEnabled: false,
        highText: null,
        highTextPosition: { x: 0, y: 3.5, z: 0.8 / 2 + 0.05 },
        highTextbgSize: { width: 0.9, height: 0.25 },
        highTextSize: 0.16,
        highTextColor: 0xffffff,
        highTextCanvasBgColor: 0x222222,
        highLineColor: 0xffff00,
        highLineWidth: 2,
        highDotColor: 0xffff00,
        highDotRadius: 0.03,
        highLabelOrientation: 'CAMERA',
        // NEW: FRONT | BACK | LEFT | RIGHT | CAMERA

        // ===== STATUS LED OPTIONS =====
        ledEnabled: false,  // Default: disabled
        ledRadius: 0.04,
        ledHeight: 0.04,
        //ledOffset = { x: 1.5 / 2 - 0.06, y: -2.0 / 2 + 0.12, z: 0.8 / 2 + 0.01 },
        ledOffset: { x: -0.6, y: 0.85, z: 0.42 },

        healthyColor: 0x10ee00,
        warningColor: 0xffff00,
        alarmColor: 0xff0000,
        runColor: 0x0000ff,
        customColor: 0xffffff,
        ledState: 'HEALTHY',
        // HEALTHY | WARNING | ALARM | RUN | CUSTOM
        ledBlinkPeriod: 1,
        // seconds

	// Fan Animation Variables
        fanEnabled: true,  // Default: disabled
        fanStatus: 'OFF', // 'ON' or 'OFF' - controlled by Zabbix monitor
        fanSpeed: 1,   // Multiplier for rotation speed
        fanSize: 0.3,
        fanColor: 0xCCCCCC,
        fanPosition: { x: 0, y: -0.6, z: 0.41 }, // Center of the unit
        zbxKey: null,      // Zabbix item key for fan status
        fanOnValue: 1,    // Value that indicates fan is ON (can be: 1, ON, 48, etc.)

        // ===== GENERAL DEVICE PROPERTIES FOR LIVE DATA =====
        deviceId: null,
        category: 'electrical',
        urlLink: null,
        zbxSrvIP: null,
        zbxAPI: null,
        zbxHost: null,
        zbxHostKeys: [],
        zbxHostKeyValues: []
});
precisionac3.position.set(-5.55, 1, -1.32);


// --- AUTO-GENERATED: precisionac4 from precisionac.js ---
const precisionac4 = createPrecisionAC(masterGroup, {
// pac dimensions
        deviceWidth: 1.1,
        deviceHeight: 2,
        deviceDepth: 0.8,
        devicePosition: { x: -5.55, y: 1, z: 0.8 },

        // PAC specific logic
        numberOfDoors: 1,

        // Camera Position
        camPosition: { x: 0, y: 0.6, z: 0.46 },

        // pac properties
        deviceColor: 0x4A5568,
        deviceoutlineColor: 0xFFFFFF,

        // ORIENTATION
        orientation: 'Left',

        // FACE TEXTURES (optional)
        faceTextures: {
            front: '/static/js/device_library/textures/precisionac4_front.png',
            back: '/static/js/device_library/textures/pac_front.png'
        },

        // label text properties (front label on door)
        text: 'PAC-4',
        textPosition: { x: 0, y: 1.1, z: 0.4 },
        textColor: 0xffffff,
        textSize: 0.15,
        textFont: 'Arial',
        textCanvasBgColor: 0x222222,
        textbgSize: { width: 0.6, height: 0.2 },

        // screen properties
	screenEnabled: false,  // Default: disabled
        screenPosition: { x: -0.5, y: 0.65, z: 0.42 },
        screenSize: { width: 0.4, height: 0.2 },
        screenColor: 0x00FF00,
        screenoutlineColor: 0x000000,

        // stand properties
        standHeight: 0.1,
        standColor: 0x333333,

        // ===== HIGH RAISED LABEL OPTIONS =====
        highLabelEnabled: false,
        highText: null,
        highTextPosition: { x: 0, y: 3.5, z: 0.8 / 2 + 0.05 },
        highTextbgSize: { width: 0.9, height: 0.25 },
        highTextSize: 0.16,
        highTextColor: 0xffffff,
        highTextCanvasBgColor: 0x222222,
        highLineColor: 0xffff00,
        highLineWidth: 2,
        highDotColor: 0xffff00,
        highDotRadius: 0.03,
        highLabelOrientation: 'CAMERA',
        // NEW: FRONT | BACK | LEFT | RIGHT | CAMERA

        // ===== STATUS LED OPTIONS =====
        ledEnabled: false,  // Default: disabled
        ledRadius: 0.04,
        ledHeight: 0.04,
        //ledOffset = { x: 1.5 / 2 - 0.06, y: -2.0 / 2 + 0.12, z: 0.8 / 2 + 0.01 },
        ledOffset: { x: -0.6, y: 0.85, z: 0.42 },

        healthyColor: 0x10ee00,
        warningColor: 0xffff00,
        alarmColor: 0xff0000,
        runColor: 0x0000ff,
        customColor: 0xffffff,
        ledState: 'HEALTHY',
        // HEALTHY | WARNING | ALARM | RUN | CUSTOM
        ledBlinkPeriod: 1,
        // seconds

	// Fan Animation Variables
        fanEnabled: true,  // Default: disabled
        fanStatus: 'OFF', // 'ON' or 'OFF' - controlled by Zabbix monitor
        fanSpeed: 1,   // Multiplier for rotation speed
        fanSize: 0.3,
        fanColor: 0xCCCCCC,
        fanPosition: { x: 0, y: -0.6, z: 0.41 }, // Center of the unit
        zbxKey: null,      // Zabbix item key for fan status
        fanOnValue: 1,    // Value that indicates fan is ON (can be: 1, ON, 48, etc.)

        // ===== GENERAL DEVICE PROPERTIES FOR LIVE DATA =====
        deviceId: null,
        category: 'electrical',
        urlLink: null,
        zbxSrvIP: null,
        zbxAPI: null,
        zbxHost: null,
        zbxHostKeys: [],
        zbxHostKeyValues: []
});
precisionac4.position.set(-5.55, 1, 0.8);


// --- AUTO-GENERATED: precisionac5 from precisionac.js ---
const precisionac5 = createPrecisionAC(masterGroup, {
// pac dimensions
        deviceWidth: 1.1,
        deviceHeight: 2,
        deviceDepth: 0.8,
        devicePosition: { x: -5.55, y: 1, z: 2.08 },

        // PAC specific logic
        numberOfDoors: 1,

        // Camera Position
        camPosition: { x: 0, y: 0.6, z: 0.46 },

        // pac properties
        deviceColor: 0x4A5568,
        deviceoutlineColor: 0xFFFFFF,

        // ORIENTATION
        orientation: 'Left',

        // FACE TEXTURES (optional)
        faceTextures: {
            front: '/static/js/device_library/textures/precisionac5_front.png',
            back: '/static/js/device_library/textures/pac_front.png'
        },

        // label text properties (front label on door)
        text: 'PAC-5',
        textPosition: { x: 0, y: 1.1, z: 0.38 },
        textColor: 0xffffff,
        textSize: 0.15,
        textFont: 'Arial',
        textCanvasBgColor: 0x222222,
        textbgSize: { width: 0.6, height: 0.2 },

        // screen properties
	screenEnabled: false,  // Default: disabled
        screenPosition: { x: -0.5, y: 0.65, z: 0.42 },
        screenSize: { width: 0.4, height: 0.2 },
        screenColor: 0x00FF00,
        screenoutlineColor: 0x000000,

        // stand properties
        standHeight: 0.1,
        standColor: 0x333333,

        // ===== HIGH RAISED LABEL OPTIONS =====
        highLabelEnabled: false,
        highText: null,
        highTextPosition: { x: 0, y: 3.5, z: 0.8 / 2 + 0.05 },
        highTextbgSize: { width: 0.9, height: 0.25 },
        highTextSize: 0.16,
        highTextColor: 0xffffff,
        highTextCanvasBgColor: 0x222222,
        highLineColor: 0xffff00,
        highLineWidth: 2,
        highDotColor: 0xffff00,
        highDotRadius: 0.03,
        highLabelOrientation: 'CAMERA',
        // NEW: FRONT | BACK | LEFT | RIGHT | CAMERA

        // ===== STATUS LED OPTIONS =====
        ledEnabled: false,  // Default: disabled
        ledRadius: 0.04,
        ledHeight: 0.04,
        //ledOffset = { x: 1.5 / 2 - 0.06, y: -2.0 / 2 + 0.12, z: 0.8 / 2 + 0.01 },
        ledOffset: { x: -0.6, y: 0.85, z: 0.42 },

        healthyColor: 0x10ee00,
        warningColor: 0xffff00,
        alarmColor: 0xff0000,
        runColor: 0x0000ff,
        customColor: 0xffffff,
        ledState: 'HEALTHY',
        // HEALTHY | WARNING | ALARM | RUN | CUSTOM
        ledBlinkPeriod: 1,
        // seconds

	// Fan Animation Variables
        fanEnabled: true,  // Default: disabled
        fanStatus: 'OFF', // 'ON' or 'OFF' - controlled by Zabbix monitor
        fanSpeed: 1,   // Multiplier for rotation speed
        fanSize: 0.3,
        fanColor: 0xCCCCCC,
        fanPosition: { x: 0, y: -0.6, z: 0.41 }, // Center of the unit
        zbxKey: null,      // Zabbix item key for fan status
        fanOnValue: 1,    // Value that indicates fan is ON (can be: 1, ON, 48, etc.)

        // ===== GENERAL DEVICE PROPERTIES FOR LIVE DATA =====
        deviceId: null,
        category: 'electrical',
        urlLink: null,
        zbxSrvIP: null,
        zbxAPI: null,
        zbxHost: null,
        zbxHostKeys: [],
        zbxHostKeyValues: []
});
precisionac5.position.set(-5.55, 1, 2.08);


// --- AUTO-GENERATED: precisionac6 from precisionac.js ---
const precisionac6 = createPrecisionAC(masterGroup, {
// pac dimensions
        deviceWidth: 1.1,
        deviceHeight: 2,
        deviceDepth: 0.8,
        devicePosition: { x: -5.55, y: 1, z: 3.4 },

        // PAC specific logic
        numberOfDoors: 1,

        // Camera Position
        camPosition: { x: 0, y: 0.6, z: 0.46 },

        // pac properties
        deviceColor: 0x4A5568,
        deviceoutlineColor: 0xFFFFFF,

        // ORIENTATION
        orientation: 'Left',

        // FACE TEXTURES (optional)
        faceTextures: {
            front: '/static/js/device_library/textures/precisionac6_front.png',
            back: '/static/js/device_library/textures/pac_front.png'
        },

        // label text properties (front label on door)
        text: 'PAC-6',
        textPosition: { x: 0, y: 1.1, z: 0.38 },
        textColor: 0xffffff,
        textSize: 0.15,
        textFont: 'Arial',
        textCanvasBgColor: 0x222222,
        textbgSize: { width: 0.6, height: 0.2 },

        // screen properties
	screenEnabled: false,  // Default: disabled
        screenPosition: { x: -0.5, y: 0.65, z: 0.42 },
        screenSize: { width: 0.4, height: 0.2 },
        screenColor: 0x00FF00,
        screenoutlineColor: 0x000000,

        // stand properties
        standHeight: 0.1,
        standColor: 0x333333,

        // ===== HIGH RAISED LABEL OPTIONS =====
        highLabelEnabled: false,
        highText: null,
        highTextPosition: { x: 0, y: 3.5, z: 0.8 / 2 + 0.05 },
        highTextbgSize: { width: 0.9, height: 0.25 },
        highTextSize: 0.16,
        highTextColor: 0xffffff,
        highTextCanvasBgColor: 0x222222,
        highLineColor: 0xffff00,
        highLineWidth: 2,
        highDotColor: 0xffff00,
        highDotRadius: 0.03,
        highLabelOrientation: 'CAMERA',
        // NEW: FRONT | BACK | LEFT | RIGHT | CAMERA

        // ===== STATUS LED OPTIONS =====
        ledEnabled: false,  // Default: disabled
        ledRadius: 0.04,
        ledHeight: 0.04,
        //ledOffset = { x: 1.5 / 2 - 0.06, y: -2.0 / 2 + 0.12, z: 0.8 / 2 + 0.01 },
        ledOffset: { x: -0.6, y: 0.85, z: 0.42 },

        healthyColor: 0x10ee00,
        warningColor: 0xffff00,
        alarmColor: 0xff0000,
        runColor: 0x0000ff,
        customColor: 0xffffff,
        ledState: 'HEALTHY',
        // HEALTHY | WARNING | ALARM | RUN | CUSTOM
        ledBlinkPeriod: 1,
        // seconds

	// Fan Animation Variables
        fanEnabled: true,  // Default: disabled
        fanStatus: 'OFF', // 'ON' or 'OFF' - controlled by Zabbix monitor
        fanSpeed: 1,   // Multiplier for rotation speed
        fanSize: 0.3,
        fanColor: 0xCCCCCC,
        fanPosition: { x: 0, y: -0.6, z: 0.41 }, // Center of the unit
        zbxKey: null,      // Zabbix item key for fan status
        fanOnValue: 1,    // Value that indicates fan is ON (can be: 1, ON, 48, etc.)

        // ===== GENERAL DEVICE PROPERTIES FOR LIVE DATA =====
        deviceId: null,
        category: 'electrical',
        urlLink: null,
        zbxSrvIP: null,
        zbxAPI: null,
        zbxHost: null,
        zbxHostKeys: [],
        zbxHostKeyValues: []
});
precisionac6.position.set(-5.55, 1, 3.4);


// --- AUTO-GENERATED: serverrack1 from serverrack.js ---
const serverrack1 = createServerRack(masterGroup, {
// rack dimensions
        deviceWidth: 0.6,
        deviceHeight: 42,
        deviceDepth: 1,
        devicePosition: { x: -3, y: 1, z: -1.6 },

        // Convert U to real-world height (1U = 44.45mm = 0.04445m)
        //deviceUHeight = deviceHeight * 0.04445,

        // Camera Position
        camPosition: { x: 0, y: 0.6, z: 0.46 },

        // rack properties
        deviceColor: 0x4A5568,
        deviceoutlineColor: 0x000000,

        // ORIENTATION
        orientation: 'Front',

        // FACE TEXTURES (optional)
        faceTextures: {
            front: '/static/js/device_library/textures/serverrack1_front.png',
            back: '/static/js/device_library/textures/serverrack1_back.png'
        },

        // label text properties (front label on door)
        text: 'Rack-1',
        textPosition: { x: 0, y: 1, z: 0.46 },
        textColor: 0xffffff,
        textSize: 0.1,
        textFont: 'Arial',
        textCanvasBgColor: 0x000000,
        textbgSize: { width: 0.5, height: 0.15 },

        // screen properties
        screenEnabled: false,
        screenPosition: { x: 0, y: 0.27, z: 0.56 },
        screenSize: { width: 0.5, height: 0.4 },
        screenColor: 0x00FF00,
        screenoutlineColor: 0x000000,

        // stand properties
        standHeight: 0.1,
        standColor: 0x333333,

        // ===== HIGH RAISED LABEL OPTIONS =====
        highLabelEnabled: false,
        highText: null,
        highTextPosition: { x: 0, y: 3.5, z: 1.0 / 2 + 0.05 },
        highTextbgSize: { width: 0.9, height: 0.25 },
        highTextSize: 0.16,
        highTextColor: 0xffffff,
        highTextCanvasBgColor: 0x222222,
        highLineColor: 0xffff00,
        highLineWidth: 2,
        highDotColor: 0xffff00,
        highDotRadius: 0.03,
        highLabelOrientation: 'CAMERA',
        // NEW: FRONT | BACK | LEFT | RIGHT | CAMERA

        // ===== STATUS LED OPTIONS =====
        ledEnabled: false,
        ledRadius: 0.04,
        ledHeight: 0.04,
        //ledOffset = { x: 0.6 / 2 - 0.06, y: -42 / 2 + 0.12, z: 1.0 / 2 + 0.01 },
        ledOffset: { x: 0.2, y: -0.6, z: 0.46 },

        healthyColor: 0x10ee00,
        warningColor: 0xffff00,
        alarmColor: 0xff0000,
        runColor: 0x0000ff,
        customColor: 0xffffff,
        ledState: 'HEALTHY',
        // HEALTHY | WARNING | ALARM | RUN | CUSTOM
        ledBlinkPeriod: 1,
        // seconds

        // ===== GENERAL DEVICE PROPERTIES FOR LIVE DATA =====
        deviceId: null,
        category: 'IT',
        urlLink: null,
        NBSrvIP: null,
        NBAPI: null,
        NBRackID: null,
        zbxSrvIP: null,
        zbxAPI: null,
        zbxHost: null
        //NBFront_ = '',
        //NBRear_ = ''
});
serverrack1.position.set(-3, 1, -1.6);


// --- AUTO-GENERATED: serverrack2 from serverrack.js ---
const serverrack2 = createServerRack(masterGroup, {
// rack dimensions
        deviceWidth: 0.6,
        deviceHeight: 42,
        deviceDepth: 1,
        devicePosition: { x: -2.38, y: 1, z: -1.6 },

        // Convert U to real-world height (1U = 44.45mm = 0.04445m)
        //deviceUHeight = deviceHeight * 0.04445,

        // Camera Position
        camPosition: { x: 0, y: 0.6, z: 0.46 },

        // rack properties
        deviceColor: 0x4A5568,
        deviceoutlineColor: 0x000000,

        // ORIENTATION
        orientation: 'Front',

        // FACE TEXTURES (optional)
        faceTextures: {
            front: '/static/js/device_library/textures/serverrack2_front.png',
            back: '/static/js/device_library/textures/serverrack2_back.png'
        },

        // label text properties (front label on door)
        text: 'Rack-2',
        textPosition: { x: 0, y: 1, z: 0.46 },
        textColor: 0xffffff,
        textSize: 0.1,
        textFont: 'Arial',
        textCanvasBgColor: 0x000000,
        textbgSize: { width: 0.5, height: 0.15 },

        // screen properties
        screenEnabled: false,
        screenPosition: { x: 0, y: 0.27, z: 0.56 },
        screenSize: { width: 0.5, height: 0.4 },
        screenColor: 0x00FF00,
        screenoutlineColor: 0x000000,

        // stand properties
        standHeight: 0.1,
        standColor: 0x333333,

        // ===== HIGH RAISED LABEL OPTIONS =====
        highLabelEnabled: false,
        highText: null,
        highTextPosition: { x: 0, y: 3.5, z: 1.0 / 2 + 0.05 },
        highTextbgSize: { width: 0.9, height: 0.25 },
        highTextSize: 0.16,
        highTextColor: 0xffffff,
        highTextCanvasBgColor: 0x222222,
        highLineColor: 0xffff00,
        highLineWidth: 2,
        highDotColor: 0xffff00,
        highDotRadius: 0.03,
        highLabelOrientation: 'CAMERA',
        // NEW: FRONT | BACK | LEFT | RIGHT | CAMERA

        // ===== STATUS LED OPTIONS =====
        ledEnabled: false,
        ledRadius: 0.04,
        ledHeight: 0.04,
        //ledOffset = { x: 0.6 / 2 - 0.06, y: -42 / 2 + 0.12, z: 1.0 / 2 + 0.01 },
        ledOffset: { x: 0.2, y: -0.6, z: 0.46 },

        healthyColor: 0x10ee00,
        warningColor: 0xffff00,
        alarmColor: 0xff0000,
        runColor: 0x0000ff,
        customColor: 0xffffff,
        ledState: 'HEALTHY',
        // HEALTHY | WARNING | ALARM | RUN | CUSTOM
        ledBlinkPeriod: 1,
        // seconds

        // ===== GENERAL DEVICE PROPERTIES FOR LIVE DATA =====
        deviceId: null,
        category: 'IT',
        urlLink: null,
        NBSrvIP: null,
        NBAPI: null,
        NBRackID: null,
        zbxSrvIP: null,
        zbxAPI: null,
        zbxHost: null
        //NBFront_ = '',
        //NBRear_ = ''
});
serverrack2.position.set(-2.38, 1, -1.6);


// --- AUTO-GENERATED: serverrack3 from serverrack.js ---
const serverrack3 = createServerRack(masterGroup, {
// rack dimensions
        deviceWidth: 0.6,
        deviceHeight: 42,
        deviceDepth: 1,
        devicePosition: { x: -1.76, y: 1, z: -1.6 },

        // Convert U to real-world height (1U = 44.45mm = 0.04445m)
        //deviceUHeight = deviceHeight * 0.04445,

        // Camera Position
        camPosition: { x: 0, y: 0.6, z: 0.46 },

        // rack properties
        deviceColor: 0x4A5568,
        deviceoutlineColor: 0x000000,

        // ORIENTATION
        orientation: 'Front',

        // FACE TEXTURES (optional)
        faceTextures: {
            front: '/static/js/device_library/textures/serverrack3_front.png',
            back: '/static/js/device_library/textures/serverrack3_back.png'
        },

        // label text properties (front label on door)
        text: 'Rack-3',
        textPosition: { x: 0, y: 1, z: 0.46 },
        textColor: 0xffffff,
        textSize: 0.1,
        textFont: 'Arial',
        textCanvasBgColor: 0x000000,
        textbgSize: { width: 0.5, height: 0.15 },

        // screen properties
        screenEnabled: false,
        screenPosition: { x: 0, y: 0.27, z: 0.56 },
        screenSize: { width: 0.5, height: 0.4 },
        screenColor: 0x00FF00,
        screenoutlineColor: 0x000000,

        // stand properties
        standHeight: 0.1,
        standColor: 0x333333,

        // ===== HIGH RAISED LABEL OPTIONS =====
        highLabelEnabled: false,
        highText: null,
        highTextPosition: { x: 0, y: 3.5, z: 1.0 / 2 + 0.05 },
        highTextbgSize: { width: 0.9, height: 0.25 },
        highTextSize: 0.16,
        highTextColor: 0xffffff,
        highTextCanvasBgColor: 0x222222,
        highLineColor: 0xffff00,
        highLineWidth: 2,
        highDotColor: 0xffff00,
        highDotRadius: 0.03,
        highLabelOrientation: 'CAMERA',
        // NEW: FRONT | BACK | LEFT | RIGHT | CAMERA

        // ===== STATUS LED OPTIONS =====
        ledEnabled: false,
        ledRadius: 0.04,
        ledHeight: 0.04,
        //ledOffset = { x: 0.6 / 2 - 0.06, y: -42 / 2 + 0.12, z: 1.0 / 2 + 0.01 },
        ledOffset: { x: 0.2, y: -0.6, z: 0.46 },

        healthyColor: 0x10ee00,
        warningColor: 0xffff00,
        alarmColor: 0xff0000,
        runColor: 0x0000ff,
        customColor: 0xffffff,
        ledState: 'HEALTHY',
        // HEALTHY | WARNING | ALARM | RUN | CUSTOM
        ledBlinkPeriod: 1,
        // seconds

        // ===== GENERAL DEVICE PROPERTIES FOR LIVE DATA =====
        deviceId: null,
        category: 'IT',
        urlLink: null,
        NBSrvIP: null,
        NBAPI: null,
        NBRackID: null,
        zbxSrvIP: null,
        zbxAPI: null,
        zbxHost: null
        //NBFront_ = '',
        //NBRear_ = ''
});
serverrack3.position.set(-1.76, 1, -1.6);


// --- AUTO-GENERATED: serverrack4 from serverrack.js ---
const serverrack4 = createServerRack(masterGroup, {
// rack dimensions
        deviceWidth: 0.6,
        deviceHeight: 42,
        deviceDepth: 1,
        devicePosition: { x: -1.14, y: 1, z: -1.6 },

        // Convert U to real-world height (1U = 44.45mm = 0.04445m)
        //deviceUHeight = deviceHeight * 0.04445,

        // Camera Position
        camPosition: { x: 0, y: 0.6, z: 0.46 },

        // rack properties
        deviceColor: 0x4A5568,
        deviceoutlineColor: 0x000000,

        // ORIENTATION
        orientation: 'Front',

        // FACE TEXTURES (optional)
        faceTextures: {
            front: '/static/js/device_library/textures/serverrack4_front.png',
            back: '/static/js/device_library/textures/serverrack4_back.png'
        },

        // label text properties (front label on door)
        text: 'Rack-4',
        textPosition: { x: 0, y: 1, z: 0.46 },
        textColor: 0xffffff,
        textSize: 0.1,
        textFont: 'Arial',
        textCanvasBgColor: 0x000000,
        textbgSize: { width: 0.5, height: 0.15 },

        // screen properties
        screenEnabled: false,
        screenPosition: { x: 0, y: 0.27, z: 0.56 },
        screenSize: { width: 0.5, height: 0.4 },
        screenColor: 0x00FF00,
        screenoutlineColor: 0x000000,

        // stand properties
        standHeight: 0.1,
        standColor: 0x333333,

        // ===== HIGH RAISED LABEL OPTIONS =====
        highLabelEnabled: false,
        highText: null,
        highTextPosition: { x: 0, y: 3.5, z: 1.0 / 2 + 0.05 },
        highTextbgSize: { width: 0.9, height: 0.25 },
        highTextSize: 0.16,
        highTextColor: 0xffffff,
        highTextCanvasBgColor: 0x222222,
        highLineColor: 0xffff00,
        highLineWidth: 2,
        highDotColor: 0xffff00,
        highDotRadius: 0.03,
        highLabelOrientation: 'CAMERA',
        // NEW: FRONT | BACK | LEFT | RIGHT | CAMERA

        // ===== STATUS LED OPTIONS =====
        ledEnabled: false,
        ledRadius: 0.04,
        ledHeight: 0.04,
        //ledOffset = { x: 0.6 / 2 - 0.06, y: -42 / 2 + 0.12, z: 1.0 / 2 + 0.01 },
        ledOffset: { x: 0.2, y: -0.6, z: 0.46 },

        healthyColor: 0x10ee00,
        warningColor: 0xffff00,
        alarmColor: 0xff0000,
        runColor: 0x0000ff,
        customColor: 0xffffff,
        ledState: 'HEALTHY',
        // HEALTHY | WARNING | ALARM | RUN | CUSTOM
        ledBlinkPeriod: 1,
        // seconds

        // ===== GENERAL DEVICE PROPERTIES FOR LIVE DATA =====
        deviceId: null,
        category: 'IT',
        urlLink: null,
        NBSrvIP: null,
        NBAPI: null,
        NBRackID: null,
        zbxSrvIP: null,
        zbxAPI: null,
        zbxHost: null
        //NBFront_ = '',
        //NBRear_ = ''
});
serverrack4.position.set(-1.14, 1, -1.6);


// --- AUTO-GENERATED: serverrack5 from serverrack.js ---
const serverrack5 = createServerRack(masterGroup, {
// rack dimensions
        deviceWidth: 0.6,
        deviceHeight: 42,
        deviceDepth: 1,
        devicePosition: { x: -0.52, y: 1, z: -1.6 },

        // Convert U to real-world height (1U = 44.45mm = 0.04445m)
        //deviceUHeight = deviceHeight * 0.04445,

        // Camera Position
        camPosition: { x: 0, y: 0.6, z: 0.46 },

        // rack properties
        deviceColor: 0x4A5568,
        deviceoutlineColor: 0x000000,

        // ORIENTATION
        orientation: 'Front',

        // FACE TEXTURES (optional)
        faceTextures: {
            front: '/static/js/device_library/textures/serverrack5_front.png',
            back: '/static/js/device_library/textures/serverrack5_back.png'
        },

        // label text properties (front label on door)
        text: 'Rack-5',
        textPosition: { x: 0, y: 1, z: 0.46 },
        textColor: 0xffffff,
        textSize: 0.1,
        textFont: 'Arial',
        textCanvasBgColor: 0x000000,
        textbgSize: { width: 0.5, height: 0.15 },

        // screen properties
        screenEnabled: false,
        screenPosition: { x: 0, y: 0.27, z: 0.56 },
        screenSize: { width: 0.5, height: 0.4 },
        screenColor: 0x00FF00,
        screenoutlineColor: 0x000000,

        // stand properties
        standHeight: 0.1,
        standColor: 0x333333,

        // ===== HIGH RAISED LABEL OPTIONS =====
        highLabelEnabled: false,
        highText: null,
        highTextPosition: { x: 0, y: 3.5, z: 1.0 / 2 + 0.05 },
        highTextbgSize: { width: 0.9, height: 0.25 },
        highTextSize: 0.16,
        highTextColor: 0xffffff,
        highTextCanvasBgColor: 0x222222,
        highLineColor: 0xffff00,
        highLineWidth: 2,
        highDotColor: 0xffff00,
        highDotRadius: 0.03,
        highLabelOrientation: 'CAMERA',
        // NEW: FRONT | BACK | LEFT | RIGHT | CAMERA

        // ===== STATUS LED OPTIONS =====
        ledEnabled: false,
        ledRadius: 0.04,
        ledHeight: 0.04,
        //ledOffset = { x: 0.6 / 2 - 0.06, y: -42 / 2 + 0.12, z: 1.0 / 2 + 0.01 },
        ledOffset: { x: 0.2, y: -0.6, z: 0.46 },

        healthyColor: 0x10ee00,
        warningColor: 0xffff00,
        alarmColor: 0xff0000,
        runColor: 0x0000ff,
        customColor: 0xffffff,
        ledState: 'HEALTHY',
        // HEALTHY | WARNING | ALARM | RUN | CUSTOM
        ledBlinkPeriod: 1,
        // seconds

        // ===== GENERAL DEVICE PROPERTIES FOR LIVE DATA =====
        deviceId: null,
        category: 'IT',
        urlLink: null,
        NBSrvIP: null,
        NBAPI: null,
        NBRackID: null,
        zbxSrvIP: null,
        zbxAPI: null,
        zbxHost: null
        //NBFront_ = '',
        //NBRear_ = ''
});
serverrack5.position.set(-0.52, 1, -1.6);


// --- AUTO-GENERATED: serverrack6 from serverrack.js ---
const serverrack6 = createServerRack(masterGroup, {
// rack dimensions
        deviceWidth: 0.6,
        deviceHeight: 42,
        deviceDepth: 1,
        devicePosition: { x: 0.1, y: 1, z: -1.6 },

        // Convert U to real-world height (1U = 44.45mm = 0.04445m)
        //deviceUHeight = deviceHeight * 0.04445,

        // Camera Position
        camPosition: { x: 0, y: 0.6, z: 0.46 },

        // rack properties
        deviceColor: 0x4A5568,
        deviceoutlineColor: 0x000000,

        // ORIENTATION
        orientation: 'Front',

        // FACE TEXTURES (optional)
        faceTextures: {
            front: '/static/js/device_library/textures/serverrack6_front.png',
            back: '/static/js/device_library/textures/serverrack6_back.png'
        },

        // label text properties (front label on door)
        text: 'Rack-6',
        textPosition: { x: 0, y: 1, z: 0.46 },
        textColor: 0xffffff,
        textSize: 0.1,
        textFont: 'Arial',
        textCanvasBgColor: 0x000000,
        textbgSize: { width: 0.5, height: 0.15 },

        // screen properties
        screenEnabled: false,
        screenPosition: { x: 0, y: 0.27, z: 0.56 },
        screenSize: { width: 0.5, height: 0.4 },
        screenColor: 0x00FF00,
        screenoutlineColor: 0x000000,

        // stand properties
        standHeight: 0.1,
        standColor: 0x333333,

        // ===== HIGH RAISED LABEL OPTIONS =====
        highLabelEnabled: false,
        highText: null,
        highTextPosition: { x: 0, y: 3.5, z: 1.0 / 2 + 0.05 },
        highTextbgSize: { width: 0.9, height: 0.25 },
        highTextSize: 0.16,
        highTextColor: 0xffffff,
        highTextCanvasBgColor: 0x222222,
        highLineColor: 0xffff00,
        highLineWidth: 2,
        highDotColor: 0xffff00,
        highDotRadius: 0.03,
        highLabelOrientation: 'CAMERA',
        // NEW: FRONT | BACK | LEFT | RIGHT | CAMERA

        // ===== STATUS LED OPTIONS =====
        ledEnabled: false,
        ledRadius: 0.04,
        ledHeight: 0.04,
        //ledOffset = { x: 0.6 / 2 - 0.06, y: -42 / 2 + 0.12, z: 1.0 / 2 + 0.01 },
        ledOffset: { x: 0.2, y: -0.6, z: 0.46 },

        healthyColor: 0x10ee00,
        warningColor: 0xffff00,
        alarmColor: 0xff0000,
        runColor: 0x0000ff,
        customColor: 0xffffff,
        ledState: 'HEALTHY',
        // HEALTHY | WARNING | ALARM | RUN | CUSTOM
        ledBlinkPeriod: 1,
        // seconds

        // ===== GENERAL DEVICE PROPERTIES FOR LIVE DATA =====
        deviceId: null,
        category: 'IT',
        urlLink: null,
        NBSrvIP: null,
        NBAPI: null,
        NBRackID: null,
        zbxSrvIP: null,
        zbxAPI: null,
        zbxHost: null
        //NBFront_ = '',
        //NBRear_ = ''
});
serverrack6.position.set(0.1, 1, -1.6);


// --- AUTO-GENERATED: serverrack7 from serverrack.js ---
const serverrack7 = createServerRack(masterGroup, {
// rack dimensions
        deviceWidth: 0.6,
        deviceHeight: 42,
        deviceDepth: 1,
        devicePosition: { x: -3, y: 1, z: -3.6 },

        // Convert U to real-world height (1U = 44.45mm = 0.04445m)
        //deviceUHeight = deviceHeight * 0.04445,

        // Camera Position
        camPosition: { x: 0, y: 0.6, z: 0.46 },

        // rack properties
        deviceColor: 0x4A5568,
        deviceoutlineColor: 0x000000,

        // ORIENTATION
        orientation: 'Back',

        // FACE TEXTURES (optional)
        faceTextures: {
            front: '/static/js/device_library/textures/serverrack7_front.png',
            back: '/static/js/device_library/textures/serverrack7_back.png'
        },

        // label text properties (front label on door)
        text: 'Rack-8',
        textPosition: { x: 0, y: 1, z: 0.46 },
        textColor: 0xffffff,
        textSize: 0.1,
        textFont: 'Arial',
        textCanvasBgColor: 0x000000,
        textbgSize: { width: 0.5, height: 0.15 },

        // screen properties
        screenEnabled: false,
        screenPosition: { x: 0, y: 0.27, z: 0.56 },
        screenSize: { width: 0.5, height: 0.4 },
        screenColor: 0x00FF00,
        screenoutlineColor: 0x000000,

        // stand properties
        standHeight: 0.1,
        standColor: 0x333333,

        // ===== HIGH RAISED LABEL OPTIONS =====
        highLabelEnabled: false,
        highText: null,
        highTextPosition: { x: 0, y: 3.5, z: 1.0 / 2 + 0.05 },
        highTextbgSize: { width: 0.9, height: 0.25 },
        highTextSize: 0.16,
        highTextColor: 0xffffff,
        highTextCanvasBgColor: 0x222222,
        highLineColor: 0xffff00,
        highLineWidth: 2,
        highDotColor: 0xffff00,
        highDotRadius: 0.03,
        highLabelOrientation: 'CAMERA',
        // NEW: FRONT | BACK | LEFT | RIGHT | CAMERA

        // ===== STATUS LED OPTIONS =====
        ledEnabled: false,
        ledRadius: 0.04,
        ledHeight: 0.04,
        //ledOffset = { x: 0.6 / 2 - 0.06, y: -42 / 2 + 0.12, z: 1.0 / 2 + 0.01 },
        ledOffset: { x: 0.2, y: -0.6, z: 0.46 },

        healthyColor: 0x10ee00,
        warningColor: 0xffff00,
        alarmColor: 0xff0000,
        runColor: 0x0000ff,
        customColor: 0xffffff,
        ledState: 'HEALTHY',
        // HEALTHY | WARNING | ALARM | RUN | CUSTOM
        ledBlinkPeriod: 1,
        // seconds

        // ===== GENERAL DEVICE PROPERTIES FOR LIVE DATA =====
        deviceId: null,
        category: 'IT',
        urlLink: null,
        NBSrvIP: null,
        NBAPI: null,
        NBRackID: null,
        zbxSrvIP: null,
        zbxAPI: null,
        zbxHost: null
        //NBFront_ = '',
        //NBRear_ = ''
});
serverrack7.position.set(-3, 1, -3.6);


// --- AUTO-GENERATED: serverrack8 from serverrack.js ---
const serverrack8 = createServerRack(masterGroup, {
// rack dimensions
        deviceWidth: 0.6,
        deviceHeight: 42,
        deviceDepth: 1,
        devicePosition: { x: -2.38, y: 1, z: -3.6 },

        // Convert U to real-world height (1U = 44.45mm = 0.04445m)
        //deviceUHeight = deviceHeight * 0.04445,

        // Camera Position
        camPosition: { x: 0, y: 0.6, z: 0.46 },

        // rack properties
        deviceColor: 0x4A5568,
        deviceoutlineColor: 0x000000,

        // ORIENTATION
        orientation: 'Back',

        // FACE TEXTURES (optional)
        faceTextures: {
            front: '/static/js/device_library/textures/serverrack8_front.png',
            back: '/static/js/device_library/textures/serverrack8_back.png'
        },

        // label text properties (front label on door)
        text: 'Rack-8',
        textPosition: { x: 0, y: 1, z: 0.46 },
        textColor: 0xffffff,
        textSize: 0.1,
        textFont: 'Arial',
        textCanvasBgColor: 0x000000,
        textbgSize: { width: 0.5, height: 0.15 },

        // screen properties
        screenEnabled: false,
        screenPosition: { x: 0, y: 0.27, z: 0.56 },
        screenSize: { width: 0.5, height: 0.4 },
        screenColor: 0x00FF00,
        screenoutlineColor: 0x000000,

        // stand properties
        standHeight: 0.1,
        standColor: 0x333333,

        // ===== HIGH RAISED LABEL OPTIONS =====
        highLabelEnabled: false,
        highText: null,
        highTextPosition: { x: 0, y: 3.5, z: 1.0 / 2 + 0.05 },
        highTextbgSize: { width: 0.9, height: 0.25 },
        highTextSize: 0.16,
        highTextColor: 0xffffff,
        highTextCanvasBgColor: 0x222222,
        highLineColor: 0xffff00,
        highLineWidth: 2,
        highDotColor: 0xffff00,
        highDotRadius: 0.03,
        highLabelOrientation: 'CAMERA',
        // NEW: FRONT | BACK | LEFT | RIGHT | CAMERA

        // ===== STATUS LED OPTIONS =====
        ledEnabled: false,
        ledRadius: 0.04,
        ledHeight: 0.04,
        //ledOffset = { x: 0.6 / 2 - 0.06, y: -42 / 2 + 0.12, z: 1.0 / 2 + 0.01 },
        ledOffset: { x: 0.2, y: -0.6, z: 0.46 },

        healthyColor: 0x10ee00,
        warningColor: 0xffff00,
        alarmColor: 0xff0000,
        runColor: 0x0000ff,
        customColor: 0xffffff,
        ledState: 'HEALTHY',
        // HEALTHY | WARNING | ALARM | RUN | CUSTOM
        ledBlinkPeriod: 1,
        // seconds

        // ===== GENERAL DEVICE PROPERTIES FOR LIVE DATA =====
        deviceId: null,
        category: 'IT',
        urlLink: null,
        NBSrvIP: null,
        NBAPI: null,
        NBRackID: null,
        zbxSrvIP: null,
        zbxAPI: null,
        zbxHost: null
        //NBFront_ = '',
        //NBRear_ = ''
});
serverrack8.position.set(-2.38, 1, -3.6);


// --- AUTO-GENERATED: serverrack9 from serverrack.js ---
const serverrack9 = createServerRack(masterGroup, {
// rack dimensions
        deviceWidth: 0.6,
        deviceHeight: 42,
        deviceDepth: 1,
        devicePosition: { x: -1.76, y: 1, z: -3.6 },

        // Convert U to real-world height (1U = 44.45mm = 0.04445m)
        //deviceUHeight = deviceHeight * 0.04445,

        // Camera Position
        camPosition: { x: 0, y: 0.6, z: 0.46 },

        // rack properties
        deviceColor: 0x4A5568,
        deviceoutlineColor: 0x000000,

        // ORIENTATION
        orientation: 'Back',

        // FACE TEXTURES (optional)
        faceTextures: {
            front: '/static/js/device_library/textures/serverrack9_front.png',
            back: '/static/js/device_library/textures/serverrack9_back.png'
        },

        // label text properties (front label on door)
        text: 'Rack-9',
        textPosition: { x: 0, y: 1, z: 0.46 },
        textColor: 0xffffff,
        textSize: 0.1,
        textFont: 'Arial',
        textCanvasBgColor: 0x000000,
        textbgSize: { width: 0.5, height: 0.15 },

        // screen properties
        screenEnabled: false,
        screenPosition: { x: 0, y: 0.27, z: 0.56 },
        screenSize: { width: 0.5, height: 0.4 },
        screenColor: 0x00FF00,
        screenoutlineColor: 0x000000,

        // stand properties
        standHeight: 0.1,
        standColor: 0x333333,

        // ===== HIGH RAISED LABEL OPTIONS =====
        highLabelEnabled: false,
        highText: null,
        highTextPosition: { x: 0, y: 3.5, z: 1.0 / 2 + 0.05 },
        highTextbgSize: { width: 0.9, height: 0.25 },
        highTextSize: 0.16,
        highTextColor: 0xffffff,
        highTextCanvasBgColor: 0x222222,
        highLineColor: 0xffff00,
        highLineWidth: 2,
        highDotColor: 0xffff00,
        highDotRadius: 0.03,
        highLabelOrientation: 'CAMERA',
        // NEW: FRONT | BACK | LEFT | RIGHT | CAMERA

        // ===== STATUS LED OPTIONS =====
        ledEnabled: false,
        ledRadius: 0.04,
        ledHeight: 0.04,
        //ledOffset = { x: 0.6 / 2 - 0.06, y: -42 / 2 + 0.12, z: 1.0 / 2 + 0.01 },
        ledOffset: { x: 0.2, y: -0.6, z: 0.46 },

        healthyColor: 0x10ee00,
        warningColor: 0xffff00,
        alarmColor: 0xff0000,
        runColor: 0x0000ff,
        customColor: 0xffffff,
        ledState: 'HEALTHY',
        // HEALTHY | WARNING | ALARM | RUN | CUSTOM
        ledBlinkPeriod: 1,
        // seconds

        // ===== GENERAL DEVICE PROPERTIES FOR LIVE DATA =====
        deviceId: null,
        category: 'IT',
        urlLink: null,
        NBSrvIP: null,
        NBAPI: null,
        NBRackID: null,
        zbxSrvIP: null,
        zbxAPI: null,
        zbxHost: null
        //NBFront_ = '',
        //NBRear_ = ''
});
serverrack9.position.set(-1.76, 1, -3.6);


// --- AUTO-GENERATED: serverrack10 from serverrack.js ---
const serverrack10 = createServerRack(masterGroup, {
// rack dimensions
        deviceWidth: 0.6,
        deviceHeight: 42,
        deviceDepth: 1,
        devicePosition: { x: -1.14, y: 1, z: -3.6 },

        // Convert U to real-world height (1U = 44.45mm = 0.04445m)
        //deviceUHeight = deviceHeight * 0.04445,

        // Camera Position
        camPosition: { x: 0, y: 0.6, z: 0.46 },

        // rack properties
        deviceColor: 0x4A5568,
        deviceoutlineColor: 0x000000,

        // ORIENTATION
        orientation: 'Back',

        // FACE TEXTURES (optional)
        faceTextures: {
            front: '/static/js/device_library/textures/serverrack10_front.png',
            back: '/static/js/device_library/textures/serverrack10_back.png'
        },

        // label text properties (front label on door)
        text: 'Rack-10',
        textPosition: { x: 0, y: 1, z: 0.46 },
        textColor: 0xffffff,
        textSize: 0.1,
        textFont: 'Arial',
        textCanvasBgColor: 0x000000,
        textbgSize: { width: 0.5, height: 0.15 },

        // screen properties
        screenEnabled: false,
        screenPosition: { x: 0, y: 0.27, z: 0.56 },
        screenSize: { width: 0.5, height: 0.4 },
        screenColor: 0x00FF00,
        screenoutlineColor: 0x000000,

        // stand properties
        standHeight: 0.1,
        standColor: 0x333333,

        // ===== HIGH RAISED LABEL OPTIONS =====
        highLabelEnabled: false,
        highText: null,
        highTextPosition: { x: 0, y: 3.5, z: 1.0 / 2 + 0.05 },
        highTextbgSize: { width: 0.9, height: 0.25 },
        highTextSize: 0.16,
        highTextColor: 0xffffff,
        highTextCanvasBgColor: 0x222222,
        highLineColor: 0xffff00,
        highLineWidth: 2,
        highDotColor: 0xffff00,
        highDotRadius: 0.03,
        highLabelOrientation: 'CAMERA',
        // NEW: FRONT | BACK | LEFT | RIGHT | CAMERA

        // ===== STATUS LED OPTIONS =====
        ledEnabled: false,
        ledRadius: 0.04,
        ledHeight: 0.04,
        //ledOffset = { x: 0.6 / 2 - 0.06, y: -42 / 2 + 0.12, z: 1.0 / 2 + 0.01 },
        ledOffset: { x: 0.2, y: -0.6, z: 0.46 },

        healthyColor: 0x10ee00,
        warningColor: 0xffff00,
        alarmColor: 0xff0000,
        runColor: 0x0000ff,
        customColor: 0xffffff,
        ledState: 'HEALTHY',
        // HEALTHY | WARNING | ALARM | RUN | CUSTOM
        ledBlinkPeriod: 1,
        // seconds

        // ===== GENERAL DEVICE PROPERTIES FOR LIVE DATA =====
        deviceId: null,
        category: 'IT',
        urlLink: null,
        NBSrvIP: null,
        NBAPI: null,
        NBRackID: null,
        zbxSrvIP: null,
        zbxAPI: null,
        zbxHost: null
        //NBFront_ = '',
        //NBRear_ = ''
});
serverrack10.position.set(-1.14, 1, -3.6);


// --- AUTO-GENERATED: serverrack11 from serverrack.js ---
const serverrack11 = createServerRack(masterGroup, {
// rack dimensions
        deviceWidth: 0.6,
        deviceHeight: 42,
        deviceDepth: 1,
        devicePosition: { x: -0.52, y: 1, z: -3.6 },

        // Convert U to real-world height (1U = 44.45mm = 0.04445m)
        //deviceUHeight = deviceHeight * 0.04445,

        // Camera Position
        camPosition: { x: 0, y: 0.6, z: 0.46 },

        // rack properties
        deviceColor: 0x4A5568,
        deviceoutlineColor: 0x000000,

        // ORIENTATION
        orientation: 'Back',

        // FACE TEXTURES (optional)
        faceTextures: {
            front: '/static/js/device_library/textures/serverrack11_front.png',
            back: '/static/js/device_library/textures/serverrack11_back.png'
        },

        // label text properties (front label on door)
        text: 'Rack-11',
        textPosition: { x: 0, y: 1, z: 0.46 },
        textColor: 0xffffff,
        textSize: 0.1,
        textFont: 'Arial',
        textCanvasBgColor: 0x000000,
        textbgSize: { width: 0.5, height: 0.15 },

        // screen properties
        screenEnabled: false,
        screenPosition: { x: 0, y: 0.27, z: 0.56 },
        screenSize: { width: 0.5, height: 0.4 },
        screenColor: 0x00FF00,
        screenoutlineColor: 0x000000,

        // stand properties
        standHeight: 0.1,
        standColor: 0x333333,

        // ===== HIGH RAISED LABEL OPTIONS =====
        highLabelEnabled: false,
        highText: null,
        highTextPosition: { x: 0, y: 3.5, z: 1.0 / 2 + 0.05 },
        highTextbgSize: { width: 0.9, height: 0.25 },
        highTextSize: 0.16,
        highTextColor: 0xffffff,
        highTextCanvasBgColor: 0x222222,
        highLineColor: 0xffff00,
        highLineWidth: 2,
        highDotColor: 0xffff00,
        highDotRadius: 0.03,
        highLabelOrientation: 'CAMERA',
        // NEW: FRONT | BACK | LEFT | RIGHT | CAMERA

        // ===== STATUS LED OPTIONS =====
        ledEnabled: false,
        ledRadius: 0.04,
        ledHeight: 0.04,
        //ledOffset = { x: 0.6 / 2 - 0.06, y: -42 / 2 + 0.12, z: 1.0 / 2 + 0.01 },
        ledOffset: { x: 0.2, y: -0.6, z: 0.46 },

        healthyColor: 0x10ee00,
        warningColor: 0xffff00,
        alarmColor: 0xff0000,
        runColor: 0x0000ff,
        customColor: 0xffffff,
        ledState: 'HEALTHY',
        // HEALTHY | WARNING | ALARM | RUN | CUSTOM
        ledBlinkPeriod: 1,
        // seconds

        // ===== GENERAL DEVICE PROPERTIES FOR LIVE DATA =====
        deviceId: null,
        category: 'IT',
        urlLink: null,
        NBSrvIP: null,
        NBAPI: null,
        NBRackID: null,
        zbxSrvIP: null,
        zbxAPI: null,
        zbxHost: null
        //NBFront_ = '',
        //NBRear_ = ''
});
serverrack11.position.set(-0.52, 1, -3.6);


// --- AUTO-GENERATED: serverrack12 from serverrack.js ---
const serverrack12 = createServerRack(masterGroup, {
// rack dimensions
        deviceWidth: 0.6,
        deviceHeight: 42,
        deviceDepth: 1,
        devicePosition: { x: 0.1, y: 1, z: -3.6 },

        // Convert U to real-world height (1U = 44.45mm = 0.04445m)
        //deviceUHeight = deviceHeight * 0.04445,

        // Camera Position
        camPosition: { x: 0, y: 0.6, z: 0.46 },

        // rack properties
        deviceColor: 0x4A5568,
        deviceoutlineColor: 0x000000,

        // ORIENTATION
        orientation: 'Back',

        // FACE TEXTURES (optional)
        faceTextures: {
            front: '/static/js/device_library/textures/serverrack12_front.png',
            back: '/static/js/device_library/textures/serverrack12_back.png'
        },

        // label text properties (front label on door)
        text: 'Rack-12',
        textPosition: { x: 0, y: 1, z: 0.46 },
        textColor: 0xffffff,
        textSize: 0.1,
        textFont: 'Arial',
        textCanvasBgColor: 0x000000,
        textbgSize: { width: 0.5, height: 0.15 },

        // screen properties
        screenEnabled: false,
        screenPosition: { x: 0, y: 0.27, z: 0.56 },
        screenSize: { width: 0.5, height: 0.4 },
        screenColor: 0x00FF00,
        screenoutlineColor: 0x000000,

        // stand properties
        standHeight: 0.1,
        standColor: 0x333333,

        // ===== HIGH RAISED LABEL OPTIONS =====
        highLabelEnabled: false,
        highText: null,
        highTextPosition: { x: 0, y: 3.5, z: 1.0 / 2 + 0.05 },
        highTextbgSize: { width: 0.9, height: 0.25 },
        highTextSize: 0.16,
        highTextColor: 0xffffff,
        highTextCanvasBgColor: 0x222222,
        highLineColor: 0xffff00,
        highLineWidth: 2,
        highDotColor: 0xffff00,
        highDotRadius: 0.03,
        highLabelOrientation: 'CAMERA',
        // NEW: FRONT | BACK | LEFT | RIGHT | CAMERA

        // ===== STATUS LED OPTIONS =====
        ledEnabled: false,
        ledRadius: 0.04,
        ledHeight: 0.04,
        //ledOffset = { x: 0.6 / 2 - 0.06, y: -42 / 2 + 0.12, z: 1.0 / 2 + 0.01 },
        ledOffset: { x: 0.2, y: -0.6, z: 0.46 },

        healthyColor: 0x10ee00,
        warningColor: 0xffff00,
        alarmColor: 0xff0000,
        runColor: 0x0000ff,
        customColor: 0xffffff,
        ledState: 'HEALTHY',
        // HEALTHY | WARNING | ALARM | RUN | CUSTOM
        ledBlinkPeriod: 1,
        // seconds

        // ===== GENERAL DEVICE PROPERTIES FOR LIVE DATA =====
        deviceId: null,
        category: 'IT',
        urlLink: null,
        NBSrvIP: null,
        NBAPI: null,
        NBRackID: null,
        zbxSrvIP: null,
        zbxAPI: null,
        zbxHost: null
        //NBFront_ = '',
        //NBRear_ = ''
});
serverrack12.position.set(0.1, 1, -3.6);


// --- AUTO-GENERATED: aislecontainment1 from aislecontainment.js ---
const aislecontainment1 = createAisleContainment(masterGroup, {
// Container dimensions
        deviceWidth: 1.85,
        deviceHeight: 1.95,
        deviceDepth: 3.85,
        devicePosition: { x: -1.45, y: 0, z: -2.6 },

        // ORIENTATION (Matching serverrack.js logic)
        orientation: 'Left',

        // Door dimensions (Double Sliding Doors)
        doorWidth: 1.6,
        doorHeight: 2,
        handleColor: 0xcccccc,
        doorOffset: 0.2,

        // Material properties
        frameColor: 0x222222,
        glassColor: 0x88ccff,
        glassOpacity: 0.3,

        // Outline/Frame Thickness
        outlineWidth: 0.02
});
masterGroup.position.set(0, 0, 0);


// --- AUTO-GENERATED: perforatedtiles1 from perforatedtiles.js ---
const perforatedtiles1 = createPerforatedTiles(masterGroup, {
// Dimensions
        deviceWidth: 3.7,
        deviceDepth: 1.1,
        deviceThickness: 0.05,
        devicePosition: { x: -0.73, y: -0.02, z: -1.3 },

        // Tiling Logic (Matching container.js)
        tileSize: 0.8,              // How large each tile is (e.g., 5 units)
        tileColor: 0xd1d5db,      // Light grey/silver
        tileLineColor: 0x333333,  // Grid line color
        tileLineWidth: 0.02,

        // Airflow (Perforation) properties
        airflowPercentage: 100,    // 0 to 100
        holeColor: 0x111111,      // Color of the holes
        holeSpacing: 10           // Spacing between holes in pixels on the canvas
});
perforatedtiles1.position.set(-0.73, -0.02, -1.3);


// --- AUTO-GENERATED: serverrack13 from serverrack.js ---
const serverrack13 = createServerRack(masterGroup, {
// rack dimensions
        deviceWidth: 0.8,
        deviceHeight: 42,
        deviceDepth: 1.2,
        devicePosition: { x: -2.8, y: 1, z: 3.76 },

        // Convert U to real-world height (1U = 44.45mm = 0.04445m)
        //deviceUHeight = deviceHeight * 0.04445,

        // Camera Position
        camPosition: { x: 0, y: 0.6, z: 0.46 },

        // rack properties
        deviceColor: 0x4A5568,
        deviceoutlineColor: 0x000000,

        // ORIENTATION
        orientation: 'Left',

        // FACE TEXTURES (optional)
        faceTextures: {
            front: '/static/js/device_library/textures/serverrack13_front.png',
            back: '/static/js/device_library/textures/serverrack13_back.png'
        },

        // label text properties (front label on door)
        text: 'Rack-13',
        textPosition: { x: 0, y: 1, z: 0.46 },
        textColor: 0xffffff,
        textSize: 0.1,
        textFont: 'Arial',
        textCanvasBgColor: 0x000000,
        textbgSize: { width: 0.5, height: 0.15 },

        // screen properties
        screenEnabled: false,
        screenPosition: { x: 0, y: 0.27, z: 0.56 },
        screenSize: { width: 0.5, height: 0.4 },
        screenColor: 0x00FF00,
        screenoutlineColor: 0x000000,

        // stand properties
        standHeight: 0.1,
        standColor: 0x333333,

        // ===== HIGH RAISED LABEL OPTIONS =====
        highLabelEnabled: false,
        highText: null,
        highTextPosition: { x: 0, y: 3.5, z: 1.0 / 2 + 0.05 },
        highTextbgSize: { width: 0.9, height: 0.25 },
        highTextSize: 0.16,
        highTextColor: 0xffffff,
        highTextCanvasBgColor: 0x222222,
        highLineColor: 0xffff00,
        highLineWidth: 2,
        highDotColor: 0xffff00,
        highDotRadius: 0.03,
        highLabelOrientation: 'CAMERA',
        // NEW: FRONT | BACK | LEFT | RIGHT | CAMERA

        // ===== STATUS LED OPTIONS =====
        ledEnabled: false,
        ledRadius: 0.04,
        ledHeight: 0.04,
        //ledOffset = { x: 0.6 / 2 - 0.06, y: -42 / 2 + 0.12, z: 1.0 / 2 + 0.01 },
        ledOffset: { x: 0.2, y: -0.6, z: 0.46 },

        healthyColor: 0x10ee00,
        warningColor: 0xffff00,
        alarmColor: 0xff0000,
        runColor: 0x0000ff,
        customColor: 0xffffff,
        ledState: 'HEALTHY',
        // HEALTHY | WARNING | ALARM | RUN | CUSTOM
        ledBlinkPeriod: 1,
        // seconds

        // ===== GENERAL DEVICE PROPERTIES FOR LIVE DATA =====
        deviceId: null,
        category: 'IT',
        urlLink: null,
        NBSrvIP: null,
        NBAPI: null,
        NBRackID: null,
        zbxSrvIP: null,
        zbxAPI: null,
        zbxHost: null
        //NBFront_ = '',
        //NBRear_ = ''
});
serverrack13.position.set(-2.8, 1, 3.76);


// --- AUTO-GENERATED: serverrack14 from serverrack.js ---
const serverrack14 = createServerRack(masterGroup, {
// rack dimensions
        deviceWidth: 0.6,
        deviceHeight: 42,
        deviceDepth: 1.2,
        devicePosition: { x: -2.8, y: 1, z: 3.04 },

        // Convert U to real-world height (1U = 44.45mm = 0.04445m)
        //deviceUHeight = deviceHeight * 0.04445,

        // Camera Position
        camPosition: { x: 0, y: 0.6, z: 0.46 },

        // rack properties
        deviceColor: 0x4A5568,
        deviceoutlineColor: 0x000000,

        // ORIENTATION
        orientation: 'Left',

        // FACE TEXTURES (optional)
        faceTextures: {
            front: '/static/js/device_library/textures/serverrack14_front.png',
            back: '/static/js/device_library/textures/serverrack14_back.png'
        },

        // label text properties (front label on door)
        text: 'Rack-14',
        textPosition: { x: 0, y: 1, z: 0.46 },
        textColor: 0xffffff,
        textSize: 0.1,
        textFont: 'Arial',
        textCanvasBgColor: 0x000000,
        textbgSize: { width: 0.5, height: 0.15 },

        // screen properties
        screenEnabled: false,
        screenPosition: { x: 0, y: 0.27, z: 0.56 },
        screenSize: { width: 0.5, height: 0.4 },
        screenColor: 0x00FF00,
        screenoutlineColor: 0x000000,

        // stand properties
        standHeight: 0.1,
        standColor: 0x333333,

        // ===== HIGH RAISED LABEL OPTIONS =====
        highLabelEnabled: false,
        highText: null,
        highTextPosition: { x: 0, y: 3.5, z: 1.0 / 2 + 0.05 },
        highTextbgSize: { width: 0.9, height: 0.25 },
        highTextSize: 0.16,
        highTextColor: 0xffffff,
        highTextCanvasBgColor: 0x222222,
        highLineColor: 0xffff00,
        highLineWidth: 2,
        highDotColor: 0xffff00,
        highDotRadius: 0.03,
        highLabelOrientation: 'CAMERA',
        // NEW: FRONT | BACK | LEFT | RIGHT | CAMERA

        // ===== STATUS LED OPTIONS =====
        ledEnabled: false,
        ledRadius: 0.04,
        ledHeight: 0.04,
        //ledOffset = { x: 0.6 / 2 - 0.06, y: -42 / 2 + 0.12, z: 1.0 / 2 + 0.01 },
        ledOffset: { x: 0.2, y: -0.6, z: 0.46 },

        healthyColor: 0x10ee00,
        warningColor: 0xffff00,
        alarmColor: 0xff0000,
        runColor: 0x0000ff,
        customColor: 0xffffff,
        ledState: 'HEALTHY',
        // HEALTHY | WARNING | ALARM | RUN | CUSTOM
        ledBlinkPeriod: 1,
        // seconds

        // ===== GENERAL DEVICE PROPERTIES FOR LIVE DATA =====
        deviceId: null,
        category: 'IT',
        urlLink: null,
        NBSrvIP: null,
        NBAPI: null,
        NBRackID: null,
        zbxSrvIP: null,
        zbxAPI: null,
        zbxHost: null
        //NBFront_ = '',
        //NBRear_ = ''
});
serverrack14.position.set(-2.8, 1, 3.04);


// --- AUTO-GENERATED: serverrack15 from serverrack.js ---
const serverrack15 = createServerRack(masterGroup, {
// rack dimensions
        deviceWidth: 0.6,
        deviceHeight: 42,
        deviceDepth: 1.2,
        devicePosition: { x: -2.8, y: 1, z: 2.42 },

        // Convert U to real-world height (1U = 44.45mm = 0.04445m)
        //deviceUHeight = deviceHeight * 0.04445,

        // Camera Position
        camPosition: { x: 0, y: 0.6, z: 0.46 },

        // rack properties
        deviceColor: 0x4A5568,
        deviceoutlineColor: 0x000000,

        // ORIENTATION
        orientation: 'Left',

        // FACE TEXTURES (optional)
        faceTextures: {
            front: '/static/js/device_library/textures/serverrack15_front.png',
            back: '/static/js/device_library/textures/serverrack15_back.png'
        },

        // label text properties (front label on door)
        text: 'Rack-15',
        textPosition: { x: 0, y: 1, z: 0.46 },
        textColor: 0xffffff,
        textSize: 0.1,
        textFont: 'Arial',
        textCanvasBgColor: 0x000000,
        textbgSize: { width: 0.5, height: 0.15 },

        // screen properties
        screenEnabled: false,
        screenPosition: { x: 0, y: 0.27, z: 0.56 },
        screenSize: { width: 0.5, height: 0.4 },
        screenColor: 0x00FF00,
        screenoutlineColor: 0x000000,

        // stand properties
        standHeight: 0.1,
        standColor: 0x333333,

        // ===== HIGH RAISED LABEL OPTIONS =====
        highLabelEnabled: false,
        highText: null,
        highTextPosition: { x: 0, y: 3.5, z: 1.0 / 2 + 0.05 },
        highTextbgSize: { width: 0.9, height: 0.25 },
        highTextSize: 0.16,
        highTextColor: 0xffffff,
        highTextCanvasBgColor: 0x222222,
        highLineColor: 0xffff00,
        highLineWidth: 2,
        highDotColor: 0xffff00,
        highDotRadius: 0.03,
        highLabelOrientation: 'CAMERA',
        // NEW: FRONT | BACK | LEFT | RIGHT | CAMERA

        // ===== STATUS LED OPTIONS =====
        ledEnabled: false,
        ledRadius: 0.04,
        ledHeight: 0.04,
        //ledOffset = { x: 0.6 / 2 - 0.06, y: -42 / 2 + 0.12, z: 1.0 / 2 + 0.01 },
        ledOffset: { x: 0.2, y: -0.6, z: 0.46 },

        healthyColor: 0x10ee00,
        warningColor: 0xffff00,
        alarmColor: 0xff0000,
        runColor: 0x0000ff,
        customColor: 0xffffff,
        ledState: 'HEALTHY',
        // HEALTHY | WARNING | ALARM | RUN | CUSTOM
        ledBlinkPeriod: 1,
        // seconds

        // ===== GENERAL DEVICE PROPERTIES FOR LIVE DATA =====
        deviceId: null,
        category: 'IT',
        urlLink: null,
        NBSrvIP: null,
        NBAPI: null,
        NBRackID: null,
        zbxSrvIP: null,
        zbxAPI: null,
        zbxHost: null
        //NBFront_ = '',
        //NBRear_ = ''
});
serverrack15.position.set(-2.8, 1, 2.42);


// --- AUTO-GENERATED: serverrack16 from serverrack.js ---
const serverrack16 = createServerRack(masterGroup, {
// rack dimensions
        deviceWidth: 0.8,
        deviceHeight: 42,
        deviceDepth: 1.2,
        devicePosition: { x: -2.8, y: 1, z: 1.7 },

        // Convert U to real-world height (1U = 44.45mm = 0.04445m)
        //deviceUHeight = deviceHeight * 0.04445,

        // Camera Position
        camPosition: { x: 0, y: 0.6, z: 0.46 },

        // rack properties
        deviceColor: 0x4A5568,
        deviceoutlineColor: 0x000000,

        // ORIENTATION
        orientation: 'Left',

        // FACE TEXTURES (optional)
        faceTextures: {
            front: '/static/js/device_library/textures/serverrack16_front.png',
            back: '/static/js/device_library/textures/serverrack16_back.png'
        },

        // label text properties (front label on door)
        text: 'Rack-16',
        textPosition: { x: 0, y: 1, z: 0.46 },
        textColor: 0xffffff,
        textSize: 0.1,
        textFont: 'Arial',
        textCanvasBgColor: 0x000000,
        textbgSize: { width: 0.5, height: 0.15 },

        // screen properties
        screenEnabled: false,
        screenPosition: { x: 0, y: 0.27, z: 0.56 },
        screenSize: { width: 0.5, height: 0.4 },
        screenColor: 0x00FF00,
        screenoutlineColor: 0x000000,

        // stand properties
        standHeight: 0.1,
        standColor: 0x333333,

        // ===== HIGH RAISED LABEL OPTIONS =====
        highLabelEnabled: false,
        highText: null,
        highTextPosition: { x: 0, y: 3.5, z: 1.0 / 2 + 0.05 },
        highTextbgSize: { width: 0.9, height: 0.25 },
        highTextSize: 0.16,
        highTextColor: 0xffffff,
        highTextCanvasBgColor: 0x222222,
        highLineColor: 0xffff00,
        highLineWidth: 2,
        highDotColor: 0xffff00,
        highDotRadius: 0.03,
        highLabelOrientation: 'CAMERA',
        // NEW: FRONT | BACK | LEFT | RIGHT | CAMERA

        // ===== STATUS LED OPTIONS =====
        ledEnabled: false,
        ledRadius: 0.04,
        ledHeight: 0.04,
        //ledOffset = { x: 0.6 / 2 - 0.06, y: -42 / 2 + 0.12, z: 1.0 / 2 + 0.01 },
        ledOffset: { x: 0.2, y: -0.6, z: 0.46 },

        healthyColor: 0x10ee00,
        warningColor: 0xffff00,
        alarmColor: 0xff0000,
        runColor: 0x0000ff,
        customColor: 0xffffff,
        ledState: 'HEALTHY',
        // HEALTHY | WARNING | ALARM | RUN | CUSTOM
        ledBlinkPeriod: 1,
        // seconds

        // ===== GENERAL DEVICE PROPERTIES FOR LIVE DATA =====
        deviceId: null,
        category: 'IT',
        urlLink: null,
        NBSrvIP: null,
        NBAPI: null,
        NBRackID: null,
        zbxSrvIP: null,
        zbxAPI: null,
        zbxHost: null
        //NBFront_ = '',
        //NBRear_ = ''
});
serverrack16.position.set(-2.8, 1, 1.7);


// --- AUTO-GENERATED: serverrack17 from serverrack.js ---
const serverrack17 = createServerRack(masterGroup, {
// rack dimensions
        deviceWidth: 0.5,
        deviceHeight: 42,
        deviceDepth: 0.7,
        devicePosition: { x: -2.55, y: 1, z: 1.03 },

        // Convert U to real-world height (1U = 44.45mm = 0.04445m)
        //deviceUHeight = deviceHeight * 0.04445,

        // Camera Position
        camPosition: { x: 0, y: 0.6, z: 0.46 },

        // rack properties
        deviceColor: 0x4A5568,
        deviceoutlineColor: 0x000000,

        // ORIENTATION
        orientation: 'Left',

        // FACE TEXTURES (optional)
        faceTextures: {
            front: '/static/js/device_library/textures/serverrack17_front.png',
            back: '/static/js/device_library/textures/serverrack17_back.png'
        },

        // label text properties (front label on door)
        text: 'UtilityRack',
        textPosition: { x: 0, y: 1, z: 0.2 },
        textColor: 0xffffff,
        textSize: 0.1,
        textFont: 'Arial',
        textCanvasBgColor: 0x000000,
        textbgSize: { width: 0.5, height: 0.15 },

        // screen properties
        screenEnabled: false,
        screenPosition: { x: 0, y: 0.27, z: 0.56 },
        screenSize: { width: 0.5, height: 0.4 },
        screenColor: 0x00FF00,
        screenoutlineColor: 0x000000,

        // stand properties
        standHeight: 0.1,
        standColor: 0x333333,

        // ===== HIGH RAISED LABEL OPTIONS =====
        highLabelEnabled: false,
        highText: null,
        highTextPosition: { x: 0, y: 3.5, z: 1.0 / 2 + 0.05 },
        highTextbgSize: { width: 0.9, height: 0.25 },
        highTextSize: 0.16,
        highTextColor: 0xffffff,
        highTextCanvasBgColor: 0x222222,
        highLineColor: 0xffff00,
        highLineWidth: 2,
        highDotColor: 0xffff00,
        highDotRadius: 0.03,
        highLabelOrientation: 'CAMERA',
        // NEW: FRONT | BACK | LEFT | RIGHT | CAMERA

        // ===== STATUS LED OPTIONS =====
        ledEnabled: false,
        ledRadius: 0.04,
        ledHeight: 0.04,
        //ledOffset = { x: 0.6 / 2 - 0.06, y: -42 / 2 + 0.12, z: 1.0 / 2 + 0.01 },
        ledOffset: { x: 0.2, y: -0.6, z: 0.46 },

        healthyColor: 0x10ee00,
        warningColor: 0xffff00,
        alarmColor: 0xff0000,
        runColor: 0x0000ff,
        customColor: 0xffffff,
        ledState: 'HEALTHY',
        // HEALTHY | WARNING | ALARM | RUN | CUSTOM
        ledBlinkPeriod: 1,
        // seconds

        // ===== GENERAL DEVICE PROPERTIES FOR LIVE DATA =====
        deviceId: null,
        category: 'IT',
        urlLink: null,
        NBSrvIP: null,
        NBAPI: null,
        NBRackID: null,
        zbxSrvIP: null,
        zbxAPI: null,
        zbxHost: null
        //NBFront_ = '',
        //NBRear_ = ''
});
serverrack17.position.set(-2.55, 1, 1.03);

}