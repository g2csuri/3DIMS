// static/js/main_layout/containerTemplate.js

function ups_room() {
    // ✅ MASTER GROUP - everything lives here
    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    // --- CONTAINER ---
    const container = createRoom(masterGroup, {  // Pass masterGroup instead of scene
        roomType: 'room',
        deviceWidth: 0.1,
        deviceHeight: 2.5,
        deviceDepth: 10,
        devicePosition: { x: 2, y: 0, z: 0 },
        orientation: 'Back',
        camPosition: { x: 0, y: 0.6, z: 0.46 },

        faceTextures: {
            front: 'none',
            back: 'none',
            right: 'none',
            left: 'none'
        },

        standHeight: 0.3,
        standColor: 0x666666,
        floorTileSize: 5,
        floorTileColor: 0xFFFFFF,
        floorTileLineColor: 0x000000,
        floorTileLineWidth: 0.02,
        ceilingTileSize: 5,
        ceilingTileColor: 0xFFFFFF,
        ceilingTileLineColor: 0x000000,
        ceilingTileLineWidth: 0.02,

        text: 'UPS Room',
        labelOrientation: 'Front',
        textPosition: { x: 2.6, y: 2.14, z: -4.95 },
        textColor: 0xffffff,
        textSize: 0.3,
        textFont: 'Arial',
        textCanvasBgColor: 0x222222,
        textbgSize: { width: 2.4, height: 0.3 }


    });
    // No need for container.position.set() - it's auto-parented

    masterGroup.position.set(2, 0, 0);     // Move everything
    // masterGroup.rotation.y = Math.PI / 4;  // Rotate everything  
    // masterGroup.scale.set(0.8, 0.8, 0.8);  // Scale everything


// --- AUTO-GENERATED: door1 from door.js ---
const door1 = createDoor(masterGroup, {
// Main Dimensions
        deviceWidth: 0.9,
        deviceHeight: 1.9,
        deviceDepth: 0.08,
        devicePosition: { x: 0.6, y: 0.95, z: -1 },

        // Outer Frame Dimension
        outerFrameWidth: 0.1, // Controlled by this single dimension

        // Glass Dimensions
        glassWidth: 0.4,
        glassHeight: 1.2,
        glassPosition: { x: 0, y: 0, z: 0 },

        // Colors & Aesthetics
        deviceColor: 0xd1d5db,
        deviceoutlineColor: 0x000000,
        handleColor: 0xcccccc,
        glassColor: 0x88ccff,
        glassOpacity: 0.3,

        // Logic
        orientation: 'Front',
        doorType: 'Single',
});
door1.position.set(0.6, 0.95, -1);




// --- AUTO-GENERATED: splitac1 from splitac.js ---
const splitac1 = createIndoorAC(masterGroup, {
// Main Dimensions (Standard AC size approx 1m wide)
        deviceWidth: 1,
        deviceHeight: 0.3,
        deviceDepth: 0.22,
        devicePosition: { x: 0.17, y: 2.2, z: -2 }, // Usually mounted high

        // Colors & Aesthetics
        deviceColor: 0x222222, // Standard AC white
        deviceoutlineColor: 0x000000,
        grillColor: 0xeeeeee,
        displayColor: 0x00ff00, // LED Green

        // FACE TEXTURES (optional override for all 6 faces)
        faceTextures: {
            front: '/static/js/device_library/textures/splitac1_front.png',
            back: '',
            left: '',
            right: '',
            top: '',
            bottom: ''
        },

        // Logic
        orientation: 'Left',
        louverAngle: 45, // Angle of the air flap

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
splitac1.position.set(0.17, 2.2, -2);


// --- AUTO-GENERATED: splitac2 from splitac.js ---
const splitac2 = createIndoorAC(masterGroup, {
// Main Dimensions
        deviceWidth: 1,
        deviceHeight: 0.3,
        deviceDepth: 0.22,
        devicePosition: { x: 0.17, y: 2.2, z: -4 },

        // Projection / Profile Contour Depths
        frontSlopeDepth: 0.05, // Depth projection at peak relative to top/bottom edges

        // Colors & Aesthetics
        deviceColor: 0x222222,
        deviceoutlineColor: 0x000000,

        // FACE TEXTURES
        faceTextures: {
            front: '/static/js/device_library/textures/splitac2_front.png',
            back: '',
            left: '',
            right: '',
            top: '',
            bottom: ''
        },

        // Logic
        orientation: 'Left',

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
splitac2.position.set(0.17, 2.2, -4);


// --- AUTO-GENERATED: ups1 from ups.js ---
const ups1 = createUPS(masterGroup, {
// UPS dimensions
        deviceWidth: 0.35,
        deviceHeight: 0.9,
        deviceDepth: 0.7,
        devicePosition: { x: 1.7, y: 0.5, z: -3 },

        // Camera Position
        camPosition: { x: 0, y: 0.6, z: 0.46 },

        // UPS properties
        deviceColor: 0x222222,
        deviceoutlineColor: 0x000000,

        // ORIENTATION
        orientation: 'Front',

        // FACE TEXTURES (optional)
        faceTextures: {
            front: '/static/js/device_library/textures/ups1_front.png',
            back: '/static/js/device_library/textures/ups1_back.png'
        },

        // label text properties (front label on door)
        text: 'UPS-1',
        textPosition: { x: 0, y: 0.5, z: 0.36 },
        textColor: 0xffffff,
        textSize: 0.08,
        textFont: 'Arial',
        textCanvasBgColor: 0x222222,
        textbgSize: { width: 0.3, height: 0.1 },

        // screen properties
        screenEnabled: false,  // Default: disabled
        screenPosition: { x: 0, y: 0.27, z: 0.46 },
        screenSize: { width: 0.5, height: 0.4 },
        screenColor: 0x00FF00,
        screenoutlineColor: 0x000000,

        // stand properties
        standHeight: 0.05,
        standColor: 0x333333,

        // ===== HIGH RAISED LABEL OPTIONS =====
        highLabelEnabled: false,
        highText: null,
        highTextPosition: { x: 0, y: 3.5, z: 0.9 / 2 + 0.05 },
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
        //ledOffset = { x: 0.6 / 2 - 0.06, y: -1.5 / 2 + 0.12, z: 0.9 / 2 + 0.01 },
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
        category: 'electrical',
        urlLink: null,
        zbxSrvIP: null,
        zbxAPI: null,
        zbxHost: null,
        zbxHostKeys: [],
        zbxHostKeyValues: []
});
ups1.position.set(1.7, 0.5, -3);


// --- AUTO-GENERATED: ups2 from ups.js ---
const ups2 = createUPS(masterGroup, {
// UPS dimensions
        deviceWidth: 0.35,
        deviceHeight: 0.9,
        deviceDepth: 0.7,
        devicePosition: { x: 2.07, y: 0.5, z: -3 },

        // Camera Position
        camPosition: { x: 0, y: 0.6, z: 0.46 },

        // UPS properties
        deviceColor: 0x222222,
        deviceoutlineColor: 0x000000,

        // ORIENTATION
        orientation: 'Front',

        // FACE TEXTURES (optional)
        faceTextures: {
            front: '/static/js/device_library/textures/ups2_front.png',
            back: '/static/js/device_library/textures/ups2_back.png'
        },

        // label text properties (front label on door)
        text: 'UPS-2',
        textPosition: { x: 0, y: 0.5, z: 0.36 },
        textColor: 0xffffff,
        textSize: 0.08,
        textFont: 'Arial',
        textCanvasBgColor: 0x222222,
        textbgSize: { width: 0.3, height: 0.1 },

        // screen properties
        screenEnabled: false,  // Default: disabled
        screenPosition: { x: 0, y: 0.27, z: 0.46 },
        screenSize: { width: 0.5, height: 0.4 },
        screenColor: 0x00FF00,
        screenoutlineColor: 0x000000,

        // stand properties
        standHeight: 0.05,
        standColor: 0x333333,

        // ===== HIGH RAISED LABEL OPTIONS =====
        highLabelEnabled: false,
        highText: null,
        highTextPosition: { x: 0, y: 3.5, z: 0.9 / 2 + 0.05 },
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
        //ledOffset = { x: 0.6 / 2 - 0.06, y: -1.5 / 2 + 0.12, z: 0.9 / 2 + 0.01 },
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
        category: 'electrical',
        urlLink: null,
        zbxSrvIP: null,
        zbxAPI: null,
        zbxHost: null,
        zbxHostKeys: [],
        zbxHostKeyValues: []
});
ups2.position.set(2.07, 0.5, -3);


// --- AUTO-GENERATED: electricalpanel1 from electricalpanel.js ---
const electricalpanel1 = createElectricalpanel(masterGroup, {
// EP dimensions
        deviceWidth: 1.1,
        deviceHeight: 1.7,
        deviceDepth: 0.2,
        devicePosition: { x: 0.7, y: 0.9, z: -4.88 },

        // Camera Position
        camPosition: { x: 0, y: 0.6, z: 0.46 },

        // EP properties
        deviceColor: 0xF0DD92,
        deviceoutlineColor: 0x000000,

        // ORIENTATION
        orientation: 'Front',

        // FACE TEXTURES (optional)
        faceTextures: {
            front: '/static/js/device_library/textures/electricalpanel1_front.png',
            back: '/static/js/device_library/textures/EP_front.png'
        },

        // label text properties (front label on door)
        text: 'UPS O/P A',
        textPosition: { x: 0, y: 0.9, z: 0.12 },
        textColor: 0xffffff,
        textSize: 0.08,
        textFont: 'Arial',
        textCanvasBgColor: 0x222222,
        textbgSize: { width: 0.6, height: 0.08 },

        // screen properties
        screenEnabled: false,  // Default: disabled
        screenPosition: { x: 0, y: 0.27, z: 0.12 },
        screenSize: { width: 0.5, height: 0.4 },
        screenColor: 0x00FF00,
        screenoutlineColor: 0x000000,

        // stand properties
        standHeight: 0.05,
        standColor: 0x333333,

        // ===== HIGH RAISED LABEL OPTIONS =====
        highLabelEnabled: false,
        highText: null,
        highTextPosition: { x: 0, y: 3.5, z: 0.20 / 2 + 0.05 },
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
        //ledOffset = { x: 1.6 / 2 - 0.06, y: -1.5 / 2 + 0.12, z: 0.20 / 2 + 0.01 },
        ledOffset: { x: 0.6, y: 0.4, z: 0.12 },

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
        category: 'electrical',
        urlLink: null,
        zbxSrvIP: null,
        zbxAPI: null,
        zbxHost: null,
        zbxHostKeys: [],
        zbxHostKeyValues: []
});
electricalpanel1.position.set(0.7, 0.9, -4.88);


// --- AUTO-GENERATED: electricalpanel2 from electricalpanel.js ---
const electricalpanel2 = createElectricalpanel(masterGroup, {
// EP dimensions
        deviceWidth: 1.1,
        deviceHeight: 1.7,
        deviceDepth: 0.2,
        devicePosition: { x: 1.85, y: 0.9, z: -4.88 },

        // Camera Position
        camPosition: { x: 0, y: 0.6, z: 0.46 },

        // EP properties
        deviceColor: 0xF0DD92,
        deviceoutlineColor: 0x000000,

        // ORIENTATION
        orientation: 'Front',

        // FACE TEXTURES (optional)
        faceTextures: {
            front: '/static/js/device_library/textures/electricalpanel2_front.png',
            back: '/static/js/device_library/textures/EP_front.png'
        },

        // label text properties (front label on door)
        text: 'UPS O/P B',
        textPosition: { x: 0, y: 0.9, z: 0.12 },
        textColor: 0xffffff,
        textSize: 0.08,
        textFont: 'Arial',
        textCanvasBgColor: 0x222222,
        textbgSize: { width: 0.6, height: 0.08 },

        // screen properties
        screenEnabled: false,  // Default: disabled
        screenPosition: { x: 0, y: 0.27, z: 0.12 },
        screenSize: { width: 0.5, height: 0.4 },
        screenColor: 0x00FF00,
        screenoutlineColor: 0x000000,

        // stand properties
        standHeight: 0.05,
        standColor: 0x333333,

        // ===== HIGH RAISED LABEL OPTIONS =====
        highLabelEnabled: false,
        highText: null,
        highTextPosition: { x: 0, y: 3.5, z: 0.20 / 2 + 0.05 },
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
        //ledOffset = { x: 1.6 / 2 - 0.06, y: -1.5 / 2 + 0.12, z: 0.20 / 2 + 0.01 },
        ledOffset: { x: 0.6, y: 0.4, z: 0.12 },

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
        category: 'electrical',
        urlLink: null,
        zbxSrvIP: null,
        zbxAPI: null,
        zbxHost: null,
        zbxHostKeys: [],
        zbxHostKeyValues: []
});
electricalpanel2.position.set(1.85, 0.9, -4.88);


// --- AUTO-GENERATED: electricalpanel3 from electricalpanel.js ---
const electricalpanel3 = createElectricalpanel(masterGroup, {
// EP dimensions
        deviceWidth: 1.6,
        deviceHeight: 1.8,
        deviceDepth: 0.4,
        devicePosition: { x: 3.86, y: 0.95, z: -3.5 },

        // Camera Position
        camPosition: { x: 0, y: 0.6, z: 0.46 },

        // EP properties
        deviceColor: 0xF0DD92,
        deviceoutlineColor: 0x000000,

        // ORIENTATION
        orientation: 'Right',

        // FACE TEXTURES (optional)
        faceTextures: {
            front: '/static/js/device_library/textures/electricalpanel3_front.png',
            back: '/static/js/device_library/textures/EP_front.png'
        },

        // label text properties (front label on door)
        text: 'Main Panel A',
        textPosition: { x: 0, y: 0.95, z: 0.12 },
        textColor: 0xffffff,
        textSize: 0.08,
        textFont: 'Arial',
        textCanvasBgColor: 0x222222,
        textbgSize: { width: 0.9, height: 0.12 },

        // screen properties
        screenEnabled: false,  // Default: disabled
        screenPosition: { x: 0, y: 0.27, z: 0.12 },
        screenSize: { width: 0.5, height: 0.4 },
        screenColor: 0x00FF00,
        screenoutlineColor: 0x000000,

        // stand properties
        standHeight: 0.05,
        standColor: 0x333333,

        // ===== HIGH RAISED LABEL OPTIONS =====
        highLabelEnabled: false,
        highText: null,
        highTextPosition: { x: 0, y: 3.5, z: 0.20 / 2 + 0.05 },
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
        //ledOffset = { x: 1.6 / 2 - 0.06, y: -1.5 / 2 + 0.12, z: 0.20 / 2 + 0.01 },
        ledOffset: { x: 0.6, y: 0.4, z: 0.12 },

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
        category: 'electrical',
        urlLink: null,
        zbxSrvIP: null,
        zbxAPI: null,
        zbxHost: null,
        zbxHostKeys: [],
        zbxHostKeyValues: []
});
electricalpanel3.position.set(3.86, 0.95, -3.5);


// --- AUTO-GENERATED: electricalpanel4 from electricalpanel.js ---
const electricalpanel4 = createElectricalpanel(masterGroup, {
// EP dimensions
        deviceWidth: 1.6,
        deviceHeight: 1.8,
        deviceDepth: 0.4,
        devicePosition: { x: 3.86, y: 0.95, z: -1.86 },

        // Camera Position
        camPosition: { x: 0, y: 0.6, z: 0.46 },

        // EP properties
        deviceColor: 0xF0DD92,
        deviceoutlineColor: 0x000000,

        // ORIENTATION
        orientation: 'Right',

        // FACE TEXTURES (optional)
        faceTextures: {
            front: '/static/js/device_library/textures/electricalpanel4_front.png',
            back: '/static/js/device_library/textures/EP_front.png'
        },

        // label text properties (front label on door)
        text: 'Main Panel B',
        textPosition: { x: 0, y: 0.95, z: 0.12 },
        textColor: 0xffffff,
        textSize: 0.08,
        textFont: 'Arial',
        textCanvasBgColor: 0x222222,
        textbgSize: { width: 0.9, height: 0.12 },

        // screen properties
        screenEnabled: false,  // Default: disabled
        screenPosition: { x: 0, y: 0.27, z: 0.12 },
        screenSize: { width: 0.5, height: 0.4 },
        screenColor: 0x00FF00,
        screenoutlineColor: 0x000000,

        // stand properties
        standHeight: 0.05,
        standColor: 0x333333,

        // ===== HIGH RAISED LABEL OPTIONS =====
        highLabelEnabled: false,
        highText: null,
        highTextPosition: { x: 0, y: 3.5, z: 0.20 / 2 + 0.05 },
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
        //ledOffset = { x: 1.6 / 2 - 0.06, y: -1.5 / 2 + 0.12, z: 0.20 / 2 + 0.01 },
        ledOffset: { x: 0.6, y: 0.4, z: 0.12 },

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
        category: 'electrical',
        urlLink: null,
        zbxSrvIP: null,
        zbxAPI: null,
        zbxHost: null,
        zbxHostKeys: [],
        zbxHostKeyValues: []
});
electricalpanel4.position.set(3.86, 0.95, -1.86);

}