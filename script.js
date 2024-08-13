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
let overlayImage = null;  // Initialize without creating it

upload.addEventListener('change', function(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            // Clear previous image and transformer if they exist
            layer.find('Image').destroy();
            layer.find('Transformer').destroy();

            userImage = new Konva.Image({
                x: 0,
                y: 0,
                image: img,
                width: stage.width(),
                height: stage.height(),
                draggable: false
            });
            layer.add(userImage);

            // Load and display the sticker if not already loaded
            if (!overlayImage) {
                overlayImage = new Konva.Image({
                    x: 150,  // Default position
                    y: 150,
                    width: 100,  // Default size
                    height: 100,
                    draggable: true
                });

                const stickerImg = new Image();
                stickerImg.onload = function() {
                    overlayImage.image(stickerImg);
                    layer.add(overlayImage);
                    addTransformer();
                };
                stickerImg.src = './sticker.webp';
            } else {
                overlayImage.visible(true);
                addTransformer();
            }
            layer.draw();
        };
        img.src = event.target.result;
    };
    if (file) {
        reader.readAsDataURL(file);
    }
});

function addTransformer() {
    const tr = new Konva.Transformer();
    layer.add(tr);
    tr.attachTo(overlayImage);
}

doneButton.addEventListener('click', function() {
    const transformers = layer.find('Transformer');
    transformers.each(function(node) {
        node.destroy();
    });
    if (overlayImage) {
        overlayImage.draggable(false);
    }
    downloadButton.disabled = false;
    layer.draw();
});

downloadButton.addEventListener('click', function() {
    if (!downloadButton.disabled) {
        const dataURL = stage.toDataURL({
            mimeType: 'image/jpeg', // Specify JPEG format
            quality: 0.9 // Specify image quality
        });
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = 'groypify-profile-pic.jpeg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
});
