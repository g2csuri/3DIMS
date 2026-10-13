// static/js/main_layout/containerTemplate.js

function bms_room() {
    // ✅ MASTER GROUP - everything lives here
    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    // --- CONTAINER ---
    const container = createRoom(masterGroup, {  // Pass masterGroup instead of scene
        roomType: 'room',
        deviceWidth: 3.89,
        deviceHeight: 2.5,
        deviceDepth: 0.1,
        devicePosition: { x: 4, y: 0, z: -1 },
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
        floorTileSize: 5,
        floorTileColor: 0xFFFFFF,
        floorTileLineColor: 0x000000,
        floorTileLineWidth: 0.02,
        ceilingTileSize: 5,
        ceilingTileColor: 0xFFFFFF,
        ceilingTileLineColor: 0x000000,
        ceilingTileLineWidth: 0.02,

        text: 'BMS Room',
        labelOrientation: 'Front',
        textPosition: { x: 0.55, y: 2.13, z: 0 },
        textColor: 0xffffff,
        textSize: 0.3,
        textFont: 'Arial',
        textCanvasBgColor: 0x222222,
        textbgSize: { width: 2.4, height: 0.3 }


    });
    // No need for container.position.set() - it's auto-parented

    masterGroup.position.set(4, 0, -1);     // Move everything
    // masterGroup.rotation.y = Math.PI / 4;  // Rotate everything  
    // masterGroup.scale.set(0.8, 0.8, 0.8);  // Scale everything


// --- AUTO-GENERATED: door1 from door.js ---
const door1 = createDoor(masterGroup, {
// Main Dimensions
        deviceWidth: 1.3,
        deviceHeight: 1.9,
        deviceDepth: 0.08,
        devicePosition: { x: -2, y: 0.95, z: 3 },

        // Outer Frame Dimension
        outerFrameWidth: 0.1, // Controlled by this single dimension

        // Glass Dimensions
        glassWidth: 0.2,
        glassHeight: 1.2,
        glassPosition: { x: 0, y: 0, z: 0 },

        // Colors & Aesthetics
        deviceColor: 0xd1d5db,
        deviceoutlineColor: 0x000000,
        handleColor: 0xcccccc,
        glassColor: 0x88ccff,
        glassOpacity: 0.3,

        // Logic
        orientation: 'Left',
        doorType: 'Double',
});
door1.position.set(-2, 0.95, 3);


// --- AUTO-GENERATED: door2 from door.js ---
const door2 = createDoor(masterGroup, {
// Main Dimensions
        deviceWidth: 1.3,
        deviceHeight: 1.9,
        deviceDepth: 0.08,
        devicePosition: { x: 1.97, y: 0.95, z: 3 },

        // Outer Frame Dimension
        outerFrameWidth: 0.1, // Controlled by this single dimension

        // Glass Dimensions
        glassWidth: 0.2,
        glassHeight: 1.2,
        glassPosition: { x: 0, y: 0, z: 0 },

        // Colors & Aesthetics
        deviceColor: 0xd1d5db,
        deviceoutlineColor: 0x000000,
        handleColor: 0xcccccc,
        glassColor: 0x88ccff,
        glassOpacity: 0.3,

        // Logic
        orientation: 'Left',
        doorType: 'Double',
});
door2.position.set(1.97, 0.95, 3);


// --- AUTO-GENERATED: gasreleasecylinder1 from gasreleasecylinder.js ---
const gasreleasecylinder1 = createGasReleaseCylinder(masterGroup, {
// CYLINDER dimensions
        deviceRadius: 0.15,
        deviceHeight: 1.2,
        devicePosition: { x: 1.7, y: 0.75, z: 5.66 },

        // Camera Position
        camPosition: { x: 0, y: 0.45, z: 0.46 },

        // CYLINDER properties (plain color, no metallic)
        deviceColor: 0xFF0000,
        deviceoutlineColor: 0x000000,

        // ORIENTATION
        orientation: 'Back',

        // LABEL text properties
        text: 'GasRelease 1',
        textPosition: { x: 0, y: 1, z: -0.16 },
        textColor: 0xffffff,
        textSize: 0.08,
        textFont: 'Arial',
        textCanvasBgColor: 0x111111,
        textbgSize: { width: 0.7, height: 0.22 },

        // DOME (top cap) properties
        domeRadius: 0.15,
        domeHeight: 0.18,
        domeColor: 0xFF0000,
        domePosition: { x: 0, y: 0, z: 0 },

        // KNOB properties
        knobRadius: 0.07,
        knobHeight: 0.16,
        knobColor: 0x000000,
        knobPosition: { x: 0, y: 0.2, z: 0 },

        // GAUGE properties
        gaugeRadius: 0.08,
        gaugeThickness: 0.02,
        gaugeColor: 0x333333,
        gaugeGlassColor: 0x333333,
        gaugeNeedleColor: 0xFF0000,
        gaugePosition: { x: 0.13, y: 0.25, z: -0.04 },

        // STAND properties
        standRadius: 0.15,
        standHeight: 0.16,
        standColor: 0x444444,

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
gasreleasecylinder1.position.set(1.7, 0.75, 5.66);


// --- AUTO-GENERATED: gasreleasecylinder2 from gasreleasecylinder.js ---
const gasreleasecylinder2 = createGasReleaseCylinder(masterGroup, {
// CYLINDER dimensions
        deviceRadius: 0.15,
        deviceHeight: 1.2,
        devicePosition: { x: 1.1, y: 0.75, z: 5.66 },

        // Camera Position
        camPosition: { x: 0, y: 0.6, z: 0.46 },

        // CYLINDER properties (plain color, no metallic)
        deviceColor: 0xFF0000,
        deviceoutlineColor: 0x000000,

        // ORIENTATION
        orientation: 'Back',

        // LABEL text properties
        text: 'GasRelease2',
        textPosition: { x: 0, y: 1, z: -0.16 },
        textColor: 0xffffff,
        textSize: 0.08,
        textFont: 'Arial',
        textCanvasBgColor: 0x111111,
        textbgSize: { width: 0.7, height: 0.22 },

        // DOME (top cap) properties
        domeRadius: 0.15,
        domeHeight: 0.18,
        domeColor: 0xFF0000,
        domePosition: { x: 0, y: 0, z: 0 },

        // KNOB properties
        knobRadius: 0.07,
        knobHeight: 0.16,
        knobColor: 0x000000,
        knobPosition: { x: 0, y: 0.2, z: 0 },

        // GAUGE properties
        gaugeRadius: 0.08,
        gaugeThickness: 0.02,
        gaugeColor: 0x333333,
        gaugeGlassColor: 0x333333,
        gaugeNeedleColor: 0xFF0000,
        gaugePosition: { x: 0.13, y: 0.25, z: -0.04 },

        // STAND properties
        standRadius: 0.15,
        standHeight: 0.16,
        standColor: 0x444444,

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
gasreleasecylinder2.position.set(1.1, 0.75, 5.66);


// --- AUTO-GENERATED: firealarmpanel1 from firealarmpanel.js ---
const firealarmpanel1 = createfirealarmpanel(masterGroup, {
// FAS dimensions
        deviceWidth: 0.5,
        deviceHeight: 0.8,
        deviceDepth: 0.1,
        devicePosition: { x: -0.7, y: 1.1, z: 5.93 },

        // Camera Position
        camPosition: { x: 0, y: 0.6, z: 0.46 },

        // FAS properties
        deviceColor: 0xFF0000,
        deviceoutlineColor: 0x000000,

        // ORIENTATION
        orientation: 'Back',

        // FACE TEXTURES - NEW! (optional)
        faceTextures: {
            front: '/static/js/device_library/textures/firealarmpanel1_front.png',
            back: '/static/js/device_library/textures/FAS_front.png'
            //left: '/static/textures/FAS_side.png',
            //right: '/static/textures/FAS_side.png'
        },

        // label text properties
        text: 'FireAlarm',
        textPosition: { x: 0, y: 0.5, z: -0.05 },
        textColor: 0xffffff,
        textSize: 0.08,
        textFont: 'Arial',
        textCanvasBgColor: 0x000000,
        textbgSize: { width: 0.5, height: 0.12 },

        // screen properties
        screenEnabled: false,
        screenPosition: { x: 0, y: 0.27, z: 0.11 },
        screenSize: { width: 0.5, height: 0.25 },
        screenColor: 0x00FF00,
        screenoutlineColor: 0x000000,

        // stand properties
        standHeight: 0,
        standColor: 0x333333,

        // ===== HIGH RAISED LABEL OPTIONS =====
        highLabelEnabled: false,
        highText: null,
        highTextPosition: { x: 0, y: 3.5, z: 0.1 / 2 + 0.05 },
        highTextbgSize: { width: 0.9, height: 0.25 },
        highTextSize: 0.16,
        highTextColor: 0xffffff,
        highTextCanvasBgColor: 0x222222,
        highLineColor: 0xffff00,
        highLineWidth: 2,
        highDotColor: 0xffff00,
        highDotRadius: 0.03,
        highLabelOrientation: 'CAMERA',
        // FRONT | BACK | LEFT | RIGHT | CAMERA

        // ===== STATUS LED OPTIONS =====
        ledEnabled: false,
        ledRadius: 0.04,
        ledHeight: 0.04,
        //ledOffset = { x: 0.5 / 2 - 0.06, y: -0.8 / 2 + 0.12, z: 0.1 / 2 + 0.01 },
        ledOffset: { x: 0.19, y: -0.4, z: 0.12 },

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
firealarmpanel1.position.set(-0.7, 1.1, 5.93);


// --- AUTO-GENERATED: firealarmpanel2 from firealarmpanel.js ---
const firealarmpanel2 = createfirealarmpanel(masterGroup, {
// FAS dimensions
        deviceWidth: 0.3,
        deviceHeight: 0.3,
        deviceDepth: 0.1,
        devicePosition: { x: -1.2, y: 0.85, z: 5.93 },

        // Camera Position
        camPosition: { x: 0, y: 0.6, z: 0.46 },

        // FAS properties
        deviceColor: 0xFF0000,
        deviceoutlineColor: 0x000000,

        // ORIENTATION
        orientation: 'Back',

        // FACE TEXTURES - NEW! (optional)
        faceTextures: {
            front: '/static/js/device_library/textures/firealarmpanel2_front.png',
            back: '/static/js/device_library/textures/FAS_front.png'
            //left: '/static/textures/FAS_side.png',
            //right: '/static/textures/FAS_side.png'
        },

        // label text properties
        text: 'FireAlarm',
        textPosition: { x: 0, y: 0, z: -0.05 },
        textColor: 0xffffff,
        textSize: 0.1,
        textFont: 'Arial',
        textCanvasBgColor: 0x000000,
        textbgSize: { width: 0.2, height: 0.08 },

        // screen properties
        screenEnabled: false,
        screenPosition: { x: 0, y: 0.27, z: 0.11 },
        screenSize: { width: 0.5, height: 0.25 },
        screenColor: 0x00FF00,
        screenoutlineColor: 0x000000,

        // stand properties
        standHeight: 0,
        standColor: 0x333333,

        // ===== HIGH RAISED LABEL OPTIONS =====
        highLabelEnabled: false,
        highText: null,
        highTextPosition: { x: 0, y: 3.5, z: 0.1 / 2 + 0.05 },
        highTextbgSize: { width: 0.9, height: 0.25 },
        highTextSize: 0.16,
        highTextColor: 0xffffff,
        highTextCanvasBgColor: 0x222222,
        highLineColor: 0xffff00,
        highLineWidth: 2,
        highDotColor: 0xffff00,
        highDotRadius: 0.03,
        highLabelOrientation: 'CAMERA',
        // FRONT | BACK | LEFT | RIGHT | CAMERA

        // ===== STATUS LED OPTIONS =====
        ledEnabled: false,
        ledRadius: 0.04,
        ledHeight: 0.04,
        //ledOffset = { x: 0.5 / 2 - 0.06, y: -0.8 / 2 + 0.12, z: 0.1 / 2 + 0.01 },
        ledOffset: { x: 0.19, y: -0.4, z: 0.12 },

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
firealarmpanel2.position.set(-1.2, 0.85, 5.93);


// --- AUTO-GENERATED: vesdapanel1 from vesdapanel.js ---
const vesdapanel1 = createvesdapanel(masterGroup, {
// Vesda dimensions
        deviceWidth: 0.3,
        deviceHeight: 0.2,
        deviceDepth: 0.08,
        devicePosition: { x: -1.2, y: 1.2, z: 5.93 },

        // Camera Position
        camPosition: { x: 0, y: 0.6, z: 0.46 },

        // Vesda properties
        deviceColor: 0xFFFFFF,
        deviceoutlineColor: 0x000000,

        // ORIENTATION
        orientation: 'Back',

        // FACE TEXTURES - NEW! (optional)
        faceTextures: {
            front: '/static/js/device_library/textures/vesdapanel1_front.png',
            back: '/static/js/device_library/textures/Vesda_front.png'
            //left: '/static/textures/Vesda_side.png',
            //right: '/static/textures/Vesda_side.png'
        },

        // label text properties
        text: 'Vesda',
        textPosition: { x: 0, y: 0.15, z: -0.05 },
        textColor: 0xffffff,
        textSize: 0.06,
        textFont: 'Arial',
        textCanvasBgColor: 0x222222,
        textbgSize: { width: 0.2, height: 0.08 },

        // screen properties
        screenEnabled: false,
        screenPosition: { x: 0, y: 0.27, z: 0.11 },
        screenSize: { width: 0.5, height: 0.25 },
        screenColor: 0x00FF00,
        screenoutlineColor: 0x000000,

        // stand properties
        standHeight: 0,
        standColor: 0x333333,

        // ===== HIGH RAISED LABEL OPTIONS =====
        highLabelEnabled: false,
        highText: null,
        highTextPosition: { x: 0, y: 3.5, z: 0.12 / 2 + 0.05 },
        highTextbgSize: { width: 0.9, height: 0.25 },
        highTextSize: 0.16,
        highTextColor: 0xffffff,
        highTextCanvasBgColor: 0x222222,
        highLineColor: 0xffff00,
        highLineWidth: 2,
        highDotColor: 0xffff00,
        highDotRadius: 0.03,
        highLabelOrientation: 'CAMERA',
        // FRONT | BACK | LEFT | RIGHT | CAMERA

        // ===== STATUS LED OPTIONS =====
        ledEnabled: false,
        ledRadius: 0.04,
        ledHeight: 0.04,
        //ledOffset = { x: 0.20 / 2 - 0.06, y: -0.45 / 2 + 0.12, z: 0.12 / 2 + 0.01 },
        ledOffset: { x: 0.19, y: -0.4, z: 0.12 },

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
vesdapanel1.position.set(-1.2, 1.2, 5.93);


// --- AUTO-GENERATED: vesdapanel2 from vesdapanel.js ---
const vesdapanel2 = createvesdapanel(masterGroup, {
// Vesda dimensions
        deviceWidth: 0.3,
        deviceHeight: 0.18,
        deviceDepth: 0.08,
        devicePosition: { x: -1.6, y: 0.95, z: 5.93 },

        // Camera Position
        camPosition: { x: 0, y: 0.6, z: 0.46 },

        // Vesda properties
        deviceColor: 0xFFFFFF,
        deviceoutlineColor: 0x000000,

        // ORIENTATION
        orientation: 'Back',

        // FACE TEXTURES - NEW! (optional)
        faceTextures: {
            front: '/static/js/device_library/textures/vesdapanel2_front.png',
            back: '/static/js/device_library/textures/Vesda_front.png'
            //left: '/static/textures/Vesda_side.png',
            //right: '/static/textures/Vesda_side.png'
        },

        // label text properties
        text: 'WLD',
        textPosition: { x: 0, y: 0.12, z: -0.05 },
        textColor: 0xffffff,
        textSize: 0.06,
        textFont: 'Arial',
        textCanvasBgColor: 0x222222,
        textbgSize: { width: 0.2, height: 0.08 },

        // screen properties
        screenEnabled: false,
        screenPosition: { x: 0, y: 0.27, z: 0.11 },
        screenSize: { width: 0.5, height: 0.25 },
        screenColor: 0x00FF00,
        screenoutlineColor: 0x000000,

        // stand properties
        standHeight: 0,
        standColor: 0x333333,

        // ===== HIGH RAISED LABEL OPTIONS =====
        highLabelEnabled: false,
        highText: null,
        highTextPosition: { x: 0, y: 3.5, z: 0.12 / 2 + 0.05 },
        highTextbgSize: { width: 0.9, height: 0.25 },
        highTextSize: 0.16,
        highTextColor: 0xffffff,
        highTextCanvasBgColor: 0x222222,
        highLineColor: 0xffff00,
        highLineWidth: 2,
        highDotColor: 0xffff00,
        highDotRadius: 0.03,
        highLabelOrientation: 'CAMERA',
        // FRONT | BACK | LEFT | RIGHT | CAMERA

        // ===== STATUS LED OPTIONS =====
        ledEnabled: false,
        ledRadius: 0.04,
        ledHeight: 0.04,
        //ledOffset = { x: 0.20 / 2 - 0.06, y: -0.45 / 2 + 0.12, z: 0.12 / 2 + 0.01 },
        ledOffset: { x: 0.19, y: -0.4, z: 0.12 },

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
vesdapanel2.position.set(-1.6, 0.95, 5.93);


// --- AUTO-GENERATED: vesdapanel3 from vesdapanel.js ---
const vesdapanel3 = createvesdapanel(masterGroup, {
// Vesda dimensions
        deviceWidth: 0.3,
        deviceHeight: 0.13,
        deviceDepth: 0.08,
        devicePosition: { x: -1.6, y: 0.77, z: 5.93 },

        // Camera Position
        camPosition: { x: 0, y: 0.6, z: 0.46 },

        // Vesda properties
        deviceColor: 0xFFFFFF,
        deviceoutlineColor: 0x000000,

        // ORIENTATION
        orientation: 'Back',

        // FACE TEXTURES - NEW! (optional)
        faceTextures: {
            front: '/static/js/device_library/textures/vesdapanel3_front.png',
            back: '/static/js/device_library/textures/Vesda_front.png'
            //left: '/static/textures/Vesda_side.png',
            //right: '/static/textures/Vesda_side.png'
        },

        // label text properties
        text: 'Rodent',
        textPosition: { x: 0, y: -0.12, z: -0.05 },
        textColor: 0xffffff,
        textSize: 0.06,
        textFont: 'Arial',
        textCanvasBgColor: 0x222222,
        textbgSize: { width: 0.2, height: 0.08 },

        // screen properties
        screenEnabled: false,
        screenPosition: { x: 0, y: 0.27, z: 0.11 },
        screenSize: { width: 0.5, height: 0.25 },
        screenColor: 0x00FF00,
        screenoutlineColor: 0x000000,

        // stand properties
        standHeight: 0,
        standColor: 0x333333,

        // ===== HIGH RAISED LABEL OPTIONS =====
        highLabelEnabled: false,
        highText: null,
        highTextPosition: { x: 0, y: 3.5, z: 0.12 / 2 + 0.05 },
        highTextbgSize: { width: 0.9, height: 0.25 },
        highTextSize: 0.16,
        highTextColor: 0xffffff,
        highTextCanvasBgColor: 0x222222,
        highLineColor: 0xffff00,
        highLineWidth: 2,
        highDotColor: 0xffff00,
        highDotRadius: 0.03,
        highLabelOrientation: 'CAMERA',
        // FRONT | BACK | LEFT | RIGHT | CAMERA

        // ===== STATUS LED OPTIONS =====
        ledEnabled: false,
        ledRadius: 0.04,
        ledHeight: 0.04,
        //ledOffset = { x: 0.20 / 2 - 0.06, y: -0.45 / 2 + 0.12, z: 0.12 / 2 + 0.01 },
        ledOffset: { x: 0.19, y: -0.4, z: 0.12 },

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
vesdapanel3.position.set(-1.6, 0.77, 5.93);

}