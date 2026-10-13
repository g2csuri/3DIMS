// static/js/device_library/Box.js

function createBox(scene, options = {}) {
    const {
        // rack dimensions
        deviceWidth = 0.6,
        deviceHeight = 1,
        deviceDepth = 0.8,
        devicePosition = { x: 0, y: 0.6, z: 0.46 },

        // Camera Position
        camPosition = { x: 0, y: 0.6, z: 0.46 },

        // rack properties
        deviceColor = 0x0077ff,
        deviceoutlineColor = 0x000000,

        // label text properties
        text = "Rack-01",
        textPosition = { x: 0, y: 0.6, z: 0.41 },
        textColor = 0xffffff,
        textSize = 0.1,
        textFont = 'helvetica',

        // label background properties
        labelbgPosition = { x: 0, y: 0.6, z: 0.41 },
        labelbgColor = 0x000000,
        labelbgSize = { width: 0.8, height: 0.15 },

        // plane properties (now screen)
        screenEnabled = 'false',  // Default: disabled
        screenPosition = { x: 0, y: 0, z: 0.41 },
        screenSize = { width: 0.6, height: 1 },
        screenColor = 0x444444,

        // stand properties
        standHeight = 0.05,
        standColor = 0x333333
    } = options;

    // === STAND (base support) ===
    const standGeometry = new THREE.BoxGeometry(deviceWidth * 0.9, standHeight, deviceDepth * 0.9);
    const standMaterial = new THREE.MeshStandardMaterial({ color: standColor });
    const stand = new THREE.Mesh(standGeometry, standMaterial);
    stand.position.y = -deviceHeight/2 - standHeight/2;
    stand.castShadow = true;
    stand.receiveShadow = true;

    // === MAIN RACK ===
    const geometry = new THREE.BoxGeometry(deviceWidth, deviceHeight, deviceDepth);
    
    const rackMaterial = new THREE.MeshStandardMaterial({
        color: deviceColor,
        roughness: 0.5,
        metalness: 0.5
    });

    const rack = new THREE.Mesh(geometry, rackMaterial);
    rack.position.y = standHeight;  // rack sits on stand
    rack.castShadow = true;
    rack.receiveShadow = true;
    scene.add(rack);

    // Add stand to rack so they move together
    rack.add(stand);

    // Outline (match rack dimensions)
    const edges = new THREE.EdgesGeometry(geometry);
    const outlineMaterial = new THREE.LineBasicMaterial({
        color: deviceoutlineColor,
        linewidth: 2,
        transparent: true,
        opacity: 0.8
    });
    const outline = new THREE.LineSegments(edges, outlineMaterial);
    rack.add(outline);

    // === LABEL BACKGROUND ===
    const bgGeometry = new THREE.PlaneGeometry(labelbgSize.width, labelbgSize.height);
    const bgMaterial = new THREE.MeshBasicMaterial({
        color: labelbgColor,
        transparent: true,
        opacity: 0.9,
        side: THREE.DoubleSide
    });
    const labelBg = new THREE.Mesh(bgGeometry, bgMaterial);
    labelBg.position.set(labelbgPosition.x, labelbgPosition.y, labelbgPosition.z);
    rack.add(labelBg);

    // === LABEL TEXT ===
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 512;
    canvas.height = 256;

    context.fillStyle = new THREE.Color(labelbgColor).getStyle();
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = new THREE.Color(textColor).getStyle();
    context.font = `bold ${Math.floor(canvas.height * 0.6)}px ${textFont}`;
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
        new THREE.PlaneGeometry(labelbgSize.width * 0.9, labelbgSize.height * 0.9),
        textMaterial
    );
    textPlane.position.set(textPosition.x, textPosition.y, textPosition.z + 0.001);
    rack.add(textPlane);

    // === SCREEN (plane) ===
    if(screenEnabled)
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
    	rack.add(screen);
    }

    return rack;
}
