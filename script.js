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

// Path to your overlay image
overlayImage.src = 'sticker.webp';

upload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            // Remove previous images if they exist
            layer.destroyChildren();

            // Add the user image
            userImage = new Konva.Image({
                x: 0,
                y: 0,
                image: img,
                width: stage.width(),
                height: stage.height(),
                draggable: false
            });
            layer.add(userImage);

            // Ensure the sticker is loaded and add it
            const stickerImg = new Image();
            stickerImg.onload = function() {
                overlayImage.image(stickerImg);
                overlayImage.setAttrs({
                    width: 100,
                    height: 100,
                    x: 50,
                    y: 50
                });
                layer.add(overlayImage);

                // Add transformer
                const tr = new Konva.Transformer();
                layer.add(tr);
                tr.attachTo(overlayImage);
                layer.draw();
            };
            stickerImg.src = overlayImage.src;
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
});

doneButton.addEventListener('click', () => {
    // Disable interaction with the sticker
    overlayImage.draggable(false);
    const transformers = layer.find('Transformer');
    transformers.each(function(node) {
        node.destroy();
    });
    layer.draw();
    downloadButton.disabled = false;
});

downloadButton.addEventListener('click', () => {
    try {
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
    } catch (error) {
        console.error('Download failed: ', error);
    }
});
