/**
 * @api               {post} /image 영수증 정보 등록
 *
 * @apiDescription   이미지를 분석하여 db에 삽입합니다.
 *
 * @apiVersion        1.0.0
 * @apiName           영수증 등록
 * @apiGroup          영수증
 *
 *
 * @apiSampleRequest  /image
 *
 *
 * @apiExample {curl} Example usage:
 *     curl  --header "Content-Type: multipart/formdata"\
 *           --request POST
 *           https://inuesc.azurewebsites.net/callDB
 *
 * @apiParamExample {ob} Request-Example:
 * name : image, data-type: image
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *      {
 *        ReceiptID:"20231106",
 *        imageUrl:"https://inuesc.azurewebsites.net/image~~~"
 *      }
 */