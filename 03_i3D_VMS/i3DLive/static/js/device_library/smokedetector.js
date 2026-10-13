// static/js/device_library/SmokeDetector.js

function createSmokeDetector(parent, options = {}) {
    const {
        // Detector dimensions
        deviceBaseRadius = 0.05,
        deviceBaseHeight = 0.02,
        deviceouterCylinderRadius = 0.12,
        deviceouterCylinderHeight = 0.05,
        deviceinnerCylinderRadius = 0.08,
        deviceinnerCylinderHeight = 0.03,
        devicePosition = { x: 0, y: 0.6, z: 0.46 },

        // Camera Position
        camPosition = { x: 0, y: 0.6, z: 0.46 },

        // Detector properties
        deviceColor = 0xF0DD92,

        // ORIENTATION (6 directions)
        orientation = 'Bottom',

        // LABEL text properties
        text = "SmokeDetector",
        textPosition = { x: 0, y: 0.3, z: 0.02 },
        textColor = 0x000000,
        textSize = 0.08,
        textFont = 'Arial',
        textCanvasBgColor = 0xFFFFFF,
        textbgSize = { width: 0.45, height: 0.12 },

        // LED properties - CENTERED
        ledRadius = 0.045,
        innerLedRadius = 0.06,
        innerLedHeight = 0.15,
        normalLedColor = 0x00FF00,
        alarmLedColor = 0xFF0000,
        blinkSpeed = 0.02,
        isAlarm = false,

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

    // === BASE PLATE ===
    const baseGeometry = new THREE.CylinderGeometry(deviceBaseRadius, deviceBaseRadius, deviceBaseHeight, 24);
    const baseMaterial = new THREE.MeshStandardMaterial({ color: deviceColor, roughness: 0.7 });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = deviceBaseHeight / 2;
    base.castShadow = true;
    base.receiveShadow = true;

    // === OUTER CYLINDER ===
    const outerGeometry = new THREE.CylinderGeometry(deviceouterCylinderRadius, deviceouterCylinderRadius, deviceouterCylinderHeight, 24);
    const outerMaterial = new THREE.MeshStandardMaterial({ color: deviceColor, roughness: 0.6 });
    const outerCylinder = new THREE.Mesh(outerGeometry, outerMaterial);
    outerCylinder.position.y = deviceBaseHeight + deviceouterCylinderHeight / 2;
    outerCylinder.castShadow = true;
    outerCylinder.receiveShadow = true;

    // === INNER CYLINDER ===
    const innerGeometry = new THREE.CylinderGeometry(deviceinnerCylinderRadius, deviceinnerCylinderRadius, deviceinnerCylinderHeight, 24);
    const innerMaterial = new THREE.MeshStandardMaterial({ color: deviceColor, roughness: 0.4 });
    const innerCylinder = new THREE.Mesh(innerGeometry, innerMaterial);
    innerCylinder.position.y = deviceBaseHeight + deviceouterCylinderHeight + deviceinnerCylinderHeight / 2;
    innerCylinder.castShadow = true;
    innerCylinder.receiveShadow = true;

    // === DETECTOR GROUP ===
    const detector = new THREE.Group();
    parent.add(detector);

    detector.add(base);
    detector.add(outerCylinder);
    detector.add(innerCylinder);

    // === CENTERED LED (TOP CENTER OF INNER CYLINDER) ===
    const ledGeometry = new THREE.CylinderGeometry(innerLedRadius, innerLedRadius, innerLedHeight, 24);
    const ledMaterial = new THREE.MeshBasicMaterial({
        color: normalLedColor,
        transparent: false,
        opacity: 0.9
    });
    const led = new THREE.Mesh(ledGeometry, ledMaterial);

    // ✅ CENTER OF INNER CYLINDER TOP
    led.position.set(0, (deviceinnerCylinderHeight / 2) - 0.05, 0);
    innerCylinder.add(led);

    // Store LED references
    detector.led = led;
    detector.ledMaterial = ledMaterial;
    detector.isAlarm = isAlarm;
    detector.blinkSpeed = blinkSpeed;
    detector.normalLedColor = normalLedColor;
    detector.alarmLedColor = alarmLedColor;
    detector.time = 0;

    // ✅ FIXED ORIENTATION
    switch(orientation.toUpperCase()) {
        case 'FRONT':
            detector.rotation.x = Math.PI / 2;
            break;
        case 'BACK':
            detector.rotation.x = -Math.PI / 2;
            break;
        case 'TOP':
            detector.rotation.y = Math.PI / 2;
            break;
        case 'BOTTOM':
            detector.rotation.x = -Math.PI;
            break;
        case 'LEFT':
            detector.rotation.z = Math.PI / 2;
            break;
        case 'RIGHT':
            detector.rotation.z = -Math.PI / 2;
            break;
    }

    // === LABEL TEXT - FRONT FACING ALWAYS ===
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    const canvasPadding = 20;
    const fontSize = Math.max(24, textSize * 1000);
    canvas.width = textbgSize.width * 1000 + canvasPadding * 2;
    canvas.height = textbgSize.height * 1000 + canvasPadding * 2;

    context.fillStyle = new THREE.Color(textCanvasBgColor).getStyle();
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = new THREE.Color(textColor).getStyle();
    context.font = `bold ${fontSize}px ${textFont}, Arial, sans-serif`;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, canvas.width / 2, canvas.height / 2);
    // ✅ FLIP CANVAS Y-AXIS (fixes upside-down)
    context.scale(1, -1);
    context.translate(0, -canvas.height);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.flipY = false;
    const textMaterial = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        side: THREE.DoubleSide
    });
    const textPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(textbgSize.width * 0.9, textbgSize.height * 0.9),
        textMaterial
    );
    
    // ✅ FRONT FACING - Always look at camera + offset position
    textPlane.position.set(
        textPosition.x, 
        textPosition.y, 
        textPosition.z //+ deviceouterCylinderRadius + 0.03  // Offset from detector surface
    );
    
    // ✅ Make text ALWAYS face camera (billboard)
    //textPlane.lookAt(0, 0, 10);  // Face +Z direction (viewer)
    
    detector.add(textPlane);

    // ✅ BLINKING ANIMATION FUNCTION
    detector.updateLED = function(deltaTime) {
        this.time += deltaTime;

        if (this.isAlarm) {
            // 🔴 RED FAST BLINKING (alarm)
            const blink = Math.sin(this.time * 15) * 0.5 + 0.5;
            this.ledMaterial.color.setHex(this.alarmLedColor);
            //this.ledMaterial.opacity = 0.4 + blink * 0.6;
        } else {
            // 🟢 GREEN SLOW PULSE (normal)
            const pulse = Math.sin(this.time * 2) * 0.3 + 0.7;
            this.ledMaterial.color.setHex(this.normalLedColor);
            this.ledMaterial.opacity = pulse;
        }
    };

    // ✅ SET ALARM STATE
    detector.setAlarmState = function(alarmState) {
        this.isAlarm = alarmState;
    };

    // ✅ GET ALARM STATE
    detector.getAlarmState = function() {
        return this.isAlarm;
    };

    return detector;
}
