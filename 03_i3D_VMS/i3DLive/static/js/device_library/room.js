// static/js/device_library/Container.js

function createRoom(scene, options = {}) {
    const {
        // 'room' or 'container'
        roomType = 'room',

        // Container dimensions (world units)
        deviceWidth = 8,
        deviceHeight = 2.5,
        deviceDepth = 5,
        devicePosition = { x: 0, y: 1.6, z: 0.46 },

        // Camera Position
        camPosition = { x: 0, y: 0.6, z: 0.46 },

        // Container properties
        deviceColor = 0xd1d5db,
        deviceoutlineColor = 0x000000,

        // STAND properties
        standHeight = 0.3,
        standColor = 0x666666,

        // FLOOR TILE properties
        floorTileSize = 5,
        floorTileColor = 0xFFFFFF,
        floorTileLineColor = 0x000000,
        floorTileLineWidth = 0.05,

        // CEILING TILE properties
        ceilingTileSize = 5,
        ceilingTileColor = 0xFFFFFF,
        ceilingTileLineColor = 0x000000,
        ceilingTileLineWidth = 0.05,

        // FACE TEXTURES - optional
        faceTextures = {
            front: 'none',
            back: 'none',
            left: 'none',
            right: 'none'
        },

        // label text properties
        text = "BMS Room",
        orientation = 'Front',
        labelOrientation = 'Front',
        textPosition = { x: 4.65, y: 0.29, z: -4.98 },
        textColor = 0xffffff,
        textSize = 2.32,
        textFont = 'Arial',
        textCanvasBgColor = 0x222222,
        textbgSize = { width: 2.5, height: 0.4 }
    } = options;

    const loader = new THREE.TextureLoader();
    const roomGroup = new THREE.Group();
    scene.add(roomGroup);

    // === STAND ===
    const standGeometry = new THREE.BoxGeometry(deviceWidth, standHeight, deviceDepth);
    const standMaterial = new THREE.MeshStandardMaterial({ color: standColor });
    const stand = new THREE.Mesh(standGeometry, standMaterial);
    stand.position.set(0, -standHeight / 1.98, 0);
    stand.receiveShadow = true;
    stand.castShadow = true;
    roomGroup.add(stand);


    // === FLOOR WITH PERFECT SQUARE TILES ===
    const floorCanvas = document.createElement('canvas');
    const floorCtx = floorCanvas.getContext('2d');
    floorCanvas.width = 1024;
    floorCanvas.height = 1024;

    // Fill entire canvas with tile color FIRST
    floorCtx.fillStyle = new THREE.Color(floorTileColor).getStyle();
    floorCtx.fillRect(0, 0, floorCanvas.width, floorCanvas.height);

    // Calculate tile counts and square size
    const floorTilesX = Math.ceil(deviceWidth / floorTileSize);
    const floorTilesZ = Math.ceil(deviceWidth / floorTileSize);

    const squareTileWorldSize = Math.min(deviceWidth / floorTilesX, deviceDepth / floorTilesZ);

    floorCtx.strokeStyle = new THREE.Color(floorTileLineColor).getStyle();
    floorCtx.lineWidth = floorTileLineWidth * 100;
    floorCtx.lineCap = 'square';

    // Draw perfect square grid lines
    for (let x = 0; x <= floorTilesX; x++) {
        const xPos = (x / floorTilesX) * floorCanvas.width;
        floorCtx.beginPath();
        floorCtx.moveTo(xPos, 0);
        floorCtx.lineTo(xPos, floorCanvas.height);
        floorCtx.stroke();
    }


    for (let z = 0; z <= floorTilesZ; z++) {
        const zPos = (z / floorTilesZ) * floorCanvas.height;
        floorCtx.beginPath();
        floorCtx.moveTo(0, zPos);
        floorCtx.lineTo(floorCanvas.width, zPos);
        floorCtx.stroke();
    }

    const floorTexture = new THREE.CanvasTexture(floorCanvas);
    floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(
        deviceWidth / squareTileWorldSize,
        deviceDepth / squareTileWorldSize
    );
    floorTexture.minFilter = THREE.LinearFilter;

    const floorMat = faceTextures.floor
        ? new THREE.MeshStandardMaterial({ map: loader.load(faceTextures.floor), roughness: 0.9 })
        : new THREE.MeshStandardMaterial({ map: floorTexture, roughness: 0.9 });

    const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(deviceWidth, deviceDepth),
        floorMat
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    floor.receiveShadow = true;
    roomGroup.add(floor);


    // === CEILING WITH PERFECT SQUARE TILES ===
    const ceilingCanvas = document.createElement('canvas');
    const ceilingCtx = ceilingCanvas.getContext('2d');
    ceilingCanvas.width = 1024;
    ceilingCanvas.height = 1024;

    // Fill entire canvas with tile color FIRST
    ceilingCtx.fillStyle = new THREE.Color(ceilingTileColor).getStyle();
    ceilingCtx.fillRect(0, 0, ceilingCanvas.width, ceilingCanvas.height);

    // Calculate tile counts and square size
    const ceilingTilesX = Math.ceil(deviceWidth / ceilingTileSize);
    const ceilingTilesZ = Math.ceil(deviceWidth / ceilingTileSize);

    const ceilingSquareTileWorldSize = Math.min(deviceWidth / ceilingTilesX, deviceDepth / ceilingTilesZ);

    ceilingCtx.strokeStyle = new THREE.Color(ceilingTileLineColor).getStyle();
    ceilingCtx.lineWidth = ceilingTileLineWidth * 100;
    ceilingCtx.lineCap = 'square';

    // Draw perfect square grid lines
    for (let x = 0; x <= ceilingTilesX; x++) {
        const xPos = (x / ceilingTilesX) * ceilingCanvas.width;
        ceilingCtx.beginPath();
        ceilingCtx.moveTo(xPos, 0);
        ceilingCtx.lineTo(xPos, ceilingCanvas.height);
        ceilingCtx.stroke();
    }
    
    for (let z = 0; z <= ceilingTilesZ; z++) {
        const zPos = (z / ceilingTilesZ) * ceilingCanvas.height;
        ceilingCtx.beginPath();
        ceilingCtx.moveTo(0, zPos);
        ceilingCtx.lineTo(ceilingCanvas.width, zPos);
        ceilingCtx.stroke();
    }

    const ceilingTexture = new THREE.CanvasTexture(ceilingCanvas);
    ceilingTexture.wrapS = ceilingTexture.wrapT = THREE.RepeatWrapping;
    ceilingTexture.repeat.set(
        deviceWidth / ceilingSquareTileWorldSize,
        deviceDepth / ceilingSquareTileWorldSize
    );
    ceilingTexture.minFilter = THREE.LinearFilter;

    const ceilingMat = faceTextures.ceiling
        ? new THREE.MeshStandardMaterial({ map: loader.load(faceTextures.ceiling), roughness: 1 })
        : new THREE.MeshStandardMaterial({ map: ceilingTexture, roughness: 1 });

    const ceiling = new THREE.Mesh(
        new THREE.PlaneGeometry(deviceWidth, deviceDepth),
        ceilingMat
    );
    ceiling.position.y = deviceHeight;
    ceiling.rotation.x = Math.PI / 2;
    roomGroup.add(ceiling);



if (roomType === 'room') {

    // === WALLS ===
    const baseWallMat = new THREE.MeshStandardMaterial({
        color: deviceColor,
        roughness: 0.95
    });

//const backWallMat = faceTextures.back ? new THREE.MeshStandardMaterial({ map: loader.load(faceTextures.back), roughness: 0.95 }) : baseWallMat.clone();
//const frontWallMat = faceTextures.front ? new THREE.MeshStandardMaterial({ map: loader.load(faceTextures.front), roughness: 0.95 }) : baseWallMat.clone();
//const rightWallMat = faceTextures.right ? new THREE.MeshStandardMaterial({ map: loader.load(faceTextures.right), roughness: 0.95 }) : baseWallMat.clone();
//const leftWallMat = faceTextures.left ? new THREE.MeshStandardMaterial({ map: loader.load(faceTextures.left), roughness: 0.95 }) : baseWallMat.clone();

const backWallMat = new THREE.MeshStandardMaterial(baseWallMat); //faceTextures.back ? new THREE.MeshStandardMaterial() : baseWallMat.clone();
const frontWallMat = new THREE.MeshStandardMaterial(baseWallMat); // faceTextures.front ? new THREE.MeshStandardMaterial() : baseWallMat.clone();
const rightWallMat = new THREE.MeshStandardMaterial(baseWallMat); // faceTextures.right ? new THREE.MeshStandardMaterial() : baseWallMat.clone();
const leftWallMat = new THREE.MeshStandardMaterial(baseWallMat); // faceTextures.left ? new THREE.MeshStandardMaterial() : baseWallMat.clone();

    const backWall = new THREE.Mesh(new THREE.PlaneGeometry(deviceWidth, deviceHeight), backWallMat);
    backWall.position.set(0, deviceHeight / 2, -deviceDepth / 2);
    backWall.receiveShadow = true;
    roomGroup.add(backWall);

    const frontWall = new THREE.Mesh(new THREE.PlaneGeometry(deviceWidth, deviceHeight), frontWallMat);
    frontWall.position.set(0, deviceHeight / 2, deviceDepth / 2);
    frontWall.rotation.y = Math.PI;
    frontWall.receiveShadow = true;
    roomGroup.add(frontWall);

    const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(deviceDepth, deviceHeight), rightWallMat);
    rightWall.position.set(deviceWidth / 2, deviceHeight / 2, 0);
    rightWall.rotation.y = -Math.PI / 2;
    rightWall.receiveShadow = true;
    roomGroup.add(rightWall);

    const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(deviceDepth, deviceHeight), leftWallMat);
    leftWall.position.set(-deviceWidth / 2, deviceHeight / 2, 0);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.receiveShadow = true;
    roomGroup.add(leftWall);

    // Wall outlines
    const outlineMat = new THREE.LineBasicMaterial({
        color: deviceoutlineColor,
        linewidth: 1,
        transparent: true,
        opacity: 0.4
    });

    [backWall, frontWall, leftWall, rightWall].forEach(wall => {
        const edges = new THREE.EdgesGeometry(wall.geometry);
        const outline = new THREE.LineSegments(edges, outlineMat);
        wall.add(outline);
    });

}

