
///////////// GLOBAL animate() /////////////////////////////////////////////////////

function animate() {
    requestAnimationFrame(animate);
    // delta time in seconds
    const now = performance.now();
    const dt = (now - last) / 1000;
    last = now;
    // update any objects that have time‑based behaviour (LEDs, fans, etc.)
    scene.traverse(obj => {
        if (obj.updateLED) obj.updateLED(dt);
        if (obj.updateHighLabelFacing) obj.updateHighLabelFacing(camera);
    });
    controls.update();
    updateHUD();
    renderer.render(scene, camera);
}

/*
ups.applyLiveData = function(row) {
    // row.state might be "HEALTHY", "ALARM", etc.
    if (row.state && typeof this.setLEDState === 'function') {
        this.setLEDState(row.state);
    }
    // you can extend: if (row.highLabelText) update label, etc.
};
*/
