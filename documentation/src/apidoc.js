
//#region Permissions
/**
 * @apiDefine Default Authentication is required
 **/

/**
 * @apiDefine Admin Admin access is required
 **/

//#endregion Permissions

//#region Authentication

/**
 * @api {post} /auth/signup Sign up
 * @apiVersion 0.1.0
 * @apiName SignUp
 * @apiGroup Authentication
 * @apiDescription Creates an account for the user, user can sign-up using his email or creating a username and creating a password.
 * A verification email is sent if the user is successfully created. Returns the user object in case it is created but not verified.
 * @apiSampleRequest off
 * @apiParam {String} email Email of the user
 * @apiParam {String} username Username of the user
 * @apiParam {String} password password of the user
 * @apiParam {String{1-50}} name The name of the user
 * @apiParam {String} gender gender of the user
 * @apiParam {DateTime} birth_date birth date of the user
 * @apiParam {String} [phone_number] phone number of the user
 * @apiParam {String} [profile_picture] Url of the uploaded profile picture
 * @apiParamExample {json} Request-Example:
 * {
 *      "email": "amrzaki2000.az@gmail.com",
 *      "username": "amrZaki123"
 *      "password": "myPassw@ord123",
 *      "name": "Amr Zaki",
 *      "gender": "male",
 *      "birth_date": "2000-01-01T00:00:00.000Z",
 *      "phone_number": "0105267436",
 *      "profile_picture" : "162178"
 * }
 * @apiSuccess {user-object} user user of the sign up operation
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *      "user" : {user-object},
 * }
 * @apiError (400) {String} BadRequest  The server cannot or will not process the request due to something that is perceived to be a client error
 * @apiError (409) {String} Conflict  Indicates that the request could not be processed because of conflict in the current state of the resource
 * @apiError (500) {String} InternalServerError  The server encountered an unexpected condition which prevented it from fulfilling the request
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 409 Conflict
 * {
 *       message: "Email or username already exists"
 * }
 **/

/**
 * @api {post} /auth/login Login
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
 *      "password": "myPassw@ord123"
 * }
 * @apiSuccess {String} access_token JWT generated access token for the user
 * @apiSuccess {user-object} user user of the sign up operation
 * @apiSuccess {DateTime} token_expiration_date The date and time of token expiration
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *      "access_token": "AAAA%2FAAA%3DAAAAAAAAxxxxxx",
 *      "user" : {user-object},
 *      "token_expiration_date": "2020-01-01T00:00:00.000Z",
 *      "message": "User logged in successfully"
 * }
 * @apiError (400) {String} BadRequest  The server cannot or will not process the request due to something that is perceived to be a client error
 * @apiError (500) {String} InternalServerError  The server encountered an unexpected condition which prevented it from fulfilling the request
 * @apiError (401) {String} NotFound  The enetered credentials are invalid
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 401 NotFound
 * {
 *       message: "Invalid user credentials"
 * }
 **/

/**
 * @api {put} /auth/verify-credentials Verify user
 * @apiVersion 0.1.0
 * @apiName VerifyEmail
 * @apiGroup Authentication
 * @apiDescription Verifies newly created user.
 * @apiSampleRequest off
 * @apiParam {int} id Id of the user to be verified
 * @apiParam {int} verification_code Verification code that is sent by email
 * @apiParamExample {json} Request-Example:
 * {
 *      "id": 32543216216,
 *      "verification_code: "123456",
 * }
 * @apiSuccess {Object} user user object carrying user information
 * @apiSuccess {String} message Success message
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *      "user": {user-object},
 *      "message": "User Email has been verified successfully"
 * }
 * @apiError (400) {String} BadRequest  The server cannot or will not process the request due to something that is perceived to be a client error
 * @apiError (500) {String} InternalServerError  The server encountered an unexpected condition which prevented it from fulfilling the request
 * @apiError (401) {String} Unauthorized  Invalid verification code
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 401 Unauthorized
 * {
 *       message: "Invalid or expired verification code"
 * }
 **/

/**
 * @api {post} /auth/send-reset-password Reset password email
 * @apiVersion 0.1.0
 * @apiName SendResetPassword
 * @apiGroup Authentication
 * @apiDescription Sends an email with reset password code to the user.
 * @apiSampleRequest off
 * @apiParam {String} email_or_username The email or the username of the user that needs to reset his/her password
 * @apiParamExample {json} Request-Example:
 * {
 *      "email_or_username": "amrzaki2000.az@gmail.com"
 * }
 * @apiSuccess {String} message Success message
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *      "message": "Reset password email has been sent successfully"
 * }
 * @apiError (400) {String} BadRequest  The server cannot or will not process the request due to something that is perceived to be a client error
 * @apiError (500) {String} InternalServerError  The server encountered an unexpected condition which prevented it from fulfilling the request
 * @apiError (401) {String} Unauthorized  Invalid verification code
 * @apiError (404) {String} NotFound  User email and username are not found
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 404 NotFound
 * {
 *       message: "Invalid email or username"
 * }
 **/

/**
 * @api {put} /auth/reset-password Reset password
 * @apiVersion 0.1.0
 * @apiName ResetPassword
 * @apiGroup Authentication
 * @apiDescription Reset password request with the code sent to the user email.
 * @apiSampleRequest off
* @apiParam {String} email_or_username Email or username of the user to reset the password
* @apiParam {int} verification_code Verification code that is sent by email
* @apiParam {String} password New password of the user
* @apiParamExample {json} Request-Example:
 * {
 *      "email_or_username": "amrzaki2000.az@gmail.com",
 *      "verification_code: "123456",
 *      "password": "myPassw@ord123"
 * }
 * @apiSuccess {String} message Success message
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *      "message": "Password has been reset successfully"
 * }
 * @apiError (400) {String} BadRequest  The server cannot or will not process the request due to something that is perceived to be a client error
 * @apiError (500) {String} InternalServerError  The server encountered an unexpected condition which prevented it from fulfilling the request
 * @apiError (401) {String} Unauthorized  Invalid verification code
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 401 Unauthorized
 * {
 *       message: "Invalid or expired verification code"
 * }
 **/

