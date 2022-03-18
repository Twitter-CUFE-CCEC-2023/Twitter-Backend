/**
 * @apiDefine RequiresAuth Authentication is required
 **/

/**
 * @api {post} /auth/login Login user
 * @apiVersion 0.1.0
 * @apiName LoginUser
 * @apiGroup Authentication
 * @apiDescription Generates authentication token for the user to login into the website. User can login usiing (email or username) and password
 * @apiSampleRequest off
 * @apiParam {String} email_or_username Email or Username of the user
 * @apiParam {String} password Password of the user
 * @apiParam {Boolean} [remember_me=false] Remember the logged in user
 * @apiParamExample {json} Request-Example: 
 * {
 *      "email_or_username": "amrzaki2000.az@gmail.com",
 *      "password": "myPassw@ord123",
 * }
 * @apiSuccess {String} access_token JWT generated access token for the user
 * @apiSuccess {DateTime} token_expiration_date The date and time of token expiration
 * @apiSuccess {String} message Success message
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *      "access_token": "AAAA%2FAAA%3DAAAAAAAAxxxxxx",
 *      "token_expiration_date": "2020-01-01T00:00:00.000Z",
 *      "message": "User logged in successfully"
 * }
 * @apiError (400) {String} BadRequest  The server cannot or will not process the request due to something that is perceived to be a client error
 * @apiError (500) {String} InternalServerError  The server encountered an unexpected condition which prevented it from fulfilling the request
 * @apiError (401) {String} UserNotFound  The enetered credentials are invalid
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 401 UserNotFound
 * {
 *       message: "Invalid user credentials"و
 * }
**/

/**
 * @api {post} status/favourite/like Like a tweet
 * @apiVersion 0.1.0
 * @apiName LikeTweet
 * @apiGroup Likes
 * @apiDescription Adds the tweet to the user liked tweets
 * @apiSampleRequest off
 * @apiPermission RequiresAuth
 * @apiParam {int} id The id of the liked tweet
 * @apiParam {Boolean} [notify=true] send notification to the user of the liked tweet
 * @apiParamExample {json} Request-Example: 
 * {
 *      "id": 1001,
 *      "notify": true
 * }
 * @apiSuccess {String} tweet tweet object carrying liked tweet information
 * @apiSuccess {String} message Success message
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *      "tweet": {tweet-object},
 *      "message": "tweet has been liked successfully"
 * }
 * @apiError (400) {String} BadRequest  The server cannot or will not process the request due to something that is perceived to be a client error
 * @apiError (500) {String} InternalServerError  The server encountered an unexpected condition which prevented it from fulfilling the request
 * @apiError (401) {String} Unauthorized  User is not authenticated
 * @apiError (404) {String} NotFound  Invalid tweet Id
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 404 NotFound
 * {
 *       message: "Invalid tweet Id"
 * }
**/

/**
 * @api {post} status/favourite/unlike Unlike a tweet
 * @apiVersion 0.1.0
 * @apiName UnlikeTweet
 * @apiGroup Likes
 * @apiDescription Removes the tweet from liked tweets
 * @apiSampleRequest off
 * @apiPermission RequiresAuth
 * @apiParam {int} id The id of the unliked tweet
 * @apiParam {Boolean} [notify=false] send notification to the user of the unliked tweet
 * @apiParamExample {json} Request-Example:
 * {
 *      "id": 1001,
 *      "notify": false
 * }
 * @apiSuccess {String} tweet tweet object carrying unliked tweet information
 * @apiSuccess {String} message Success message
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *      "tweet": {tweet-object},
 *      "message": "tweet has been unliked successfully"
 * }
 * @apiError (400) {String} BadRequest  The server cannot or will not process the request due to something that is perceived to be a client error
 * @apiError (500) {String} InternalServerError  The server encountered an unexpected condition which prevented it from fulfilling the request
 * @apiError (401) {String} Unauthorized  User is not authenticated
 * @apiError (404) {String} NotFound  Invalid tweet Id
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 404 NotFound
 * {
 *       message: "Invalid tweet Id"
 * }
**/