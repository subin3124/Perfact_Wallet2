const canvas = document.getElementById("jsCanvas");
const ctx = canvas.getContext("2d");
const colors = document.getElementsByClassName("jsColor");
let ReceiptArray = []
function handleColorClick(event) {
    const color = event.target.style.backgroundColor;
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
  }
  
  Array.from(colors).forEach(color =>
    color.addEventListener("click", handleColorClick)
  );

const range = document.getElementById("jsRange");

if (range) {
    range.addEventListener("input", handleRangeChange);
}

function handleRangeChange(event) {
  const size = event.target.value;
  ctx.lineWidth = size;
}

const INITIAL_COLOR = "#000000";

ctx.strokeStyle = "#2c2c2c";

canvas.width = 1370;
canvas.height = 520;

ctx.strokeStyle = INITIAL_COLOR;
ctx.lineWidth = 2.5; /* 라인 굵기 */

let painting = false;
let stopper = 0;

function stopPainting() {
    painting = false;
}

function startPainting() {
    painting = true;
}

function onMouseMove(event) {
    const x = event.offsetX;
    const y = event.offsetY;
    if (!painting || stopper) {
        ctx.beginPath();
        ctx.moveTo(x, y);
    } else {
        ctx.lineTo(x, y);
        ctx.stroke();
    }
}


function handleColorClick(event) {
    const color = event.target.style.backgroundColor;
    ctx.strokeStyle = color;
}

function handleRangeChange(event) {
    const size = event.target.value;
    ctx.lineWidth = size;
}


if (canvas) {
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mousedown", startPainting);
    canvas.addEventListener("mouseup", stopPainting);   
    canvas.addEventListener("mouseleave", stopPainting);
}


Array.from(colors).forEach(color =>
    color.addEventListener("click", handleColorClick));


if (range) {
    range.addEventListener("input", handleRangeChange);
}

const drawingBtn = document.getElementById("drawingBtn");
const stopBtn = document.getElementById("stopBtn");

if (drawingBtn) {
    drawingBtn.addEventListener("click", () => {
        stopper = 0;
        ctx.globalCompositeOperation = "source-over";
        ctx.strokeStyle = lineColorPicker.value;
    });
}

if (stopBtn) {
    stopBtn.addEventListener("click", () => {
        stopper = 1;
    });
}

const colorPickerPreview = document.getElementById("colorPickerPreview");
const lineColorPicker = document.getElementById("lineColorPicker");

colorPickerPreview.addEventListener("click", () => {
    lineColorPicker.click();
});

lineColorPicker.addEventListener("input", (event) => {
    const color = event.target.value;
    ctx.strokeStyle = color;
});


function eraseCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}
const eraserBtn = document.getElementById("eraserBtn");

if (eraserBtn) {
    eraserBtn.addEventListener("click", () => {
        stopper = 0;
        ctx.globalCompositeOperation = "destination-out";
    });
}

