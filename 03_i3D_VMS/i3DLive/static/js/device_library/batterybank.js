// static/js/device_library/createbatterybank.js

function createbatterybank(scene, options = {}) {
    const {
        // BB dimensions
        deviceWidth = 1.0,
        deviceHeight = 1.5,
        deviceDepth = 0.20,
        devicePosition = { x: 3.85, y: 0.8, z: -0.90 },

        // Camera Position
        camPosition = { x: 0, y: 0.6, z: 0.46 },

        // BB properties
        deviceColor = 0xF0DD92,
        deviceoutlineColor = 0x000000,

        // ORIENTATION
        orientation = 'Front',

        // FACE TEXTURES (optional)
        faceTextures = {
            front: '/static/js/device_library/textures/BB_front.png',
            back: '/static/js/device_library/textures/BB_front.png'
        },

        // label text properties (front label on door)
        text = "BB-00",
        textPosition = { x: 0, y: 0.6, z: 0.12 },
        textColor = 0xffffff,
        textSize = 0.10,
        textFont = 'Arial',
        textCanvasBgColor = 0x222222,
        textbgSize = { width: 0.8, height: 0.2 },

        // screen properties
        screenEnabled = 'false',  // Default: disabled
        screenPosition = { x: 0, y: 0.27, z: 0.12 },
        screenSize = { width: 0.5, height: 0.4 },
        screenColor = 0x00FF00,
        screenoutlineColor = 0x000000,

        // stand properties
        standHeight = 0.05,
        standColor = 0x333333,

        // ===== HIGH RAISED LABEL OPTIONS =====
        highLabelEnabled = false,
        highText = null,
        highTextPosition = { x: 0, y: 3.5, z: deviceDepth / 2 + 0.05 },
        highTextbgSize = { width: 0.9, height: 0.25 },
        highTextSize = 0.16,
        highTextColor = 0xffffff,
        highTextCanvasBgColor = 0x222222,
        highLineColor = 0xffff00,
        highLineWidth = 2,
        highDotColor = 0xffff00,
        highDotRadius = 0.03,
        highLabelOrientation = 'CAMERA',
        // NEW: FRONT | BACK | LEFT | RIGHT | CAMERA

        // ===== STATUS LED OPTIONS =====
        ledEnabled = false,  // Default: disabled
        ledRadius = 0.04,
        ledHeight = 0.04,
        //ledOffset = { x: deviceWidth / 2 - 0.06, y: -deviceHeight / 2 + 0.12, z: deviceDepth / 2 + 0.01 },
        ledOffset = { x: 0.40, y: 0.40, z: 0.12 },

        healthyColor = 0x10ee00,
        warningColor = 0xffff00,
        alarmColor   = 0xff0000,
        runColor     = 0x0000ff,
        customColor  = 0xffffff,
        ledState = 'HEALTHY',
        // HEALTHY | WARNING | ALARM | RUN | CUSTOM
        ledBlinkPeriod = 1.0,
        // seconds

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

    const loader = new THREE.TextureLoader();

    // === STAND ===
    const standGeometry = new THREE.BoxGeometry(deviceWidth * 0.9, standHeight, deviceDepth * 0.9);
    const standMaterial = new THREE.MeshStandardMaterial({ color: standColor });
    const stand = new THREE.Mesh(standGeometry, standMaterial);
    stand.position.y = -deviceHeight / 2 - standHeight / 2;
    stand.castShadow = true;
    stand.receiveShadow = true;

    // === MAIN BB WITH FACE TEXTURES ===
    const geometry = new THREE.BoxGeometry(deviceWidth, deviceHeight, deviceDepth);

    const materials = [
        // +X (Right)
        faceTextures.right ? new THREE.MeshStandardMaterial({ map: loader.load(faceTextures.right) })
                           : new THREE.MeshStandardMaterial({ color:deviceColor }),

        // -X (Left)
        faceTextures.left ? new THREE.MeshStandardMaterial({ map: loader.load(faceTextures.left) })
                          : new THREE.MeshStandardMaterial({ color:deviceColor }),

        // +Y (Top)
        new THREE.MeshStandardMaterial({ color:deviceColor, roughness: 0.5, metalness: 0.5 }),

        // -Y (Bottom)
        new THREE.MeshStandardMaterial({ color:deviceColor, roughness: 0.7, metalness: 0.1 }),

        // +Z (Front)
        faceTextures.front ? new THREE.MeshStandardMaterial({ map: loader.load(faceTextures.front) })
                           : new THREE.MeshStandardMaterial({ color:deviceColor, roughness: 0.5, metalness: 0.5 }),

        // -Z (Back)
        faceTextures.back ? new THREE.MeshStandardMaterial({ map: loader.load(faceTextures.back) })
                          : new THREE.MeshStandardMaterial({ color:deviceColor })
    ];

    const BB = new THREE.Mesh(geometry, materials);
    BB.position.y = standHeight;
    BB.castShadow = true;
    BB.receiveShadow = true;
    scene.add(BB);

    BB.add(stand);

    // === BB Outline ===
    const edges = new THREE.EdgesGeometry(geometry);
    const outlineMaterial = new THREE.LineBasicMaterial({
        color: deviceoutlineColor,
        linewidth: 2,
        transparent: true,
        opacity: 0.8
    });
    const outline = new THREE.LineSegments(edges, outlineMaterial);
    BB.add(outline);

    // === ORIENTATION ===
    switch (orientation.toUpperCase()) {
        case 'BACK':  BB.rotation.y = Math.PI;      break;
        case 'LEFT':  BB.rotation.y = Math.PI / 2;  break;
        case 'RIGHT': BB.rotation.y = -Math.PI / 2; break;
        case 'FRONT':
        default:      BB.rotation.y = 0;            break;
    }

    // === LABEL TEXT (front) ===
    (function () {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const pad = 20;
        const fontSize = Math.max(32, textSize * 1000);

        canvas.width = textbgSize.width * 1000 + pad * 2;
        canvas.height = textbgSize.height * 1000 + pad * 2;

        ctx.fillStyle = new THREE.Color(textCanvasBgColor).getStyle();
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = new THREE.Color(textColor).getStyle();
        ctx.font = `bold ${fontSize}px ${textFont}, Arial, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, canvas.width / 2, canvas.height / 2);

        const tex = new THREE.CanvasTexture(canvas);
        tex.minFilter = THREE.LinearFilter;

        const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, side: THREE.DoubleSide });
        const plane = new THREE.Mesh(
            new THREE.PlaneGeometry(textbgSize.width * 0.9, textbgSize.height * 0.9),
            mat
        );
        plane.position.set(textPosition.x, textPosition.y, textPosition.z + 0.001);
        BB.add(plane);
    })();

    // === SCREEN ===
    if(screenEnabled)
    {
    	(function () {
        	const screenGeometry = new THREE.PlaneGeometry(screenSize.width, screenSize.height);
        	const screenMaterial = new THREE.MeshStandardMaterial({
            		color: screenColor,
            		side: THREE.DoubleSide,
            		transparent:  true,
            		opacity: 100
        });
        const screen = new THREE.Mesh(screenGeometry, screenMaterial);
        screen.position.set(screenPosition.x, screenPosition.y, screenPosition.z);
        BB.add(screen);

        const screenEdges = new THREE.EdgesGeometry(screenGeometry);
        const screenOutlineMaterial = new THREE.LineBasicMaterial({
            color: screenoutlineColor,
            linewidth: 1.5,
            transparent: true,
            opacity: 0.9
        });
        const screenOutline = new THREE.LineSegments(screenEdges, screenOutlineMaterial);
        screen.add(screenOutline);

    	})();
    }
    // =================================================================
    // 1. HIGH RAISED LABEL (optional, with orientation)
    // =================================================================
    if (highLabelEnabled) {
        const labelText = highText || text;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const pad = 20;
        const fontSize = Math.max(32, highTextSize * 1000);

        canvas.width = highTextbgSize.width * 1000 + pad * 2;
        canvas.height = highTextbgSize.height * 1000 + pad * 2;

        // flip Y so text is correct
        ctx.scale(1, -1);
        ctx.translate(0, -canvas.height);

        ctx.fillStyle = new THREE.Color(highTextCanvasBgColor).getStyle();
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = new THREE.Color(highTextColor).getStyle();
        ctx.font = `bold ${fontSize}px ${textFont}, Arial, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(labelText, canvas.width / 2, canvas.height / 2);

        const tex = new THREE.CanvasTexture(canvas);
        tex.flipY = false;
        tex.minFilter = THREE.LinearFilter;

        const mat = new THREE.MeshBasicMaterial({
            map: tex,
            transparent: true,
            side: THREE.DoubleSide
        });
        const plane = new THREE.Mesh(
            new THREE.PlaneGeometry(highTextbgSize.width * 0.9, highTextbgSize.height * 0.9),
            mat
        );

        // base position
        plane.position.set(highTextPosition.x, highTextPosition.y, highTextPosition.z);

        // ----- ORIENTATION for high label -----
        const highOrient = highLabelOrientation.toUpperCase();

        if (highOrient === 'CAMERA') {
            // dynamic billboard: always face camera each frame
            BB.updateHighLabelFacing = function (camera) {
                // make label look at camera
                plane.lookAt(camera.position);
            };
        } else {
            switch (highOrient) {
                case 'FRONT':   // facing +Z
                    plane.rotation.y = 0;
                    break;
                case 'BACK':    // facing -Z
                    plane.rotation.y = Math.PI;
                    break;
                case 'LEFT':    // facing -X
                    plane.rotation.y = Math.PI / 2;
                    break;
                case 'RIGHT':   // facing +X
                    plane.rotation.y = -Math.PI / 2;
                    break;
            }
        }

        // Store high label mesh reference for live data updates
        BB.highLabelMesh = plane;
        BB.add(plane);

        // line from label bottom center to BB top/front
        const labelBottom = new THREE.Vector3(
            highTextPosition.x,
            highTextPosition.y - highTextbgSize.height * 0.5,
            highTextPosition.z
        );
        const targetPoint = new THREE.Vector3(0, deviceHeight / 2 + standHeight * 0.1, deviceDepth / 2);

        const lineGeom = new THREE.BufferGeometry().setFromPoints([labelBottom, targetPoint]);
        const lineMat = new THREE.LineBasicMaterial({
            color: highLineColor,
            linewidth: highLineWidth
        });
        const line = new THREE.Line(lineGeom, lineMat);
        BB.add(line);

        // round dot at BB surface
        const dotGeom = new THREE.SphereGeometry(highDotRadius, 16, 16);
        const dotMat = new THREE.MeshBasicMaterial({ color: highDotColor });
        const dot = new THREE.Mesh(dotGeom, dotMat);
        dot.position.copy(targetPoint);
        BB.add(dot);
    }

    // =================================================================
    // 2. STATUS LED (right bottom front)
    // =================================================================
    if (ledEnabled) {
        const ledGeom = new THREE.CylinderGeometry(ledRadius, ledRadius, ledHeight, 16);
        const baseColor = new THREE.Color(healthyColor);

        const ledMat = new THREE.MeshStandardMaterial({
            color: baseColor,
            emissive: baseColor,
            emissiveIntensity: 0.0,
            transparent: false,
            opacity: 0.3,
            roughness: 0.4,
            metalness: 0.1
        });
        const led = new THREE.Mesh(ledGeom, ledMat);
        led.rotation.x = Math.PI / 2;
        led.position.set(ledOffset.x, ledOffset.y, ledOffset.z);
        led.castShadow = true;
        led.receiveShadow = true;
        BB.add(led);

        // glow sphere for alarm / highlight
        const glowGeom = new THREE.SphereGeometry(ledRadius * 2.0, 16, 16);
        const glowMat = new THREE.MeshBasicMaterial({
            color: alarmColor,
            transparent: true,
            opacity: 0.0
        });
        const glow = new THREE.Mesh(glowGeom, glowMat);
        glow.position.copy(led.position);
        BB.add(glow);

        // store state and colors on BB mesh
        BB.led = led;
        BB.ledMaterial = ledMat;
        BB.ledGlow = glow;
        BB.ledGlowMaterial = glowMat;

        BB.ledColors = {
            HEALTHY: new THREE.Color(healthyColor),
            WARNING: new THREE.Color(warningColor),
            ALARM:   new THREE.Color(alarmColor),
            RUN:     new THREE.Color(runColor),
            CUSTOM:  new THREE.Color(customColor)
        };

        BB.ledState = ledState.toUpperCase();
        BB.ledBlinkPeriod = ledBlinkPeriod;
        BB.ledTime = 0;

        // Helper to get color for current state
        BB._getLEDColor = function () {
            return this.ledColors[this.ledState] || this.ledColors.HEALTHY;
        };

        // Called from global animate() via scene.traverse
        BB.updateLED = function (dt) {
            this.ledTime += dt;
            const phase = (this.ledTime % this.ledBlinkPeriod) / this.ledBlinkPeriod;
            const on = phase < 0.5;  // half period on, half off

            const c = this._getLEDColor();
            this.ledMaterial.color.copy(c);
            this.ledMaterial.emissive.copy(c);

            if (this.ledState === 'ALARM') {
                const intensity = on ? 2.5 : 0.3;
                const opacity = on ? 0.8 : 0.3;
                const glowOpacity = on ? 0.6 : 0.0;

                this.ledMaterial.emissiveIntensity = intensity;
                this.ledMaterial.opacity = opacity;

                this.ledGlowMaterial.color.copy(c);
                this.ledGlowMaterial.opacity = glowOpacity;
                const s = on ? 1.5 : 1.0;
                this.ledGlow.scale.set(s, s, s);
            } else {
                const intensity = on ? 1.2 : 0.1;
                const opacity = on ? 0.6 : 0.25;

                this.ledMaterial.emissiveIntensity = intensity;
                this.ledMaterial.opacity = opacity;

                this.ledGlowMaterial.opacity = 0.0;
                this.ledGlow.scale.set(1, 1, 1);
            }
        };

        // API to change LED state from outside
        BB.setLEDState = function (state) {
            this.ledState = String(state || 'HEALTHY').toUpperCase();
        };

        // === LIVE DATA HANDLER HOOK ===
        // row is one element from /api/live_data
        // e.g. { id: "BB-01", type: "BB", state: "ALARM", label: "BB-01 (Bypass)" }
        BB.applyLiveData = function(row) {
            if (!row) return;
            // 1) Update LED state if provided
            if (row.state && typeof this.setLEDState === 'function') {
                this.setLEDState(row.state);
            }

            // 2) Update high label text if backend sends it
            if (row.label && this.highLabelMesh) {
                // Update high label texture with new text
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const pad = 20;
                const fontSize = Math.max(32, highTextSize * 1000);
                const highTextbgSize = { width: 0.9, height: 0.25 }; // Match original size

                canvas.width = highTextbgSize.width * 1000 + pad * 2;
                canvas.height = highTextbgSize.height * 1000 + pad * 2;

                ctx.scale(1, -1);
                ctx.translate(0, -canvas.height);

                ctx.fillStyle = new THREE.Color(highTextCanvasBgColor).getStyle();
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                ctx.fillStyle = new THREE.Color(highTextColor).getStyle();
                ctx.font = `bold ${fontSize}px ${textFont}, Arial, sans-serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(row.label, canvas.width / 2, canvas.height / 2);

                const tex = new THREE.CanvasTexture(canvas);
                tex.flipY = false;
                tex.minFilter = THREE.LinearFilter;

                const mat = this.highLabelMesh.material;
                mat.map = tex;
                mat.needsUpdate = true;
            }
        };
    }

    // =================================================================
    // 3. NEW DEVICE METADATA STORAGE
    // =================================================================
    // Store all device metadata on the BB mesh for mouse hover/click events
    BB.deviceMetadata = {
        deviceId: deviceId,
        category: category,
        urlLink: urlLink,
        zbxSrvIP: zbxSrvIP,                      // Zabbix server IP
        zbxAPI: zbxAPI,
        zbxHost: zbxHost,
        zbxHostKeys: [...zbxHostKeys],           // Dynamic array for multiple Zbx host keys
        zbxHostKeyValues: [...zbxHostKeyValues]  // Corresponding live data values for each host key
    };

    // Helper method to get metadata (for raycasting/hover systems)
    BB.getDeviceMetadata = function() {
        return this.deviceMetadata;
    };

    // Helper method to update metadata dynamically
    BB.updateDeviceMetadata = function(metadata) {
        Object.assign(this.deviceMetadata, metadata);
    };

    // Helper method to add Zabbix host key + value pair to arrays
    BB.addZbxHostKey = function(hostKey, hostKeyValue = '') {
        if (hostKey && !this.deviceMetadata.zbxHostKeys.includes(hostKey)) {
            this.deviceMetadata.zbxHostKeys.push(hostKey);
            this.deviceMetadata.zbxHostKeyValues.push(hostKeyValue);
        }
    };

    // Helper method to remove Zabbix host key + value pair from arrays
    BB.removeZbxHostKey = function(hostKey) {
        const index = this.deviceMetadata.zbxHostKeys.indexOf(hostKey);
        if (index > -1) {
            this.deviceMetadata.zbxHostKeys.splice(index, 1);
            this.deviceMetadata.zbxHostKeyValues.splice(index, 1);
        }
    };

    // Helper method to update specific host key value
    BB.updateZbxHostKeyValue = function(hostKey, newValue) {
        const index = this.deviceMetadata.zbxHostKeys.indexOf(hostKey);
        if (index > -1) {
            this.deviceMetadata.zbxHostKeyValues[index] = newValue;
        }
    };

    // Helper method to get all host key-value pairs as object for popup display
    BB.getZbxKeyValuePairs = function() {
        const pairs = {};
        this.deviceMetadata.zbxHostKeys.forEach((key, index) => {
            pairs[key] = this.deviceMetadata.zbxHostKeyValues[index] || 'N/A';
        });
        return pairs;
    };

    // Helper method to clear all Zabbix data
    BB.clearZbxData = function() {
        this.deviceMetadata.zbxHostKeys = [];
        this.deviceMetadata.zbxHostKeyValues = [];
    };

    return BB;
}
