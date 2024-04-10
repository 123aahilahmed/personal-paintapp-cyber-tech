// Get the canvas element and its 2d context
const canvas = document.getElementById('paintCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
canvas.width = window.innerWidth - 20;
canvas.height = window.innerHeight - 150;

// Initialize variables for drawing
let isMouseDown = false;
let brushSize = 5;
let brushColor = '#000'; // Default color is black
let eraserMode = false;
let startPos = {}; // Track starting position for free drawing

// Function to draw on the canvas
function draw(e) {
    if (isMouseDown) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (eraserMode) {
            erase(x, y);
        } else {
            drawPen(x, y);
        }
    }
}

// Function to draw with the pen tool
function drawPen(x, y) {
    ctx.lineWidth = brushSize;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.strokeStyle = brushColor;

    if (!startPos.x || !startPos.y) {
        ctx.beginPath();
        ctx.moveTo(x, y);
    } else {
        ctx.lineTo(x, y);
        ctx.stroke();
    }

    startPos = { x, y };
}

// Function to erase on the canvas
function erase(x, y) {
    const eraseSize = 10; // Adjust eraser size as needed
    ctx.clearRect(x - eraseSize / 2, y - eraseSize / 2, eraseSize, eraseSize);
}

// Event listeners for mouse actions
canvas.addEventListener('mousedown', (e) => {
    isMouseDown = true;
    const rect = canvas.getBoundingClientRect();
    startPos = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };

    ctx.beginPath();
    ctx.moveTo(startPos.x, startPos.y);
});

canvas.addEventListener('mouseup', () => {
    isMouseDown = false;
    startPos = {};
});

canvas.addEventListener('mousemove', draw);

// Event listeners for touch actions
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault(); // Prevent default touch behavior
    isMouseDown = true;
    const rect = canvas.getBoundingClientRect();
    startPos = {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
    };

    ctx.beginPath();
    ctx.moveTo(startPos.x, startPos.y);
});

canvas.addEventListener('touchend', () => {
    isMouseDown = false;
    startPos = {};
});

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault(); // Prevent default touch behavior
    draw(e.touches[0]);
});

// Function to change brush size
function changeBrushSize(size) {
    brushSize = size;
}

// Function to change brush color
function changeBrushColor(color) {
    brushColor = color;
    eraserMode = false;
}

// Function to enable pen mode
function enablePenMode() {
    eraserMode = false;
}

// Function to enable eraser mode
function enableEraser() {
    eraserMode = true;
}

// Function to clear the canvas
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Function to save canvas as image with custom file name
function saveCanvas() {
    const fileName = prompt("Enter a file name:", "artwork"); // Prompt user for file name
    if (fileName) {
        const url = canvas.toDataURL("image/png"); // Convert canvas to data URL
        const link = document.createElement("a");
        link.download = fileName + ".png"; // Set the file name with .png extension
        link.href = url;
        link.click(); // Simulate click on the link to trigger download
    }
}