/**
 * @api {put} /auth/update-password Update password
 * @apiVersion 0.1.0
 * @apiName UpdatePassword
 * @apiGroup Authentication
 * @apiDescription Updates authenticated user's password.
 * @apiSampleRequest off
 * @apiParam {String} token Authentication token for the user. It is sent in the header of the request
 * @apiParam {String} old_password The old password of the user
 * @apiParam {String} new_password The new password of the user
 * @apiParamExample {json} Request-Example:
 * {
 *      "old_password": "myPassw@ord123",
 *      "new_password": "myNewPassw@rd"
 * }
 * @apiSuccess {String} message Success message
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *      "message": "Password has been updated successfully"
 * }
 * @apiError (400) {String} BadRequest  The server cannot or will not process the request due to something that is perceived to be a client error
 * @apiError (500) {String} InternalServerError  The server encountered an unexpected condition which prevented it from fulfilling the request
 * @apiError (401) {String} Unauthorized  Invalid verification code
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400 BadRequest
 * {
 *       message: "Could not update user password due to server problem"
 * }
 **/

//#endregion Authentication

//#region Admin Dashboard

/**
 * @api {get} /dashboard/users Get users
 * @apiVersion 0.1.0
 * @apiName GetUsers
 * @apiGroup Admin Dashboard
 * @apiDescription Get users by specifying some data on a filter, example: the location or a gender, a count for the number of users data recived can also be specified
 * @apiSampleRequest off
 * @apiPermission Admin
 * @apiParam {String} access_token JWT generated access token for the user. It is sent in header 
 * @apiParam {String} [location_filter=all] Get users from specific location
 * @apiParam {String} [gender=all] Get users of specific gender
 * @apiParam {int{1-200}} [count=20] Specifies the number of retrieved users
 * @apiParamExample {json} Request-Example:
 * {
 *      "location_filter": "Egypt",
 *      "gender_filter": "male",
 * }
 * @apiSuccess {list} users_list list of retrived users
 * @apiSuccess {String} message Success message
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *      "message": "Users have been retrived successfully",
 *      "users_list": []
 * }
 * @apiError (400) {String} BadRequest  The server cannot or will not process the request due to something that is perceived to be a client error
 * @apiError (500) {String} InternalServerError  The server encountered an unexpected condition which prevented it from fulfilling the request
 * @apiError (401) {String} Unauthorized  User is not authenticated
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400 BadRequest
 * {
 *       message: "Could not retrieve data"
 * }
 **/

/**
 * @api {get} /dashbaord/average-tweets Average number of tweets per day
 * @apiVersion 0.1.0
 * @apiName Average number of tweets per day
 * @apiGroup Admin Dashboard
 * @apiDescription Gets the average number of tweets per day in the specified date interval
 * @apiSampleRequest off
 * @apiPermission Admin
 * @apiParam {String} access_token JWT generated access token for the user. It is sent in header
 * @apiParam {DateTime} [start_date] if not specified, the start date is 7 days before end_date
 * @apiParam {DateTime} [end_date] if not specified, the end date is today
 * @apiParamExample {json} Request-Example:
 * {
 *      "start_date": "2020-01-01T00:00:00.000Z",
 *      "end_date": "2020-01-09T00:00:00.000Z"
 * }
 * @apiSuccess {Number} tweets_per_day Average number of tweets per day in the specified period
 * @apiSuccess {String} message Success message
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *      "tweets_per_day": 204252.562, ,
 *      "message": "Data has been retrived successfully",
 * }
 * @apiError (400) {String} BadRequest  The server cannot or will not process the request due to something that is perceived to be a client error
 * @apiError (500) {String} InternalServerError  The server encountered an unexpected condition which prevented it from fulfilling the request
 * @apiError (401) {String} Unauthorized  User is not authenticated
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400 BadRequest
 * {
 *       message: "Could not retrieve data"
 * }
 **/

/**
 * @api {get} /dashbaord/average-likes Average number of likes per day
 * @apiVersion 0.1.0
 * @apiName Average number of likes per day
 * @apiGroup Admin Dashboard
 * @apiDescription Gets the average number of likes per day in the specified date interval
 * @apiSampleRequest off
 * @apiPermission Admin
 * @apiParam {String} access_token JWT generated access token for the user. It is sent in header
 * @apiParam {DateTime} [start_date] if not specified, the start date is 7 days before end_date
 * @apiParam {DateTime} [end_date] if not specified, the end date is today
 * @apiParamExample {json} Request-Example:
 * {
 *      "start_date": "2020-01-01T00:00:00.000Z",
 *      "end_date": "2020-01-09T00:00:00.000Z"
 * }
 * @apiSuccess {Number} likes_per_day Average number of likes per day in the specified period
 * @apiSuccess {String} message Success message
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *      "likes_per_day": 204252.562, ,
 *      "message": "Data has been retrived successfully",
 * }
 * @apiError (400) {String} BadRequest  The server cannot or will not process the request due to something that is perceived to be a client error
 * @apiError (500) {String} InternalServerError  The server encountered an unexpected condition which prevented it from fulfilling the request
 * @apiError (401) {String} Unauthorized  User is not authenticated
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400 BadRequest
 * {
 *       message: "Could not retrieve data"
 * }
 **/

/**
 * @api {get} /dashbaord/average-retweets Average number of retweets per day
 * @apiVersion 0.1.0
 * @apiName Average number of retweets per day
 * @apiGroup Admin Dashboard
 * @apiDescription Gets the average number of retweets per day in the specified date interval
 * @apiSampleRequest off
 * @apiPermission Admin
 * @apiParam {String} access_token JWT generated access token for the user. It is sent in header
 * @apiParam {DateTime} [start_date] if not specified, the start date is 7 days before end_date
 * @apiParam {DateTime} [end_date] if not specified, the end date is today
 * @apiParamExample {json} Request-Example:
 * {
 *      "start_date": "2020-01-01T00:00:00.000Z",
 *      "end_date": "2020-01-09T00:00:00.000Z"
 * }
 * @apiSuccess {Number} retweets_per_day Average number of retweets per day in the specified period
 * @apiSuccess {String} message Success message
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *      "retweets_per_day": 204252.562, ,
 *      "message": "Data has been retrived successfully",
 * }
 * @apiError (400) {String} BadRequest  The server cannot or will not process the request due to something that is perceived to be a client error
 * @apiError (500) {String} InternalServerError  The server encountered an unexpected condition which prevented it from fulfilling the request
 * @apiError (401) {String} Unauthorized  User is not authenticated
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400 BadRequest
 * {
 *       message: "Could not retrieve data"
 * }
 **/

