function RedPen1(dateMax, dateMin) {
    fetch(`https://inuesc.azurewebsites.net/Receipt/date?dateMax=${dateMax}&dateMin=${dateMin}`, {
        method: 'GET'
    }).then((response)=>{
        if(response.ok) {
            return response.json();
        }
    }).then((data) => {
        let array = [];
        
        for(let i in data) {
            array.push({ReceiptId:data[i].ReceiptID});
        }
        RedPen2(array);
    })
}
function RedPen2(ReceiptArray) {
    let PercentData = [];
    fetch('https://inuesc.azurewebsites.net/Receipt/RedPen', {
        'method' : 'post',
        headers:{
            'content-type' : 'application/json'
        },
        body : JSON.stringify(ReceiptArray) //오브젝트 타입 예시 [{ReceiptId : "23942382947"}, {ReceiptId : "34023498"}]
    }).then((res) => {return res.json()}).then((data) => {
    
        for(let i in data.Items) {
            PercentData.push({category : data.Items[i].category, percent : calculatePercentage(data.Items[i].cost, data.totalCost)});
    
        }
        console.log(PercentData);
        return PercentData;
    });
}
function calculatePercentage(part, whole) {
      return (part / whole) * 100;
}