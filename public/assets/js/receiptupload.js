// back
let ReceiptID = null;
function downloadExcel() {
    if(ReceiptID == null)
        alert("업로드 된 영수증이 없습니다.");
    else {
        fetch(`/excel/${ReceiptID}`, {
            method: "GET",
        }).then((res) => res.blob())
            .then((data) => {
                const blob = new Blob([data], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
                const url = window.URL.createObjectURL(blob);
                const anchor = document.createElement('a');
                anchor.href = url;
                anchor.download = `테스트.xlsx`;
                anchor.click();
                window.URL.revokeObjectURL(url);
            });
    }
}
function onUpload() {
    let imgdo = document.getElementById('imageRes');
    console.log("test1");
    let formdata = new FormData();
    formdata.append('image',document.getElementById('image').files[0])
    fetch('/image', {
        method : "post",
        body : formdata
    }).then((r) => {
        if(!r.ok)
            alert("오류가 발생했습니다.\n response code : "+r.status)
        return r.json();})
        .then((res) => {
            imgdo.setAttribute('src', res.imageUrl);
            ReceiptID = res.ReceiptID;
            console.log(res);
        })
}


//
function load() {
fetch(`/Receipt/date/${document.getElementById('date').value}`, {
    method : "get"
}).then((r) => {
    if(!r.ok)
        alert("오류가 발생했습니다.\n response code : "+r.status)
    return r.json();})
    .then((res) => {
        for(let idx in res) {
            let padivobj = document.getElementById('main');
            let divobj = document.createElement('div');
            let imgobj = document.createElement('img');
            imgobj.setAttribute('src',res[idx].imageSrc);
            divobj.setAttribute('draggable','true');
            divobj.setAttribute('ondrop','event()');
            divobj.setAttribute('id',res[idx].ReceiptID);
            divobj.appendChild(imgobj);
            padivobj.appendChild(divobj);
        }
    })
}
function ReciptSaveOnDrop(event) {
    console.log(event.target.id);
    fetch(`/Receipt/id/${event.target.id}`, {
        method : "get"
    }).then((r) => {
        if(!r.ok)
            alert("오류가 발생했습니다.\n response code : "+r.status);
        return r.json();
    }).then((res) => {
    console.log(res[0].StoreName);
    });
}