/**
 * @api {get} /dashboard/tweets Number of tweets
 * @apiVersion 0.1.0
 * @apiName get number of tweets
 * @apiGroup Admin Dashboard
 * @apiDescription Get the number of tweets in a specific period of time
 * @apiSampleRequest off
 * @apiPermission Admin
 * @apiParam {String} access_token JWT generated access token for the user. It is sent in header
 * @apiParam {DateTime} [start-date] date of starting to count the tweets, if not specified start counting from the past 7 days
 * @apiParam {DateTime} [end_date] date of ending of counting the tweets, if not specified count untill today
 * @apiParamExample {json} Request-Example:
 * {
 *      "start-date": "2000-01-01T00:00:00.000Z",,
 *      "end_date": "2020-01-01T00:00:00.000Z",
 * }
 * @apiSuccess {int} [count] count of tweets in that period
 * @apiSuccess {String} message Success message
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *      "message": "Tweets counted successfully",
 *      "count": 8641513
 * }
 * @apiError (400) {String} BadRequest  The server cannot or will not process the request due to something that is perceived to be a client error
 * @apiError (500) {String} InternalServerError  The server encountered an unexpected condition which prevented it from fulfilling the request
 * @apiError (401) {String} Unauthorized  User is not authenticated
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400 BadRequest
 * {
 *       message: "Could not retrieve data"
 * }
 **/

/**
 * @api {get} /dashboard/likes Get number of likes
 * @apiVersion 0.1.0
 * @apiName get number of likes
 * @apiGroup Admin Dashboard
 * @apiDescription Get the number of likes in a specific period of time
 * @apiSampleRequest off
 * @apiPermission Admin
 * @apiParam {String} access_token JWT generated access token for the user. It is sent in header 
 * @apiParam {DateTime} [start-date] date of starting to count the likes, if not specified start counting from the past 7 days
 * @apiParam {DateTime} [end_date] date of ending of counting the likes, if not specified count untill today
 * @apiParamExample {json} Request-Example:
 * {
 *      "start-date": "2000-01-01T00:00:00.000Z",,
 *      "end_date": "2020-01-01T00:00:00.000Z",
 * }
 * @apiSuccess {int} count count of likes in that period
 * @apiSuccess {String} message Success message
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *      "message": "Likes counted successfully",
 *      "count": 12565885465
 * }
 * @apiError (400) {String} BadRequest  The server cannot or will not process the request due to something that is perceived to be a client error
 * @apiError (500) {String} InternalServerError  The server encountered an unexpected condition which prevented it from fulfilling the request
 * @apiError (401) {String} Unauthorized  User is not authenticated
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400 BadRequest
 * {
 *       message: "Could not retrieve data"
 * }
 **/

/**
 * @api {get} /dashboard/retweets Get number of retweets
 * @apiVersion 0.1.0
 * @apiName get number of retweets
 * @apiGroup Admin Dashboard
 * @apiDescription Get the number of retweets in a specific period of time
 * @apiSampleRequest off
 * @apiPermission Admin
 * @apiParam {String} access_token JWT generated access token for the user. It is sent in header 
 * @apiParam {DateTime} [start-date] date of starting to count the retweets, if not specified start counting from the past 7 days
 * @apiParam {DateTime} [end_date] date of ending of counting the retweets, if not specified count untill today
 * @apiParamExample {json} Request-Example:
 * {
 *      "start-date": "2000-01-01T00:00:00.000Z",,
 *      "end_date": "2020-01-01T00:00:00.000Z",
 * }
 * @apiSuccess {String} message Success message
 * @apiSuccess {int} count count of retweets in that period
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *      "message": "Retweets counted successfully",
 *      "count": 3456656
 * }
 * @apiError (400) {String} BadRequest  The server cannot or will not process the request due to something that is perceived to be a client error
 * @apiError (500) {String} InternalServerError  The server encountered an unexpected condition which prevented it from fulfilling the request
 * @apiError (401) {String} Unauthorized  User is not authenticated
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400 BadRequest
 * {
 *       message: "Could not retrieve data"
 * }
 **/

/**
 * @api {get} /dashboard/tweets-per-region Get number of tweets per region
 * @apiVersion 0.1.0
 * @apiName get number of tweets per region
 * @apiGroup Admin Dashboard
 * @apiDescription Get the number of tweets per region in a specific period of time
 * @apiSampleRequest off
 * @apiPermission Admin
 * @apiParam {String} access_token JWT generated access token for the user. It is sent in header 
 * @apiParam {DateTime} [start-date] date of starting to count the tweets per region, if not specified start counting from the past 7 days
 * @apiParam {DateTime} [end_date] date of ending of counting the tweets per region, if not specified count untill today
 * @apiParam {String} location location of the searched region
 * @apiParamExample {json} Request-Example:
 * {
 *      "start-date": "2000-01-01T00:00:00.000Z",
 *      "end_date": "2020-01-01T00:00:00.000Z",
 *      "location": "Cairo"
 * }
 * @apiSuccess {int} count count of tweets per region in that period
 * @apiSuccess {String} message Success message
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *      "message": "tweets per region counted successfully",
 *      "count": 3456656
 * }
 * @apiError (400) {String} BadRequest  The server cannot or will not process the request due to something that is perceived to be a client error
 * @apiError (500) {String} InternalServerError  The server encountered an unexpected condition which prevented it from fulfilling the request
 * @apiError (401) {String} Unauthorized  User is not authenticated
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400 BadRequest
 * {
 *       message: "Could not retrieve data"
 * }
 **/

