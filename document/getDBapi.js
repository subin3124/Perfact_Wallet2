/**
 * @api {get} /getDB 영수증 정보 가져오기
 *
 * @apiVersion        1.0.0
 * @apiName 영수증 가져오기
 * @apiGroup 영수증
 *
 *
 @apiSuccessExample Success-Response:
  HTTP/1.1 200 OK
  {
    [
        {
            "rid": 1,
            "item": "농후토리소바",
            "qu": 1,
            "cost": 9000,
            "userID": null,
            "date": "2023-10-26"
        },
        {
            "rid": 2,
            "item": "면익힘 보통",
            "qu": 1,
            "cost": 0,
            "userID": null,
            "date": "2023-10-26"
        },
        {
            "rid": 3,
            "item": "이누센트 버거",
            "qu": 1,
            "cost": 2900,
            "userID": null,
            "date": "2023-10-11"
        }
    ]
  }
 */