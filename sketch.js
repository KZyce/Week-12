let mic, fft;
let colors = [];

function setup() {
    createCanvas(600, 600);
    background(0);

    // Start Audio Context (required for mic access)
    userStartAudio().then(() => {
        console.log("🔊 Audio Context Started!");
        
        mic = new p5.AudioIn();
        mic.start(() => {
            console.log("🎤 Microphone Started!");
            fft = new p5.FFT();
            fft.setInput(mic);
        }, (err) => {
            console.error("❌ Error starting mic:", err);
        });
    }).catch(err => {
        console.error("⚠️ Audio Context Error:", err);
    });

    // Generate rainbow gradient colors
    for (let i = 0; i < 100; i++) {
        let inter = map(i, 0, 100, 0, 1);
        colors.push(lerpColor(color("#ff0000"), color("#0000ff"), inter)); // Red to Blue gradient
    }
}

function draw() {
    background(0, 50); // Slight fade effect for smooth transitions

    if (!fft) return; // Ensure FFT is initialized

    let spectrum = fft.analyze();
    translate(width / 2, height / 2);

    for (let i = 0; i < spectrum.length; i += 10) {
        let angle = map(i, 0, spectrum.length, 0, TWO_PI);
        let radius = map(spectrum[i], 0, 255, 50, 250);
        
        let x = radius * cos(angle);
        let y = radius * sin(angle);
        
        // Use a rainbow gradient
        let colIndex = floor(map(i, 0, spectrum.length, 0, colors.length));
        fill(colors[colIndex]);
        noStroke();
        ellipse(x, y, 10);
    }
}
