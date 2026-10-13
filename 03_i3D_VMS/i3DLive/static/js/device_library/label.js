// static/js/device_library/label.js

function createLabel(scene, options = {}) {
    const {
        // Spatial & Placement Configurations
        deviceWidth = 1.0,         // Overall horizontal span/width of the label board
        deviceHeight = 0.4,        // Overall vertical height of the label board
        deviceDepth = 0.02,        // Thickness of the label board
        devicePosition = { x: 0, y: 0, z: 0 },

        // Placement Orientation Options: 'Floor', 'Roof', 'Front', 'Back', 'Left', 'Right'
        labelOrientation = 'Floor',

        // Text & Canvas Styling
        text = 'LABEL TEXT',       // Content displayed on the label
        textSize = 48,             // Font size in canvas pixels
        textColor = '#FFFFFF',     // Hex string for font color
        textCanvasBgColor = '#222222', // Hex string for board background color
        textbgSize = { width: 512, height: 256 }, // Canvas resolution dimensions

        // Material & Frame Styling
        deviceColor = 0x333333,    // Fallback frame/board back color
        outlineColor = 0x000000,   // Border contour color
        outlineVisible = 'Enable', // 'Enable' or 'Close'

        // Support Structure (e.g. for Floor/Roof stands)
        enableSupportPost = 'Close', // 'Enable' or 'Close'
        postHeight = 1.0,            // Height of mounting pole/stand
        postRadius = 0.02            // Radius of mounting pole
    } = options;

    const labelGroup = new THREE.Group();
    scene.add(labelGroup);

    // --- 1. DYNAMIC CANVAS TEXTURE GENERATOR ---
    const createDynamicTextTexture = (labelText, fontSize, fontColor, bgColor, canvasSize) => {
        const canvas = document.createElement('canvas');
        canvas.width = canvasSize.width || 512;
        canvas.height = canvasSize.height || 256;

        const ctx = canvas.getContext('2d');

        // Force string conversion for colors (handles hex numbers and strings)
        const parsedBgColor = typeof bgColor === 'number' 
            ? '#' + bgColor.toString(16).padStart(6, '0') 
            : bgColor || '#222222';

        const parsedTextColor = typeof fontColor === 'number' 
            ? '#' + fontColor.toString(16).padStart(6, '0') 
            : fontColor || '#FFFFFF';

        // Clear Canvas First
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw Background Fill
        ctx.fillStyle = parsedBgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw Text
        ctx.font = `Bold ${fontSize}px Arial, sans-serif`;
        ctx.fillStyle = parsedTextColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(labelText, canvas.width / 2, canvas.height / 2);

        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true; // Force WebGL texture update
        return texture;
    };

    // --- 2. MATERIAL CREATION ---
    const labelTexture = createDynamicTextTexture(
        text,
        textSize,
        textColor,
        textCanvasBgColor,
        textbgSize
    );

    const faceMaterial = new THREE.MeshStandardMaterial({
        map: labelTexture,
        roughness: 0.4,
        metalness: 0.1
    });

    const boardBackMaterial = new THREE.MeshStandardMaterial({
        color: typeof deviceColor === 'number' ? deviceColor : 0x333333,
        roughness: 0.5,
        metalness: 0.2
    });

    // Box mesh materials: [Right, Left, Top, Bottom, Front (+Z Face), Back (-Z Face)]
    const materials = [
        boardBackMaterial, // Right
        boardBackMaterial, // Left
        boardBackMaterial, // Top
        boardBackMaterial, // Bottom
        faceMaterial,      // Front (+Z face gets canvas texture)
        boardBackMaterial  // Back
    ];

    // --- 3. MAIN LABEL BOARD MESH ---
    const boardGeo = new THREE.BoxGeometry(deviceWidth, deviceHeight, deviceDepth);
    const boardMesh = new THREE.Mesh(boardGeo, materials);

    // Apply Edges Outline
    if (String(outlineVisible).toUpperCase() === 'ENABLE') {
        const outlineMat = new THREE.LineBasicMaterial({ color: outlineColor, linewidth: 1 });
        const edges = new THREE.EdgesGeometry(boardGeo);
        const outline = new THREE.LineSegments(edges, outlineMat);
        boardMesh.add(outline);
    }

    labelGroup.add(boardMesh);

    // --- 4. OPTIONAL SUPPORT POST / MOUNTING ROD ---
    if (String(enableSupportPost).toUpperCase() === 'ENABLE') {
        const postGeo = new THREE.CylinderGeometry(postRadius, postRadius, postHeight, 16);
        const postMat = new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.8, roughness: 0.3 });
        const postMesh = new THREE.Mesh(postGeo, postMat);

        // Position post underneath the board
        postMesh.position.set(0, -(deviceHeight / 2 + postHeight / 2), 0);
        labelGroup.add(postMesh);
    }

    // --- 5. PLACEMENT & ORIENTATION LOGIC ---
    const normalizedOrientation = String(labelOrientation).toUpperCase();

    switch (normalizedOrientation) {
        case 'FLOOR':
            boardMesh.rotation.x = -Math.PI / 2;
            break;

        case 'ROOF':
            boardMesh.rotation.x = Math.PI / 2;
            break;

        case 'FRONT':
            boardMesh.rotation.set(0, 0, 0);
            break;

        case 'BACK':
            boardMesh.rotation.set(0, Math.PI, 0);
            break;

        case 'LEFT':
            boardMesh.rotation.set(0, -Math.PI / 2, 0);
            break;

        case 'RIGHT':
            boardMesh.rotation.set(0, Math.PI / 2, 0);
            break;

        default:
            boardMesh.rotation.set(0, 0, 0);
            break;
    }

    // Set absolute world coordinates
    labelGroup.position.set(devicePosition.x, devicePosition.y, devicePosition.z);

    return labelGroup;
}
