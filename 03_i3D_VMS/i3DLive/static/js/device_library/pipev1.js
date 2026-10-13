// static/js/device_library/pipeLineV1.js

function createPipe(scene, options = {}) {
    const {
        // Main Spatial Layout Dimensions
        pipeRadius = 0.05,
        deviceDepth = 2.0, // Total length of the main core pipe body
        devicePosition = { x: 0, y: 2.4, z: 0 },

        // Colors & Structural Material Aesthetics
        deviceColor = 0x00ffff,

        // Options: 'Horizontal_FrontBack', 'Horizontal_LeftRight', 'Vertical'
        pipeOrientation = 'Horizontal_FrontBack',

        // =================================================================
        // ===== FRONT END SHORTENED ROUTING REGISTRY =====
        // =================================================================
        // BEND 1
        F_B1_Sts = 'Close', // 'Enable' or 'Close'
        F_B1_H   = 0,       // Horizontal Angle (Yaw)
        F_B1_V   = 90,      // Vertical Angle (Pitch)
        F_B1_L   = 0.5,     // Length

        // BEND 2
        F_B2_Sts = 'Close', 
        F_B2_H   = 90,
        F_B2_V   = 0,
        F_B2_L   = 0.5,

        // BEND 3
        F_B3_Sts = 'Close', 
        F_B3_H   = 90,
        F_B3_V   = -45,
        F_B3_L   = 0.5,

        // =================================================================
        // ===== REAR END SHORTENED ROUTING REGISTRY =====
        // =================================================================
        // BEND 1
        R_B1_Sts = 'Close', 
        R_B1_H   = 180,
        R_B1_V   = 0,
        R_B1_L   = 0.5,

        // BEND 2
        R_B2_Sts = 'Close', 
        R_B2_H   = 180,
        R_B2_V   = -90,
        R_B2_L   = 0.5,

        // BEND 3
        R_B3_Sts = 'Close', 
        R_B3_H   = 270,
        R_B3_V   = 0,
        R_B3_L   = 0.5,

        // FLOW SYSTEM TELEMETRY CONTROLS
        flowAnimation = 'Enable',       
        arrowFlowDirection = 'LeftToRight', 
        flowSpeed = 1.5,                
        flowColor = 0xFFFFFF,           
        arrowIntensity = 1.0,  
        flowOnValue = '1', 
        zbxKey = '',       

        // ===== LIVE MONITORING SYSTEM METADATA =====
        deviceId = '',
        category = 'piping',
        urlLink = '',
        zbxSrvIP = '',
        zbxAPI = '',
        zbxHost = '',
        zbxHostKeys = [],
        zbxHostKeyValues = []
    } = options;

    const pipeGroup = new THREE.Group();
    scene.add(pipeGroup);

    const normalizedOrientation = pipeOrientation.toUpperCase(); 
    pipeGroup.isFlowing = false; 

    // --- 1. STRUCTURAL MATERIAL SPECIFICATION ---
    const pipeMat = new THREE.MeshPhongMaterial({
        color: deviceColor,
        shininess: 30,
        flatShading: false,
        emissive: deviceColor,
        emissiveIntensity: 0.05
    });

    // --- 2. HIGH-INTENSITY FLUID STREAM SHADER MATERIAL ---
    let fluidShaderMat = null;
    let globalTimeUniform = { value: 0.0 };

    if (flowAnimation.toUpperCase() === 'ENABLE') {
        let dirSign = (arrowFlowDirection.toUpperCase() === 'RIGHTTOLEFT' || arrowFlowDirection.toUpperCase() === 'BOTTOMTOTOP') ? -1.0 : 1.0;

        fluidShaderMat = new THREE.ShaderMaterial({
            uniforms: {
                time: globalTimeUniform,
                baseColor: { value: new THREE.Color(deviceColor) },
                streamColor: { value: new THREE.Color(flowColor) }, 
                speed: { value: flowSpeed * dirSign },              
                intensity: { value: arrowIntensity } 
            },
            vertexShader: `
                varying vec2 vUv;
                varying vec3 vNormal;
                void main() {
                    vUv = uv;
                    vNormal = normalize(normalMatrix * normal);
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform vec3 baseColor;
                uniform vec3 streamColor;
                uniform float speed;
                uniform float intensity;
                varying vec2 vUv;
                varying vec3 vNormal;

                void main() {
                    float wave = sin(vUv.y * 40.0 - time * speed * 8.0) * 0.5 + 0.5;
                    float wave2 = cos(vUv.x * 6.28 + time * speed * 2.0) * 0.2 + 0.8;
                    float mixFactor = clamp(wave * wave2 * 0.6 * intensity, 0.0, 0.9); 
                    vec3 finalColor = mix(baseColor, streamColor, mixFactor);
                    float rim = pow(1.0 - max(dot(vNormal, vec3(0, 0, 1)), 0.0), 2.0);
                    finalColor += streamColor * rim * 0.4 * intensity;
                    gl_FragColor = vec4(finalColor, 1.0);
                }
            `
        });
    }

    // --- 3. MAIN PIPE SEGMENT GENERATION ---
    const staticBaseGeo = new THREE.CylinderGeometry(pipeRadius, pipeRadius, deviceDepth, 32, 1, true);
    const staticBasePipe = new THREE.Mesh(staticBaseGeo, pipeMat);
    
    const mainGeo = new THREE.CylinderGeometry(pipeRadius * 1.002, pipeRadius * 1.002, deviceDepth, 32, 1, true);
    const mainPipe = new THREE.Mesh(mainGeo, fluidShaderMat ? fluidShaderMat : pipeMat);
    
    mainPipe.visible = false;

    if (normalizedOrientation === 'HORIZONTAL_FRONTBACK') {
        staticBasePipe.rotation.x = Math.PI / 2;
        mainPipe.rotation.x = Math.PI / 2;
    } else if (normalizedOrientation === 'HORIZONTAL_LEFTRIGHT') {
        staticBasePipe.rotation.z = Math.PI / 2;
        mainPipe.rotation.z = Math.PI / 2;
    } else if (normalizedOrientation === 'VERTICAL') {
        staticBasePipe.rotation.set(0, 0, 0); 
    }
    pipeGroup.add(staticBasePipe);
    pipeGroup.add(mainPipe);


    // --- 4. 3-STAGE CONTINUOUS ANGULAR ROUTING ENGINE ---
    const buildAngularBranch = (parentX, parentY, parentZ, horizDeg, vertDeg, branchLength) => {
        const theta = (horizDeg * Math.PI) / 180; 
        const phi = (vertDeg * Math.PI) / 180;    

        const dirX = Math.cos(phi) * Math.sin(theta);
        const dirY = Math.sin(phi);
        const dirZ = Math.cos(phi) * Math.cos(theta);

        const jointSphereGeo = new THREE.SphereGeometry(pipeRadius, 32, 16);
        const jointSphere = new THREE.Mesh(jointSphereGeo, pipeMat);
        jointSphere.position.set(parentX, parentY, parentZ);
        pipeGroup.add(jointSphere);

        const branchGeo = new THREE.CylinderGeometry(pipeRadius, pipeRadius, branchLength, 32, 1, false);
        const branchMesh = new THREE.Mesh(branchGeo, pipeMat);

        const targetTipX = parentX + dirX * branchLength;
        const targetTipY = parentY + dirY * branchLength;
        const targetTipZ = parentZ + dirZ * branchLength;

        branchMesh.position.set(
            (parentX + targetTipX) / 2,
            (parentY + targetTipY) / 2,
            (parentZ + targetTipZ) / 2
        );

        const upVector = new THREE.Vector3(0, 1, 0);
        const directionVector = new THREE.Vector3(dirX, dirY, dirZ).normalize();
        branchMesh.quaternion.setFromUnitVectors(upVector, directionVector);
        
        pipeGroup.add(branchMesh);

        return { x: targetTipX, y: targetTipY, z: targetTipZ };
    };

    const processTerminalPipeline = (isFrontEnd, b1Sts, b1H, b1V, b1L, b2Sts, b2H, b2V, b2L, b3Sts, b3H, b3V, b3L) => {
        const halfLengthPos = deviceDepth / 2;
        const directionSign = isFrontEnd ? 1 : -1;
        let startX = 0, startY = 0, startZ = 0;

        if (normalizedOrientation === 'HORIZONTAL_FRONTBACK')  startZ = halfLengthPos * directionSign;
        else if (normalizedOrientation === 'HORIZONTAL_LEFTRIGHT') startX = halfLengthPos * directionSign;
        else if (normalizedOrientation === 'VERTICAL')             startY = halfLengthPos * directionSign;

        if (b1Sts.toUpperCase() !== 'ENABLE') {
            const capGeo = new THREE.CircleGeometry(pipeRadius, 32);
            const cap = new THREE.Mesh(capGeo, pipeMat);
            cap.position.set(startX, startY, startZ);

            if (normalizedOrientation === 'HORIZONTAL_FRONTBACK')  cap.rotation.y = isFrontEnd ? 0 : Math.PI;
            else if (normalizedOrientation === 'HORIZONTAL_LEFTRIGHT') cap.rotation.y = isFrontEnd ? Math.PI / 2 : -Math.PI / 2;
            else if (normalizedOrientation === 'VERTICAL')             cap.rotation.x = isFrontEnd ? -Math.PI / 2 : Math.PI / 2;

            pipeGroup.add(cap);
            return;
        }

        // Execute sequential multi-stage rendering calculations
        const stage1Tip = buildAngularBranch(startX, startY, startZ, b1H, b1V, b1L);

        if (b2Sts.toUpperCase() === 'ENABLE') {
            const stage2Tip = buildAngularBranch(stage1Tip.x, stage1Tip.y, stage1Tip.z, b2H, b2V, b2L);

            if (b3Sts.toUpperCase() === 'ENABLE') {
                buildAngularBranch(stage2Tip.x, stage2Tip.y, stage2Tip.z, b3H, b3V, b3L);
            }
        }
    };

    // Compile Front and Rear networks
    processTerminalPipeline(true, F_B1_Sts, F_B1_H, F_B1_V, F_B1_L, F_B2_Sts, F_B2_H, F_B2_V, F_B2_L, F_B3_Sts, F_B3_H, F_B3_V, F_B3_L);
    processTerminalPipeline(false, R_B1_Sts, R_B1_H, R_B1_V, R_B1_L, R_B2_Sts, R_B2_H, R_B2_V, R_B2_L, R_B3_Sts, R_B3_H, R_B3_V, R_B3_L);

    pipeGroup.position.set(devicePosition.x, devicePosition.y, devicePosition.z);


    // =================================================================
    // TELEMETRY ENGINE & KEY INTERCEPT VALIDATION
    // =================================================================
    pipeGroup.applyLiveData = function(row) {
        if (!row) {
            this.isFlowing = false;
            mainPipe.visible = false;
            return;
        }

        let statusValue = undefined;
        const checkKey = zbxKey ? zbxKey.trim() : '';

        if (checkKey !== '') {
            if (row.key === checkKey || row.itemkey === checkKey || row.zbxKey === checkKey) {
                statusValue = (row.value !== undefined) ? row.value : row.status;
            } else if (row[checkKey] !== undefined) {
                statusValue = row[checkKey];
            }
        }

        if (statusValue === undefined) {
            if (row.status !== undefined && row.status !== null) statusValue = row.status;
            else if (row.value !== undefined && row.value !== null) statusValue = row.value;
            else if (row.val !== undefined && row.val !== null) statusValue = row.val;
        }

        if (statusValue === undefined || statusValue === null) {
            this.isFlowing = false;
            mainPipe.visible = false;
            return;
        }

        let parsedVal = String(statusValue).trim().toLowerCase();
        let targetOnVal = String(flowOnValue).trim().toLowerCase();

        if (parsedVal === targetOnVal || parsedVal === '1' || parsedVal === 'true' || parsedVal === 'on' || parsedVal === 'run') {
            this.isFlowing = true;
        } else {
            this.isFlowing = false;
        }

        mainPipe.visible = this.isFlowing;
    };

    // =================================================================
    // RUNTIME ANIMATION TICKER LOOP
    // =================================================================
    pipeGroup.updatePipeAnimation = function(dt) {
        if (!dt) dt = 0.016;
        if (!this.isFlowing || !mainPipe.visible) return;
        globalTimeUniform.value += dt;
    };

    pipeGroup.updateFan = function(dt) {
        this.updatePipeAnimation(dt);
    };

/*
    // Telemetry and Management Metadata properties allocation
    pipeGroup.deviceMetadata = {
        deviceId, category, urlLink, zbxSrvIP, zbxAPI, zbxHost, zbxHostKeys, zbxHostKeyValues, zbxKey, flowOnValue,
        
        // Short Names mapping explicitly to metadata structures
        F_B1_Sts, F_B1_H, F_B1_V, F_B1_L,
        F_B2_Sts, F_B2_H, F_B2_V, F_B2_L,
        F_B3_Sts, F_B3_H, F_B3_V, F_B3_L,

        R_B1_Sts, R_B1_H, R_B1_V, R_B1_L,
        R_B2_Sts, R_B2_H, R_B2_V, R_B2_L,
        R_B3_Sts, R_B3_H, R_B3_V, R_B3_L
    };

    pipeGroup.getDeviceMetadata = function() { return this.deviceMetadata; };
    pipeGroup.updateDeviceMetadata = function(m) { Object.assign(this.deviceMetadata, m); };
*/

    return pipeGroup;
}
