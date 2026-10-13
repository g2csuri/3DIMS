// static/js/device_library/perforatedtiles.js

function createPerforatedTiles(scene, options = {}) {
    const {
        // Dimensions
        deviceWidth = 10,
        deviceDepth = 10,
        deviceThickness = 0.05,
        devicePosition = { x: 0, y: 0, z: 0 },

        // Tiling Logic (Matching container.js)
        tileSize = 5,              // How large each tile is (e.g., 5 units)
        tileColor = 0xd1d5db,      // Light grey/silver
        tileLineColor = 0x333333,  // Grid line color
        tileLineWidth = 0.02,

        // Airflow (Perforation) properties
        airflowPercentage = 50,    // 0 to 100
        holeColor = 0x111111,      // Color of the holes
        holeSpacing = 10           // Spacing between holes in pixels on the canvas
    } = options;

    const group = new THREE.Group();
    scene.add(group);

    // === TILING LOGIC (From container.js) ===
    // Calculate how many tiles fit in the given dimensions
    const tilesX = Math.ceil(deviceWidth / tileSize);
    const tilesZ = Math.ceil(deviceDepth / tileSize);
    
    // Stretch/Fit logic to ensure tiles are perfectly square within the bounds
    const squareTileWorldSize = Math.min(deviceWidth / tilesX, deviceDepth / tilesZ);

    // === CREATE PERFORATED CANVAS TEXTURE ===
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 512;
    canvas.height = 512;

    // 1. Fill Background
    ctx.fillStyle = new THREE.Color(tileColor).getStyle();
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Calculate Capsule Size based on Airflow Percentage
    // Max size is based on spacing with a small margin
    const maxDimension = holeSpacing * 0.8; 
    const airflowFactor = airflowPercentage / 100;
    
    const capsuleWidth = maxDimension * airflowFactor;
    const capsuleHeight = (maxDimension * 1.5) * airflowFactor; // Slightly longer than wide
    const radius = capsuleWidth / 2;

    // 3. Draw Capsule/Rectangle Holes
    ctx.fillStyle = new THREE.Color(holeColor).getStyle();
    for (let x = holeSpacing; x < canvas.width; x += holeSpacing) {
        for (let y = holeSpacing; y < canvas.height; y += holeSpacing * 1.5) {
            
            // Draw Capsule (Rounded Rectangle)
            const posX = x - capsuleWidth / 2;
            const posY = y - capsuleHeight / 2;
            
            ctx.beginPath();
            ctx.roundRect(posX, posY, capsuleWidth, capsuleHeight, radius);
            ctx.fill();
        }
    }

    // 4. Draw Tile Border (The Grid Line)
    ctx.strokeStyle = new THREE.Color(tileLineColor).getStyle();
    ctx.lineWidth = tileLineWidth * 1000; // Scaled for canvas
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    
    // Set repeat based on the tiling logic
    texture.repeat.set(
        deviceWidth / squareTileWorldSize, 
        deviceDepth / squareTileWorldSize
    );

    // === GEOMETRY & MATERIALS ===
    const geometry = new THREE.BoxGeometry(deviceWidth, deviceThickness, deviceDepth);
    
    const sideMat = new THREE.MeshStandardMaterial({ color: tileColor, roughness: 0.8 });
    const topMat = new THREE.MeshStandardMaterial({ map: texture, roughness: 0.7 });

    const materials = [
        sideMat, // Right
        sideMat, // Left
        topMat,  // Top (The perforated surface)
        sideMat, // Bottom
        sideMat, // Front
        sideMat  // Back
    ];

    const tilesMesh = new THREE.Mesh(geometry, materials);
    tilesMesh.position.set(devicePosition.x, devicePosition.y + deviceThickness / 2, devicePosition.z);
    tilesMesh.receiveShadow = true;
    
    group.add(tilesMesh);

    return group;
}
