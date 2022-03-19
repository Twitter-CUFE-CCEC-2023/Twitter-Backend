
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
 * @apiParam {String} phone_number phone number of the user
 * @apiParam {int} [profile_picture] Id of the uploaded profile picture
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
 * @apiSuccess {String} access_token JWT generated access token for the user
 * @apiSuccess {user-object} user of the sign up operation
 * @apiSuccess {DateTime} token_expiration_date The date and time of token expiration
 * @apiSuccess {String} message Success message
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *      "access_token": "AAAA%2FAAA%3DAAAAAAAAxxxxxx",
 *      "user" : {user-object},
 *      "token_expiration_date": "2020-01-01T00:00:00.000Z",
 *      "message": "User Signed up successfully"
 * }
 * @apiError (400) {String} BadRequest  The server cannot or will not process the request due to something that is perceived to be a client error
 * @apiError (409) {String} Conflict  Indicates that the request could not be processed because of conflict in the current state of the resource
 * @apiError (500) {String} InternalServerError  The server encountered an unexpected condition which prevented it from fulfilling the request
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 409 Conflict
 * {
 *       message: "Email already exists"
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
 * @apiSuccess {DateTime} token_expiration_date The date and time of token expiration
 * @apiSuccess {String} message Success message
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
 * @api {put} /user/verify-credentials/:id Verify user
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
 * @api {put} /auth/verify-reset-password/:id Verify reset password
 * @apiVersion 0.1.0
 * @apiName VerifyResetPassword
 * @apiGroup Authentication
 * @apiDescription Verifies the reset password request with the code sent to the user email.
 * @apiSampleRequest off
 * @apiParam {int} id Id of the user that needes reset password request to be verified
 * @apiParam {int} verification_code The code that is used to verify reset password request
 * @apiParamExample {json} Request-Example:
 * {
 *      "id": 32543216216,
 *      "verification_code": "123456"
 * }
 * @apiSuccess {String} message Success message
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *      "message": "Request has been verified"
 * }
 * @apiError (400) {String} BadRequest  The server cannot or will not process the request due to something that is perceived to be a client error
 * @apiError (500) {String} InternalServerError  The server encountered an unexpected condition which prevented it from fulfilling the request
 * @apiError (401) {String} Unauthorized  Invalid verification code
 * @apiError (404) {String} NotFound  Invalid verification code
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 401 Unauthorized
 * {
 *       message: "Invalid or expired verification code"
 * }
 **/

/**
 * @api {put} /auth/reset-password/:id Update password
 * @apiVersion 0.1.0
 * @apiName ResetPassword
 * @apiGroup Authentication
 * @apiDescription Updates user's password.
 * @apiSampleRequest off
 * @apiParam {int} id Id of the user that needs to reset his/her password
 * @apiParam {String} password The new password of the user
 * @apiParamExample {json} Request-Example:
 * {
 *      "id": 32543216216,
 *      "password": "myNewPassw@rd"
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
 * @api {put} /dashboard/ban/:userid Ban User
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
 * @api {put} /dashboard/unban/:userid Unban user
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
 * @api {post} /status/like/:id Like a tweet
 * @apiVersion 0.1.0
 * @apiName LikeTweet
 * @apiGroup Tweets
 * @apiDescription Adds the tweet to the user liked tweets
 * @apiSampleRequest off
 * @apiPermission Default
 * @apiParam {String} access_token JWT generated access token for the user. It is sent in header
 * @apiParam {int} id The id of the liked tweet
 * @apiParam {Boolean} [notify=true] send notification to the user of the liked tweet
 * @apiParamExample {json} Request-Example:
 * {
 *      "id": 1001,
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
 * @api {delete} /status/unlike/:id Unlike a tweet
 * @apiVersion 0.1.0
 * @apiName UnlikeTweet
 * @apiGroup Tweets
 * @apiDescription Removes the tweet from liked tweets
 * @apiSampleRequest off
 * @apiPermission Default
 * @apiParam {String} access_token JWT generated access token for the user. It is sent in header
 * @apiParam {int} id The id of the unliked tweet
 * @apiParam {Boolean} [notify=false] send notification to the user of the unliked tweet
 * @apiParamExample {json} Request-Example:
 * {
 *      "id": 1001,
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
 * @api {get} /status/liked/list Get liked tweets
 * @apiVersion 0.1.0
 * @apiName GetLikedTweets
 * @apiGroup Tweets
 * @apiDescription Get list carrying the user liked tweets
 * @apiSampleRequest off
 * @apiPermission Default
 * @apiParam {String} access_token JWT generated access token for the user. It is sent in header
 * @apiParam {int} [user_id] The id of user to whom results are returned
 * @apiParam {int{1-200}} [count=20] Number of retrieved tweets
 * @apiParamExample {json} Request-Example:
 * {
 *      "user_id": 20,
 *      "count": 40
 * }
 * @apiSuccess {String} message Success message
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *      "message": "Tweets have been retrieved successfully"
 * }
 * @apiError (400) {String} BadRequest  The server cannot or will not process the request due to something that is perceived to be a client error
 * @apiError (500) {String} InternalServerError  The server encountered an unexpected condition which prevented it from fulfilling the request
 * @apiError (401) {String} Unauthorized  User is not authenticated
 * @apiError (404) {String} NotFound  Invalid user Id
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 404 NotFound
 * {
 *       message: "Could not find any tweets"
 * }
 **/