else if(roomType === 'container') {

// === 1. MATERIAL SETUP ===
    const baseWallMat = new THREE.MeshStandardMaterial({
        color: deviceColor,
        roughness: 0.95,
        side: THREE.FrontSide // Only visible from one side
    });

    const outlineMat = new THREE.LineBasicMaterial({
        color: deviceoutlineColor,
        linewidth: 1,
        transparent: true,
        opacity: 0.4
    });

    // === 2. WALL GENERATION HELPER ===
    // This function creates two planes back-to-back for Container mode
    // or one plain plane for Room mode.
    const createSmartWall = (width, height, sideName, position, rotationY) => {
        const wallGroup = new THREE.Group();
        const geometry = new THREE.PlaneGeometry(width, height);

        // A. INNER PLANE (Always plain, visible from inside)
        const innerMesh = new THREE.Mesh(geometry, baseWallMat.clone());
        innerMesh.position.set(0, 0, 0); 
        // No rotation needed here because we rotate the wallGroup
        innerMesh.receiveShadow = true;
        wallGroup.add(innerMesh);

        // B. OUTER PLANE (Textured, visible from outside - ONLY for Containers)
        if (roomType === 'container') {
            const texPath = faceTextures[sideName];
            const outerMat = (texPath && texPath !== 'none') 
                ? new THREE.MeshStandardMaterial({ map: loader.load(texPath), roughness: 0.95, side: THREE.FrontSide })
                : baseWallMat.clone();
            
            const outerMesh = new THREE.Mesh(geometry, outerMat);
            
            // Flip the outer mesh to face the opposite direction of the inner mesh
            outerMesh.rotation.y = Math.PI; 
            wallGroup.add(outerMesh);
        }

        // Add Outline to the wall
        const edges = new THREE.EdgesGeometry(geometry);
        const outline = new THREE.LineSegments(edges, outlineMat);
        wallGroup.add(outline);

        // Final Positioning
        wallGroup.position.set(position.x, position.y, position.z);
        wallGroup.rotation.y = rotationY;
        
        return wallGroup;
    };

    // === 3. APPLY LOGIC TO SPECIFIC SIDES ===

    // BACK WALL (Always exists)
    const backWallGroup = createSmartWall(deviceWidth, deviceHeight, 'back', 
        { x: 0, y: deviceHeight / 2, z: -deviceDepth / 2 }, 0);
    roomGroup.add(backWallGroup);

    // RIGHT WALL (Always exists)
    const rightWallGroup = createSmartWall(deviceDepth, deviceHeight, 'right', 
        { x: deviceWidth / 2, y: deviceHeight / 2, z: 0 }, -Math.PI / 2);
    roomGroup.add(rightWallGroup);

    // LEFT WALL (Always exists)
    const leftWallGroup = createSmartWall(deviceDepth, deviceHeight, 'left', 
        { x: -deviceWidth / 2, y: deviceHeight / 2, z: 0 }, Math.PI / 2);
    roomGroup.add(leftWallGroup);

    // FRONT WALL 
    // Only created if roomType is 'room'. If 'container', it stays empty/open.
    if (roomType === 'room') {
        const frontWallGroup = createSmartWall(deviceWidth, deviceHeight, 'front', 
            { x: 0, y: deviceHeight / 2, z: deviceDepth / 2 }, Math.PI);
        roomGroup.add(frontWallGroup);
    }

}

    // === ROOM LABEL ===
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

    const textTexture = new THREE.CanvasTexture(canvas);
    textTexture.minFilter = THREE.LinearFilter;

    const textMaterial = new THREE.MeshBasicMaterial({
        map: textTexture,
        transparent: true,
        side: THREE.DoubleSide
    });

    const textPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(textbgSize.width, textbgSize.height),
        textMaterial
    );
    textPlane.position.set(textPosition.x, textPosition.y, textPosition.z);

    // === ORIENTATION ===
    switch (labelOrientation.toUpperCase()) {
        case 'BACK':  textPlane.rotation.y = Math.PI;      break;
        case 'LEFT':  textPlane.rotation.y = Math.PI / 2;  break;
        case 'RIGHT': textPlane.rotation.y = -Math.PI / 2; break;
        case 'FRONT':
        default:      textPlane.rotation.y = 0;            break;
    }

    roomGroup.add(textPlane);


    return roomGroup;
}
