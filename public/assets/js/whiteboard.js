const whiteboard = document.getElementById('whiteboard');
const addImageBtn = document.getElementById('addImageBtn');
const addTextButton = document.getElementById('addTextButton');
const fontSizeSelect = document.getElementById('fontSizeSelect');
const textColorPicker = document.getElementById('textColorPicker');

let selectedText = null;
let selectedImage = null;
let offsetX, offsetY, isDragging = false;

// 이미지 추가
addImageBtn.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.style.display = 'none';

    input.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageURL = URL.createObjectURL(file);
            addImage(imageURL);
        }
    });

    whiteboard.appendChild(input);
    input.click();
});

function addImage(imageURL) {
    const imgElement = document.createElement('img');
    imgElement.src = imageURL;
    imgElement.style.position = 'absolute';
    imgElement.style.left = '100px';
    imgElement.style.top = '100px';
    imgElement.style.width = '200px';
    imgElement.style.height = '150px';
    imgElement.style.cursor = 'grab';

    imgElement.addEventListener('mousedown', function (event) {
        selectedImage = imgElement;
        const startX = event.clientX;
        const startY = event.clientY;
        const startLeft = parseFloat(imgElement.style.left);
        const startTop = parseFloat(imgElement.style.top);
        document.onmousemove = function (event) {
            const diffX = event.clientX - startX;
            const diffY = event.clientY - startY;
            imgElement.style.left = startLeft + diffX + 'px';
            imgElement.style.top = startTop + diffY + 'px';
        };
        document.onmouseup = function () {
            document.onmousemove = null;
            document.onmouseup = null;
        };
    });

    imgElement.addEventListener('click', function () {
        if (selectedImage) {
            selectedImage.style.border = "none";
        }
        if (selectedText) {
            selectedText.style.border = "none";
        }
        selectedImage = imgElement;
        selectedText = null;

        imgElement.style.border = "2px dotted black";
    });
    imgElement.setAttribute('data-type', 'image');

    whiteboard.appendChild(imgElement);
}

// 이미지 크기 조절
let isCtrlPressed = false;

document.addEventListener('keydown', function (event) {
    if (event.key === 'Control') {
        isCtrlPressed = true;
    }
});

document.addEventListener('keyup', function (event) {
    if (event.key === 'Control') {
        isCtrlPressed = false;
    }
});

document.addEventListener('keydown', function (event) {
    if (selectedImage) {
        const step = isCtrlPressed ? 10 : 1;

        if (event.key === 'ArrowUp') {
            const currentWidth = parseInt(selectedImage.style.width, 10);
            const currentHeight = parseInt(selectedImage.style.height, 10);

            const newWidth = currentWidth + step;
            const newHeight = (currentHeight / currentWidth) * newWidth;

            selectedImage.style.width = newWidth + 'px';
            selectedImage.style.height = newHeight + 'px';
        } else if (event.key === 'ArrowDown') {
            const currentWidth = parseInt(selectedImage.style.width, 10);
            const currentHeight = parseInt(selectedImage.style.height, 10);

            if (currentWidth > step) {
                const newWidth = currentWidth - step;
                const newHeight = (currentHeight / currentWidth) * newWidth;

                selectedImage.style.width = newWidth + 'px';
                selectedImage.style.height = newHeight + 'px';
            }
        }
    }
});

// 텍스트 추가
addTextButton.addEventListener('click', function () {
    addText("텍스트");
});
function addText(text) {
    const textElement = document.createElement('div');
    textElement.innerText = text;
    textElement.contentEditable = true;
    textElement.style.position = 'absolute';
    textElement.style.left = '500px';
    textElement.style.top = '150px';
    textElement.style.fontSize = fontSizeSelect.value + 'px';
    textElement.style.fontFamily = 'Font';
    textElement.style.color = textColorPicker.value;

    textElement.addEventListener('mousedown', function (event) {
        selectedText = textElement;
        const startX = event.clientX;
        const startY = event.clientY;
        const startLeft = parseFloat(textElement.style.left);
        const startTop = parseFloat(textElement.style.top);
        document.onmousemove = function (event) {
            const diffX = event.clientX - startX;
            const diffY = event.clientY - startY;
            textElement.style.left = startLeft + diffX + 'px';
            textElement.style.top = startTop + diffY + 'px';
        };
        document.onmouseup = function () {
            document.onmousemove = null;
            document.onmouseup = null;
        };
    });

    textElement.addEventListener('click', function () {
        if (selectedImage) {
            selectedImage.style.border = "none";
            selectedImage = null;
        }
        if (selectedText && selectedText !== textElement) {
            selectedText.style.border = "none";
        }
    });

    textElement.setAttribute('data-type', 'text');

    whiteboard.appendChild(textElement);
}

// 텍스트 폰트 사이즈
fontSizeSelect.addEventListener('change', function () {
    if (selectedText) {
        selectedText.style.fontSize = fontSizeSelect.value + 'px';
    }
});

// 텍스트 색깔
textColorPicker.addEventListener('change', function () {
    if (selectedText) {
        selectedText.style.color = textColorPicker.value;
    }
});


// 이미지 및 텍스트 삭제
document.addEventListener('keydown', function (event) {
    if (event.key === 'Delete') {
        if (selectedImage && selectedImage.getAttribute('data-type') === 'image') {
            whiteboard.removeChild(selectedImage);
            selectedImage = null;
        }
        if (selectedText && selectedText.getAttribute('data-type') === 'text') {
            whiteboard.removeChild(selectedText);
            selectedText = null;
        }
    }
});

document.addEventListener('click', function (event) {
    if (event.target !== selectedImage && event.target !== selectedText) {
        if (selectedImage) {
            selectedImage.style.border = "none";
            selectedImage = null;
        }
    }
});