/**
 * @api {get} status/tweet/:id Retrieve a tweet by id
 * @apiVersion 0.1.0
 * @apiName GetTweet
 * @apiGroup Tweets
 * @apiDescription Returns a single Tweet, specified by the id parameter. The Tweet's author will also be embedded within the Tweet.
 * @apiSampleRequest off
 * @apiPermission Default
 * @apiParam {String} access_token JWT generated access token for the user. It is sent in header
 * @apiParam {int} id id of the tweet
 * @apiParam {Boolean} [include_my_retweet] When set to either true , t or 1 , any Tweets returned that have been retweeted by the authenticating user will include an additional current_user_retweet node, containing the ID of the source status for the retweet.
 * @apiParamExample {json} Request-Example:
 * {
 *      "id": 123456
 * }
 * @apiSuccess {String} access_token JWT generated access token for the user
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *      "tweet": {tweet-object},
 *      "user": {user-object}
 * }
 * @apiError (400) {String} BadRequest  The server cannot or will not process the request due to something that is perceived to be a client error
 * @apiError (500) {String} InternalServerError  The server encountered an unexpected condition which prevented it from fulfilling the request
 * @apiError (401) {String} UnAuthorized  user is not authenticated
 * @apiError (404) {String} TweetNotFound  The enetered credentials are invalid
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 401 Unauthorized
 * {
 *       message: "tweet not found"
 * }
 **/

/**
 * @api {post} status/tweet/post Post a tweet
 * @apiVersion 0.1.0
 * @apiName PostTweet
 * @apiGroup Tweets
 * @apiDescription Post a tweet with the input data(strings) of the user choice
 * @apiSampleRequest off
 * @apiPermission Default
 * @apiParam {String} access_token JWT generated access token for the user. It is sent in header
 * @apiParam {String{1-280}} content content of the tweet
 * @apiParam {int} [replying] id that this tweet is replied on
 * @apiParam {list} [mentions] usernames of the mentioned people in the tweet
 * @apiParam {list} [attachment_urls] urls attached to the meassage
 * @apiParam {list} [media_ids] media ids attached to the meassage
 * @apiParam {Boolean} [notify=true] notifies user's followers when a tweet is posted
 * @apiParamExample {json} Request-Example:
 * {
 *      content: "This is a sample text of a tweet"
 * }
 * @apiSuccess {String} message Success message
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *      "tweet": {tweet-object},
 *      "message": "Tweet posted successfully"
 * }
 * @apiError (400) {String} BadRequest  The server cannot or will not process the request due to something that is perceived to be a client error
 * @apiError (500) {String} InternalServerError  The server encountered an unexpected condition which prevented it from fulfilling the request
 * @apiError (401) {String} Unauthorized  User is not authenticated
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 401 Unauthorized
 * {
 *       message: "Tweet posting failed"
 * }
 **/

/**
 * @api {get} /status/retweeters/:id Get tweet retweeters
 * @apiVersion 0.1.0
 * @apiName GetTweetRetweeters
 * @apiGroup Tweets
 * @apiDescription Get list carrying the users who retweeted a specific tweet
 * @apiSampleRequest off
 * @apiPermission Default
 * @apiParam {String} access_token JWT generated access token for the user. It is sent in header
 * @apiParam {int} [id] The id of the tweet
 * @apiParam {int{1-100}} [count=20] Number of retrieved tweets
 * @apiParamExample {json} Request-Example:
 * {
 *      "id": 1202,
 *      "count": 40
 * }
 * @apiSuccess {String} message Success message
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *      "retweeters": [{user-object},{user-object},{user-object}],
 *      "message": "Retweeters have been retrieved successfully"
 * }
 * @apiError (400) {String} BadRequest  The server cannot or will not process the request due to something that is perceived to be a client error
 * @apiError (500) {String} InternalServerError  The server encountered an unexpected condition which prevented it from fulfilling the request
 * @apiError (401) {String} Unauthorized  User is not authenticated
 * @apiError (404) {String} NotFound  Invalid tweet Id
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 404 NotFound
 * {
 *       message: "Tweet is not found"
 * }
 **/


