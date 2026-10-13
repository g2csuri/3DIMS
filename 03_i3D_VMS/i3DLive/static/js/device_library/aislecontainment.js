// static/js/device_library/aislecontainment.js

function createAisleContainment(scene, options = {}) {
    const {
        // Container dimensions
        deviceWidth = 1.85,
        deviceHeight = 1.95,
        deviceDepth = 3.45,
        devicePosition = { x: -2.25, y: 0, z: -0.55 },

        // ORIENTATION (Matching serverrack.js logic)
        orientation = 'RIGHT',

        // Door dimensions (Double Sliding Doors)
        doorWidth = 1.6,
        doorHeight = 2.0,
        handleColor = 0xcccccc,
        doorOffset = 0.2,

        // Material properties
        frameColor = 0x222222,
        glassColor = 0x88ccff,
        glassOpacity = 0.3,

        // Outline/Frame Thickness
        outlineWidth = 0.02

    } = options;

    const group = new THREE.Group();
    scene.add(group);

    // === MATERIALS ===
    const glassMaterial = new THREE.MeshStandardMaterial({
        color: glassColor,
        transparent: true,
        opacity: glassOpacity,
        roughness: 0.1,
        metalness: 0.5,
        side: THREE.DoubleSide,

        depthWrite: false,      // High priority: prevents glass from "blocking" interior pixels
        depthTest: true,       // Keeps the glass in the right 3D space
        renderOrder: 1,       // Forces the glass to be drawn AFTER the racks/trays

        polygonOffset: true,
        polygonOffsetFactor: 1,
        polygonOffsetUnits: 1

    });

    const frameMaterial = new THREE.MeshStandardMaterial({
        color: frameColor,
        roughness: 0.5
    });

    // === HELPER: BOLD FRAME PANEL ===
    const createContainmentPanel = (width, height, isDoor = false, side = 'center') => {
        const panelGroup = new THREE.Group();

        const glassGeo = new THREE.PlaneGeometry(width, height);
        const glass = new THREE.Mesh(glassGeo, glassMaterial);
        panelGroup.add(glass);

        const createBar = (w, h, d, px, py, pz) => {
            const barGeo = new THREE.BoxGeometry(w, h, d);
            const bar = new THREE.Mesh(barGeo, frameMaterial);
            bar.position.set(px, py, pz);

            bar.frustumCulled = false;  // This line is for ensuring the devices are always visable inside the aislecontainment cabin

            panelGroup.add(bar);
        };

        createBar(outlineWidth, height, outlineWidth, -width/2, 0, 0); 
        createBar(outlineWidth, height, outlineWidth, width/2, 0, 0);  
        createBar(width, outlineWidth, outlineWidth, 0, height/2, 0);  
        createBar(width, outlineWidth, outlineWidth, 0, -height/2, 0); 

        if (isDoor) {
            const handleGeo = new THREE.CapsuleGeometry(0.02, 0.4, 4, 8);
            const handleMat = new THREE.MeshStandardMaterial({ color: handleColor });
            const handle = new THREE.Mesh(handleGeo, handleMat);
            const handleX = (side === 'left') ? (width / 2 - 0.05) : (-width / 2 + 0.05);
            handle.position.set(handleX, 0, 0.05);
            panelGroup.add(handle);
        }

        return panelGroup;
    };

    // === ASSEMBLY ===

    // 1. Double Sliding Doors (Back & Front)
    const createDoubleDoorSet = (posZ, rotY) => {
        const doorSet = new THREE.Group();
        const singleDoorWidth = doorWidth / 2;
        
        const leftLeaf = createContainmentPanel(singleDoorWidth, doorHeight, true, 'left');
        leftLeaf.position.set(-singleDoorWidth / 2 - doorOffset, doorHeight / 2, 0);
        
        const rightLeaf = createContainmentPanel(singleDoorWidth, doorHeight, true, 'right');
        rightLeaf.position.set(singleDoorWidth / 2 + doorOffset, doorHeight / 2, 0);
        
        doorSet.add(leftLeaf, rightLeaf);
        doorSet.position.z = posZ;
        doorSet.rotation.y = rotY;
        return doorSet;
    };

    group.add(createDoubleDoorSet(-deviceDepth / 2, 0));
    group.add(createDoubleDoorSet(deviceDepth / 2, Math.PI));

    // 2. Side Walls
    const rightWall = createContainmentPanel(deviceDepth, deviceHeight);
    rightWall.position.set(deviceWidth / 2, deviceHeight / 2, 0);
    rightWall.rotation.y = -Math.PI / 2;
    group.add(rightWall);

    const leftWall = createContainmentPanel(deviceDepth, deviceHeight);
    leftWall.position.set(-deviceWidth / 2, deviceHeight / 2, 0);
    leftWall.rotation.y = Math.PI / 2;
    group.add(leftWall);

    // 3. Top Transparent Roof
    const roof = createContainmentPanel(deviceWidth, deviceDepth);
    roof.position.set(0, deviceHeight, 0);
    roof.rotation.x = Math.PI / 2;
    group.add(roof);

    // 4. Fill gaps around double doors
    if (doorWidth < deviceWidth) {
        const fillWidth = (deviceWidth - doorWidth) / 2;
        [1, -1].forEach(side => {
            const filler = createContainmentPanel(fillWidth, deviceHeight);
            const xPos = side * (doorWidth / 2 + fillWidth / 2);
            
            const f = filler.clone();
            f.position.set(xPos, deviceHeight / 2, deviceDepth / 2);
            group.add(f);

            const b = filler.clone();
            b.position.set(xPos, deviceHeight / 2, -deviceDepth / 2);
            group.add(b);
        });
    }

    // === ORIENTATION LOGIC (Integrated from serverrack.js) ===
    const orient = (typeof orientation === 'string') ? orientation.toUpperCase() : '';
    switch(orient) {
        case 'BACK':
            group.rotation.y = Math.PI;
            break;
        case 'LEFT':
            group.rotation.y = Math.PI / 2;
            break;
        case 'RIGHT':
            group.rotation.y = -Math.PI / 2;
            break;
        case 'FRONT':
        default:
            // If it's a number (from previous version), use it as degrees
            if (!isNaN(orientation)) {
                group.rotation.y = (orientation * Math.PI) / 180;
            } else {
                group.rotation.y = 0;
            }
            break;
    }

    // Final Position
    group.position.set(devicePosition.x, devicePosition.y, devicePosition.z);

    return group;
}
