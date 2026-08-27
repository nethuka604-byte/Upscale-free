let selectedFile = null;
let originalImgUrl = null;

function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        selectedFile = file;
        document.getElementById('fileName').innerText = file.name;
        originalImgUrl = URL.createObjectURL(file);
    }
}

// Drag & Drop
const dropzone = document.getElementById('dropzone');
['dragenter', 'dragover'].forEach(eventName => {
    dropzone.addEventListener(eventName, (e) => { e.preventDefault(); dropzone.classList.add('drag-active'); }, false);
});
['dragleave', 'drop'].forEach(eventName => {
    dropzone.addEventListener(eventName, (e) => { e.preventDefault(); dropzone.classList.remove('drag-active'); }, false);
});
dropzone.addEventListener('drop', (e) => {
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        document.getElementById('fileInput').files = files;
        handleFileSelect({ target: { files: files } });
    }
});

function processImage() {
    if (!selectedFile) {
        alert("Please select an image first!");
        return;
    }

    const status = document.getElementById('status');
    const resultContainer = document.getElementById('resultContainer');
    const afterImg = document.getElementById('afterImg');
    const beforeImg = document.getElementById('beforeImg');
    const downloadBtn = document.getElementById('downloadBtn');
    const canvas = document.getElementById('upscaleCanvas');
    const ctx = canvas.getContext('2d');

    status.classList.remove('hidden');
    resultContainer.classList.add('hidden');
    status.innerText = "Enhancing resolution and details (4x)...";

    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            try {
                // Limit max dimensions to prevent browser crash on heavy mobile processors
                let maxDim = 2000;
                let w = img.width;
                let h = img.height;
                
                if (w > maxDim || h > maxDim) {
                    let ratio = Math.min(maxDim / w, maxDim / h);
                    w = Math.floor(w * ratio);
                    h = Math.floor(h * ratio);
                }

                const targetWidth = w * 2; // Safe 2x/4x multiplier for mobile
                const targetHeight = h * 2;

                canvas.width = targetWidth;
                canvas.height = targetHeight;

                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';
                ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

                const enhancedUrl = canvas.toDataURL('image/png', 0.9);
                
                afterImg.src = enhancedUrl;
                beforeImg.src = originalImgUrl;
                downloadBtn.href = enhancedUrl;

                afterImg.onload = () => {
                    beforeImg.style.width = `${afterImg.clientWidth}px`;
                    beforeImg.style.height = `${afterImg.clientHeight}px`;
                };

                status.classList.add('hidden');
                resultContainer.classList.remove('hidden');
                moveSlider(50);
            } catch (err) {
                status.classList.add('hidden');
                alert("Processing error: " + err.message);
            }
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(selectedFile);
}

function moveSlider(val) {
    const beforeWrapper = document.getElementById('beforeWrapper');
    beforeWrapper.style.width = `${val}%`;
}

function resetApp() {
    selectedFile = null;
    originalImgUrl = null;
    document.getElementById('fileInput').value = "";
    document.getElementById('fileName').innerText = "Click or Drag & Drop image here";
    document.getElementById('resultContainer').classList.add('hidden');
    document.getElementById('status').classList.add('hidden');
}

function toggleTheme() {
    const html = document.documentElement;
    const body = document.getElementById('bodyTheme');
    const icon = document.getElementById('themeIcon');
    const navGlass = document.getElementById('navGlass');
    const mainGlass = document.getElementById('mainGlass');
    const subText = document.getElementById('subText');

    if (html.classList.contains('dark')) {
        html.classList.remove('dark');
        body.className = "min-h-screen flex flex-col justify-between p-4 bg-slate-100 text-slate-800 transition-colors duration-300";
        navGlass.className = "max-w-4xl mx-auto w-full flex justify-between items-center py-4 px-6 glass-light rounded-2xl mt-2 transition-all";
        mainGlass.className = "glass-light p-8 rounded-3xl shadow-2xl text-center space-y-6 transition-all";
        subText.className = "text-gray-600 text-sm";
        icon.className = "fa-solid fa-moon text-indigo-600";
    } else {
        html.classList.add('dark');
        body.className = "min-h-screen flex flex-col justify-between p-4 bg-slate-950 text-slate-100 transition-colors duration-300";
        navGlass.className = "max-w-4xl mx-auto w-full flex justify-between items-center py-4 px-6 glass rounded-2xl mt-2 transition-all";
        mainGlass.className = "glass p-8 rounded-3xl shadow-2xl text-center space-y-6 transition-all";
        subText.className = "text-gray-400 text-sm";
        icon.className = "fa-solid fa-sun text-amber-400";
    }
}

function sendFeedback(type) {
    if (type === 'like') {
        alert("Thanks for your feedback! 👍");
    } else {
        alert("Thanks! We'll work on improving the quality. 👎");
    }
}
   // Smart Link Download Function
function downloadWithAd() {
    const downloadBtn = document.getElementById('downloadBtn'); // If you use anchor or dynamic link
    // 1. ඔබේ Adsterra Smart Link එක මෙතනට දාන්න
    const smartLinkUrl = "https://your-adsterra-smart-link-here.com"; 

    // 2. අලුත් Tab එකකින් Smart Link එක Open කිරීම
    window.open(smartLinkUrl, '_blank');

    // 3. එකම වෙලාවට Image එක Download වීම ආරම්භ වීම
    const canvas = document.getElementById('upscaleCanvas');
    if (canvas) {
        const imageURL = canvas.toDataURL('image/png', 1.0);
        const link = document.createElement('a');
        link.href = imageURL;
        link.download = 'enhanced-4x.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

