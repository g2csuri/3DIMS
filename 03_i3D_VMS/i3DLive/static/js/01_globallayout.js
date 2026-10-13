// static/js/01_globallayout.js

let scene, camera, renderer, controls;
let last = performance.now();

// 1. DEFINE GLOBALS AT THE TOP
let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();

let hoveredDevice = null;      // Use this consistently
let originalMaterials = [];    // Array to store multiple parts
let fetchController = null;    // Used to kill pending requests

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * findDeviceRoot: 
 * Consistency is key. We use this name everywhere now.
 */
function findDeviceRoot(obj) {
    if (!obj) return null;
    let current = obj;
    while (current && current !== scene) {
        if (current.deviceMetadata) {
            return current;
        }
        current = current.parent;
    }
    return null;
}

function resetDeviceHighlight() {
    if (hoveredDevice) {
        originalMaterials.forEach(item => {
            if (item.mat && item.mat.color) {
                item.mat.color.setHex(item.hex);
            }
        });
        originalMaterials = [];
        hoveredDevice = null;
        document.body.style.cursor = 'default';
    }
}

function handleHover(event) {
    // 1. Calculate mouse position
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);

    let foundTarget = null;

    // 2. Debug the very first thing hit
    if (intersects.length > 0) {
        const topHit = intersects[0].object;
        const parentDevice = findDeviceRoot(topHit); // FIXED NAME
    }

    // 3. Find valid device
    for (let i = 0; i < intersects.length; i++) {
        const hit = intersects[i].object;

        if (hit.isLine || hit.isLineSegments || hit.type === 'LineSegments') {
                continue;
        }

        const root = findDeviceRoot(hit); // FIXED NAME
        if (!root) continue; // Skip if it's "NONE" (the floor/room)

        const n = (hit.name || "").toLowerCase();
        if (n.includes("floor") || n.includes("wall") || n.includes("container")) continue;

        foundTarget = root;
        break;
    }

    // 4. Apply Highlight
    if (foundTarget && foundTarget !== hoveredDevice) {
        resetDeviceHighlight();
        hoveredDevice = foundTarget;

        hoveredDevice.traverse((node) => {
            if (node.isMesh && node.material) {
                const materials = Array.isArray(node.material) ? node.material : [node.material];
                materials.forEach(m => {
                    if (m.color) {
                        originalMaterials.push({ mat: m, hex: m.color.getHex() });
                        m.color.setHex(0xffffcc);
                    }
                });
            }
        });
        document.body.style.cursor = 'pointer';
    } 
    else if (!foundTarget && hoveredDevice) {
        resetDeviceHighlight();
    }
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 200);
    camera.position.set(8, 8, 8);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.sortObjects = true;
    document.body.appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.target.set(0, 1.0, 0);

    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xaaaaaa, 0.7);
    directionalLight.position.set(5, 10, 7);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // ATTACH THE NEW LOGIC LISTENERS
    window.addEventListener('mousemove', handleHover, false);
    //window.addEventListener('contextmenu', handleRightClick, false);
    window.addEventListener('click', handleDeviceClick, false);
    window.addEventListener('contextmenu', handleDeviceRightClick, false);

    initHUD();
    //initCSSRenderer();
    mainlayout();
    animate();

}

function animate() {
    requestAnimationFrame(animate);

    const now = performance.now();
    const dt = (now - last) / 1000;
    last = now;

    if (controls) controls.update();

    // Loop through every object in the scene
    scene.traverse((node) => {
        // If the object has an update function (Fans)
        if (typeof node.update === 'function') {
            node.update(dt);
        }
        // If the object has an updateLED function (UPS)
        if (typeof node.updateLED === 'function') {
            node.updateLED(dt);
        }
        // If the object has an updateFan function (InRow, PrecisionAC)
        if (typeof node.updateFan === 'function') {
            node.updateFan(dt);
        }
    });

        renderer.render(scene, camera);
}



window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//--- 1. HANDLE CTRL + LEFT CLICK (Navigate to Dashboard) ---
function handleDeviceClick(event) {
    if (event.ctrlKey && hoveredDevice) {
        const data = hoveredDevice.deviceMetadata;
        // Construct the URL based on your provided format
        // We use the zbxHost or a specific dashboard ID if you have it in metadata
        //console.log('data ######', data);
        const finalUrl = data.urlLink || data.NBFront ; 

        window.open(finalUrl, '_blank');
    }
}


// --- 2. HANDLE CTRL + RIGHT CLICK (Live Data Popup) ---
function handleDeviceRightClick(event) {
    if (event.ctrlKey && hoveredDevice) {
        event.preventDefault(); // Prevent default browser menu
        const metadata = hoveredDevice.deviceMetadata;
        
        if (metadata && metadata.zbxHost) {
            showLivePopup(event.clientX, event.clientY, metadata);
        }
    }
}

// START
init();


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

