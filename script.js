const upload = document.getElementById('upload');
const doneButton = document.getElementById('done');
const downloadButton = document.getElementById('download');
const stage = new Konva.Stage({
    container: 'canvas-container',
    width: 500,  // Matches the canvas container size
    height: 500
});

const layer = new Konva.Layer();
stage.add(layer);

let userImage = null;
let overlayImage = null;
let transformer = new Konva.Transformer();

// Function to create overlay image
function createOverlay() {
    const imageObj = new Image();
    imageObj.onload = function() {
        overlayImage = new Konva.Image({
            image: imageObj,
            x: 50,
            y: 50,
            width: 100,
            height: 100,
            draggable: true
        });
        layer.add(overlayImage);
        transformer.nodes([overlayImage]);
        layer.add(transformer);
        layer.draw();
    };
    imageObj.src = 'sticker.webp';  // Load your sticker image
}

upload.addEventListener('change', function(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            // Clear previous image
            layer.destroyChildren();

            // Set user image
            userImage = new Konva.Image({
                x: 0,
                y: 0,
                image: img,
                width: stage.width(),
                height: stage.height(),
                draggable: false
            });
            layer.add(userImage);
            createOverlay();  // Add sticker upon image load
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
});

doneButton.addEventListener('click', function() {
    // Disable editing and remove transformer
    if (overlayImage) {
        overlayImage.draggable(false);
        transformer.detach();
        layer.draw();
        downloadButton.disabled = false;
    }
});

downloadButton.addEventListener('click', function() {
    // Download the composite image
    const dataURL = stage.toDataURL({
        mimeType: 'image/jpeg',
        quality: 1  // Max quality
    });
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'groypified-img.jpeg';  // Set the desired file name
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});
