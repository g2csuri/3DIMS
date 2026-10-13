// static/js/main_layout/containerTemplate.js

function room() {
    // ✅ MASTER GROUP - everything lives here
    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    // --- CONTAINER ---
    const container = createRoom(masterGroup, {  // Pass masterGroup instead of scene
        roomType: 'room',
        deviceWidth: 8,
        deviceHeight: 2.5,
        deviceDepth: 3,
        devicePosition: { x: 8, y: 3.0, z: -12 },
        orientation: 'Front',
        camPosition: { x: 0, y: 0.6, z: 0.46 },

        faceTextures: {
            front: 'none',
            back: 'none',
            right: 'none',
            left: 'none'
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

        text: "BMS Room",
        labelOrientation: 'Front',
        textPosition: { x: 4.65, y: 0.29, z: -4.98 },
        textColor: 0xffffff,
        textSize: 2.32,
        textFont: 'Arial',
        textCanvasBgColor: 0x222222,
        textbgSize: { width: 2.5, height: 0.4 }


    });
    // No need for container.position.set() - it's auto-parented

    masterGroup.position.set(0, 0, 0);     // Move everything
    // masterGroup.rotation.y = Math.PI / 4;  // Rotate everything  
    // masterGroup.scale.set(0.8, 0.8, 0.8);  // Scale everything

}
