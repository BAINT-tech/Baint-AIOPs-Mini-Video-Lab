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
logoImage.src = "url(data:image/jpeg;base64,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lsUV1aw5KFybBckyZMDQIbsjoCcPiqszid4zfBEwKza7889iiupfidF7JVZfE7xPlooBWcXWgoBOSaJsuWQeAQA8cchCpKqZBAghxLYIByreqK6t2tSuBAONronZKqPiu7eCioUCs5utYGC4hoM4IkU1gCh9csfUICQDBAgprlmkE8CwGTBYDJgghXw9CbA5nNR2GbWOT5/LDFDEiac89IIGLpo5Ah9rG1aHJC3pnZKrq3c7yQoFZzdYU+Pd7FRPuxsw0yC9o7RKUcAR+EAwYWtwTQHOwUJyIxTZlo4rh+qljlzpETBvUoW8UECoAxvJJiyi60c8PhGiPvNwWPii45LmsUWhCwgtC9YajeIxEBgxxXxCVtFB4mD3B52B4T1JCM9wu6YgvLes9wUhWUXWjLDMBqncToeaEaDixkNkAl3l6AAMGA/F9ARQHLaxY4SDZlzOnBehlvBWouPZYIV3I/kNwmoklMMRKtj2vcgkf1GQXoAYBBx3co652Dv3sNHpchQCDuDeFAOdjp7CcUZ5sIFFDDcS7oiJGYIZ27iIAEGadgkl4FgUadPYtCrSy0AtCLQi0ItELTi04tELQC0gtLohhOgyONjQ4mD3B5Tom17kIBFyEAYGw3qaEAkaYkIjmjjE8m2DmtalFTMWewB2BwCaEt01rPstZ9kUW63snXjgiix1gSB5T6PaV2EJtqNE+v8AhuidjslDYnuIlWWSySz4gT1GkIT38E6IggjESIQ2Azyf8J0TsU/4y2AJI8/rqOgfkBCSHyCYg1TGSXHYOhc5KHizO+D/ABKGQGC1ErW01tNbKrdwKojXrY4K1ItaLWi1onp6CZXBxQsNONBTaiCbKcLlBaKyKxCepJGzAeMEx1Hr03yBLbGDtJPsPY+yNIAOORMmtOycVQDUsFHzV0dUJCrApvhABiAbVa0/8fWta1veAAkG/wCHn//aAAwDAQACAAMAAAAQ8Y888088s80s444c880888s488c88888888888888848888888s888880888848w8c888888888888s888888c888888888888888888888888888c88888888888888888wW/y7GiysYHs88s888888888fUlyPRN+vClK9O88888888888Fx8DWY8888pDQOy8888888888Cq8pPc8AXkxLMHa8888s88888EQ8Qbu8nuMR8yG88888808088b388s/iK76kogC88808888888Ft88xR79COe/MV88888888888338BD08Tjo80XC84888488888Ra8T8RQ0MMmHLk88888888888EK8K/Xh488D/gU88888888888VO1088808Yw/sJD888888Yc88t1e8vWc/geEgEj8sssM88808888899mb8c83ew6D88880888880885J5DQlHK3xlg4888888800440LMNNZ0c88888Us88w8cc8888s48c888s884o8c88888888888848c8s0848848888888c888c88888888888888888888088884ow8088844w884w8w808888888848c84088888888880//EACkRAAECAgkFAQEBAAAAAAAAAAEAETFBECEwUWFxkaHRgbHB4fDxIHD/2gAIAQMBAT8Q/wAD6/RkM0FXScGHd0Rcw4QfMOEFzDhB8w4RFyDhH2g4WLqHCrkj4oxEoi2i1ksOqrrUCs3nky0Vde8epPhYzbhPTbcLE7IknWOWI2WOR6Vy63xRIEVHz2mersUI0Cew90Do3JTz2jghbTiXZ/zGzPhbopw9QswmcUQRxgQasisMG897Pu+5HrHxQQ5ptEY35L0+aRZ/tAMNyUNcQ3TivZ7TCeoI5CZdE8QXcSP1arYggANT7WCD9s+/7FG+YfFA0RiFMEC3ZQyk1zodxUE3gVXonkNPadT1A6SH6Xi0YJn2K6xPikGJunYDFRlMpREbqMvos7T2szT2gDEmpXUvkxFp1E7FdTGkhOFNlMILAl3DouiDi5TzosfosfohuJcIQ/C8WjWlSF1AxzZQYZ0hDw8lE5sFFKdsg+F4tHZGFdQQ5WdnQfao/c2rQmAFr35R/c5V5i0A8BCgwAEAbibX8TN57XlTJXGKjkkIB7VNvadBO4XTooIBO9ZEwbwgYRqnAPsENEQmRFYLRNhAYBqL/wBn0rocCxTQBt8/aDz7p6WkU5n0rRcdgDdZIF/7A4RjsiRQcQkT5+06xzK9sTZkOGKOguUpjK8IdVdVj71i70NZR1TGIyJQLA70PuUR3fWna6B8eEfZcofGIQH+ZutmTBMg0kLfSITUtNItr+LZI8p4DWiLsckwVZRH00CFcG2YWAagwhJYjQcIsJIKLSMSscscpvnq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LLlxDCgqUIDq449IAKXNJiODlxxA9Ta3i0YNOrYb+SC/SoetJNANDxjgQ5iWR/y0/jJ/Ez+In8BP4CfwE/gJ/BT+Kn8VAAAGAf8Ajs855zznnPOec8+Pn/8AAv8A/9kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA=)";

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