/**
 * @api {get} /dashboard/tweets-per-gender Number of tweets per gender
 * @apiVersion 0.1.0
 * @apiName get number of tweets per gender
 * @apiGroup Admin Dashboard
 * @apiDescription Get the number of tweets per gender in a specific period of time
 * @apiSampleRequest off
 * @apiPermission Admin
 * @apiParam {String} access_token JWT generated access token for the user. It is sent in header 
 * @apiParam {DateTime} [start-date] date of starting to count the tweets per gender, if not specified start counting from the past 7 days
 * @apiParam {DateTime} [end_date] date of ending of counting the tweets per gender, if not specified count untill today
 * @apiParam {String} gender gender of the users to get the the number of tweets of.
 * @apiParamExample {json} Request-Example:
 * {
 *      "start-date": "2000-01-01T00:00:00.000Z",
 *      "end_date": "2020-01-01T00:00:00.000Z",
 *      "gender": "male"
 * }
 * @apiSuccess {int} count count of tweets per gender in that period
 * @apiSuccess {String} message Success message
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *      "message": "tweets per gender counted successfully",
 *      "count": 3456656
 * }
 * @apiError (400) {String} BadRequest  The server cannot or will not process the request due to something that is perceived to be a client error
 * @apiError (500) {String} InternalServerError  The server encountered an unexpected condition which prevented it from fulfilling the request
 * @apiError (401) {String} Unauthorized  User is not authenticated
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400 BadRequest
 * {
 *       message: "Could not retrieve data"
 * }
 **/
//#endregion Admin Dashboard

//#region Account Suspension

/**
 * @api {put} /dashboard/ban Ban User
 * @apiVersion 0.1.0
 * @apiName BanUser
 * @apiGroup Account Suspension
 * @apiDescription Ban the specified user from the services of twitter for a period of time
 * @apiSampleRequest off
 * @apiPermission Admin
 * @apiParam {String} access_token JWT generated access token for the user. It is sent in header
 * @apiParam {int} userid The ID of the potentially blocked user
 * @apiParam {String} reason reason of banning the specified user
 * @apiParam {DateTime} [end_date] date of ban ending
 * @apiParam {Boolean} [forever_banned=false] if true specifies that the user account will be banned forever, in that case the end_date is ignored
 * @apiParamExample {json} Request-Example:
 * {
 *      "userid": 20,
 *      "reason": "using offensive language",
 *      "end_date": "2020-01-01T00:00:00.000Z",
 *      "forever_banned": false
 * }
 * @apiSuccess {String} message Success message
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *      "message": "User Banned successfully"
 * }
 * @apiError (400) {String} BadRequest  The server cannot or will not process the request due to something that is perceived to be a client error
 * @apiError (500) {String} InternalServerError  The server encountered an unexpected condition which prevented it from fulfilling the request
 * @apiError (401) {String} Unauthorized  User is not authenticated
 * @apiError (404) {String} NotFound  Invalid user Id
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 404 NotFound
 * {
 *       message: "Invalid user Id"
 * }
 **/

/**
 * @api {put} /dashboard/unban Unban user
 * @apiVersion 0.1.0
 * @apiName Unban user
 * @apiGroup Account Suspension
 * @apiDescription Un-bans the user specified in the ID parameter for the authenticating user. the banned user will regain access to his account
 * @apiSampleRequest off 
 * @apiPermission Admin
 * @apiParam {String} access_token JWT generated access token for the user. It is sent in header
 * @apiParam {int} userid The ID of the  blocked user
 * @apiParamExample {json} Request-Example: 
 * {
 *      "userid": 20,
 * }
 * @apiSuccess {String} message Success message
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *      "message": "User Unblocked successfully"
 * }
 * @apiError (400) {String} BadRequest  The server cannot or will not process the request due to something that is perceived to be a client error
 * @apiError (500) {String} InternalServerError  The server encountered an unexpected condition which prevented it from fulfilling the request
 * @apiError (401) {String} Unauthorized  User is not authenticated
 * @apiError (404) {String} NotFound  Invalid user Id
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 404 NotFound
 * {
 *       message: "Invalid user Id"
 * }
**/

//#endregion Account Suspension

//#region Tweets

