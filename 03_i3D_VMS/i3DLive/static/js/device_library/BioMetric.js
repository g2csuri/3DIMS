// static/js/device_library/BioMetric.js

function createBioMetric(scene, options = {}) {
    const {
        // BioMetric dimensions
        deviceWidth = 0.10,
        deviceHeight = 0.23,
        deviceDepth = 0.05,
        devicePosition = { x: 1.40, y: 1.60, z: 1.46 },

        // Camera Position
        camPosition = { x: 0, y: 0.6, z: 0.46 },

        // BioMetric properties
        deviceColor = 0xFFFFFF,
        deviceoutlineColor = 0x444444,

        // ORIENTATION
        orientation = 'Front',

        // FACE TEXTURES - NEW! (optional)
        faceTextures = {
            front: '/static/js/device_library/textures/Electrical_Panel_1.png',
            back: '/static/js/device_library/textures/BioMetric_front.png'
            //left: '/static/textures/BioMetric_side.png',
            //right: '/static/textures/BioMetric_side.png'
        },

        // label text properties
        text = "BioMetric",
        textPosition = { x: 0, y: 0.20, z: -0.05 },
        textColor = 0xffffff,
        textSize = 0.06,
        textFont = 'Arial',
        textCanvasBgColor = 0xFF0000,
        textbgSize = { width: 0.2, height: 0.08 },

        // screen properties
        screenEnabled = 'false',
        screenPosition = { x: 0, y: 0.27, z: 0.11 },
        screenSize = { width: 0.5, height: 0.25 },
        screenColor = 0x00FF00,
        screenoutlineColor = 0x000000,

        // stand properties
        standHeight = 0.01,
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
        // FRONT | BACK | LEFT | RIGHT | CAMERA

        // ===== STATUS LED OPTIONS =====
        ledEnabled = false,
        ledRadius = 0.04,
        ledHeight = 0.04,
        //ledOffset = { x: deviceWidth / 2 - 0.06, y: -deviceHeight / 2 + 0.12, z: deviceDepth / 2 + 0.01 },
        ledOffset = { x: 0.19, y: -0.40, z: 0.12 },

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
    stand.position.y = -deviceHeight/2 - standHeight/2;
    stand.castShadow = true;
    stand.receiveShadow = true;

    // === MAIN BioMetric WITH FACE TEXTURES ===
    const geometry = new THREE.BoxGeometry(deviceWidth, deviceHeight, deviceDepth);

    // Create 6 materials for each face (BoxGeometry order: +X, -X, +Y, -Y, +Z, -Z)
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
            metalness: 0.5
        }),

        // -Y (Bottom face)
        new THREE.MeshStandardMaterial({
            color: deviceColor,
            roughness: 0.7,
            metalness: 0.1
        }),

        // +Z (Front face)
        faceTextures.front ? new THREE.MeshStandardMaterial({
            map: loader.load(faceTextures.front)
        }) : new THREE.MeshStandardMaterial({
            color: deviceColor,
            roughness: 0.5,
            metalness: 0.5
        }),

        // -Z (Back face)
        faceTextures.back ? new THREE.MeshStandardMaterial({
            map: loader.load(faceTextures.back)
        }) : new THREE.MeshStandardMaterial({ color: deviceColor })
    ];

    const BioMetric = new THREE.Mesh(geometry, materials);
    BioMetric.position.y = standHeight;
    BioMetric.castShadow = true;
    BioMetric.receiveShadow = true;
    scene.add(BioMetric);

    // Add stand to BioMetric
    //BioMetric.add(stand);

    // BioMetric Outline
    const edges = new THREE.EdgesGeometry(geometry);
    const outlineMaterial = new THREE.LineBasicMaterial({
        color: deviceoutlineColor,
        linewidth: 2,
        transparent: true,
        opacity: 0.8
    });
    const outline = new THREE.LineSegments(edges, outlineMaterial);
    //BioMetric.add(outline);

    // === ORIENTATION ROTATION ===
    switch(orientation.toUpperCase()) {
        case 'BACK':
            BioMetric.rotation.y = Math.PI;
            break;
        case 'LEFT':
            BioMetric.rotation.y = Math.PI / 2;
            break;
        case 'RIGHT':
            BioMetric.rotation.y = -Math.PI / 2;
            break;
        case 'FRONT':
        default:
            BioMetric.rotation.y = 0;
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

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    const textMaterial = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        side: THREE.DoubleSide
    });

    const textPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(textbgSize.width * 0.9, textbgSize.height * 0.9),
        textMaterial
    );
    textPlane.position.set(textPosition.x, textPosition.y, textPosition.z + 0.001);
    BioMetric.add(textPlane);

    // === SCREEN ===
    if( screenEnabled)
    {
	    const screenGeometry = new THREE.PlaneGeometry(screenSize.width, screenSize.height);
	    const screenMaterial = new THREE.MeshStandardMaterial({
        		color: screenColor,
        		side: THREE.DoubleSide,
        		transparent: true,
        		opacity: 0.8
    		});
    	const screen = new THREE.Mesh(screenGeometry, screenMaterial);
    	screen.position.set(screenPosition.x, screenPosition.y, screenPosition.z);
    	BioMetric.add(screen);

    	const screenEdges = new THREE.EdgesGeometry(screenGeometry);
    	const screenOutlineMaterial = new THREE.LineBasicMaterial({
        		color: screenoutlineColor,
        		linewidth: 1.5,
        		transparent: true,
        		opacity: 0.9
    	});
    	const screenOutline = new THREE.LineSegments(screenEdges, screenOutlineMaterial);
    	screen.add(screenOutline);
    }
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
            BioMetric.updateHighLabelFacing = function (camera) {
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
        BioMetric.highLabelMesh = planeHL;
        BioMetric.add(planeHL);

        // line from label bottom center to BioMetric top/front
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
        BioMetric.add(line);

        // round dot at BioMetric surface
        const dotGeom = new THREE.SphereGeometry(highDotRadius, 16, 16);
        const dotMat = new THREE.MeshBasicMaterial({ color: highDotColor });
        const dot = new THREE.Mesh(dotGeom, dotMat);
        dot.position.copy(targetPoint);
        BioMetric.add(dot);
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
        BioMetric.add(led);

        // glow sphere for alarm / highlight
        const glowGeom = new THREE.SphereGeometry(ledRadius * 2.0, 16, 16);
        const glowMat = new THREE.MeshBasicMaterial({
            color: alarmColor,
            transparent: true,
            opacity: 0.0
        });
        const glow = new THREE.Mesh(glowGeom, glowMat);
        glow.position.copy(led.position);
        BioMetric.add(glow);

        // store state and colors on BioMetric mesh
        BioMetric.led = led;
        BioMetric.ledMaterial = ledMat;
        BioMetric.ledGlow = glow;
        BioMetric.ledGlowMaterial = glowMat;

        BioMetric.ledColors = {
            HEALTHY: new THREE.Color(healthyColor),
            WARNING: new THREE.Color(warningColor),
            ALARM:   new THREE.Color(alarmColor),
            RUN:     new THREE.Color(runColor),
            CUSTOM:  new THREE.Color(customColor)
        };

        BioMetric.ledState = ledState.toUpperCase();
        BioMetric.ledBlinkPeriod = ledBlinkPeriod;
        BioMetric.ledTime = 0;

        // Helper to get color for current state
        BioMetric._getLEDColor = function () {
            return this.ledColors[this.ledState] || this.ledColors.HEALTHY;
        };

        // Called from global animate() via scene.traverse
        BioMetric.updateLED = function (dt) {
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
        BioMetric.setLEDState = function (state) {
            this.ledState = String(state || 'HEALTHY').toUpperCase();
        };

        // === LIVE DATA HANDLER HOOK ===
        // row is one element from /api/live_data
        // e.g. { id: "BioMetric-01", type: "BioMetric", state: "ALARM", label: "Fire Alarm Panel 1" }
        BioMetric.applyLiveData = function(row) {
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
    // Store all device metadata on the BioMetric mesh for mouse hover/click events
    BioMetric.deviceMetadata = {
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
    BioMetric.getDeviceMetadata = function() {
        return this.deviceMetadata;
    };

    // Helper method to update metadata dynamically
    BioMetric.updateDeviceMetadata = function(metadata) {
        Object.assign(this.deviceMetadata, metadata);
    };

    // Helper method to add Zabbix host key + value pair to arrays
    BioMetric.addZbxHostKey = function(hostKey, hostKeyValue = '') {
        if (hostKey && !this.deviceMetadata.zbxHostKeys.includes(hostKey)) {
            this.deviceMetadata.zbxHostKeys.push(hostKey);
            this.deviceMetadata.zbxHostKeyValues.push(hostKeyValue);
        }
    };

    // Helper method to remove Zabbix host key + value pair from arrays
    BioMetric.removeZbxHostKey = function(hostKey) {
        const index = this.deviceMetadata.zbxHostKeys.indexOf(hostKey);
        if (index > -1) {
            this.deviceMetadata.zbxHostKeys.splice(index, 1);
            this.deviceMetadata.zbxHostKeyValues.splice(index, 1);
        }
    };

    // Helper method to update specific host key value
    BioMetric.updateZbxHostKeyValue = function(hostKey, newValue) {
        const index = this.deviceMetadata.zbxHostKeys.indexOf(hostKey);
        if (index > -1) {
            this.deviceMetadata.zbxHostKeyValues[index] = newValue;
        }
    };

    // Helper method to get all host key-value pairs as object for popup display
    BioMetric.getZbxKeyValuePairs = function() {
        const pairs = {};
        this.deviceMetadata.zbxHostKeys.forEach((key, index) => {
            pairs[key] = this.deviceMetadata.zbxHostKeyValues[index] || 'N/A';
        });
        return pairs;
    };

    // Helper method to clear all Zabbix data
    BioMetric.clearZbxData = function() {
        this.deviceMetadata.zbxHostKeys = [];
        this.deviceMetadata.zbxHostKeyValues = [];
    };

    return BioMetric;
}
