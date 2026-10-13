// static/js/audio_helper.js


function playAlarmBeep_1() {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        //const numberOfBeeps = 10;
        //const beepDuration = 0.15; // Seconds the sound is ON
        //const pauseDuration = 0.10; // Seconds the sound is OFF
        const numberOfBeeps = 20;
        const beepDuration = 0.05; // Seconds the sound is ON
        const pauseDuration = 0.05; // Seconds the sound is OFF
        
        let currentTime = audioCtx.currentTime;

        for (let i = 0; i < numberOfBeeps; i++) {
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();

            oscillator.type = 'square';
            oscillator.frequency.setValueAtTime(880, currentTime);
            
            gainNode.gain.setValueAtTime(0.1, currentTime); // Volume (1.05 is very loud/clipping)

            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            // Schedule this specific beep to start and stop in the future
            oscillator.start(currentTime);
            oscillator.stop(currentTime + beepDuration);

            // Move the time forward for the next beep in the loop
            currentTime += (beepDuration + pauseDuration);
        }
    } catch (e) {
        console.log("Audio notice: Click once on the page to enable alarm sounds.");
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


/**
 * Plays a local .wav file
 * @param {string} fileName - The name of the file (e.g., 'siren.wav')
 */
function playLocalSiren(fileName = 'siren.wav') {
    // Construct the path relative to the web root
    // Assuming your file is in /static/audio/siren.wav
    const audioPath = `/static/audio/${fileName}`;
    
    const alarmAudio = new Audio(audioPath);
    
    // Adjust volume (0.0 to 1.0)
    alarmAudio.volume = 0.5; 

    alarmAudio.play().catch(error => {
        // Browsers block audio until the user clicks the page
        console.warn("Audio playback failed. Please click on the page to enable sounds:", error);
    });
}

/**
 * Plays the "Beep Beep ... Pause" pattern using the local file
 */
function playSirenPatternLocal() {
    const fileName = 'siren.wav';
    
    // Play first beep
    playLocalSiren(fileName);
    
    // Play second beep after 400ms
    //setTimeout(() => {
    //    playLocalSiren(fileName);
    //}, 400);
}



/**
 * Plays a double-beep siren pattern:
 * Beep (0.15s) -> Short Gap (0.1s) -> Beep (0.15s) -> Long Pause
 */
function playSirenPattern() {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

        // Use a helper to create a single pulse
        const createPulse = (startTime) => {
            const osc = audioCtx.createOscillator();
            const lfo = audioCtx.createOscillator();
            const lfoGain = audioCtx.createGain();
            const gainNode = audioCtx.createGain();

            // Siren Waveform Setup
            osc.type = 'square';
            osc.frequency.setValueAtTime(600, startTime);

            // LFO for the "Wail" effect
            lfo.type = 'triangle';
            lfo.frequency.setValueAtTime(150, startTime); // Faster wail for short beeps
            lfoGain.gain.setValueAtTime(150, startTime);

            lfo.connect(lfoGain);
            lfoGain.connect(osc.frequency);

            osc.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            // Volume Envelope (Quick Fade)
            gainNode.gain.setValueAtTime(0, startTime);
            gainNode.gain.linearRampToValueAtTime(0.1, startTime + 0.02);
            gainNode.gain.linearRampToValueAtTime(0, startTime + 0.15);

            lfo.start(startTime);
            osc.start(startTime);
            lfo.stop(startTime + 1.15);
            osc.stop(startTime + 1.15);
        };

        const now = audioCtx.currentTime;

        // Schedule: Pulse 1 -- Pulse 2 -- (Gap/Pause)
        createPulse(now);          // First Beep
        createPulse(now + 0.25);   // Second Beep (Starts after first beep + gap)

    } catch (e) {
        console.log("Audio notice: Browser blocked sound. Click once on the page.");
    }
}

function playSiren_1() {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

        // The main sound source
        const mainOscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        // The "Wail" controller (LFO)
        const lfo = audioCtx.createOscillator();
        const lfoGain = audioCtx.createGain();

        // 1. Configure Main Sound (The "Voice")
        mainOscillator.type = 'square'; // Aggressive wave format
        mainOscillator.frequency.setValueAtTime(440, audioCtx.currentTime); // Base frequency

        // 2. Configure the Siren "Slide" (The Modulation)
        lfo.type = 'triangle';
        lfo.frequency.setValueAtTime(2, audioCtx.currentTime); // How fast it wails (2 times per second)
        lfoGain.gain.setValueAtTime(200, audioCtx.currentTime); // How high/low the pitch slides

        // 3. Connect LFO to Frequency (This creates the siren wail)
        lfo.connect(lfoGain);
        lfoGain.connect(mainOscillator.frequency);

        // 4. Output Connections
        mainOscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        // Volume Envelope
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1.5);

        // Start and Stop
        lfo.start();
        mainOscillator.start();

        // Stop after 1.5 seconds of wailing
        lfo.stop(audioCtx.currentTime + 1.5);
        mainOscillator.stop(audioCtx.currentTime + 1.5);

    } catch (e) {
        console.log("Audio notice: Browser blocked sound. Click anywhere on the layout once.");
    }
}


function playSiren_2() {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

        // The main sound source
        const mainOscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        // The "Wail" controller (LFO)
        const lfo = audioCtx.createOscillator();
        const lfoGain = audioCtx.createGain();

        // 1. Configure Main Sound (The "Voice")
        mainOscillator.type = 'square'; // Aggressive wave format
        mainOscillator.frequency.setValueAtTime(440, audioCtx.currentTime); // Base frequency

        // 2. Configure the Siren "Slide" (The Modulation)
        lfo.type = 'triangle';
        lfo.frequency.setValueAtTime(3, audioCtx.currentTime); // How fast it wails (2 times per second)
        lfoGain.gain.setValueAtTime(100, audioCtx.currentTime); // How high/low the pitch slides

        // 3. Connect LFO to Frequency (This creates the siren wail)
        lfo.connect(lfoGain);
        lfoGain.connect(mainOscillator.frequency);

        // 4. Output Connections
        mainOscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        // Volume Envelope
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1.5);

        // Start and Stop
        lfo.start();
        mainOscillator.start();

        // Stop after 1.5 seconds of wailing
        lfo.stop(audioCtx.currentTime + 2.5);
        mainOscillator.stop(audioCtx.currentTime + 2.5);

    } catch (e) {
        console.log("Audio notice: Browser blocked sound. Click anywhere on the layout once.");
    }
}