/**
 * @api {get} /status/replies/:id Get a specific tweet replies
 * @apiVersion 0.1.0
 * @apiName GetTweetReplies
 * @apiGroup Tweets
 * @apiDescription Retrives a list of a specific tweet replies
 * @apiSampleRequest off
 * @apiPermission Default
 * @apiParam {String} access_token JWT generated access token for the user. It is sent in header
 * @apiParam {ObjectId} id The id of the tweet that is being replied to 
 * @apiParamExample {json} Request-Example:
 * {
 *      "id": "624a490d7e14fbfa14e5b5b6",
 *      "notify": true
 * }
 * @apiSuccess {list} tweets list of tweets objects carrying replies to a specific tweet
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *      "tweets": [{tweet-object},{tweet-object}, ..],
 * }
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
 * @api {post} /status/like Like a tweet
 * @apiVersion 0.1.0
 * @apiName LikeTweet
 * @apiGroup Tweets
 * @apiDescription Adds the tweet to the user liked tweets
 * @apiSampleRequest off
 * @apiPermission Default
 * @apiParam {String} access_token JWT generated access token for the user. It is sent in header
 * @apiParam {ObjectId} id The id of the liked tweet
 * @apiParam {Boolean} [notify=true] send notification to the user of the liked tweet
 * @apiParamExample {json} Request-Example:
 * {
 *      "id": "624a490d7e14fbfa14e5b5b6",
 *      "notify": true
 * }
 * @apiSuccess {Object} tweet tweet object carrying liked tweet information
 * @apiSuccess {String} message Success message
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *      "tweet": {tweet-object},
 *      "message": "tweet has been liked successfully"
 * }
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
 * @api {delete} /status/unlike Unlike a tweet
 * @apiVersion 0.1.0
 * @apiName UnlikeTweet
 * @apiGroup Tweets
 * @apiDescription Removes the tweet from liked tweets
 * @apiSampleRequest off
 * @apiPermission Default
 * @apiParam {String} access_token JWT generated access token for the user. It is sent in header
 * @apiParam {ObjectId} id The id of the unliked tweet
 * @apiParam {Boolean} [notify=false] send notification to the user of the unliked tweet
 * @apiParamExample {json} Request-Example:
 * {
 *      "id": "624a490d7e14fbfa14e5b5b6",
 *      "notify": false
 * }
 * @apiSuccess {Object} tweet tweet object carrying unliked tweet information
 * @apiSuccess {String} message Success message
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *      "tweet": {tweet-object},
 *      "message": "tweet has been unliked successfully"
 * }
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
 * @api {get} /status/tweet/:id?include_replies=true Retrieve a tweet by id
 * @apiVersion 0.1.0
 * @apiName GetTweet
 * @apiGroup Tweets
 * @apiDescription Returns a single Tweet, specified by the id parameter. The Tweet's author will also be embedded within the Tweet.
 * @apiSampleRequest off
 * @apiPermission Default
 * @apiParam {String} access_token JWT generated access token for the user. It is sent in header
 * @apiParam {ObjectId} id id of the tweet
 * @apiParam {Boolean} [include_replies=false] Decides whether to include the tweet replies within the tweet or not.
 * @apiSuccess {object} tweet tweet object carrying the tweet information
 * @apiSuccess {object} user user object carrying the user, who posted the tweet, information
 * @apiSuccess {String} message Success message
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *      "tweet": {tweet-object},
 *      "user": {user-object},
 *      "message": "Tweet has been retrieved successfully"
 * }
 * @apiError (500) {String} InternalServerError  The server encountered an unexpected condition which prevented it from fulfilling the request
 * @apiError (401) {String} UnAuthorized  user is not authenticated
 * @apiError (404) {String} NotFound  Invalid tweet id
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 404 NotFound
 * {
 *       message: "Invalid tweet Id"
 * }
 **/

/**
 * @api {post} /status/tweet/post Post a tweet
 * @apiVersion 0.1.0
 * @apiName PostTweet
 * @apiGroup Tweets
 * @apiDescription Post a tweet with the input data of user's choice
 * @apiSampleRequest off
 * @apiPermission Default
 * @apiParam {String} access_token JWT generated access token for the user. It is sent in header
 * @apiParam {String{1-280}} content content of the tweet
 * @apiParam {Objectid} [replied_to_tweet] id that this tweet is replied on
 * @apiParam {list} [mentions] usernames of the mentioned people in the tweet
 * @apiParam {list} [media_urls] urls of media attached to the meassage
 * @apiParam {Boolean} [notify=true] notifies user's followers when a tweet is posted
 * @apiParamExample {json} Request-Example:
 * {
 *      content: "This is a sample text of a tweet"
 * }
 * @apiSuccess {object} tweet tweet object carrying the tweet information
 * @apiSuccess {String} message Success message
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *      "tweet": {tweet-object},
 *      "message": "Tweet posted successfully"
 * }
 * @apiError (500) {String} InternalServerError  The server encountered an unexpected condition which prevented it from fulfilling the request
 * @apiError (401) {String} Unauthorized  User is not authenticated
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 401 Unauthorized
 * {
 *       message: "User is not authenticated"
 * }
 **/

/**
 * @api {get} /status/retweeters/:id/:page/:count Get tweet retweeters
 * @apiVersion 0.1.0
 * @apiName GetTweetRetweeters
 * @apiGroup Tweets
 * @apiDescription Get list carrying the users who retweeted a specific tweet
 * @apiSampleRequest off
 * @apiPermission Default
 * @apiParam {String} access_token JWT generated access token for the user. It is sent in header
 * @apiParam {ObjectId} id The id of the tweet
 * @apiParam {int} page The page number of the list
 * @apiParam {int} [count=10] The number of users to be returned per page
 * @apiSuccess {list} retweeters list of user objects who retweeted the tweet
 * @apiSuccess {String} message Success message
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *      "retweeters": [{user-object},{user-object},{user-object}],
 *      "message": "Retweeters have been retrieved successfully"
 * }
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
 * @api {delete} /status/tweet/delete Delete a tweet
 * @apiVersion 0.1.0
 * @apiName DeleteTweet
 * @apiGroup Tweets
 * @apiDescription Delete a tweet that is posted by authenticated user
 * @apiSampleRequest off
 * @apiPermission Default
 * @apiParam {String} access_token JWT generated access token for the user. It is sent in header
 * @apiParam {ObjectId} id The id of deleted tweet
 * @apiParamExample {json} Request-Example:
 * {
 *      "id" : "624a490d7e14fbfa14e5b5b6"
 * }
 * @apiSuccess {Object} tweet Deleted tweet object
 * @apiSuccess {String} message Success message
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *      "tweet": {tweet-object},
 *      "message": Tweet has been deleted successfully
 * }
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
 * @api {get} /status/tweet/quote-tweets/:id/:page/:count Get tweet quote tweets
 * @apiVersion 0.1.0
 * @apiName GetQuoteTweets
 * @apiGroup Tweets
 * @apiDescription Get list of quote tweets of specified tweet
 * @apiSampleRequest off 
 * @apiPermission Default
 * @apiParam {String} access_token JWT generated access token for the user. It is sent in header
 * @apiParam {ObjectId} id The ID of the quoted tweet
 * @apiParam {int} page The page number of the list
 * @apiParam {int} [count=10] The number of tweets per page
 * @apiSuccess {list} quote_tweets List of quote tweets objects
 * @apiSuccess {String} message Success message
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *     "quote_tweets": [{tweet-object}, {tweet-object}, {tweet-object}, ....],
 *     "message": "Quote tweets have been retrieved successfully"
 * }
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
 * @api {post} /status/retweet Retweet a tweet
 * @apiVersion 0.1.0
 * @apiName Retweet a Tweet
 * @apiGroup Tweets
 * @apiDescription Retweets a tweet. Returns the original Tweet with Retweet details embedded.
 * @apiSampleRequest off
 * @apiPermission Default
 * @apiParam {String} access_token JWT generated access token for the user. It is sent in header
 * @apiParam {ObjectId} id The Id of the desired tweet.
 * @apiParam {String{1-280}} quote_comment Optional. A comment to be embedded with the tweet in case of quote tweet only.
 * @apiParamExample {json} Request-Example:
 * {
 *      "id": "624a490d7e14fbfa14e5b5b6"
 * }
 * @apiSuccess {Object} tweet tweet object carrying the retweeted tweet information
 * @apiSuccess {String} message Success message
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *      "tweet": {tweet-object},
 *      "message": "Tweet has been Retweeted successfully"
 * }
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
 * @api {delete} /status/unretweet Unretweet a tweet
 * @apiVersion 0.1.0
 * @apiName Unretweet
 * @apiGroup Tweets
 * @apiDescription Untweets a retweeted status. Returns the original Tweet with Retweet details embedded, The untweeted retweet status ID must be authored by the user backing the authentication token.
 * @apiSampleRequest off
 * @apiPermission Default
 * @apiParam {String} access_token JWT generated access token for the user. It is sent in header
 * @apiParam {ObjectId} id The id the retweeted tweet.
 * @apiParamExample {json} Request-Example:
 * {
 *      "id": "624a490d7e14fbfa14e5b5b6",
 * }
 * @apiSuccess {Object} tweet tweet object carrying original tweet information
 * @apiSuccess {String} message Success message
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *      "tweet": {tweet-object},
 *      "message": "tweet has been Unretweeted successfully"
 * }
 * @apiError (500) {String} InternalServerError  The server encountered an unexpected condition which prevented it from fulfilling the request
 * @apiError (401) {String} Unauthorized  User is not authenticated
 * @apiError (404) {String} NotFound  Invalid tweet Id
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 404 NotFound
 * {
 *       message: "Invalid tweet Id"
 * }
 **/

