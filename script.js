const upload = document.getElementById('upload');
const doneButton = document.getElementById('done');
const downloadButton = document.getElementById('download');
const stage = new Konva.Stage({
    container: 'canvas-container',
    width: 500,  // Match the CSS settings
    height: 500  // Match the CSS settings
});

const layer = new Konva.Layer();
stage.add(layer);

let userImage = null;

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
                draggable: true
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
    // Disable further interactions
    const shapes = layer.find('Image');
    shapes.forEach(function(shape) {
        shape.draggable(false);
    });
    const transformers = layer.find('Transformer');
    transformers.each(function(node) {
        node.destroy();
    });
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
