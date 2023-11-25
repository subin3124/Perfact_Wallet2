const ReceiptItemRepository = require("./ReceiptItemRepository");
const receiptItemRepository = new ReceiptItemRepository();
function calculatePercentage(part, whole) {
    return (part / whole) * 100;
}
async function testCodeRedPen() {
    let data = [{ReceiptId:20231125}];
    let listReceipts = [];
    let listItems = [];
    let TotalCost = 0;
    let resData = new Map();
    let resObjroot = {};
    let resObj = resObjroot.Items = []
    for (let i in data) {
        listReceipts.push(data[i].ReceiptId);
    }
    for (let i in listReceipts) {
        for(let j in await receiptItemRepository.getItemsByReceiptID(listReceipts[i])) {
            let items = await receiptItemRepository.getItemsByReceiptID(listReceipts[i]);
            if (items[j].cost > 0) {
                listItems.push(items[j]);
                TotalCost += items[j].cost;
                resData.has(items[j].category) ? resData.set(items[j].category,resData.get(items[j].category)+items[j].cost) : resData.set(items[j].category,items[j].cost);
            }
        }
    }
    resData.forEach((value, key)=> {
        resObj.push({category : key, cost : value});
    });
    resObjroot.totalCost = TotalCost;
    console.log(JSON.stringify(resObjroot));
}
testCodeRedPen();