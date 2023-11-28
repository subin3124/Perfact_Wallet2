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
canvas.height = 500;

ctx.strokeStyle = INITIAL_COLOR;
ctx.lineWidth = 2.5; /* 라인 굵기 */

let painting = false;

function stopPainting() {
    painting = false;
}

function startPainting() {
    painting = true;
}

function onMouseMove(event) {
    const x = event.offsetX;
    const y = event.offsetY;
    if (!painting) {
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
        startPainting();
    });
}

if (stopBtn) {
    stopBtn.addEventListener("click", () => {
        stopPainting();
    });
}