/**
 * @api {delete} status/tweet/delete/:id Delete a tweet
 * @apiVersion 0.1.0
 * @apiName DeleteTweet
 * @apiGroup Tweets
 * @apiDescription Delete a tweet that is posted by authenticated user
 * @apiSampleRequest off
 * @apiPermission Default
 * @apiParam {String} access_token JWT generated access token for the user. It is sent in header
 * @apiParam {int} id The id of deleted tweet
 * @apiParamExample {json} Request-Example:
 * {
 *      "id" : 1291
 * }
 * @apiSuccess {String} tweet Deleted tweet object
 * @apiSuccess {String} message Success message
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *      "tweet": {tweet-object},
 *      "message": Tweet has been deleted successfully
 * }
 * @apiError (400) {String} BadRequest  The server cannot or will not process the request due to something that is perceived to be a client error
 * @apiError (500) {String} InternalServerError  The server encountered an unexpected condition which prevented it from fulfilling the request
 * @apiError (401) {String} UnAuthorized  user is not authenticated
 * @apiError (404) {String} NotFound  Invalid tweet Id
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 401 NotFound
 * {
 *       message: "Invalid tweet Id"
 * }
 **/

/**
 * @api {get} /status/tweet/quote-tweets/:id Get tweet quote tweets
 * @apiVersion 0.1.0
 * @apiName GetQuoteTweets
 * @apiGroup Tweets
 * @apiDescription Get list of quote tweets of specified tweet
 * @apiSampleRequest off 
 * @apiPermission Default
 * @apiParam {String} access_token JWT generated access token for the user. It is sent in header
 * @apiParam {int} id The ID of the quoted tweet
 * @apiParamExample {json} Request-Example: 
 * {
 *      "id": 20,
 * }
 * @apiSuccess {list} quote_tweets List of quote tweets objects
 * @apiSuccess {String} message Success message
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *     "quote_tweets": [{tweet-object}, {tweet-object}, {tweet-object}, ....],
 *     "message": "Quote tweets have been retrieved successfully"
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
 * @api {post} /status/retweet/:id Retweet a tweet
 * @apiVersion 0.1.0
 * @apiName Retweet a Tweet
 * @apiGroup Tweets
 * @apiDescription Retweets a tweet. Returns the original Tweet with Retweet details embedded.
 * @apiSampleRequest off
 * @apiPermission Default
 * @apiParam {String} access_token JWT generated access token for the user. It is sent in header
 * @apiParam {int} id The numerical ID of the desired status.
 * @apiParam {String{1-280}} quote_comment Optional. A comment to be embedded with the tweet in case of quote tweet only.
 * @apiParamExample {json} Request-Example:
 * {
 *      "id": 1001
 * }
 * @apiSuccess {Object} tweet tweet object carrying the retweeted tweet information
 * @apiSuccess {String} message Success message
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *      "tweet": {tweet-object},
 *      "message": "Tweet has been Retweeted successfully"
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
 * @api {delete} /status/unretweet/:id Unretweet a tweet
 * @apiVersion 0.1.0
 * @apiName Unretweet
 * @apiGroup Tweets
 * @apiDescription Untweets a retweeted status. Returns the original Tweet with Retweet details embedded, The untweeted retweet status ID must be authored by the user backing the authentication token.
 * @apiSampleRequest off
 * @apiPermission Default
 * @apiParam {String} access_token JWT generated access token for the user. It is sent in header
 * @apiParam {int} id The numerical ID of the desired status.
 * @apiParamExample {json} Request-Example:
 * {
 *      "id": 1001,
 * }
 * @apiSuccess {Object} original tweet object carrying original tweet information
 * @apiSuccess {String} message Success message
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *      "tweet": {tweet-object},
 *      "message": "tweet has been Unretweeted successfully"
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

//#endregion Tweets

//#region Users

/**
 * @api {POST} /user/follow/:id Follow user
 * @apiVersion 0.1.0
 * @apiName FollowUser
 * @apiGroup User
 * @apiDescription Add the user to the followers list
 * @apiSampleRequest off
 * @apiPermission Default
 * @apiParam {String} access_token JWT generated access token for the user. It is sent in header
 * @apiParam {int} userid user id of the authenticated user. It is sent in header
 * @apiParam {int} id user id of the following user
 * @apiParam {Boolean} [notify=true] send notification to the following user
 * @apiParamExample {json} Request-Example:
 * {
 *      "following_userid": 11,
 *      "notify": true
 * }
 * @apiSuccess {object} user object carrying authenticated user information
 * @apiSuccess {String} message Success message
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *      "user": {user-object},
 *      "message": "User followed successfully"
 * }
 * @apiError (400) {String} BadRequest  The server cannot or will not process the request due to something that is perceived to be a client error
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
 * @api {delete} /user/unfollow/:id Unfollow user
 * @apiVersion 0.1.0
 * @apiName UnFollowUser
 * @apiGroup User
 * @apiDescription Remove the user from the followers list
 * @apiSampleRequest off
 * @apiPermission Default
 * @apiParam {String} access_token JWT generated access token for the user. It is sent in header
 * @apiParam {int} userid user id of the authenticated user. It is sent in header
 * @apiParam {int} id user id of the following user
 * @apiParam {Boolean} [notify=false] send notification to the following user
 * @apiParamExample {json} Request-Example:
 * {
 *      "following_userid": 25,
 *      "notify": false
 * }
 * @apiSuccess {object} user object carrying authenticated user information
 * @apiSuccess {String} message Success message
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *      "user": {user-object},
 *      "message": "User unfollowed successfully"
 * }
 * @apiError (400) {String} BadRequest  The server cannot or will not process the request due to something that is perceived to be a client error
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
 * @api {POST} /user/block/:id Block user
 * @apiVersion 0.1.0
 * @apiName Block user
 * @apiGroup User
 * @apiDescription Blocks the specified user from following the authenticating user. In addition the blocked user will not show in the authenticating users mentions or timeline (unless retweeted by another user). If a follow or friend relationship exists it is destroyed
 * @apiSampleRequest off 
 * @apiPermission Default
 * @apiParam {String} access_token JWT generated access token for the user. It is sent in header
 * @apiParam {int} userid user id of the authenticated user. It is sent in header
 * @apiParam {int} id The ID of the potentially blocked user
 * @apiParamExample {json} Request-Example: 
 * {
 *      "id": 25
 * }
 * @apiSuccess {object} user object carrying authenticated user information
 * @apiSuccess {String} message Success message
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *      "user": {user-object},
 *      "message": "User Blocked successfully"
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
 * @api {delete} /user/unblock/:id Unblock user
 * @apiVersion 0.1.0
 * @apiName Unblock user
 * @apiGroup User
 * @apiDescription Un-blocks the user specified in the ID parameter for the authenticating user. Returns the un-blocked user when successful. If relationships existed before the block was instantiated, they will not be restored.
 * @apiSampleRequest off 
 * @apiPermission Default
 * @apiParam {String} access_token JWT generated access token for the user. It is sent in header
 * @apiParam {int} userid user id of the authenticated user. It is sent in header
 * @apiParam {int} id The ID of the blocked user
 * @apiParamExample {json} Request-Example: 
 * {
 *      "id": 25
 * }
 * @apiSuccess {object} user object carrying authenticated user information
 * @apiSuccess {String} message Success message
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *      "user" : {user-object},
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

/**
 * @api {GET} /user/followers/list Followers list
 * @apiVersion 0.1.0
 * @apiName FollowersList
 * @apiGroup User
 * @apiDescription Get list of followers
 * @apiSampleRequest off
 * @apiPermission Default
 * @apiParam {String} access_token JWT generated access token for the user. It is sent in header
 * @apiParam {int} userid the ID of the user for whom to return results. It is sent in header
 * @apiSuccess {list} followers_users list of followers users objects
 * @apiSuccess {String} message Success message
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *      "followers_users": [{user-object},{user-object}, ..],
 *      "message": "Followers list displayed successfully"
 * }
 * @apiError (400) {String} BadRequest  The server cannot or will not process the request due to something that is perceived to be a client error
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
 * @api {GET} /user/following/list Following list
 * @apiVersion 0.1.0
 * @apiName FollowingList
 * @apiGroup User
 * @apiDescription Get list of following
 * @apiSampleRequest off
 * @apiPermission Default
 * @apiParam {String} access_token JWT generated access token for the user. It is sent in header
 * @apiParam {int} userid the ID of the user for whom to return results. It is sent in header
 * @apiSuccess {list} following_users list of following user objects
 * @apiSuccess {String} message Success message
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *      "following_users": [{user-object},{user-object}, ..],
 *      "message": "Following list displayed successfully"
 * }
 * @apiError (400) {String} BadRequest  The server cannot or will not process the request due to something that is perceived to be a client error
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
 * @api {put} /user/update-profile Update user profile
 * @apiVersion 0.1.0
 * @apiName UpdateProfile
 * @apiGroup User
 * @apiDescription Updates authenticated user profile.
 * @apiSampleRequest off
 * @apiPermission Default
 * @apiParam {String} access_token JWT generated access token for the user. It is sent in header
 * @apiParam {int} userid user id of the authenticated user. It is sent in header
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
 *       message: "User not found"
 * }
 **/

