const whiteboard = document.getElementById('whiteboard');
const addImageBtn = document.getElementById('addImageBtn');
const addTextButton = document.getElementById('addTextButton');
const fontSizeSelect = document.getElementById('fontSizeSelect');
const textColorPicker = document.getElementById('textColorPicker');

let selectedText = null;
let selectedImage = null;
let offsetX, offsetY, isDragging = false;
let cnt = 0;
let cntT = 0;
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
function loadReceipt() {
    let params = getUrlParams();
    let date = params.data;
    fetch(`https://inuesc.azurewebsites.net/Receipt/date?dateMax=${date}&dateMin=${date}`, {
        method: 'GET'
    }).then((response)=>{
        if(response.ok) {
            return response.json();
        }
    }).then((data) => {
        let array = [];

        for(let i in data) {
            array.push({ReceiptId: data[i].ReceiptID});
            console.log(data[i].ReceiptID);
            fetch(`https://inuesc.azurewebsites.net/Receipt/id/${data[i].ReceiptID}`, {
                method:'get',
            }).then((res) => { return res.json()}).then((resdata) => {
                console.log(resdata);
                addImage(resdata[0].imageSrc);
                let txt = `${resdata[0].StoreName} \n 금액 : ${resdata[0].TotalCost}원 \n 날짜 : ${resdata[0].date}`;
                addText(txt);
            });
        }
    });
}
loadReceipt();
function popupOpen() {
    let url = `./redPenPage.html?dateMin=${getUrlParams().data}&dateMax=${getUrlParams().data}`;
    let name = '소비분석결과';
    let specs = "width=500,height=400,top=200,left=100, toolbar=no,menubar=no,scrollbars=yes, resizable=yes";
    window.open(url,name,specs)
}
function popupOpenMonth() {
    let dat = new Date(getUrlParams().data);
    console.log(dat.getMonth());
    let dateMin = `${dat.getFullYear()}-${dat.getMonth()+1}-31`
    let dateMax = `${dat.getFullYear()}-${dat.getMonth()}-1`
    let url = `./redPenPage.html?dateMin=${dateMin}&dateMax=${dateMax}`;
    let name = '소비분석결과';
    let specs = "width=500,height=400,top=200,left=100, toolbar=no,menubar=no,scrollbars=yes, resizable=yes";
    window.open(url,name,specs)
}
function getUrlParams() {
    var params = {};
    window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(str, key, value) { params[key] = value; });
    return params;
}

function addImage(imageURL) {
    const imgElement = document.createElement('img');
    imgElement.src = imageURL;
    imgElement.style.position = 'absolute';
    imgElement.style.left = `${250+(200*(cnt%5))}px`;
    imgElement.style.top = '100px';
    imgElement.style.width = '200px';
    imgElement.style.height = 'auto;';
    imgElement.style.cursor = 'grab';
    cnt++;
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
    textElement.style.left = `${250+((cntT%5)*250)}px`;
    textElement.style.top = '150px';
    textElement.style.fontSize = fontSizeSelect.value + 'px';
    textElement.style.fontFamily = 'Font';
    textElement.style.color = textColorPicker.value;
    cntT++;
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
    if(!stopper){
    textElement.addEventListener('click', function () {
        if (selectedImage) {
            selectedImage.style.border = "none";
            selectedImage = null;
        }
        if (selectedText && selectedText !== textElement) {
            selectedText.style.border = "none";
        }
    });
    }

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
