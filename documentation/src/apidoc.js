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
 *      "role": "user",
 *      "token_expiration_date": "2020-01-01T00:00:00.000Z",
 *      "message": "User logged in successfully"
 * }
 * @apiError (400) {String} BadRequest  The server cannot or will not process the request due to something that is perceived to be a client error
 * @apiError (500) {String} InternalServerError  The server encountered an unexpected condition which prevented it from fulfilling the request
 * @apiError (401) {String} UserNotFound  The enetered credentials are invalid
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 401 UserNotFound
 * {
 *       message: "Invalid user credentials"
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
 * @api {get} /status/tweet/retweeters Get tweet retweeters
 * @apiVersion 0.1.0
 * @apiName GetTweetRetweeters
 * @apiGroup Tweets
 * @apiDescription Get list carrying the users who retweeted a specific tweet
 * @apiSampleRequest off
 * @apiPermission RequiresAuth
 * @apiParam {String} access_token JWT generated access token for the user. It is sent in header
 * @apiParam {int} [tweet_id] The id of the tweet
 * @apiParam {int{1-100}} [count=20] Number of retrieved tweets
 * @apiParamExample {json} Request-Example:
 * {
 *      "tweet_id": 1202,
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
 * HTTP/1.1 404 TweetNotFound
 * {
 *       message: "Tweet is not found"
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
 * @apiParam {int} user_id The ID of the potentially blocked user
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
 * @apiParam {int} user_id The ID of the  blocked user
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
 * @api {GET} /user/followers/list Followers list
 * @apiVersion 0.1.0
 * @apiName FollowersList
 * @apiGroup User
 * @apiDescription Get list of followers
 * @apiSampleRequest off
 * @apiPermission RequiresAuth
 * @apiParam {String} access_token JWT generated access token for the user. It is sent in header
 * @apiParam {int} user_id the ID of the user for whom to return results
 * @apiParam {int} count The number of followers users
 * @apiParamExample {json} Request-Example:
 * {
 *      "user_id": 20,
 *      "count": 10,
 * }
 * @apiSuccess {String} message Success message
 * @apiSuccess {list} followers_users list of followers IDs
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *      "message": "Followers list displayed successfully",
 *      "followers_users": [10 20 25 36 40 40 23 58 95 45]
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
 * @api {get} status/tweet/retrieve Retrieve a tweet by id
 * @apiVersion 0.1.0
 * @apiName GetTweet
 * @apiGroup Tweets
 * @apiDescription Returns a single Tweet, specified by the id parameter. The Tweet's author will also be embedded within the Tweet.
 * @apiSampleRequest off
 * @apiPermission RequiresAuth
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
 * @apiDescription post a tweet with the input data(strings) of the user choice
 * @apiSampleRequest off
 * @apiPermission RequiresAuth
 * @apiParam {String} access_token JWT generated access token for the user. It is sent in header
 * @apiParam {String} content content of the tweet
 * @apiParam {int} [replying] id that this tweet is replied on
 * @apiParam {list} [mentions] usernames of the mentioned people in the tweet
 * @apiParam {list} [attachment_urls] urls attached to the meassage
 * @apiParamExample {json} Request-Example:
 * {
 *      content: "this is a sample text of a tweet"
 * }
 * @apiSuccess {String} tweet tweet object posted successfully
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *      "tweet": {tweet-object},
 *      "message": tweet posted successfully
 * }
 * @apiError (400) {String} BadRequest  The server cannot or will not process the request due to something that is perceived to be a client error
 * @apiError (500) {String} InternalServerError  The server encountered an unexpected condition which prevented it from fulfilling the request
 * @apiError (401) {String} UnAuthorized  user is not authenticated
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 401 Unauthorized
 * {
 *       message: "tweet posting failed"
 * }
 **/

/**
 * @api {GET} /user/following/list Following list
 * @apiVersion 0.1.0
 * @apiName FollowingList
 * @apiGroup User
 * @apiDescription Get list of following
 * @apiSampleRequest off
 * @apiPermission RequiresAuth
 * @apiParam {String} access_token JWT generated access token for the user. It is sent in header
 * @apiParam {int} user_id the ID of the user for whom to return results
 * @apiParam {int} count The number of following users
 * @apiParamExample {json} Request-Example:
 * {
 *      "user_id": 20,
 *      "count": 12,
 * }
 * @apiSuccess {String} message Success message
 * @apiSuccess {list} following_users list of following IDs
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *      "message": "Following list displayed successfully",
 *      "following_users": [23 45 68 95 45 24 69 87 56 23 14 58]
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
 * @api {post} /status/retweet Retweet a tweet
 * @apiVersion 0.1.0
 * @apiName Retweet a Tweet
 * @apiGroup Tweets
 * @apiDescription Retweets a tweet. Returns the original Tweet with Retweet details embedded.
 * @apiSampleRequest off
 * @apiPermission RequiresAuth
 * @apiParam {String} access_token JWT generated access token for the user. It is sent in header
 * @apiParam {int} id The numerical ID of the desired status.
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
 * @api {post} status/tweet/Post Post a tweet
 * @apiVersion 0.1.0
 * @apiName PostTweet
 * @apiGroup Tweets
 * @apiDescription post a tweet with the input data(strings) of the user choice
 * @apiSampleRequest off
 * @apiPermission RequiresAuth
 * @apiParam {String} access_token JWT generated access token for the user. It is sent in header
 * @apiParam {String} content content of the tweet
 * @apiParam {int} [replying] id that this tweet is replied on
 * @apiParam {list} [mentions] usernames of the mentioned people in the tweet
 * @apiParam {list} [attachment_urls] urls attached to the meassage
 * @apiParamExample {json} Request-Example:
 * {
 *      "content": "This is a sample text of a tweet"
 * }
 * @apiSuccess {String} tweet tweet object posted successfully
 * @apiSuccess {String} message Success message
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *      "tweet": {tweet-object},
 *      "message": "Tweet posted successfully"
 * }
 * @apiError (400) {String} BadRequest  The server cannot or will not process the request due to something that is perceived to be a client error
 * @apiError (500) {String} InternalServerError  The server encountered an unexpected condition which prevented it from fulfilling the request
 * @apiError (401) {String} UnAuthorized  user is not authenticated
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400 BadRequest
 * {
 *       message: "Tweet posting failed"
 * }
 **/

/**
 * @api {post} status/tweet/delete Delete a tweet
 * @apiVersion 0.1.0
 * @apiName DeleteTweet
 * @apiGroup Tweets
 * @apiDescription Delete a tweet that is posted by authenticated user
 * @apiSampleRequest off
 * @apiPermission RequiresAuth
 * @apiParam {String} access_token JWT generated access token for the user. It is sent in header
 * @apiParam {int} tweet_id The id of deleted tweet
 * @apiParamExample {json} Request-Example:
 * {
 *      "id" : 1291
 * }
 * @apiSuccess {String} tweet tweet deleted tweet object
 * @apiSuccess {String} message Success message
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *      "deleted_tweet": {tweet-object},
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
 * @api {post} /status/unretweet Unretweet a tweet
 * @apiVersion 0.1.0
 * @apiName Unretweet
 * @apiGroup Tweets
 * @apiDescription Untweets a retweeted status. Returns the original Tweet with Retweet details embedded, The untweeted retweet status ID must be authored by the user backing the authentication token.
 * @apiSampleRequest off
 * @apiPermission RequiresAuth
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

/**
 * @api {put} /user/update-profile Update user profile
 * @apiVersion 0.1.0
 * @apiName UpdateProfile
 * @apiGroup User
 * @apiDescription Updates authenticated user profile.
 * @apiSampleRequest off
 * @apiPermission RequiresAuth
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
 *       message: "User not found"
 * }
 **/

/**
 * @api {post} /auth/signUp SignUp user
 * @apiVersion 0.1.0
 * @apiName SignUp
 * @apiGroup Authentication
 * @apiDescription creates an account for the user, user can sign-up using his email or creating a username and creating a password
 * @apiSampleRequest off
 * @apiParam {String} email Email of the user
 * @apiParam {String} username Username of the user
 * @apiParam {String} password password of the user
 * @apiParam {String} first_name first name of the user
 * @apiParam {String} second_name second name of the user
 * @apiParam {String} gender gender of the user
 * @apiParam {DateTime} birth_date birth date of the user
 * @apiParam {int} phone_number phone number of the user
 * @apiParamExample {json} Request-Example:
 * {
 *      "email": "amrzaki2000.az@gmail.com",
 *      "username": "amrZaki123"
 *      "password": "myPassw@ord123",
 *      "first_name": "Amr",
 *      "second_name": "Zaki",
 *      "gender": "male",
 *      "birth_date": "2000-01-01T00:00:00.000Z",
 *      "phone_number": "0105267436"
 * }
 * @apiSuccess {String} message Success message
 * @apiSuccess {String} access_token JWT generated access token for the user
 * @apiSuccess {user-object} user of the sign up operation
 * @apiSuccess {String} role role of the user
 * @apiSuccess {DateTime} token_expiration_date The date and time of token expiration
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *      "access_token": "AAAA%2FAAA%3DAAAAAAAAxxxxxx",
 *      "user" : {user-object},
 *      "role": "user",
 *      "token_expiration_date": "2020-01-01T00:00:00.000Z",
 *      "message": "User Signed up successfully"
 * }
 * @apiError (400) {String} BadRequest  The server cannot or will not process the request due to something that is perceived to be a client error
 * @apiError (500) {String} InternalServerError  The server encountered an unexpected condition which prevented it from fulfilling the request
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400 SignUpFailed
 * {
 *       message: "sign up failed"
 * }
 **/

/**
 * @api {post} /user/verify-credentials Verify signed up user credentials
 * @apiVersion 0.1.0
 * @apiName VerifyEmail
 * @apiGroup Authentication
 * @apiDescription Verifies newly created user.
 * @apiSampleRequest off
 * @apiPermission RequiresAuth
 * @apiParam {String} access_token JWT generated access token for the user. It is sent in header
 * @apiParam {int} verification_code Verification code that is sent by email
 * @apiParamExample {json} Request-Example:
 * {
 *      "verification_code: "123456"
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
 *       message: "Invalid verification code"
 * }
 **/

/**
 * @api {get} /status/tweets/list Get authenticated user tweets
 * @apiVersion 0.1.0
 * @apiName GetTweets
 * @apiGroup Tweets
 * @apiDescription Retrieve user tweets, tweets may be including replies or not.
 * @apiSampleRequest off
 * @apiPermission RequiresAuth
 * @apiParam {String} access_token JWT generated access token for the user. It is sent in header
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
 * @api {post} /auth/verify-reset-password Verify reset password
 * @apiVersion 0.1.0
 * @apiName VerifyResetPassword
 * @apiGroup Authentication
 * @apiDescription Verifies the reset password request with the code sent to the user email.
 * @apiSampleRequest off
 * @apiParam {int} verification_code The code that is used to veridy reset password request
 * @apiParamExample {json} Request-Example:
 * {
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
 *       message: "Invalid verification code"
 * }
 **/

/**
 * @api {put} /auth/reset-password Update user password
 * @apiVersion 0.1.0
 * @apiName ResetPassword
 * @apiGroup Authentication
 * @apiDescription Updates user's password.
 * @apiSampleRequest off
 * @apiParam {String} password The new password of the user
 * @apiParamExample {json} Request-Example:
 * {
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

/**
 * @api {post} /user/ban Ban User
 * @apiVersion 0.1.0
 * @apiName ban user
 * @apiGroup Admin
 * @apiDescription ban the specified user from the services of twitter
 * @apiSampleRequest off
 * @apiPermission RequiresAuth
 * @apiParam {String} access_token JWT generated access token for the user. It is sent in header
 * @apiParam {int} user_id The ID of the potentially blocked user
 * @apiParam {String} reason reason of banning the specified user
 * @apiParem {DateTime} [end_date] date of ban ending
 * @apiParem {Boolean} [forever_banned] if true specifies that the user account will be banned forever, in that case the end_date is ignored
 * @apiParamExample {json} Request-Example:
 * {
 *      "user_id": 20,
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
 * @apiError (404) {String} UserNotFound  Invalid user Id
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 404 UserNotFound
 * {
 *       message: "Invalid user Id"
 * }
 **/

/**
 * @api {POST} /user/unban Unban user
 * @apiVersion 0.1.0
 * @apiName Unban user
 * @apiGroup Admin
 * @apiDescription Un-bans the user specified in the ID parameter for the authenticating user. the banned user will regain access to his account
 * @apiSampleRequest off 
 * @apiPermission RequiresAuth
 * @apiParam {String} access_token JWT generated access token for the user. It is sent in header
 * @apiParam {int} user_id The ID of the  blocked user
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
 * @api {get} /status/tweet/quote-tweets Get tweet quote tweets
 * @apiVersion 0.1.0
 * @apiName GetQuoteTweets
 * @apiGroup Tweets
 * @apiDescription Get list of quote tweets of specified tweet
 * @apiSampleRequest off 
 * @apiPermission RequiresAuth
 * @apiParam {String} access_token JWT generated access token for the user. It is sent in header
 * @apiParam {int} tweet_id The ID of the quoted tweet
 * @apiParamExample {json} Request-Example: 
 * {
 *      "tweet_id": 20,
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
