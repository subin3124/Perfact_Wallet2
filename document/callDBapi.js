/**
 * @api               {post} /callDB 영수증 정보 등록
 *
 * @apiDescription   영수증 분석 정보를 db에 삽입합니다.
 *
 * @apiVersion        1.0.0
 * @apiName           영수증 등록
 * @apiGroup          영수증
 *
 *
 * @apiSampleRequest  /callDB
 *
 *
 * @apiExample {curl} Example usage:
 *     curl  --header "Content-Type: application/json"\
 *           --request POST \
 *           --data '[{"objectName" : "라멘", "qu" : 1, "price" : 8500, "date" : "2023-11-02"}]' \
 *           https://inuesc.azurewebsites.net/callDB
 *
 * @apiParamExample {ob} Request-Example:
 * {
 *  "objectName" : "라멘", "qu" : 1, "price" : 8500, "date" : "2023-11-02"
 * }
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *      {
 *        "result": true
 *      }
 */