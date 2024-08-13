// Get references to DOM elements
const upload = document.getElementById('upload');
const doneButton = document.getElementById('done');
const downloadButton = document.getElementById('download');

// Set up the Konva stage and layer
const stage = new Konva.Stage({
    container: 'canvas-container',
    width: 500, // Set an initial width
    height: 500, // Set an initial height
});

const layer = new Konva.Layer();
stage.add(layer);

let uploadedImage = new Image();
let overlayImage = new Image();
let userImage = null;
let overlay = null;

// Path to your overlay image (sticker.webp)
overlayImage.src = 'sticker.webp';

// Event listener for image upload
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

            // Add a transformer to allow resizing and rotation
            const tr = new Konva.Transformer();
            layer.add(tr);
            tr.attachTo(overlay);
            layer.draw();
        };
    };
    reader.readAsDataURL(e.target.files[0]);
});

// Event listener for the "Done" button
doneButton.addEventListener('click', () => {
    if (overlay && userImage) {
        overlay.draggable(false); // Disable dragging for overlay
        userImage.draggable(false); // Disable dragging for user image
        layer.getChildren().forEach(child => {
            if (child instanceof Konva.Transformer) {
                child.destroy(); // Remove the transformer handles
            }
        });
        layer.draw();
        downloadButton.disabled = false; // Enable the download button
    }
});

// Event listener for the "Download" button
downloadButton.addEventListener('click', () => {
    try {
        const dataURL = stage.toDataURL(); // Generate the data URL for the image
        console.log(dataURL); // Log the data URL for debugging

        const link = document.createElement('a');
        link.setAttribute('href', dataURL);
        link.setAttribute('download', 'profile-picture.png');

        document.body.appendChild(link); // Append link to the body
        link.click(); // Trigger the download
        document.body.removeChild(link); // Remove the link from the DOM
    } catch (error) {
        console.error('Download failed: ', error); // Log any errors
    }
});
