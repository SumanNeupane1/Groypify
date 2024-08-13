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

let uploadedImage = new Image();
let overlayImage = new Image();
let userImage = null;
let overlay = null;

overlayImage.src = './sticker.webp';  // Adjust as needed

upload.addEventListener('change', (e) => {
    const reader = new FileReader();
    reader.onload = function(event) {
        uploadedImage.src = event.target.result;
        uploadedImage.onload = function() {
            userImage = new Konva.Image({
                x: 20,
                y: 20,
                image: uploadedImage,
                draggable: true,
            });

            layer.add(userImage);
            stage.width(uploadedImage.width);
            stage.height(uploadedImage.height);
            layer.draw();

            overlay = new Konva.Image({
                x: 50,
                y: 50,
                image: overlayImage,
                draggable: true,
            });

            layer.add(overlay);
            layer.draw();

            const tr = new Konva.Transformer();
            layer.add(tr);
            tr.attachTo(overlay);
            layer.draw();
        };
    };
    reader.readAsDataURL(e.target.files[0]);
});

doneButton.addEventListener('click', () => {
    if (overlay && userImage) {
        overlay.draggable(false);
        userImage.draggable(false);
        layer.find('Transformer').destroy();
        layer.draw();
        downloadButton.disabled = false;
    }
});

downloadButton.addEventListener('click', () => {
    const dataURL = stage.toDataURL({
        mimeType: 'image/jpeg',
        quality: 0.9
    });
    const link = document.createElement('a');
    link.setAttribute('href', dataURL);
    link.setAttribute('download', 'edited-image.jpeg');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});