/**
 * @api {get} /status/tweets/list Get authenticated user tweets
 * @apiVersion 0.1.0
 * @apiName GetTweets
 * @apiGroup Tweets
 * @apiDescription Retrieve user tweets, tweets may be including replies or not.
 * @apiSampleRequest off
 * @apiPermission Default
 * @apiParam {String} access_token JWT generated access token for the user. It is sent in header
 * @apiParam {int} userid user id of the authenticated user. It is sent in header
 * @apiParam {Boolean} [include_replies] Determines if replies and their tweets should be included in the response.
 * @apiParamExample {json} Request-Example:
 * {
 *      "include_replies": true
 * }
 * @apiSuccess {list} tweets list carrying tweets objects
 * @apiSuccess {String} message Success message
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *      "tweets": [{tweet-object},{tweet-object}],
 *      "message": "User has been verified successfully"
 * }
 * @apiError (400) {String} BadRequest  The server cannot or will not process the request due to something that is perceived to be a client error
 * @apiError (500) {String} InternalServerError  The server encountered an unexpected condition which prevented it from fulfilling the request
 * @apiError (401) {String} Unauthorized  Invalid verification code
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 401 Unauthorized
 * {
 *       message: "Invalid or expired token"
 * }
 **/

/**
 * @api {GET} /notifications/list Notifications list
 * @apiVersion 0.1.0
 * @apiName NotificationsList
 * @apiGroup User
 * @apiDescription Get list of user notifications
 * @apiSampleRequest off 
 * @apiPermission Default
 * @apiParam {String} access_token JWT generated access token for the user. It is sent in header
 * @apiParam {int} userid the ID of the user for whom to return results. It is sent in header
 * @apiParam {int{1-200}} [count=20] The number of notifications 
 * @apiParamExample {json} Request-Example: 
 * {
 *      "count": 12,
 * }
 * @apiSuccess {list} list of objects carrying the notifications information 
 * @apiSuccess {String} message Success message
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *      "notifications": [{notification-object}, {notification-object}, ..],
 *      "message": "Notifications list displayed successfully"
 * }
 * @apiError (400) {String} BadRequest  The server cannot or will not process the request due to something that is perceived to be a client error
 * @apiError (500) {String} InternalServerError  The server encountered an unexpected condition which prevented it from fulfilling the request
 * @apiError (401) {String} Unauthorized  User is not authenticated
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 401 Unauthorized
 * {
 *       message: "Invalid or expired token"
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
 * @api {get} /timeline/home Home timeline
 * @apiVersion 0.1.0
 * @apiName GetTimeline
 * @apiGroup Timeline
 * @apiDescription Retireves the timeline containing following tweets and user tweets.
 * @apiSampleRequest off
 * @apiPermission Default
 * @apiParam {String} access_token JWT generated access token for the user. It is sent in header
 * @apiParam {int{1-200}} [count=20] count of retrieved ids
 * @apiParam {int} [since_id] Returns results with an ID greater than (that is, more recent than) the specified ID.
 * @apiParamExample {json} Request-Example:
 * {
 *      "count": "20",
 *      "since_id": "1324",
 * }
 * @apiSuccess {list} tweets list of retrieved tweets
 * @apiSuccess {String} message Success message
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *      "tweets": [{tweet-object}, {tweet-object}, ...],
 *      "message" : "Tweets have been uploaded successfully"
 *
 * }
 * @apiError (400) {String} BadRequest  The server cannot or will not process the request due to something that is perceived to be a client error
 * @apiError (500) {String} InternalServerError  The server encountered an unexpected condition which prevented it from fulfilling the request
 * @apiError (401) {String} Unauthorized  User is not authenticated
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400 BadRequest
 * {
 *       "message": "Could not retrieve data"
 * }
 **/

//#endregion Timeline
