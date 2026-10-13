// static/js/device_library/PDU.js

function createPDU(scene, options = {}) {
    const {
        // PDU body dimensions
        deviceWidth = 0.05,
        deviceHeight = 1.5,
        deviceDepth = 0.05,
        devicePosition = { x: -1.75, y: 0.90, z: 1.24 },

        // Camera Position
        camPosition = { x: 0, y: 0.6, z: 0.46 },

        // PDU properties
        deviceColor = 0xFFFFFF,
        deviceoutlineColor = 0x000000,

        // ORIENTATION (mounted on side/back of rack)
        orientation = 'Front',

        // FACE TEXTURES - optional artwork
        faceTextures = {
            front: '/static/js/device_library/textures/EP_front.png',
            back: '/static/js/device_library/textures/EP_front.png'
        },
        // { front, back, left, right }

        // label text properties
        text = "PDU-01",
        textPosition = { x: -0.08, y: -0.85, z: 0.05 },
        textColor = 0xffffff,
        textSize = 0.08,
        textFont = 'Arial',
        textCanvasBgColor = 0x222222,
        textbgSize = { width: 0.30, height: 0.10 },

        // stand properties (small base if free‑standing)
        standHeight = 0.05,
        standColor = 0x333333,

        // ===== STATUS LED OPTIONS =====
        ledEnabled = false,  // Default: disabled
        ledRadius = 0.02,
        ledHeight = 0.02,
        ledOffset = { x: 0, y: -0.70, z: 0.05 },

        healthyColor = 0x10ee00,
        warningColor = 0xffff00,
        alarmColor   = 0xff0000,
        runColor     = 0x0000ff,
        customColor  = 0xffffff,
        ledState = 'HEALTHY',
        // HEALTHY | WARNING | ALARM | RUN | CUSTOM
        ledBlinkPeriod = 1.0,
        // seconds

         // PDU plug point configuration
        plugCount = 2,
        plugCols = 1,
        plugWidth = 0.03,
        plugHeight = 0.025,
        plugDepth = 0.01,
        plugWidthReductionRatio = 0.01,
        plugColor = 0x202020,
        plugBorderColor = 0x111111,
        plugSpacingY = 0.06,
        plugOffsetX = 0.0,
        plugOffsetY = 0.2,
        plugOffsetZ = deviceDepth / 2 + 0.001,
        // phase color strip / A,B,C zones (optional)
        zoneStripEnabled = false,
        zoneColors = [0xffd700, 0x00a2ff, 0xff4500],

        // ===== HIGH RAISED LABEL OPTIONS =====
        highLabelEnabled = false,
        highText = null,
        highTextPosition = { x: 0, y: 4.0, z: deviceDepth / 2 + 0.05 },
        highTextbgSize = { width: 0.9, height: 0.25 },
        highTextSize = 0.16,
        highTextColor = 0xffffff,
        highTextCanvasBgColor = 0x222222,
        highLineColor = 0xffff00,
        highLineWidth = 2,
        highDotColor = 0xffff00,
        highDotRadius = 0.03,
        highLabelOrientation = 'CAMERA',
        // FRONT | BACK | LEFT | RIGHT | CAMERA



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

    // === STAND (optional) ===
    const standGeometry = new THREE.BoxGeometry(deviceWidth * 0.9, standHeight, deviceDepth * 0.9);
    const standMaterial = new THREE.MeshStandardMaterial({ color: standColor });
    const stand = new THREE.Mesh(standGeometry, standMaterial);
    stand.position.y = -deviceHeight / 2 - standHeight / 2;
    stand.castShadow = true;
    stand.receiveShadow = true;

    // === MAIN PDU BODY WITH OPTIONAL FACE TEXTURE ===
    const geometry = new THREE.BoxGeometry(deviceWidth, deviceHeight, deviceDepth);

    const materials = [
        // +X (Right face)
        faceTextures.right ? new THREE.MeshStandardMaterial({
            map: loader.load(faceTextures.right)
        }) : new THREE.MeshStandardMaterial({ color: deviceColor }),

        // -X (Left face)
        faceTextures.left ? new THREE.MeshStandardMaterial({
            map: loader.load(faceTextures.left)
        }) : new THREE.MeshStandardMaterial({ color: deviceColor }),

        // +Y (Top face)
        new THREE.MeshStandardMaterial({
            color: deviceColor,
            roughness: 0.5,
            metalness: 0.2
        }),

        // -Y (Bottom face)
        new THREE.MeshStandardMaterial({
            color: deviceColor,
            roughness: 0.7,
            metalness: 0.1
        }),

        // +Z (Front face where plugs are)
        faceTextures.front ? new THREE.MeshStandardMaterial({
            map: loader.load(faceTextures.front)
        }) : new THREE.MeshStandardMaterial({
            color: deviceColor,
            roughness: 0.5,
            metalness: 0.2
        }),

        // -Z (Back face)
        faceTextures.back ? new THREE.MeshStandardMaterial({
            map: loader.load(faceTextures.back)
        }) : new THREE.MeshStandardMaterial({ color: deviceColor })
    ];

    const pdu = new THREE.Mesh(geometry, materials);
    pdu.position.y = standHeight;
    pdu.castShadow = true;
    pdu.receiveShadow = true;
    scene.add(pdu);

    // Add stand to PDU (optional)
    pdu.add(stand);

    // PDU Outline
    const edges = new THREE.EdgesGeometry(geometry);
    const outlineMaterial = new THREE.LineBasicMaterial({
        color: deviceoutlineColor,
        linewidth: 1,
        transparent: true,
        opacity: 0.7
    });
    const outline = new THREE.LineSegments(edges, outlineMaterial);
    pdu.add(outline);

    // === ORIENTATION ROTATION ===
    switch (orientation.toUpperCase()) {
        case 'BACK':
            pdu.rotation.y = Math.PI;
            break;
        case 'LEFT':
            pdu.rotation.y = Math.PI / 2;
            break;
        case 'RIGHT':
            pdu.rotation.y = -Math.PI / 2;
            break;
        case 'FRONT':
        default:
            pdu.rotation.y = 0;
            break;
    }

    // === PHASE / ZONE COLOR STRIP (A,B,C like image) ===
    if (zoneStripEnabled) {
        const zoneStripHeight = deviceHeight * 0.04;
        const zoneStripGeometry = new THREE.PlaneGeometry(deviceWidth * 0.9, zoneStripHeight);
        const zones = Math.min(zoneColors.length, 3);

        for (let i = 0; i < zones; i++) {
            const mat = new THREE.MeshBasicMaterial({
                color: zoneColors[i],
                side: THREE.DoubleSide
            });
            const strip = new THREE.Mesh(zoneStripGeometry, mat);
            const yPos = -deviceHeight / 2 + zoneStripHeight / 2 + i * (zoneStripHeight + 0.01);
            strip.position.set(0, yPos, deviceDepth / 2 + 0.001);
            pdu.add(strip);
        }
    }

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    // === PLUG POINTS (C13‑style) ===
    const plugsPerCol = Math.ceil(plugCount / plugCols);

    for (let col = 0; col < plugCols; col++) {
        for (let i = 0; i < plugsPerCol; i++) {
            const index = col * plugsPerCol + i;
            if (index >= plugCount) break;

            // Main plug body
            const plugGeometry = new THREE.BoxGeometry(plugWidth, plugHeight, plugDepth);
            const plugMaterial = new THREE.MeshStandardMaterial({
                color: plugColor,
                roughness: 0.4,
                metalness: 0.1
            });
            const plug = new THREE.Mesh(plugGeometry, plugMaterial);

            // Position along front face
            const xOffset = plugOffsetX + (col - (plugCols - 1) / 2) * (plugWidth + 0.015);
            const yOffset = -deviceHeight / 2 + plugOffsetY + i * plugSpacingY;

            plug.position.set(
                xOffset,
                yOffset,
                plugOffsetZ
            );
            plug.castShadow = true;

            // Inner "holes" as small black rectangles
            const holeGeo = new THREE.BoxGeometry(plugWidth * 0.2, plugHeight * 0.3, plugDepth * 0.6);
            const holeMat = new THREE.MeshStandardMaterial({ color: 0x000000 });

            const holeLeft = new THREE.Mesh(holeGeo, holeMat);
            holeLeft.position.set(-plugWidth * 0.2, 0, plugDepth * 0.1);
            plug.add(holeLeft);

            const holeRight = holeLeft.clone();
            holeRight.position.x = plugWidth * 0.2;
            plug.add(holeRight);

            // Optional border
            const borderEdges = new THREE.EdgesGeometry(plugGeometry);
            const borderMat = new THREE.LineBasicMaterial({ color: plugBorderColor, linewidth: 1 });
            const border = new THREE.LineSegments(borderEdges, borderMat);
            plug.add(border);

            //pdu.add(plug);
        }
    }

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // === LABEL TEXT (kept) ===
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

    const labelTexture = new THREE.CanvasTexture(canvas);
    labelTexture.minFilter = THREE.LinearFilter;
    const textMaterial = new THREE.MeshBasicMaterial({
        map: labelTexture,
        transparent: true,
        side: THREE.DoubleSide
    });

    const textPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(textbgSize.width * 0.9, textbgSize.height * 0.9),
        textMaterial
    );
    textPlane.position.set(textPosition.x, textPosition.y, textPosition.z);
    pdu.add(textPlane);


    // =================================================================
    // 1. HIGH RAISED LABEL (optional, with orientation)
    // =================================================================

    if (highLabelEnabled) {
        const labelText = highText || text;

        const canvasHL = document.createElement('canvas');
        const ctxHL = canvasHL.getContext('2d');
        const pad = 20;
        const fontSizeHL = Math.max(32, highTextSize * 1000);

        canvasHL.width = highTextbgSize.width * 1000 + pad * 2;
        canvasHL.height = highTextbgSize.height * 1000 + pad * 2;

        // flip Y so text is correct
        ctxHL.scale(1, -1);
        ctxHL.translate(0, -canvasHL.height);

        ctxHL.fillStyle = new THREE.Color(highTextCanvasBgColor).getStyle();
        ctxHL.fillRect(0, 0, canvasHL.width, canvasHL.height);

        ctxHL.fillStyle = new THREE.Color(highTextColor).getStyle();
        ctxHL.font = `bold ${fontSizeHL}px ${textFont}, Arial, sans-serif`;
        ctxHL.textAlign = 'center';
        ctxHL.textBaseline = 'middle';
        ctxHL.fillText(labelText, canvasHL.width / 2, canvasHL.height / 2);

        const texHL = new THREE.CanvasTexture(canvasHL);
        texHL.flipY = false;
        texHL.minFilter = THREE.LinearFilter;

        const matHL = new THREE.MeshBasicMaterial({
            map: texHL,
            transparent: true,
            side: THREE.DoubleSide
        });
        const planeHL = new THREE.Mesh(
            new THREE.PlaneGeometry(highTextbgSize.width * 0.9, highTextbgSize.height * 0.9),
            matHL
        );

        // base position
        planeHL.position.set(highTextPosition.x, highTextPosition.y, highTextPosition.z);

        // ----- ORIENTATION for high label -----
        const highOrient = highLabelOrientation.toUpperCase();

        if (highOrient === 'CAMERA') {
            // dynamic billboard: always face camera each frame
            pdu.updateHighLabelFacing = function (camera) {
                planeHL.lookAt(camera.position);
            };
        } else {
            switch (highOrient) {
                case 'FRONT':   // facing +Z
                    planeHL.rotation.y = 0;
                    break;
                case 'BACK':    // facing -Z
                    planeHL.rotation.y = Math.PI;
                    break;
                case 'LEFT':    // facing -X
                    planeHL.rotation.y = Math.PI / 2;
                    break;
                case 'RIGHT':   // facing +X
                    planeHL.rotation.y = -Math.PI / 2;
                    break;
            }
        }

        // Store high label mesh reference for live data updates
        pdu.highLabelMesh = planeHL;
        pdu.add(planeHL);

        // line from label bottom center to PDU top/front
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
        pdu.add(line);

        // round dot at PDU surface
        const dotGeom = new THREE.SphereGeometry(highDotRadius, 16, 16);
        const dotMat = new THREE.MeshBasicMaterial({ color: highDotColor });
        const dot = new THREE.Mesh(dotGeom, dotMat);
        dot.position.copy(targetPoint);
        pdu.add(dot);
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
        pdu.add(led);

        // glow sphere for alarm / highlight
        const glowGeom = new THREE.SphereGeometry(ledRadius * 2.0, 16, 16);
        const glowMat = new THREE.MeshBasicMaterial({
            color: alarmColor,
            transparent: true,
            opacity: 0.0
        });
        const glow = new THREE.Mesh(glowGeom, glowMat);
        glow.position.copy(led.position);
        pdu.add(glow);

        // store state and colors on PDU mesh
        pdu.led = led;
        pdu.ledMaterial = ledMat;
        pdu.ledGlow = glow;
        pdu.ledGlowMaterial = glowMat;

        pdu.ledColors = {
            HEALTHY: new THREE.Color(healthyColor),
            WARNING: new THREE.Color(warningColor),
            ALARM:   new THREE.Color(alarmColor),
            RUN:     new THREE.Color(runColor),
            CUSTOM:  new THREE.Color(customColor)
        };

        pdu.ledState = ledState.toUpperCase();
        pdu.ledBlinkPeriod = ledBlinkPeriod;
        pdu.ledTime = 0;

        // Helper to get color for current state
        pdu._getLEDColor = function () {
            return this.ledColors[this.ledState] || this.ledColors.HEALTHY;
        };

        // Called from global animate() via scene.traverse
        pdu.updateLED = function (dt) {
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
        pdu.setLEDState = function (state) {
            this.ledState = String(state || 'HEALTHY').toUpperCase();
        };

        // === LIVE DATA HANDLER HOOK ===
        // row is one element from /api/live_data
        // e.g. { id: "PDU-01", type: "PDU", state: "ALARM", label: "PDU-01 (Main)" }
        pdu.applyLiveData = function(row) {
            if (!row) return;
            // 1) Update LED state if provided
            if (row.state && typeof this.setLEDState === 'function') {
                this.setLEDState(row.state);
            }

            // 2) Update high label text if backend sends it
            if (row.label && this.highLabelMesh) {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const pad = 20;
                const fontSize = Math.max(32, highTextSize * 1000);
                const highTextbgSize = { width: 0.9, height: 0.25 };

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
    // Store all device metadata on the PDU mesh for mouse hover/click events
    pdu.deviceMetadata = {
        deviceId: deviceId,
        category: category,
        urlLink: urlLink,
        zbxSrvIP: zbxSrvIP,                      // Zabbix server IP
        zbxAPI: zbxAPI,
        zbxHost: zbxHost,
        zbxHostKeys: [...zbxHostKeys],
        zbxHostKeyValues: [...zbxHostKeyValues]
    };

    // Helper method to get metadata (for raycasting/hover systems)
    pdu.getDeviceMetadata = function() {
        return this.deviceMetadata;
    };

    // Helper method to update metadata dynamically
    pdu.updateDeviceMetadata = function(metadata) {
        Object.assign(this.deviceMetadata, metadata);
    };

    // Helper method to add Zabbix host key + value pair to arrays
    pdu.addZbxHostKey = function(hostKey, hostKeyValue = '') {
        if (hostKey && !this.deviceMetadata.zbxHostKeys.includes(hostKey)) {
            this.deviceMetadata.zbxHostKeys.push(hostKey);
            this.deviceMetadata.zbxHostKeyValues.push(hostKeyValue);
        }
    };

    // Helper method to remove Zabbix host key + value pair from arrays
    pdu.removeZbxHostKey = function(hostKey) {
        const index = this.deviceMetadata.zbxHostKeys.indexOf(hostKey);
        if (index > -1) {
            this.deviceMetadata.zbxHostKeys.splice(index, 1);
            this.deviceMetadata.zbxHostKeyValues.splice(index, 1);
        }
    };

    // Helper method to update specific host key value
    pdu.updateZbxHostKeyValue = function(hostKey, newValue) {
        const index = this.deviceMetadata.zbxHostKeys.indexOf(hostKey);
        if (index > -1) {
            this.deviceMetadata.zbxHostKeyValues[index] = newValue;
        }
    };

    // Helper to get all key-value pairs for popup
    pdu.getZbxKeyValuePairs = function() {
        const pairs = {};
        this.deviceMetadata.zbxHostKeys.forEach((key, index) => {
            pairs[key] = this.deviceMetadata.zbxHostKeyValues[index] || 'N/A';
        });
        return pairs;
    };

    // Helper to clear all Zabbix data
    pdu.clearZbxData = function() {
        this.deviceMetadata.zbxHostKeys = [];
        this.deviceMetadata.zbxHostKeyValues = [];
    };

    return pdu;
}
