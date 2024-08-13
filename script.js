const upload = document.getElementById('upload');
const doneButton = document.getElementById('done');
const downloadButton = document.getElementById('download');
const stage = new Konva.Stage({
    container: 'canvas-container',
    width: 500,
    height: 500
});

const layer = new Konva.Layer();
stage.add(layer);

let userImage = null;
let overlayImage = new Konva.Image({
    draggable: true
});

// Preload the sticker image
const sticker = new Image();
sticker.onload = function() {
    overlayImage.image(sticker);
    overlayImage.width(100);  // Set initial size of the sticker
    overlayImage.height(100);
    overlayImage.x(200);  // Initial position of the sticker
    overlayImage.y(200);
};
sticker.src = './sticker.webp';

layer.add(overlayImage);

upload.addEventListener('change', function(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            // Remove previous image if exists
            if (userImage) {
                userImage.destroy();
            }
            
            userImage = new Konva.Image({
                x: 0,
                y: 0,
                image: img,
                width: stage.width(),
                height: stage.height(),
                draggable: false  // Make it non-draggable
            });
            
            layer.add(userImage);
            layer.draw();
        };
        img.src = event.target.result;
    };
    
    if (file) {
        reader.readAsDataURL(file);
    }
});

doneButton.addEventListener('click', function() {
    // Disable interaction with the sticker
    overlayImage.draggable(false);
    layer.draw();
    downloadButton.disabled = false;
});

downloadButton.addEventListener('click', function() {
    const dataURL = stage.toDataURL({
        mimeType: 'image/jpeg',
        quality: 0.9
    });
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'groypify-profile-pic.jpeg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});
