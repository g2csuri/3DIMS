// static/js/02_mainlayout.js

async function mainlayout() {
    //console.log("Initializing dynamic main layout...");

    let functionsFound = [];

    if (!window.layoutFiles || !Array.isArray(window.layoutFiles)) {
        //console.warn("No layout files found to initialize.");
        return;
    }

    window.layoutFiles.forEach(fileName => {
        const functionName = fileName.replace('.js', '');
        let activeName = null;

        // Check for direct name or snake_case
        if (typeof window[functionName] === 'function') {
            activeName = functionName;
        } else {
            const snakeName = functionName.includes('room') ? functionName.replace('room', '_room') : functionName;
            if (typeof window[snakeName] === 'function') {
                activeName = snakeName;
            }
        }

        if (activeName) {
            //console.log(`Executing: ${activeName}()`);
            functionsFound.push(activeName);
            window[activeName]();
        } else {
            //console.error(`Missing function for: ${fileName}`);
        }
    });

    // SEND TO TERMINAL via Flask
    if (functionsFound.length > 0) {
        fetch('/log_functions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ functions: functionsFound })
        });
    }

// Inside your existing interaction logic or main layout initialization
function onDeviceLoaded(rackMesh) {
    const metadata = rackMesh.deviceMetadata;
    if (metadata && metadata.zbxHost) {
        // Call the new NetBox function
        updateRackTexturesFromNetbox(rackMesh, metadata);
    }
}

}


