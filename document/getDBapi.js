/**
 * @api {get} /getDB 영수증 목록 가져오기
 *
 * @apiVersion        1.0.0
 * @apiName 영수증 가져오기
 * @apiGroup 영수증
 *
 *
 @apiSuccessExample Success-Response:
  HTTP/1.1 200 OK
  [
    {
        "ReceiptID": "2023105187131",
        "TotalCost": 2637,
        "StoreName": "인센트버거 BURGER)",
        "date": "2002"
    }
  ]
 */