// static/js/main_layout/containerTemplate.js

function room() {
    // ✅ MASTER GROUP - everything lives here
    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    // --- CONTAINER ---
    const container = createContainer(masterGroup, {  // Pass masterGroup instead of scene
        roomType: 'container',
        deviceWidth: 8,
        deviceHeight: 2.5,
        deviceDepth: 3,
        devicePosition: { x: 0, y: 0, z: 0 },
        orientation: 'Front',
        camPosition: { x: 0, y: 0.6, z: 0.46 },
        faceTextures: {
            front: 'none',
            back: '/static/js/device_library/textures/container_back.png',
            right: '/static/js/device_library/textures/container_right.png',
            left: '/static/js/device_library/textures/container_left.png'
        },
        standHeight: 0.3,
        standColor: 0x666666,
        floorTileSize: 5,
        floorTileColor: 0xFFFFFF,
        floorTileLineColor: 0x000000,
        floorTileLineWidth: 0.02,
        ceilingTileSize: 5,
        ceilingTileColor: 0xFFFFFF,
        ceilingTileLineColor: 0x000000,
        ceilingTileLineWidth: 0.02,
        text: 'Container',
        textSize: 0.28,
        labelOrientation: 'Front',
        textPosition: { x: -2.4, y: 2.2, z: -1.45 }
    });
    // No need for container.position.set() - it's auto-parented

    masterGroup.position.set(0, 0, 0);     // Move everything
    // masterGroup.rotation.y = Math.PI / 4;  // Rotate everything  
    // masterGroup.scale.set(0.8, 0.8, 0.8);  // Scale everything




}
