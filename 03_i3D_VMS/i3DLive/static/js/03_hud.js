
function initHUD() {
    const HUD = document.getElementById('HUD');
    if (!HUD) {
        // safety: create it if missing
        HUD = document.createElement('div');
        HUD.id = 'HUD';
        HUD.style.position = 'fixed';
        HUD.style.top = '8px';
        HUD.style.right = '8px';
        HUD.style.padding = '6px 10px';
        HUD.style.background = 'rgba(0,0,0,0.6)';
        HUD.style.color = '#fff';
        HUD.style.fontFamily = 'monospace';
        HUD.style.fontSize = '11px';
        HUD.style.lineHeight = '1.4';
        HUD.style.zIndex = '1000';
        HUD.style.pointerEvents = 'none';
        document.body.appendChild(HUD);
    }
}

function updateHUD() {
    if (!HUD) return;

    const pos = camera.position;
    const target = controls.target;

    const lines = [
        `cam.pos  x:${pos.x.toFixed(2)}  y:${pos.y.toFixed(2)}  z:${pos.z.toFixed(2)}`,
        //`cam.tar  x:${target.x.toFixed(2)}  y:${target.y.toFixed(2)}  z:${target.z.toFixed(2)}`,
        //`cam.fov  ${camera.fov.toFixed(1)}°`,
        //`aspect   ${(camera.aspect).toFixed(3)}`,
        //`near/far ${camera.near.toFixed(2)} / ${camera.far.toFixed(0)}`
    ];

    HUD.innerText = lines.join('\n');
}
