
function createDoor(scene, options = {}) {
    const {
        // Main Dimensions
        deviceWidth = 0.90,
        deviceHeight = 1.8,
        deviceDepth = 0.08,
        devicePosition = { x: 0, y: 1.05, z: 0 },

        // Outer Frame Dimension
        outerFrameWidth = 0.1, // Controlled by this single dimension

        // Glass Dimensions
        glassWidth = 0.4,
        glassHeight = 1.2,
        glassPosition = { x: 0, y: 0, z: 0 },

        // Colors & Aesthetics
        deviceColor = 0xd1d5db,
        deviceoutlineColor = 0x000000,
        handleColor = 0xcccccc,
        glassColor = 0x88ccff,
        glassOpacity = 0.3,

        // Logic
        orientation = 'FRONT',
        doorType = 'Single',
    } = options;

    const doorGroup = new THREE.Group();
    scene.add(doorGroup);

    // --- MATERIALS ---
    const doorMat = new THREE.MeshStandardMaterial({ color: deviceColor });
    const glassMat = new THREE.MeshStandardMaterial({
        color: glassColor,
        transparent: true,
        opacity: glassOpacity,
        roughness: 0.1,
        metalness: 0.5,
        side: THREE.DoubleSide
    });
    const handleMat = new THREE.MeshStandardMaterial({ color: handleColor, metalness: 0.9, roughness: 0.1 });
    const outlineMat = new THREE.LineBasicMaterial({ color: deviceoutlineColor, transparent: true, opacity: 0.5 });

    // --- OUTER FRAME LOGIC (Top, Left, Right) ---
    const frameGroup = new THREE.Group();
    
    // Left Pillar
    const sideFrameGeo = new THREE.BoxGeometry(outerFrameWidth, deviceHeight, deviceDepth * 1.1);
    const leftFrame = new THREE.Mesh(sideFrameGeo, doorMat);
    leftFrame.position.set(-(deviceWidth / 2 + outerFrameWidth / 2), 0, 0);
    frameGroup.add(leftFrame);

    // Right Pillar
    const rightFrame = leftFrame.clone();
    rightFrame.position.set((deviceWidth / 2 + outerFrameWidth / 2), 0, 0);
    frameGroup.add(rightFrame);

    // Top Header
    const topFrameGeo = new THREE.BoxGeometry(deviceWidth + (outerFrameWidth * 2), outerFrameWidth, deviceDepth * 1.1);
    const topFrame = new THREE.Mesh(topFrameGeo, doorMat);
    topFrame.position.set(0, deviceHeight / 2 + outerFrameWidth / 2, 0);
    frameGroup.add(topFrame);

    // Add outlines to frame parts
    [leftFrame, rightFrame, topFrame].forEach(part => {
        const edges = new THREE.EdgesGeometry(part.geometry);
        const outline = new THREE.LineSegments(edges, outlineMat);
        part.add(outline);
    });

    doorGroup.add(frameGroup);

    // --- HELPER: Create Door Leaf ---
    const createLeaf = (width, height, isRightSide = false) => {
        const leafGroup = new THREE.Group();

        const doorBodyGeo = new THREE.BoxGeometry(width, height, deviceDepth);
        const doorBody = new THREE.Mesh(doorBodyGeo, doorMat);
        leafGroup.add(doorBody);

        const glassGeo = new THREE.PlaneGeometry(glassWidth, glassHeight);
        const glassMesh = new THREE.Mesh(glassGeo, glassMat);
        glassMesh.position.set(glassPosition.x, glassPosition.y, (deviceDepth / 2 + 0.001));
        leafGroup.add(glassMesh);

        const glassMeshBack = glassMesh.clone();
        glassMeshBack.position.z = -(deviceDepth / 2 + 0.001);
        glassMeshBack.rotation.y = Math.PI;
        leafGroup.add(glassMeshBack);

        const createHandle = () => {
            const hGroup = new THREE.Group();
            const barGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.4);
            const bar = new THREE.Mesh(barGeo, handleMat);
            hGroup.add(bar);
            return hGroup;
        };

        const handleOffset = width / 2 - 0.04;
        const handleX = isRightSide ? -handleOffset : handleOffset;

        const frontHandle = createHandle();
        frontHandle.position.set(handleX, 0, deviceDepth / 2);
        leafGroup.add(frontHandle);

        const backHandle = createHandle();
        backHandle.position.set(handleX, 0, -deviceDepth / 2);
        backHandle.rotation.y = Math.PI;
        leafGroup.add(backHandle);

        const edges = new THREE.EdgesGeometry(doorBodyGeo);
        const outline = new THREE.LineSegments(edges, outlineMat);
        leafGroup.add(outline);

        return leafGroup;
    };

    // --- CONSTRUCT DOOR TYPE ---
    if (doorType.toUpperCase() === 'DOUBLE') {
        const leafWidth = deviceWidth / 2;
        const leftLeaf = createLeaf(leafWidth, deviceHeight, false);
        leftLeaf.position.set(-leafWidth / 2, 0, 0);
        doorGroup.add(leftLeaf);

        const rightLeaf = createLeaf(leafWidth, deviceHeight, true);
        rightLeaf.position.set(leafWidth / 2, 0, 0);
        doorGroup.add(rightLeaf);
    } else {
        const singleLeaf = createLeaf(deviceWidth, deviceHeight, false);
        doorGroup.add(singleLeaf);
    }

    // --- FINAL TRANSFORMS ---
    doorGroup.position.set(devicePosition.x, devicePosition.y, devicePosition.z);

    switch (orientation.toUpperCase()) {
        case 'BACK':  doorGroup.rotation.y = Math.PI; break;
        case 'LEFT':  doorGroup.rotation.y = Math.PI / 2; break;
        case 'RIGHT': doorGroup.rotation.y = -Math.PI / 2; break;
        case 'FRONT':
        default:      doorGroup.rotation.y = 0; break;
    }

    return doorGroup;
}