//#endregion Tweets

//#region Users

/**
 * @api {POST} /user/follow Follow user
 * @apiVersion 0.1.0
 * @apiName FollowUser
 * @apiGroup User
 * @apiDescription Add the user to the followers list
 * @apiSampleRequest off
 * @apiPermission Default
 * @apiParam {String} access_token JWT generated access token for the user. It is sent in header
 * @apiParam {ObjectId} id id of the user to be followed
 * @apiParam {Boolean} [notify=true] send notification to the following user
 * @apiParamExample {json} Request-Example:
 * {
 *      "id": "624a490d7e14fbfa14e5b5b6",
 *      "notify": true
 * }
 * @apiSuccess {object} user object carrying followed user
 * @apiSuccess {String} message Success message
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *      "followed_user": {user-object},
 *      "message": "User followed successfully"
 * }
 * @apiError (500) {String} InternalServerError  The server encountered an unexpected condition which prevented it from fulfilling the request
 * @apiError (401) {String} Unauthorized  User is not authenticated
 * @apiError (404) {String} NotFound Invalid user Id
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 404 NotFound
 * {
 *       message: "Invalid user Id"
 * }
 **/

/**
 * @api {delete} /user/unfollow Unfollow user
 * @apiVersion 0.1.0
 * @apiName UnFollowUser
 * @apiGroup User
 * @apiDescription Remove the user from the followers list
 * @apiSampleRequest off
 * @apiPermission Default
 * @apiParam {String} access_token JWT generated access token for the user. It is sent in header
 * @apiParam {ObjectId} id id of the user to be unfollowed
 * @apiParam {Boolean} [notify=false] send notification to the following user
 * @apiParamExample {json} Request-Example:
 * {
 *      "id": "624a490d7e14fbfa14e5b5b6",
 *      "notify": false
 * }
 * @apiSuccess {object} user object carrying unfollowed user information
 * @apiSuccess {String} message Success message
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *      "user": {user-object},
 *      "message": "User unfollowed successfully"
 * }
 * @apiError (500) {String} InternalServerError  The server encountered an unexpected condition which prevented it from fulfilling the request
 * @apiError (401) {String} Unauthorized  User is not authenticated
 * @apiError (404) {String} NotFound Invalid user Id
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 404 NotFound
 * {
 *       message: "Invalid user Id"
 * }
 **/

/**
 * @api {GET} /followers/list/:username/:page/:count Followers list
 * @apiVersion 0.1.0
 * @apiName FollowersList
 * @apiGroup User
 * @apiDescription Get list of specific user followers
 * @apiSampleRequest off
 * @apiPermission Default
 * @apiParam {String} access_token JWT generated access token for the user. It is sent in header
 * @apiParam {String} username The username of the user
 * @apiParam {int} page The page number
 * @apiParam {int} [count=10] count of followers to per page
 * @apiSuccess {list} followers list of followers users objects
 * @apiSuccess {String} message Success message
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *      "followers": [{user-object},{user-object}, ..],
 *      "message": "Followers list displayed successfully"
 * }
 * @apiError (500) {String} InternalServerError  The server encountered an unexpected condition which prevented it from fulfilling the request
 * @apiError (401) {String} Unauthorized  User is not authenticated
 * @apiError (404) {String} NotFound Invalid user Id
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 404 NotFound
 * {
 *       message: "User is not found"
 * }
 **/

/**
 * @api {GET} /following/list/:username/:page/:count Following list
 * @apiVersion 0.1.0
 * @apiName FollowingList
 * @apiGroup User
 * @apiDescription Get list of specified user followings
 * @apiSampleRequest off
 * @apiPermission Default
 * @apiParam {String} access_token JWT generated access token for the user. It is sent in header
 * @apiParam {String} username The username of the user
 * @apiParam {int} page The page number
 * @apiParam {int} [count=10] count of followings per page
* @apiSuccess {list} followings list of following user objects
 * @apiSuccess {String} message Success message
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *      "followings": [{user-object},{user-object}, ..],
 *      "message": "Following list displayed successfully"
 * }
 * @apiError (500) {String} InternalServerError  The server encountered an unexpected condition which prevented it from fulfilling the request
 * @apiError (401) {String} Unauthorized  User is not authenticated
 * @apiError (404) {String} NotFound Invalid user Id
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 404 NotFound
 * {
 *       message: "User is not found"
 * }
 **/

