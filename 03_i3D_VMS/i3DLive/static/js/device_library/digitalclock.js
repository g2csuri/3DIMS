// static/js/device_library/clock.js

function createDigitalClock(scene, options = {}) {
    const {
        deviceWidth = 0.80,
        deviceHeight = 0.30,
        deviceDepth = 0.03,
        devicePosition = { x: 2.0, y: 2.2, z: -1.5 },
        orientation = 'FRONT',
        clockType = 'LED', // 'LED' or 'LCD'
        
        // --- LED COLOR SCHEME ---
        LEDactiveColor = 0xFF0000,
        LEDdimColor = 0x220000,
        LEDframeColor = 0x555555,
        LEDscreenColor = 0x000000,

        // --- LCD COLOR SCHEME ---
        LCDactiveColor = 0x050505,
        LCDdimColor = 0x8fa17d,
        LCDframeColor = 0x555555,
        LCDscreenColor = 0xa3b18a,

        showFrame = true,
        showDate = true,
        
        // --- DATE CONFIG ---
        dateScale = 0.5,           // Size relative to time digits
        dateThicknessRatio = 0.6   // Thickness relative to time segments
    } = options;

    // Determine colors based on clockType
    const isLCD = clockType === 'LCD';
    const activeColor = isLCD ? LCDactiveColor : LEDactiveColor;
    const dimColor = isLCD ? LCDdimColor : LEDdimColor;
    const frameColor = isLCD ? LCDframeColor : LEDframeColor;
    const screenColor = isLCD ? LCDscreenColor : LEDscreenColor;

    const clockGroup = new THREE.Group();
    scene.add(clockGroup);

    // --- 1. DYNAMIC SCALING CALCULATION ---
    // Refined scaling to ensure digits and spacing fit within deviceWidth/Height
    // Horizontal: 6 time digits + 2 colons + gaps. Vertical: 2 rows.
    const horizontalUnits = 8.5; 
    const verticalUnits = showDate ? 1.2 : 0.7;
    
    const baseScale = Math.min( (deviceWidth - 0.10) / horizontalUnits, (deviceHeight - 0.10) / verticalUnits);
    
    const timeThickness = 0.007 * (baseScale * 10);
    const timeLen = 0.05 * (baseScale * 10);
    const timeOffset = 0.04 * (baseScale * 10);

    // --- 2. MATERIALS ---
    const activeMat = new THREE.MeshStandardMaterial({
        color: activeColor,
        emissive: activeColor,
        emissiveIntensity: isLCD ? 0 : 4.0
    });

    const dimMat = new THREE.MeshStandardMaterial({
        color: dimColor,
        transparent: true,
        opacity: isLCD ? 0.4 : 0.1
    });

    // --- 3. 7-SEGMENT PATTERN MAPPING ---
    const digitMap = [
        [1, 1, 1, 0, 1, 1, 1], // 0
        [0, 0, 1, 0, 0, 1, 0], // 1
        [1, 0, 1, 1, 1, 0, 1], // 2
        [1, 0, 1, 1, 0, 1, 1], // 3
        [0, 1, 1, 1, 0, 1, 0], // 4
        [1, 1, 0, 1, 0, 1, 1], // 5
        [1, 1, 0, 1, 1, 1, 1], // 6
        [1, 0, 1, 0, 0, 1, 0], // 7
        [1, 1, 1, 1, 1, 1, 1], // 8
        [1, 1, 1, 1, 0, 1, 1]  // 9
    ];

    function createDigit(isDate = false) {
        const group = new THREE.Group();
        const segments = [];

        const scale = isDate ? dateScale : 1.0;
        const thickness = isDate ? (timeThickness * dateThicknessRatio) : timeThickness;
        const len = timeLen * scale;
        const off = timeOffset * scale;

        const layout = [
            [0, off * 2, false],    // 0: Top
            [-off, off, true],      // 1: Top-Left
            [off, off, true],       // 2: Top-Right
            [0, 0, false],          // 3: Middle
            [-off, -off, true],     // 4: Bot-Left
            [off, -off, true],      // 5: Bot-Right
            [0, -off * 2, false]    // 6: Bottom
        ];

        layout.forEach(pos => {
            const geo = new THREE.CapsuleGeometry(thickness, len, 4, 8);
            const seg = new THREE.Mesh(geo, dimMat);
            seg.position.set(pos[0], pos[1], 0);
            if (!pos[2]) seg.rotation.z = Math.PI / 2;
            group.add(seg);
            segments.push(seg);
        });

        group.setVal = (num) => {
            const bits = digitMap[num] ?? [0,0,0,0,0,0,0];
            segments.forEach((seg, i) => {
                seg.material = bits[i] ? activeMat : dimMat;
            });
        };
        return group;
    }

    // --- 4. ASSEMBLY ---
    if (showFrame) {
        const frame = new THREE.Mesh(
            new THREE.BoxGeometry(deviceWidth, deviceHeight, deviceDepth),
            new THREE.MeshStandardMaterial({ color: frameColor })
        );
        clockGroup.add(frame);

        const screen = new THREE.Mesh(
            new THREE.PlaneGeometry(deviceWidth * 0.96, deviceHeight * 0.92),
            new THREE.MeshBasicMaterial({ color: screenColor })
        );
        screen.position.z = deviceDepth/2 + 0.002;
        clockGroup.add(screen);
    }

    // --- 5. TIME ROW (HH:MM:SS) ---
    const timeContainer = new THREE.Group();
    // Center vertically if no date, otherwise push up
    timeContainer.position.y = showDate ? (deviceHeight * 0.18) : 0;
    clockGroup.add(timeContainer);

    const timeDigits = [];
    const tSpacing = timeOffset * 3.2;
    const tColonGap = timeOffset * 1.5;
    let tStartX = -((5 * tSpacing + 2 * tColonGap) / 2);

    for (let i = 0; i < 6; i++) {
        const d = createDigit(false);
        d.position.set(tStartX, 0, deviceDepth/2 + 0.01);
        timeContainer.add(d);
        timeDigits.push(d);
        tStartX += tSpacing;
        if (i === 1 || i === 3) tStartX += tColonGap;
    }

    // --- 6. DATE ROW (DDMMYYYY) ---
    const dateDigits = [];
    if (showDate) {
        const dateContainer = new THREE.Group();
        dateContainer.position.y = -(deviceHeight * 0.22);
        clockGroup.add(dateContainer);

        const dSpacing = (timeOffset * dateScale) * 3.1;
        // Grouping DD MM YYYY with slight gaps
        const yearGap = 0.05 * baseScale * 10;
        let dStartX = -((7 * dSpacing + 2 * yearGap) / 2);

        for (let i = 0; i < 8; i++) {
            const d = createDigit(true);
            d.position.set(dStartX, 0, deviceDepth/2 + 0.01);
            dateContainer.add(d);
            dateDigits.push(d);
            dStartX += dSpacing;
            if (i === 1 || i === 3) dStartX += yearGap;
        }
    }

    // --- 7. COLONS ---
    const createCol = (x) => {
        const g = new THREE.Group();
        const dotGeo = new THREE.SphereGeometry(timeThickness * 1.5, 8, 8);
        const d1 = new THREE.Mesh(dotGeo, activeMat);
        const d2 = d1.clone();
        d1.position.set(x, timeOffset * 0.8, deviceDepth/2 + 0.015);
        d2.position.set(x, -timeOffset * 0.8, deviceDepth/2 + 0.015);
        g.add(d1, d2);
        timeContainer.add(g);
        return g;
    };

    const c1 = createCol(timeDigits[1].position.x + tSpacing/2 + tColonGap/4);
    const c2 = createCol(timeDigits[3].position.x + tSpacing/2 + tColonGap/4);

    // --- 8. LOOP ---
    const tick = () => {
        const now = new Date();
        const h = now.getHours(), m = now.getMinutes(), s = now.getSeconds();

        timeDigits[0].setVal(Math.floor(h/10));
        timeDigits[1].setVal(h%10);
        timeDigits[2].setVal(Math.floor(m/10));
        timeDigits[3].setVal(m%10);
        timeDigits[4].setVal(Math.floor(s/10));
        timeDigits[5].setVal(s%10);

        if (showDate) {
            const day = now.getDate(), mon = now.getMonth() + 1, yr = now.getFullYear();
            dateDigits[0].setVal(Math.floor(day/10));
            dateDigits[1].setVal(day%10);
            dateDigits[2].setVal(Math.floor(mon/10));
            dateDigits[3].setVal(mon%10);
            dateDigits[4].setVal(Math.floor(yr/1000));
            dateDigits[5].setVal(Math.floor((yr%1000)/100));
            dateDigits[6].setVal(Math.floor((yr%100)/10));
            dateDigits[7].setVal(yr%10);
        }

        const blink = s % 2 === 0;
        c1.visible = blink; c2.visible = blink;
    };

    const timer = setInterval(tick, 1000);
    tick();

    clockGroup.position.set(devicePosition.x, devicePosition.y, devicePosition.z);
    const rotations = { 'LEFT': Math.PI/2, 'RIGHT': -Math.PI/2, 'BACK': Math.PI };
    if (rotations[orientation]) clockGroup.rotation.y = rotations[orientation];

    clockGroup.userData = { refreshTimer: timer };
    return clockGroup;
}
