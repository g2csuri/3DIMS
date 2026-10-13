function createCableTray(scene, options = {}) {
    const {
        // Main Dimensions
        deviceWidth = 0.4,
        deviceHeight = 0.05,
        deviceDepth = 2.0,
        devicePosition = { x: 0, y: 2.4, z: 0 },

        // Support (Threaded Rods/Bolts)
        rodLength = 0.1,
        rodDiameter = 0.012,
        rodOffset = -0.02,

        // Colors & Aesthetics
        deviceColor = 0x000000,
        deviceoutlineColor = 0x000000,
        boltColor = 0xcccccc,

        // Logic
        orientation = 'FRONT',

        // Cable Tray Open End Cap # Options # Left, Right, Straight, Close, etc.
        Front_Side_Opening = 'Close',
        Rear_Side_Opening = 'Close'

    } = options;

    const trayGroup = new THREE.Group();
    scene.add(trayGroup);

    // --- NEW VARIABLE FOR TURN LOGIC ---
    const turnLength = deviceWidth / 6;

    // --- 1. CREATE CAPSULE HOLE TEXTURE ---
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 128;
    canvas.height = 256;
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    const drawCapsule = (x, y, w, h) => {
        ctx.beginPath();
        ctx.roundRect(x, y, w, h, w / 2);
        ctx.fill();
    };
    for (let y = 30; y < canvas.height; y += 60) {
        drawCapsule(20, y, 25, 40);
        drawCapsule(80, y, 25, 40);
        drawCapsule(50, y - 30, 25, 40);
    }
    const alphaTexture = new THREE.CanvasTexture(canvas);
    alphaTexture.wrapS = alphaTexture.wrapT = THREE.RepeatWrapping;
    alphaTexture.repeat.set(deviceWidth * 4, deviceDepth * 2);

    // --- 2. MATERIALS ---
    const trayMat = new THREE.MeshStandardMaterial({
        color: deviceColor,
        metalness: 0.7,
        roughness: 0.3,
        alphaMap: alphaTexture,
        transparent: true,
        side: THREE.DoubleSide
    });
    const railMat = new THREE.MeshStandardMaterial({ color: deviceColor, metalness: 0.8 });
    const boltMat = new THREE.MeshStandardMaterial({ color: boltColor, metalness: 1.0 });

    // --- 3. TRAY BODY (Main Section) ---
    const bottomGeo = new THREE.PlaneGeometry(deviceWidth, deviceDepth);
    const bottom = new THREE.Mesh(bottomGeo, trayMat);
    bottom.rotation.x = -Math.PI / 2;
    bottom.position.y = -deviceHeight / 2;
    trayGroup.add(bottom);

    // --- LOGIC FOR SIDE RAILS (UPDATED FOR MULTI-DIRECTION) ---
    const createMainSideRail = (isLeft) => {
        const fStr = Front_Side_Opening.toUpperCase();
        const rStr = Rear_Side_Opening.toUpperCase();

        // Check if this side is "blocked" by a turn extension
        const hasFrontTurn = (isLeft && fStr.includes('LEFT')) || (!isLeft && fStr.includes('RIGHT'));
        const hasRearTurn = (isLeft && rStr.includes('LEFT')) || (!isLeft && rStr.includes('RIGHT'));

        let startZ = -deviceDepth / 2;
        let endZ = deviceDepth / 2;

        if (hasFrontTurn) endZ -= deviceWidth;
        if (hasRearTurn) startZ += deviceWidth;

        const length = endZ - startZ;
        if (length > 0) {
            const geo = new THREE.BoxGeometry(0.01, deviceHeight, length);
            const rail = new THREE.Mesh(geo, railMat);
            rail.position.set(isLeft ? -deviceWidth / 2 : deviceWidth / 2, 0, (startZ + endZ) / 2);
            trayGroup.add(rail);
        }
    };
    createMainSideRail(true);  // Left Rail
    createMainSideRail(false); // Right Rail


    // --- LOGIC FOR TURNS (UPDATED FOR MULTI-DIRECTION) ---
    const addTurnExtensions = (openingType, zPos) => {
        const str = openingType.toUpperCase();
        if (str === 'CLOSE') return;

        // Process Left and Right branches independently for T and 4-way junctions
        const directions = [];
        if (str.includes('LEFT')) directions.push(-1);
        if (str.includes('RIGHT')) directions.push(1);

        directions.forEach(dir => {
            const turnGroup = new THREE.Group();

            // Perforated Bottom
            const extGeo = new THREE.PlaneGeometry(turnLength, deviceWidth);
            const extBottom = new THREE.Mesh(extGeo, trayMat);
            extBottom.rotation.x = -Math.PI / 2;
            extBottom.position.y = -deviceHeight / 2;
            turnGroup.add(extBottom);

            // Side rails
            const turnRailGeo = new THREE.BoxGeometry(turnLength, deviceHeight, 0.01);
            const frontRail = new THREE.Mesh(turnRailGeo, railMat);
            frontRail.position.z = deviceWidth / 2;
            const backRail = frontRail.clone();
            backRail.position.z = -deviceWidth / 2;
            turnGroup.add(frontRail, backRail);

            const xOffset = (deviceWidth / 2) + (turnLength / 2);
            // Position adjustment based on Front or Rear
            const zOffset = zPos + (zPos > 0 ? -deviceWidth/2 : deviceWidth/2);
            
            turnGroup.position.set(dir * xOffset, 0, zOffset);
            trayGroup.add(turnGroup);
        });
    };

    addTurnExtensions(Front_Side_Opening, deviceDepth / 2);
    addTurnExtensions(Rear_Side_Opening, -deviceDepth / 2);

    // --- LOGIC FOR END CAPS (UPDATED FOR MULTI-DIRECTION) ---
    const addEndCap = (openingType, zPos) => {
        const str = openingType.toUpperCase();
        
        // If "STRAIGHT" is present in the string, we DO NOT put a cap (keep it open)
        // If it is 'CLOSE' or only contains 'LEFT'/'RIGHT', we seal the main path end
        if (!str.includes('STRAIGHT')) {
            const endRailGeo = new THREE.BoxGeometry(deviceWidth, deviceHeight, 0.01);
            const endRail = new THREE.Mesh(endRailGeo, railMat);
            endRail.position.set(0, 0, zPos);
            trayGroup.add(endRail);
        }
    };
    addEndCap(Front_Side_Opening, deviceDepth / 2);
    addEndCap(Rear_Side_Opening, -deviceDepth / 2);

    // --- 4. ROOF BOLTS / RODS ---
    const createRod = (x, z) => {
        const rodGrp = new THREE.Group();
        const rodGeo = new THREE.CylinderGeometry(rodDiameter/2, rodDiameter/2, rodLength);
        const rod = new THREE.Mesh(rodGeo, boltMat);
        rod.position.y = rodLength / 2;
        rodGrp.add(rod);
        const nutGeo = new THREE.CylinderGeometry(rodDiameter * 1.5, rodDiameter * 0.5, 0.02, 10);
        const nut = new THREE.Mesh(nutGeo, boltMat);
        rodGrp.add(nut);
        rodGrp.position.set(x, -(deviceHeight+0.025)/2, z);
        return rodGrp;
    };

    const xPos = deviceWidth / 2 + rodOffset;
    const zPosCalc = deviceDepth / 2 - 0.2 - 0.6;
    trayGroup.add(createRod(xPos, zPosCalc));
    trayGroup.add(createRod(-xPos, zPosCalc));
    trayGroup.add(createRod(xPos, -zPosCalc));
    trayGroup.add(createRod(-xPos, -zPosCalc));

    // --- FINAL TRANSFORMS ---
    trayGroup.position.set(devicePosition.x, devicePosition.y, devicePosition.z);
    if (orientation.toUpperCase() === 'LEFT' || orientation.toUpperCase() === 'RIGHT') trayGroup.rotation.y = Math.PI / 2;
    if (orientation.toUpperCase() === 'BACK') trayGroup.rotation.y = Math.PI;

    return trayGroup;
}
