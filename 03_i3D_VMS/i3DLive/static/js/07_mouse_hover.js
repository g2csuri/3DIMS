// static/js/07_mouse_hover_interaction.js


(function() {
    let tooltip = document.getElementById('netbox-tooltip');
    
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.id = 'netbox-tooltip';
        document.body.appendChild(tooltip);
    }

    Object.assign(tooltip.style, {
        position: 'fixed',
        display: 'none',
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        color: '#ffffff',
        padding: '8px',            // Reduced from 12px
        border: '1px solid #3b82f6', 
        borderRadius: '4px',
        fontFamily: 'sans-serif',
        fontSize: '10px',          // Reduced from 11px
        zIndex: '1000000',
        pointerEvents: 'none',
        boxShadow: '0 0 15px rgba(0, 255, 204, 0.3)',
        minWidth: '220px'          // Reduced from 260px
    });



window.addEventListener('mousemove', (event) => {
    // 1. Identify the hovered device from the global 'hoveredDevice'
    const activeDevice = (typeof hoveredDevice !== 'undefined') ? hoveredDevice : null;

    if (!activeDevice) {
        tooltip.style.display = 'none';
        return;
    }

    // 2. Determine which data source to use
    // It looks for EITHER netboxStats OR zabbixStats in the userData
    const stats = activeDevice.userData.netboxStats || activeDevice.userData.zabbixStats;

    if (!stats) {
        tooltip.style.display = 'none';
        return;
    }

    // 3. Update Tooltip Appearance
    tooltip.style.display = 'block';
    tooltip.style.left = (event.clientX + 15) + 'px';
    tooltip.style.top = (event.clientY + 10) + 'px';

    // UI Feedback: Change border color based on source
    // Cyan for Netbox/Racks, Blue for Zabbix Devices
    const isZabbix = !!activeDevice.userData.zabbixStats;
    tooltip.style.borderColor = isZabbix ? '#3b82f6' : '#3b82f6';
    tooltip.style.boxShadow = isZabbix ? '0 0 10px #3b82f6' : '0 0 10px #3b82f6';

    // 4. Build the Table (This calls the shared build function)
    if (typeof buildTooltipTable === 'function') {
        tooltip.innerHTML = buildTooltipTable(stats);
    }
});






})();
