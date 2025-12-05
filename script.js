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

// State
let isPlaying = false;
let videoDuration = 0;
let mediaRecorder = null;
let recordedChunks = [];
let logoImage = new Image();
logoImage.crossOrigin = "anonymous";
logoImage.src = "https://ibb.co/KpXhbZw9https://ibb.co/zHDGvYSN";

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
    
    // Set canvas size
    previewCanvas.width = videoElement.videoWidth || 640;
    previewCanvas.height = videoElement.videoHeight || 480;
    
    // Initialize trim sliders
    trimStartSlider.max = videoDuration;
    trimEndSlider.max = videoDuration;
    trimEndSlider.value = videoDuration;
    trimStartValue.textContent = '0.0';
    trimEndValue.textContent = videoDuration.toFixed(1);
    
    // Initial render
    renderFrame();
});

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

// Render frame with effects
function renderFrame() {
    if (!videoElement.videoWidth) return;
    
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
    ctx.drawImage(videoElement, 0, 0, previewCanvas.width, previewCanvas.height);
    ctx.filter = 'none';
    
    // Draw intro text
    const intro = introText.value;
    if (intro) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, previewCanvas.width, 100);
        
        ctx.font = 'bold 36px Arial';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(intro, previewCanvas.width / 2, 50);
    }
    
    // Draw watermark based on type
    const wmType = watermarkType.value;
    const logoSize = 50;
    const padding = 20;
    
    if (wmType === 'logo' || wmType === 'both') {
        // Draw logo in bottom-right
        if (logoImage.complete) {
            const logoX = previewCanvas.width - logoSize - padding;
            const logoY = previewCanvas.height - logoSize - padding;
            
            // Add subtle background for logo
            ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.fillRect(logoX - 5, logoY - 5, logoSize + 10, logoSize + 10);
            
            ctx.drawImage(logoImage, logoX, logoY, logoSize, logoSize);
        }
    }
    
    if (wmType === 'text' || wmType === 'both') {
        const watermark = watermarkText.value;
        if (watermark) {
            ctx.font = '20px Arial';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.textAlign = 'right';
            ctx.textBaseline = 'bottom';
            
            if (wmType === 'both') {
                // Position text above logo
                ctx.fillText(watermark, previewCanvas.width - padding, previewCanvas.height - logoSize - padding - 10);
            } else {
                // Position text at bottom-right
                ctx.fillText(watermark, previewCanvas.width - padding, previewCanvas.height - padding);
            }
        }
    }
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
            a.download = 'baint-aiops-video.webm';
            a.click();
            
            progressDiv.textContent = 'Export complete! Download started.';
            setTimeout(() => {
                progressDiv.style.display = 'none';
                exportBtn.disabled = false;
            }, 3000);
        };
        
        // Start recording
        mediaRecorder.start();
        progressDiv.textContent = 'Recording video with Baint-AIOPs branding...';
        
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