/**
 * @api {put} /user/update-profile Update user profile
 * @apiVersion 0.1.0
 * @apiName UpdateProfile
 * @apiGroup User
 * @apiDescription Updates authenticated user profile.
 * @apiSampleRequest off
 * @apiPermission Default
 * @apiParam {String} access_token JWT generated access token for the user. It is sent in header
 * @apiParam {String} name Full name associated with profile.
 * @apiParam {String} location The location of the user.
 * @apiParam {String} website The website of the user.
 * @apiParam {String} bio The user bio.
 * @apiParam {DateTime} birth_date The user birth date.
 * @apiParam {String{public-your_followers-people_you_follow-you_follow_each_other-only_you}} month_day_access Determines who has access to see user birth month and day.
 * @apiParam {String{public-your_followers-people_you_follow-you_follow_each_other-only_you}} year_access Determines who has access to see user birth year.
 * @apiParamExample {json} Request-Example:
 * {
 *      "name": "John Doe",
 *      "location": "New York",
 *      "website": "http://www.example.com",
 *      "bio": "I am a web developer",
 *      "birth_date": "1990-01-01",
 *      "month_day_access": "only_you",
 *      "year_access": "only_you"
 * }
 * @apiSuccess {Object} user user object carrying user after updating information
 * @apiSuccess {String} message Success message
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *      "user": {user-object},
 *      "message": "User profile has been update successfully"
 * }
 * @apiError (400) {String} BadRequest  The server cannot or will not process the request due to something that is perceived to be a client error
 * @apiError (500) {String} InternalServerError  The server encountered an unexpected condition which prevented it from fulfilling the request
 * @apiError (401) {String} Unauthorized  User is not authenticated
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 401 Unauthorized
 * {
 *       message: "User is not authenticated"
 * }
 **/

/**
 * @api {get} /status/tweets/list/:username/:page/:count?include_replies=true Get authenticated user tweets
 * @apiVersion 0.1.0
 * @apiName GetTweets
 * @apiGroup User
 * @apiDescription Retrieve user tweets, tweets may be including replies or not.
 * @apiSampleRequest off
 * @apiPermission Default
 * @apiParam {String} access_token JWT generated access token for the user. It is sent in header
 * @apiParam {String} username The username of the user
 * @apiParam {int} page The page number
 * @apiParam {int} [count=10] The count of tweets per page
 * @apiParam {Boolean} [include_replies=false] Determines if replies and their tweets should be included in the response.
 * @apiSuccess {list} tweets list carrying tweets objects
 * @apiSuccess {String} message Success message
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *      "tweets": [{tweet-object},{tweet-object}],
 *      "message": "User has been verified successfully"
 * }
 * @apiError (500) {String} InternalServerError  The server encountered an unexpected condition which prevented it from fulfilling the request
 * @apiError (401) {String} Unauthorized  Invalid verification code
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 401 Unauthorized
 * {
 *       message: "User is not authenticated"
 * }
 **/

/**
 * @api {GET} /notifications/list/:page/:count Notifications list
 * @apiVersion 0.1.0
 * @apiName NotificationsList
 * @apiGroup User
 * @apiDescription Get list of user notifications
 * @apiSampleRequest off 
 * @apiPermission Default
 * @apiParam {String} access_token JWT generated access token for the user. It is sent in header
 * @apiParam {int} page The page number
 * @apiParam {int} [count=10] count of notifications per page 
*  @apiSuccess {list} notifications list of objects carrying the notifications information 
 * @apiSuccess {String} message Success message
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *      "notifications": [{notification-object}, {notification-object}, ..],
 *      "message": "Notifications list displayed successfully"
 * }
 * @apiError (500) {String} InternalServerError  The server encountered an unexpected condition which prevented it from fulfilling the request
 * @apiError (401) {String} Unauthorized  User is not authenticated
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 401 Unauthorized
 * {
 *       message: "User is not authenticated"
 * }
 **/

/**
 * @api {GET} /info/:username Get specific user profile
 * @apiVersion 0.1.0
 * @apiName GetUserInformation
 * @apiGroup User
 * @apiDescription Get the information of specific user
 * @apiSampleRequest off 
 * @apiPermission Default
 * @apiParam {String} access_token JWT generated access token for the user. It is sent in header
 * @apiParam {String} username The username of the user
 * @apiSuccess {object} user object carrying user information 
 * @apiSuccess {String} message Success message
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *      "user": {user-object},
 *      "message": "User information has been retrieved successfully"
 * }
 * @apiError (500) {String} InternalServerError  The server encountered an unexpected condition which prevented it from fulfilling the request
 * @apiError (401) {String} Unauthorized  User is not authenticated
 * @apiError (404) {String} NotFound  Invalid user id
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 404 NotFound
 * {
 *       message: "User is not authenticated"
 * }
 **/

/**
 * @api {get} /liked/list/:username/:page/:count Get liked tweets
 * @apiVersion 0.1.0
 * @apiName GetLikedTweets
 * @apiGroup User
 * @apiDescription Get list carrying the user liked tweets
 * @apiSampleRequest off
 * @apiPermission Default
 * @apiParam {String} access_token JWT generated access token for the user. It is sent in header
 * @apiParam {String} username The username of the user
 * @apiParam {int} page The page number
 * @apiParam {int} count count of liked tweets per page
 * @apiSuccess {list} tweets list of tweet objects carrying user liked tweets
 * @apiSuccess {String} message Success message
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *      "tweets": [{tweet-object},{tweet-object}],
 *      "message": "Tweets have been retrieved successfully"
 * }
 * @apiError (500) {String} InternalServerError  The server encountered an unexpected condition which prevented it from fulfilling the request
 * @apiError (401) {String} Unauthorized  User is not authenticated
 * @apiError (404) {String} NotFound  Invalid user Id
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 404 NotFound
 * {
 *       message: "User not found"
 * }
 **/


