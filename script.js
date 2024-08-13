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
            layer.destroyChildren(); 
            userImage = new Konva.Image({
                x: 0,
                y: 0,
                image: img,
                width: stage.width(),
                height: stage.height(),
                draggable: false
            });
            layer.add(userImage);
            createOverlay(); 
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
});

function createOverlay() {
    if (!overlayImage) {
        const stickerImg = new Image();
        stickerImg.onload = function() {
            overlayImage = new Konva.Image({
                x: 150,
                y: 150,
                image: stickerImg,
                width: 100,
                height: 100,
                draggable: true
            });
            layer.add(overlayImage);
            layer.draw();
            const tr = new Konva.Transformer();
            layer.add(tr);
            tr.attachTo(overlayImage);
        };
        stickerImg.src = 'sticker.webp';
    }
}

doneButton.addEventListener('click', function() {
    if (overlayImage) {
        overlayImage.draggable(false);
        layer.find('Transformer').destroy();
        layer.draw();
        downloadButton.disabled = false;
    }
});

downloadButton.addEventListener('click', function() {
    const dataURL = stage.toDataURL({
        mimeType: 'image/jpeg',
        quality: 1
    });
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'groypified-img.jpeg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});
