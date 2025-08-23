document.addEventListener('DOMContentLoaded', () => {
    // Screens
    const homeScreen = document.getElementById('home-screen');
    const verifyScreen = document.getElementById('verify-screen');
    const resultScreen = document.getElementById('result-screen');
    const analyzingOverlay = document.getElementById('analyzing-overlay');

    // Buttons
    const tryNowBtn = document.getElementById('try-now-btn');
    const verifyNowBtn = document.getElementById('verify-now-btn');
    const newAnalysisBtn = document.getElementById('new-analysis-btn');
    const backHomeBtns = document.querySelectorAll('.back-home-btn');

    // Upload elements
    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('image-upload');
    const imagePreviewContainer = document.getElementById('image-preview-container');
    const previewImage = document.getElementById('preview-image');
    const clearBtn = document.querySelector('.clear-btn');

    // Result elements
    const resultText = document.querySelector('.result-text');
    const resultBar = document.getElementById('result-bar');
    const resultTitle = document.getElementById('result-title');

    // Screen transition with fade
    function showScreen(screen) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        screen.classList.add('active');
    }

    // Overlay control
    function showOverlay(overlay) {
        overlay.classList.remove('hidden');
    }

    function hideOverlay(overlay) {
        overlay.classList.add('hidden');
    }

    // Reset upload state
    function resetUpload() {
        imagePreviewContainer.style.display = 'none';
        uploadArea.style.display = 'flex';
        previewImage.src = '#';
        fileInput.value = '';
        verifyNowBtn.disabled = true;
    }

    // Update result bar with animation
    function updateResultBar(confidence) {
        resultText.textContent = `${confidence}% REAL`;
        resultBar.style.width = '0%'; // Reset first

        setTimeout(() => {
            resultBar.style.width = `${confidence}%`;
            resultBar.style.backgroundColor = confidence > 90 ? '#4caf50' : '#fbc02d';
            resultTitle.textContent = 'Analysis Complete';

            resultBar.classList.add('pulse');
            setTimeout(() => resultBar.classList.remove('pulse'), 1000);
        }, 100);
    }

    // Navigation
    tryNowBtn?.addEventListener('click', () => {
        resetUpload();
        showScreen(verifyScreen);
    });

    newAnalysisBtn?.addEventListener('click', () => {
        resetUpload();
        resultBar.style.width = '0%';
        showScreen(verifyScreen);
    });

    backHomeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            resetUpload();
            resultBar.style.width = '0%';
            showScreen(homeScreen);
        });
    });

    // Upload interactions
    uploadArea?.addEventListener('click', () => {
        fileInput.click();
    });

    uploadArea?.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = 'var(--primary-color)';
    });

    uploadArea?.addEventListener('dragleave', () => {
        uploadArea.style.borderColor = 'var(--border-color)';
    });

    uploadArea?.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = 'var(--border-color)';
        const file = e.dataTransfer.files[0];
        handleFile(file);
    });

    fileInput?.addEventListener('change', (e) => {
        const file = e.target.files[0];
        handleFile(file);
    });

    clearBtn?.addEventListener('click', () => {
        resetUpload();
    });

    // Verification trigger
    verifyNowBtn?.addEventListener('click', () => {
        if (!verifyNowBtn.disabled) {
            showOverlay(analyzingOverlay);

            setTimeout(() => {
                hideOverlay(analyzingOverlay);
                showScreen(resultScreen);

                const confidence = Math.floor(Math.random() * 21) + 80; // Simulated 80–100%
                updateResultBar(confidence);
            }, 3000);
        }
    });

    // File handler
    function handleFile(file) {
    if (!file || !file.type.startsWith('image/')) return;

    // ✅this block to enforce 10MB limit
    if (file.size > 10 * 1024 * 1024) {
        alert("File too large. Max size is 10MB.");
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        previewImage.src = e.target.result;
        imagePreviewContainer.style.display = 'block';
        uploadArea.style.display = 'none';
        verifyNowBtn.disabled = false;
    };
    reader.readAsDataURL(file);
}
});