//#endregion Users

//#region Media

/**
 * @api {post} /media/upload Upload media
 * @apiVersion 0.1.0
 * @apiName UploadMedia
 * @apiGroup Media
 * @apiDescription Uploads media like pictures, videos, gifs, etc.
 * @apiSampleRequest off
 * @apiParam {String} [media_type] type of the media to upload. It can be image, video, gif, etc.
 * @apiSuccess {int} media_id The id of the uploaded media
 * @apiSuccess {String} media type
 * @apiSuccess {String} path The url of the uploaded media
 * @apiSuccess {String} message Success message
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *      "media_id": 1,
 *      "media_type": ".jpg",
 *      "path": "http://localhost:3000/media/1.jpg",
 *      "message" : "Media has been uploaded successfully"
 *
 * }
 * @apiError (400) {String} BadRequest  The server cannot or will not process the request due to something that is perceived to be a client error
 * @apiError (500) {String} InternalServerError  The server encountered an unexpected condition which prevented it from fulfilling the request
 * @apiError (401) {String} Unauthorized  User is not authenticated
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400 BadRequest
 * {
 *       "message": "Could not Upload data"
 * }
 **/

//#endregion Media

//#region Timeline

/**
 * @api {get} /home/:page/:count Home timeline
 * @apiVersion 0.1.0
 * @apiName GetTimeline
 * @apiGroup Timeline
 * @apiDescription Retireves the timeline containing following tweets and user tweets.
 * @apiSampleRequest off
 * @apiPermission Default
 * @apiParam {String} access_token JWT generated access token for the user. It is sent in header
 * @apiParam {int} page The page number
 * @apiParam {int} [count=10] count of tweets per page.
 * @apiSuccess {list} tweets list of retrieved tweets
 * @apiSuccess {String} message Success message
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *      "tweets": [{tweet-object}, {tweet-object}, ...],
 *      "message" : "Tweets have been uploaded successfully"
 *
 * }
 * @apiError (500) {String} InternalServerError  The server encountered an unexpected condition which prevented it from fulfilling the request
 * @apiError (401) {String} Unauthorized  User is not authenticated
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 404 Unauthorized
 * {
 *       "message": "User is not authenticated"
 * }
 **/

//#endregion Timeline

//#region Objects information

/**
 * @api {get} / User Object
 * @apiName user-object
 * @apiVersion 0.1.0
 * @apiGroup Objects information
 * @apiDescription An object carrying user information.
 * @apiSampleRequest off
 * @apiParam {ObjectId} id Represents the id of the user
 * @apiParam {String} name Represents the name of the user
 * @apiParam {String} username Represents the username of the user
 * @apiParam {String} email Represents the email of the user
 * @apiParam {String} [phone] Represents the phone number of the user
 * @apiParam {String} profile_image_url Represents the profile image url of the user
 * @apiParam {String} cover_image_url Represents the cover image url of the user
 * @apiParam {String} bio Represents the bio of the user
 * @apiParam {String} website Represents the website of the user
 * @apiParam {String} location Represents the location of the user
 * @apiParam {DateTime} created_at Represents the date when the user was created
 * @apiParam {Boolean} isVerified determines if the user is verified
 * @apiParam {String} role The role of the user (admin or regular user).
 * @apiParam {int} followers_count Represents the number of followers of the user
 * @apiParam {int} following_count Represents the number of users the user is following
 * @apiParam {int} tweets_count Represents the number of tweets the user has posted
 * @apiParam {int} likes_count Represents the number of likes the user has received
 * @apiParam {Boolean} isBanned Represents the number of media the user has uploaded
 * @apiParam {DateTime} banDuration Represents the duration of the ban
 * @apiParam {Boolean} permanentBan Represents if the user is banned forever
 * @apiParam {String} month_day_access Determines who has access to see user birth month and day.
 * @apiParam {String} year_access Determines who has access to see user birth year.
 **/

/**
 * @api {get} / Tweet Object
 * @apiName tweet-object
 * @apiVersion 0.1.0
 * @apiGroup Objects information
 * @apiDescription An object carrying tweet information.
 * @apiSampleRequest off
 * @apiParam {ObjectId} id Represents the id of the tweet
 * @apiParam {String} content Contains the tweet content
 * @apiParam {Object} user Represents the information of the user who posted the tweet
 * @apiParam {int} likes_count Represents the number of likes the tweet has received
 * @apiParam {int} retweets_count Represents the number of retweets the tweet has received
 * @apiParam {int} quote_tweets_count Represents the number of quote tweets the tweet has received
 * @apiParam {int} replies_count Represents the number of replies the tweet has received
 * @apiParam {DateTime} created_at Represents the date when the tweet was created
 * @apiParam {Boolean} is_liked Represents if the user has liked the tweet
 * @apiParam {Boolean} is_retweeted Represents if the user has retweeted the tweet
 * @apiParam {Boolean} is_quoted Represents if the user has quoted the tweet
 * @apiParam {String} quote_comment Represents the caption of the quote tweet in case it is quoted
 * @apiParam {List} replies Represents list of tweets objects that are replies to the tweet.
 * @apiParam {List} mentions Represents list of users that are mentioned in the tweet
 * @apiParam {List} media Represents list of media that are attached to the tweet
 **/

/**
 * @api {get} / Notification Object
 * @apiName notification-object
 * @apiVersion 0.1.0
 * @apiGroup Objects information
 * @apiDescription An object carrying notification information.
 * @apiSampleRequest off
 * @apiParam {ObjectId} id Represents the id of the notification
 * @apiParam {String} content Contains the notification content
 * @apiParam {String} notification_type Represents the type of the notification
 * @apiParam {Object} related_user Represents the user who recieved the notification
 * @apiParam {Object} tweet Represents the tweet that the notification is about
 * @apiParam {DateTime} created_at Represents the date when the notification was created
 * @apiParam {Boolean} is_read Represents if the notification has been read
 * 
 **/

//#endregion Objects information