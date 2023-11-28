document.addEventListener("DOMContentLoaded", function () {
    buildCalendar();
});

let nowMonth = new Date();
let today = new Date();
today.setHours(0, 0, 0, 0);

function buildCalendar() {

    let firstDate = new Date(nowMonth.getFullYear(), nowMonth.getMonth(), 1);
    let lastDate = new Date(nowMonth.getFullYear(), nowMonth.getMonth() + 1, 0);

    let tbody_Calendar = document.querySelector(".Calendar > tbody");
    document.getElementById("calYear").innerText = nowMonth.getFullYear();
    document.getElementById("calMonth").innerText = leftPad(nowMonth.getMonth() + 1);

    while (tbody_Calendar.rows.length > 0) {
        tbody_Calendar.deleteRow(tbody_Calendar.rows.length - 1);
    }

    let nowRow = tbody_Calendar.insertRow();

    for (let j = 0; j < firstDate.getDay(); j++) {
        let nowColumn = nowRow.insertCell();
    }

    for (let nowDay = firstDate; nowDay <= lastDate; nowDay.setDate(nowDay.getDate() + 1)) {

        let nowColumn = nowRow.insertCell();

        let newDIV = document.createElement("p");
        newDIV.innerHTML = leftPad(nowDay.getDate());
        nowColumn.appendChild(newDIV);

        if (nowDay.getDay() == 6) {
            nowRow = tbody_Calendar.insertRow();
        }

        if (nowDay < today) {
            newDIV.className = "pastDay";
            newDIV.onclick = function () { choiceDate(this); }
        }
        else if (nowDay.getFullYear() == today.getFullYear() && nowDay.getMonth() == today.getMonth() && nowDay.getDate() == today.getDate()) { // 오늘인 경우           
            newDIV.className = "today";
            newDIV.onclick = function () { choiceDate(this); }
        }
        else {
            newDIV.className = "futureDay";
            newDIV.onclick = function () { choiceDate(this); }
        }
    }
}

// 날짜 선택
function choiceDate(newDIV) {
    if (document.getElementsByClassName("choiceDay")[0]) {
        document.getElementsByClassName("choiceDay")[0].classList.remove("choiceDay");
    }
    newDIV.classList.add("choiceDay");

    newDIV.addEventListener("dblclick", function () {
        const selectedDate = new Date(nowMonth.getFullYear(), nowMonth.getMonth(), parseInt(newDIV.textContent));
        const formattedDate = `${selectedDate.getFullYear()}-${leftPad(selectedDate.getMonth() + 1)}-${leftPad(selectedDate.getDate())}`;
        console.log(formattedDate); 
        window.location.href = "whiteboard.html";
    });
}

// 이전달 버튼 클릭
function prevCalendar() {
    nowMonth = new Date(nowMonth.getFullYear(), nowMonth.getMonth() - 1, nowMonth.getDate());
    buildCalendar();
}
// 다음달 버튼 클릭
function nextCalendar() {
    nowMonth = new Date(nowMonth.getFullYear(), nowMonth.getMonth() + 1, nowMonth.getDate());
    buildCalendar();
}

function leftPad(value) {
    if (value < 10) {
        value = "0" + value;
        return value;
    }
    return value;
}