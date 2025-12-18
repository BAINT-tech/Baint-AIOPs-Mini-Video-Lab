// Elements
const videoInput = document.getElementById('videoInput');
const uploadSection = document.getElementById('uploadSection');
const editorSection = document.getElementById('editorSection');
const videoElement = document.getElementById('videoElement');
const previewCanvas = document.getElementById('previewCanvas');
const playBtn = document.getElementById('playBtn');
const playIcon = document.getElementById('playIcon');
const pauseIcon = document.getElementById('pauseIcon');
const playText = document.getElementById('playText');
const exportBtn = document.getElementById('exportBtn');
const progressDiv = document.getElementById('progressDiv');

// Text inputs
const introText = document.getElementById('introText');
const watermarkText = document.getElementById('watermarkText');
const watermarkType = document.getElementById('watermarkType');

// Filter controls
const filterSelect = document.getElementById('filterSelect');
const brightnessSlider = document.getElementById('brightnessSlider');
const contrastSlider = document.getElementById('contrastSlider');
const brightnessValue = document.getElementById('brightnessValue');
const contrastValue = document.getElementById('contrastValue');

// Trim controls
const trimStartSlider = document.getElementById('trimStartSlider');
const trimEndSlider = document.getElementById('trimEndSlider');
const trimStartValue = document.getElementById('trimStartValue');
const trimEndValue = document.getElementById('trimEndValue');

// Aspect ratio buttons
const aspectBtns = document.querySelectorAll('.aspect-btn');

// State
let isPlaying = false;
let videoDuration = 0;
let mediaRecorder = null;
let recordedChunks = [];
let currentAspectRatio = 'original';
let logoImage = new Image();
logoImage.crossOrigin = "anonymous";
logoImage.src = "https://pbs.twimg.com/profile_images/1849127708057645056/ojA02hHz_400x400.jpg";

// Canvas context
const ctx = previewCanvas.getContext('2d');

// File upload handler
videoInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('video/')) {
        const url = URL.createObjectURL(file);
        videoElement.src = url;
        uploadSection.style.display = 'none';
        editorSection.style.display = 'block';
    }
});

// Video metadata loaded
videoElement.addEventListener('loadedmetadata', () => {
    videoDuration = videoElement.duration;
    
    // Set canvas size based on aspect ratio
    updateCanvasSize();
    
    // Initialize trim sliders
    trimStartSlider.max = videoDuration;
    trimEndSlider.max = videoDuration;
    trimEndSlider.value = videoDuration;
    trimStartValue.textContent = '0.0';
    trimEndValue.textContent = videoDuration.toFixed(1);
    
    // Initial render
    renderFrame();
});

// Aspect ratio button handlers
aspectBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        aspectBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');
        // Update aspect ratio
        currentAspectRatio = btn.dataset.ratio;
        // Update canvas size
        updateCanvasSize();
        // Re-render
        renderFrame();
    });
});

// Update canvas size based on aspect ratio
function updateCanvasSize() {
    const videoWidth = videoElement.videoWidth || 640;
    const videoHeight = videoElement.videoHeight || 480;
    
    switch(currentAspectRatio) {
        case '16:9':
            previewCanvas.width = 1280;
            previewCanvas.height = 720;
            break;
        case '9:16':
            previewCanvas.width = 720;
            previewCanvas.height = 1280;
            break;
        case '1:1':
            previewCanvas.width = 1080;
            previewCanvas.height = 1080;
            break;
        case '4:5':
            previewCanvas.width = 1080;
            previewCanvas.height = 1350;
            break;
        case 'original':
        default:
            previewCanvas.width = videoWidth;
            previewCanvas.height = videoHeight;
            break;
    }
}

// Play/Pause button
playBtn.addEventListener('click', () => {
    if (isPlaying) {
        videoElement.pause();
    } else {
        videoElement.play();
    }
});

videoElement.addEventListener('play', () => {
    isPlaying = true;
    playIcon.style.display = 'none';
    pauseIcon.style.display = 'block';
    playText.textContent = 'Pause';
    renderLoop();
});

videoElement.addEventListener('pause', () => {
    isPlaying = false;
    playIcon.style.display = 'block';
    pauseIcon.style.display = 'none';
    playText.textContent = 'Play';
});

videoElement.addEventListener('seeked', renderFrame);

// Slider updates
brightnessSlider.addEventListener('input', (e) => {
    brightnessValue.textContent = e.target.value;
    renderFrame();
});

contrastSlider.addEventListener('input', (e) => {
    contrastValue.textContent = e.target.value;
    renderFrame();
});

trimStartSlider.addEventListener('input', (e) => {
    const value = parseFloat(e.target.value);
    trimStartValue.textContent = value.toFixed(1);
    if (value < parseFloat(trimEndSlider.value)) {
        videoElement.currentTime = value;
    }
});

trimEndSlider.addEventListener('input', (e) => {
    trimEndValue.textContent = parseFloat(e.target.value).toFixed(1);
});

// Text and filter changes
introText.addEventListener('input', renderFrame);
watermarkText.addEventListener('input', renderFrame);
watermarkType.addEventListener('change', renderFrame);
filterSelect.addEventListener('change', renderFrame);

