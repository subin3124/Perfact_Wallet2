
// 팝업 열기 함수
function showPopup(popupId) {
    var popup = document.getElementById(popupId);
    popup.style.display = "block";
}

// 팝업 닫기 함수
function closePopup(popupId) {
    var popup = document.getElementById(popupId);
    popup.style.display = "none";
}

// 로그인 입력 필드 초기화 함수
function clearLoginFields() {
    let a = document.getElementById("loginUsername").value;
    document.getElementById("userName").innerText = a;
    document.getElementById("loginButton").remove();
    document.getElementById("signupButton").remove();
}

// 회원가입 입력 필드 초기화 함수
function clearSignupFields() {
    document.getElementById("signupUsername").value = "";
    document.getElementById("signupPassword").value = "";
    document.getElementById("signupPassword_again").value = "";
}

function showLoginPopup() {
    showPopup('loginPopup');
    closePopup('signupPopup');
}

function showSignupPopup() {
    showPopup('signupPopup');
    closePopup('loginPopup');
}
