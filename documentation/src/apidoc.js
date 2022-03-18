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
 * @api {post} /status/favourite/like Like a tweet
 * @apiVersion 0.1.0
 * @apiName LikeTweet
 * @apiGroup Likes
 * @apiDescription Adds the tweet to the user liked tweets
 * @apiSampleRequest off
 * @apiPermission RequiresAuth
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
 * @api {post} status/favourite/unlike Unlike a tweet
 * @apiVersion 0.1.0
 * @apiName UnlikeTweet
 * @apiGroup Likes
 * @apiDescription Removes the tweet from liked tweets
 * @apiSampleRequest off
 * @apiPermission RequiresAuth
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
 * @api {get} /status/favourite/list Get liked tweets
 * @apiVersion 0.1.0
 * @apiName GetLikedTweets
 * @apiGroup Tweets
 * @apiDescription Get list carrying the user liked tweets
 * @apiSampleRequest off
 * @apiPermission RequiresAuth
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
 * HTTP/1.1 401 UserNotFound
 * {
 *       message: "User is not authenticated"
 * }
 **/

/**
 * @api {get} status/tweet/retrieve Retrieve a tweet by id
 * @apiVersion 0.1.0
 * @apiName GetTweet
 * @apiGroup Tweets
 * @apiDescription Returns a single Tweet, specified by the id parameter. The Tweet's author will also be embedded within the Tweet.
 * @apiSampleRequest off
 * @apiPermission RequiresAuth
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
 *      "created_at": "Wed Oct 10 20:19:24 +0000 2018",
 *      "id": 1050118621198921728,
 *      "text": "To make room for more expression, we will now count all emojis as equal—including those with gender‍‍‍ and skin t… https://t.co/MkGjXf9aXm",
 *      "user_mentions": [],
 *      "urls": [],
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
 * @api {POST} /user/follow Follow user
 * @apiVersion 0.1.0
 * @apiName FollowUser
 * @apiGroup User
 * @apiDescription Add the user to the followers list
 * @apiSampleRequest off
 * @apiPermission RequiresAuth
 * @apiParam {String} access_token JWT generated access token for the user. It is sent in header
 * @apiParam {int} [follower_userid] user id of the follower user
 * @apiParam {int} following_userid user id of the following user
 * @apiParam {Boolean} [notify=true] send notification to the following user
 * @apiParamExample {json} Request-Example:
 * {
 *      "follower_userid": 10,
 *      "following_userid": 11,
 *      "notify": true
 * }
 * @apiSuccess {String} message Success message
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *      "message": "User followed successfully"
 * }
 * @apiError (400) {String} BadRequest  The server cannot or will not process the request due to something that is perceived to be a client error
 * @apiError (500) {String} InternalServerError  The server encountered an unexpected condition which prevented it from fulfilling the request
 * @apiError (401) {String} Unauthorized  User is not authenticated
 * @apiError (404) {String} UserNotFound Invalid user Id
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 404 UserNotFound
 * {
 *       message: "Invalid user Id"
 * }
 **/

/**
 * @api {POST} /user/unfollow Unfollow user
 * @apiVersion 0.1.0
 * @apiName UnFollowUser
 * @apiGroup User
 * @apiDescription Remove the user from the followers list
 * @apiSampleRequest off
 * @apiPermission RequiresAuth
 * @apiParam {String} access_token JWT generated access token for the user. It is sent in header
 * @apiParam {int} [follower_userid] user id of the follower user
 * @apiParam {int} following_userid user id of the following user
 * @apiParam {Boolean} [notify=false] send notification to the following user
 * @apiParamExample {json} Request-Example:
 * {
 *      "follower_userid": 20,
 *      "following_userid": 25,
 *      "notify": false
 * }
 * @apiSuccess {String} message Success message
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *      "message": "User unfollowed successfully"
 * }
 * @apiError (400) {String} BadRequest  The server cannot or will not process the request due to something that is perceived to be a client error
 * @apiError (500) {String} InternalServerError  The server encountered an unexpected condition which prevented it from fulfilling the request
 * @apiError (401) {String} Unauthorized  User is not authenticated
 * @apiError (404) {String} UserNotFound Invalid user Id
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 404 UserNotFound
 * {
 *       message: "Invalid user Id"
 * }
 **/

/**
 * @api {POST} /user/block Block user
 * @apiVersion 0.1.0
 * @apiName Block user
 * @apiGroup User
 * @apiDescription Blocks the specified user from following the authenticating user. In addition the blocked user will not show in the authenticating users mentions or timeline (unless retweeted by another user). If a follow or friend relationship exists it is destroyed
 * @apiSampleRequest off 
 * @apiPermission RequiresAuth
 * @apiParam {String} access_token JWT generated access token for the user. It is sent in header
 * @apiParam {int} [user_id] The ID of the potentially blocked user
 * @apiParamExample {json} Request-Example: 
 * {
 *      "user_id": 20,
 * }
 * @apiSuccess {String} message Success message
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *      "message": "User Blocked successfully"
 * }
 * @apiError (400) {String} BadRequest  The server cannot or will not process the request due to something that is perceived to be a client error
 * @apiError (500) {String} InternalServerError  The server encountered an unexpected condition which prevented it from fulfilling the request
 * @apiError (401) {String} Unauthorized  User is not authenticated
 * @apiError (404) {String} UserNotFound  Invalid user Id

 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 404 UserNotFound
 * {
 *       message: "Invalid user Id"
 * }
 **/


/**
 * @api {POST} /user/unblock Unblock user
 * @apiVersion 0.1.0
 * @apiName Unblock user
 * @apiGroup User
 * @apiDescription Un-blocks the user specified in the ID parameter for the authenticating user. Returns the un-blocked user when successful. If relationships existed before the block was instantiated, they will not be restored.
 * @apiSampleRequest off 
 * @apiPermission RequiresAuth
 * @apiParam {String} access_token JWT generated access token for the user. It is sent in header
 * @apiParam {int} [user_id] The ID of the  blocked user
 * @apiParamExample {json} Request-Example: 
 * {
 *      "user_id": 20,
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
 * @apiError (404) {String} UserNotFound  Invalid user Id

 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 404 UserNotFound
 * {
 *       message: "Invalid user Id"
 * }
 **/

/**
 * @api {GET} /user/followers Followers list
 * @apiVersion 0.1.0
 * @apiName FollowersList
 * @apiGroup User
 * @apiDescription Get list of followers
 * @apiSampleRequest off 
 * @apiPermission RequiresAuth
 * @apiParam {int} user_id the ID of the user for whom to return results
 * @apiParam {int} count The number of followers users 
 * @apiParam {list} followers_users list of followers IDs
 * @apiParam {Boolean} [notify=false] send notification to the following user
 * @apiParamExample {json} Request-Example: 
 * {
 *      "user_id": 20,
 *      "count": 10,
 *      "followers_users": [10 20 25 36 40 40 23 58 95 45]
 *      "notify": false
 * }
 * @apiSuccess {String} message Success message
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *      "message": "Followers list displayed successfully"
 * }
 * @apiError (400) {String} BadRequest  The server cannot or will not process the request due to something that is perceived to be a client error
 * @apiError (500) {String} InternalServerError  The server encountered an unexpected condition which prevented it from fulfilling the request
 * @apiError (401) {String} Unauthorized  User is not authenticated
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 401 UserNotFound
 * {
 *       message: "Invalid user credentials"
 * }
 **/