// Render frame with effects and cropping
function renderFrame() {
    if (!videoElement.videoWidth) return;
    
    const canvasWidth = previewCanvas.width;
    const canvasHeight = previewCanvas.height;
    const videoWidth = videoElement.videoWidth;
    const videoHeight = videoElement.videoHeight;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    
    // Calculate crop dimensions to fit aspect ratio (cover mode)
    let scale = Math.max(canvasWidth / videoWidth, canvasHeight / videoHeight);
    let scaledWidth = videoWidth * scale;
    let scaledHeight = videoHeight * scale;
    let x = (canvasWidth - scaledWidth) / 2;
    let y = (canvasHeight - scaledHeight) / 2;
    
    // Apply filters
    const brightness = brightnessSlider.value;
    const contrast = contrastSlider.value;
    const filter = filterSelect.value;
    
    let filterStr = `brightness(${brightness}%) contrast(${contrast}%)`;
    if (filter === 'grayscale') {
        filterStr += ' grayscale(100%)';
    } else if (filter === 'sepia') {
        filterStr += ' sepia(100%)';
    }
    
    ctx.filter = filterStr;
    ctx.drawImage(videoElement, x, y, scaledWidth, scaledHeight);
    ctx.filter = 'none';
    
    // Draw intro text at top
    const intro = introText.value;
    if (intro) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvasWidth, 100);
        
        ctx.font = 'bold 36px Arial';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(intro, canvasWidth / 2, 50);
    }
    
    // TikTok-style watermark: Logo + Text side by side
    const wmType = watermarkType.value;
    
    if (wmType === 'logo' || wmType === 'both') {
        const logoSize = 50;
        const padding = 20;
        const textGap = 10;
        
        // Position at bottom-right
        const startX = canvasWidth - 200;
        const startY = canvasHeight - logoSize - padding;
        
        if (logoImage.complete) {
            // Draw semi-transparent background box
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.beginPath();
            ctx.roundRect(startX - 10, startY - 10, 180, logoSize + 20, 10);
            ctx.fill();
            
            // Draw logo on the LEFT
            const logoX = startX;
            const logoY = startY;
            ctx.drawImage(logoImage, logoX, logoY, logoSize, logoSize);
            
            // Draw "Baint-AIOPs" text on the RIGHT of logo
            ctx.font = 'bold 20px Arial';
            ctx.fillStyle = 'white';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText('Baint-AIOPs', logoX + logoSize + textGap, logoY + logoSize / 2);
        }
    }
    
    // Optional additional watermark text at bottom-left
    if (wmType === 'text') {
        const watermark = watermarkText.value;
        if (watermark) {
            const padding = 20;
            ctx.font = '18px Arial';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'bottom';
            
            // Background for text
            const textWidth = ctx.measureText(watermark).width;
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillRect(padding - 5, canvasHeight - 35, textWidth + 10, 30);
            
            // Draw text
            ctx.fillStyle = 'white';
            ctx.fillText(watermark, padding, canvasHeight - padding);
        }
    }
}

// Add roundRect support for older browsers
if (!CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
        if (w < 2 * r) r = w / 2;
        if (h < 2 * r) r = h / 2;
        this.beginPath();
        this.moveTo(x + r, y);
        this.arcTo(x + w, y, x + w, y + h, r);
        this.arcTo(x + w, y + h, x, y + h, r);
        this.arcTo(x, y + h, x, y, r);
        this.arcTo(x, y, x + w, y, r);
        this.closePath();
        return this;
    };
}

// Render loop for playing video
function renderLoop() {
    if (isPlaying && !videoElement.paused) {
        renderFrame();
        requestAnimationFrame(renderLoop);
    }
}

// Export video
exportBtn.addEventListener('click', async () => {
    const trimStart = parseFloat(trimStartSlider.value);
    const trimEnd = parseFloat(trimEndSlider.value);
    
    if (trimEnd <= trimStart) {
        alert('End time must be greater than start time!');
        return;
    }
    
    exportBtn.disabled = true;
    progressDiv.style.display = 'block';
    progressDiv.textContent = 'Preparing to record...';
    
    try {
        // Reset video to trim start
        videoElement.currentTime = trimStart;
        recordedChunks = [];
        
        // Create stream from canvas
        const stream = previewCanvas.captureStream(30);
        
        // Try to add audio (may not work in all browsers)
        try {
            const audioContext = new AudioContext();
            const source = audioContext.createMediaElementSource(videoElement);
            const dest = audioContext.createMediaStreamDestination();
            source.connect(dest);
            source.connect(audioContext.destination);
            
            const audioTrack = dest.stream.getAudioTracks()[0];
            if (audioTrack) {
                stream.addTrack(audioTrack);
            }
        } catch (audioError) {
            console.warn('Could not capture audio:', audioError);
        }
        
        // Setup MediaRecorder
        const options = { mimeType: 'video/webm;codecs=vp9' };
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
            options.mimeType = 'video/webm';
        }
        
        mediaRecorder = new MediaRecorder(stream, options);
        
        mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) {
                recordedChunks.push(e.data);
            }
        };
        
        mediaRecorder.onstop = () => {
            const blob = new Blob(recordedChunks, { type: 'video/webm' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `baint-aiops-${currentAspectRatio}.webm`;
            a.click();
            
            progressDiv.textContent = 'Export complete! Download started.';
            setTimeout(() => {
                progressDiv.style.display = 'none';
                exportBtn.disabled = false;
            }, 3000);
        };
        
        // Start recording
        mediaRecorder.start();
        progressDiv.textContent = `Recording ${currentAspectRatio} video...`;
        
        // Play video
        await videoElement.play();
        
        // Monitor progress and stop at trim end
        const checkProgress = () => {
            if (videoElement.currentTime >= trimEnd) {
                videoElement.pause();
                mediaRecorder.stop();
            } else if (mediaRecorder.state === 'recording') {
                renderFrame();
                requestAnimationFrame(checkProgress);
            }
        };
        
        renderFrame();
        requestAnimationFrame(checkProgress);
        
    } catch (error) {
        console.error('Export error:', error);
        progressDiv.textContent = 'Export failed: ' + error.message;
        exportBtn.disabled = false;
    }
});
