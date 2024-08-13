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
let overlayImage = null;

upload.addEventListener('change', function(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            layer.destroyChildren(); // Clear previous content

            userImage = new Konva.Image({
                x: 0,
                y: 0,
                image: img,
                width: stage.width(),
                height: stage.height(),
                draggable: false
            });
            layer.add(userImage);
            
            if (!overlayImage) {
                overlayImage = new Konva.Image({
                    x: 100, // Initial position of the sticker
                    y: 100,
                    image: new Image(),
                    width: 100,
                    height: 100,
                    draggable: true
                });
                overlayImage.image().src = 'sticker.webp';
                layer.add(overlayImage);
            } else {
                overlayImage.visible(true); // Make sticker visible if previously hidden
            }

            // Add a transformer to allow resizing and rotation
            const tr = new Konva.Transformer();
            layer.add(tr);
            tr.attachTo(overlayImage);
            layer.draw();
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
});

doneButton.addEventListener('click', function() {
    const transformers = layer.find('Transformer');
    transformers.each(function(node) {
        node.detach();
        node.destroy();
    });
    overlayImage.draggable(false); // Disable dragging of the sticker
    layer.draw();
    downloadButton.disabled = false; // Enable the download button
});

downloadButton.addEventListener('click', function() {
    if (!downloadButton.disabled) { // Check if the button is enabled
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
    } else {
        console.error('Download button was clicked but it is disabled.');
    }
});
