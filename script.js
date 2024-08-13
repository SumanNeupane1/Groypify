const upload = document.getElementById('upload');
const doneButton = document.getElementById('done');
const downloadButton = document.getElementById('download');
const stage = new Konva.Stage({
    container: 'canvas-container',
    width: 500,  // Match the CSS settings for canvas-container
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

            // Load sticker when image is loaded
            if (!overlayImage) {
                overlayImage = new Konva.Image({
                    x: 150,  // Initial position of the sticker
                    y: 150,
                    width: 100,  // Initial size of the sticker
                    height: 100,
                    draggable: true
                });

                const sticker = new Image();
                sticker.onload = function() {
                    overlayImage.image(sticker);
                    layer.add(overlayImage);
                    layer.draw();

                    // Add ability to resize and rotate the sticker
                    const tr = new Konva.Transformer();
                    layer.add(tr);
                    tr.attachTo(overlayImage);
                    layer.draw();
                };
                sticker.src = './sticker.webp'; // Ensure path is correct
            }
        };
        img.src = event.target.result;
    };
    
    if (file) {
        reader.readAsDataURL(file);
    }
});

doneButton.addEventListener('click', function() {
    // Disable interaction with the sticker
    if (overlayImage) {
        overlayImage.draggable(false);
        const transformers = layer.find('Transformer');
        transformers.each(function(node) {
            node.destroy();
        });
        layer.draw();
        downloadButton.disabled = false;
    }
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
