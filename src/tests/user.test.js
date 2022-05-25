const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("./testApp");
const mongoose = require("mongoose");
const config = require("../config");
const User = require("../models/user");
const notificationModel = require("./../models/notification.js");
const Tweet = require("../models/tweet");
const FormData = require("form-data");
require("dotenv").config();


const connectionurl = config.testConnectionString;

const userOneId = new mongoose.Types.ObjectId();
const userTwoId = new mongoose.Types.ObjectId();
const userThreeId = new mongoose.Types.ObjectId();
const notificationOneId = new mongoose.Types.ObjectId();
const notificationTwoId = new mongoose.Types.ObjectId();
const tweetOneId=new mongoose.Types.ObjectId();
const tweetTwoId=new mongoose.Types.ObjectId();

const userOne = {
    _id: userOneId,
    name: "Amr Zaki",
    username: "zikaaaaa",
    birth_date: "2000-01-01T00:00:00.000Z",
    email: "zika@gmail.com",
    password: "myPassw@ord123",
    followers: [userTwoId],
    followings: [userTwoId],
    gender: "Male",
    isVerified: true
}

const userTwo = {
    _id: userTwoId,
    name: "Ahmed Elgarf",
    username: "elgarf",
    birth_date: "1999-10-10T00:00:00.000Z",
    email: "elgarf@gmail.com",
    password: "TTFTTSTTD",
    followers: [userOneId],
    followings: [userOneId],
    gender: "Male",
    isVerified: true
}

const userThree = {
    _id: userThreeId,
    name: "Ammar yasser",
    username: "ElDr.Ammar",
    birth_date: "1999-10-10T00:00:00.000Z",
    email: "ammar@gmail.com",
    password: "ammaryasserEng",
    gender: "Male",
    isVerified: true
}

const notificationOne = {
    _id: notificationOneId,
    userId: userOneId,
    notificationTypeId: "6240cd218b70b6ccc7a22cdf",
}
const notificationTwo = {
    _id: notificationTwoId,
    userId: userOneId,
    notificationTypeId: "6240cd6b3516844208b542d4",
}

const tweetOne= {
    _id: tweetOneId,
    userId: userOneId,
    username: "zikaaaaaa",
    content: "I am the first tweet"
}
const tweetTwo = {
    _id: tweetTwoId,
    userId: userOneId,
    username: "zikaaaaaa",
    parentId: tweetOne._id,
    isRetweeted: true,
    content: "I am the second tweet"
}
async function getUser(username_email) {
    const user = await User.find({
        $or: [{ email: username_email }, { username: username_email }],
    });
    if (user[0]) {
        return new User(user[0]);
    } else {
        return null;
    }
};

beforeAll(() => {
    mongoose.connect(
        connectionurl,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        },
        (error, result) => {
            if (error) {
                throw error;
            }
        }
    );
});


afterAll(() => {
    mongoose.connection.close();
});

beforeEach(async () => {
    await User.deleteMany({});
    await notificationModel.deleteMany({});
    await Tweet.deleteMany({});
    await new User(userOne).save();
    await new User(userTwo).save();
    await new User(userThree).save();
    await new notificationModel(notificationOne).save();
    await new notificationModel(notificationTwo).save();
    await new Tweet(tweetOne).save();
    await new Tweet(tweetTwo).save();
});


/*test("Testing that no user is found with this username", async () => {
    const signup = await request(app).post("/auth/signup").send({
        email: "mostafa.abdelbrr@hotmail.com",
        username: "MostafaA",
        password: "myPassw@ord123",
        name: "Mostafa Abdelbrr",
        gender: "male",
        birth_date: "2000-01-01T00:00:00.000Z",
        isVerified: true
    }).expect(200);

    const login = await request(app)
        .post("/auth/login")
        .send({ email_or_username: "MostafaA", password: "myPassw@ord123" })
        .expect(200);

    const user = await getUser("MostafaA");
    const response = await request(app)
        .get("/follower/list/me5aaaaa/1/2")
        .set("Authorization", "Bearer " + user.tokens[0].token)
        .send()
        .expect(404);
});

test("Should get followers list", async () => {
    const signup = await request(app).post("/auth/signup").send({
        email: "mostafa.abdelbrr@hotmail.com",
        username: "MostafaA",
        password: "myPassw@ord123",
        name: "Mostafa Abdelbrr",
        gender: "male",
        birth_date: "2000-01-01T00:00:00.000Z",
        isVerified: true
    }).expect(200);

    const login = await request(app)
        .post("/auth/login")
        .send({ email_or_username: "MostafaA", password: "myPassw@ord123" })
        .expect(200);

    const user = await getUser("MostafaA");

    const response = await request(app)
        .get("/follower/list/" + userTwo.username + "/1/2")
        .set("Authorization", "Bearer " + user.tokens[0].token)
        .send()
        .expect(200);
});
test("Should get following list", async () => {
    const signup = await request(app).post("/auth/signup").send({
        email: "mostafa.abdelbrr@hotmail.com",
        username: "MostafaA",
        password: "myPassw@ord123",
        name: "Mostafa Abdelbrr",
        gender: "male",
        birth_date: "2000-01-01T00:00:00.000Z",
        isVerified: true
    }).expect(200);

    const login = await request(app)
        .post("/auth/login")
        .send({ email_or_username: "MostafaA", password: "myPassw@ord123" })
        .expect(200);

    const user = await getUser("MostafaA");

    const response = await request(app)
        .get("/following/list/" + userOne.username + "/1/2")
        .set("Authorization", "Bearer " + user.tokens[0].token)
        .send()
        .expect(200);
});

test("Testing that no user is found with this username", async () => {
    const signup = await request(app).post("/auth/signup").send({
        email: "mostafa.abdelbrr@hotmail.com",
        username: "MostafaA",
        password: "myPassw@ord123",
        name: "Mostafa Abdelbrr",
        gender: "male",
        birth_date: "2000-01-01T00:00:00.000Z",
        isVerified: true
    }).expect(200);

    const login = await request(app)
        .post("/auth/login")
        .send({ email_or_username: "MostafaA", password: "myPassw@ord123" })
        .expect(200);

    const user = await getUser("MostafaA");
    const response = await request(app)
        .get("/following/list/drammar/1/2")
        .set("Authorization", "Bearer " + user.tokens[0].token)
        .send()
        .expect(404);
});

test("Should get tweets in home timeline", async () => {
    const login = await request(app)
        .post("/auth/login")
        .send({ email_or_username: userOne.email, password: userOne.password })
        .expect(200);

    const user = await getUser(userOne.username);
    const response = await request(app)
        .get("/home/1/2")
        .set("Authorization", "Bearer " + user.tokens[0].token)
        .send({})
        .expect(200);
});*/
//*********************************************************notification list */
test("Should get notifications list", async () => {
  const login = await request(app)
    .post("/auth/login")
    .send({ email_or_username: userOne.username, password: userOne.password })
    .expect(200);

  const user = await getUser(userOne.username);
  const response = await request(app)
    .get("/notifications/list/1/2")
    .set("Authorization", "Bearer " + user.tokens[0].token)
    .send({})
    .expect(200);
});
//************************************************************* */
//2
/*test("Should follow user", async () => {
    const signup = await request(app).post("/auth/signup").send({
        email: "mostafa.abdelbrr@hotmail.com",
        username: "MostafaA",
        password: "myPassw@ord123",
        name: "Mostafa Abdelbrr",
        gender: "male",
        birth_date: "2000-01-01T00:00:00.000Z",
        isVerified: true
    }).expect(200);
    const login = await request(app)
        .post("/auth/login")
        .send({ email_or_username: "MostafaA", password: "myPassw@ord123" })
        .expect(200);
    const user = await getUser("MostafaA");
    const response = await request(app)
        .post("/user/follow")
        .set("Authorization", "Bearer " + user.tokens[0].token)
        .send(
            {
                id: userThree._id
            }
        )
        .expect(200);
});*/
/*test("Should give error message when the user is invalid", async () => {
    const login = await request(app)
        .post("/auth/login")
        .send({ email_or_username: userOne.email, password: userOne.password })
        .expect(200);

    const user = await getUser(userOne.username);
    const response = await request(app)
        .post("/user/follow")
        .set("Authorization", "Bearer " + user.tokens[0].token)
        .send(
            {
                id: new mongoose.Types.ObjectId()
            }
        )
        .expect(404);
});*/
//1
/*test("Should unfollow user", async () => {
    const login = await request(app)
        .post("/auth/login")
        .send({ email_or_username: userOne.email, password: userOne.password })
        .expect(200);

    const user = await getUser(userOne.username);
    const response = await request(app)
        .post("/user/follow")
        .set("Authorization", "Bearer " + user.tokens[0].token)
        .send(
            {
                id: userThree._id
            }
        )
        .expect(200);
    const unfollow = await request(app)
        .post("/user/unfollow")
        .set("Authorization", "Bearer " + user.tokens[0].token)
        .send(
            {
                id: userThree._id
            }
        )
        .expect(200);
});*/
/*test("Should get user information", async () => {
    const signup = await request(app).post("/auth/signup").send({
        email: "mostafa.abdelbrr@hotmail.com",
        username: "MostafaA",
        password: "myPassw@ord123",
        name: "Mostafa Abdelbrr",
        gender: "male",
        birth_date: "2000-01-01T00:00:00.000Z",
        isVerified: true
    }).expect(200);
    const login = await request(app)
        .post("/auth/login")
        .send({ email_or_username: "MostafaA", password: "myPassw@ord123" })
        .expect(200);
    const user = await getUser("MostafaA");
    const response = await request(app)
        .get("/info/" + userThree.username)
        .set("Authorization", "Bearer " + user.tokens[0].token)
        .send()
        .expect(200);
});
test("Should return error for unvalid user", async () => {
    const signup = await request(app).post("/auth/signup").send({
        email: "mostafa.abdelbrr@hotmail.com",
        username: "MostafaA",
        password: "myPassw@ord123",
        name: "Mostafa Abdelbrr",
        gender: "male",
        birth_date: "2000-01-01T00:00:00.000Z",
        isVerified: true
    }).expect(200);
    const login = await request(app)
        .post("/auth/login")
        .send({ email_or_username: "MostafaA", password: "myPassw@ord123" })
        .expect(200);
    const user = await getUser("MostafaA");
    const response = await request(app)
        .get("/info/" + new mongoose.Types.ObjectId())
        .set("Authorization", "Bearer " + user.tokens[0].token)
        .send()
        .expect(404);
});*/

//********************Search tests */
/*test("Should return not found for invalid username", async () => {
    const signup = await request(app).post("/auth/signup").send({
        email: "ahmed.elgarf@gmail.com",
        username: "ahmedelgarf94",
        password: "password123",
        name: "Ahmed Elgarf",
        gender: "male",
        birth_date: "1999-04-10T00:00:00.000Z",
        isVerified: true
    }).expect(200);
    const login = await request(app)
        .post("/auth/login")
        .send({ email_or_username: "ahmedelgarf94", password: "password123" })
        .expect(200);
    const user = await getUser("ahmedelgarf94");
    const response = await request(app)
        .get("/search/:invalidusername")
        .set("Authorization", "Bearer " + user.tokens[0].token)
        .send()
        .expect(404);
});

test("Should return all users with username", async () => {
    const signup = await request(app).post("/auth/signup").send({
        email: "ahmed.elgarf@gmail.com",
        username: "ahmedelgarf94",
        password: "password123",
        name: "Ahmed Elgarf",
        gender: "male",
        birth_date: "1999-04-10T00:00:00.000Z",
        isVerified: true
    }).expect(200);
    const login = await request(app)
        .post("/auth/login")
        .send({ email_or_username: "ahmedelgarf94", password: "password123" })
        .expect(200);
    const user = await getUser("ahmedelgarf94");
    const response = await request(app)
        .get("/search/"+userThree.username)
        .set("Authorization", "Bearer " + user.tokens[0].token)
        .send()
        .expect(200);
});

test("Should return error for unauthanticated users", async () => {
    const signup = await request(app).post("/auth/signup").send({
        email: "ahmed.elgarf@gmail.com",
        username: "ahmedelgarf94",
        password: "password123",
        name: "Ahmed Elgarf",
        gender: "male",
        birth_date: "1999-04-10T00:00:00.000Z",
        isVerified: true
    }).expect(200);

    const user = await getUser("ahmedelgarf94");
    const response = await request(app)
        .get("/search/"+userThree.username)
        .send()
        .expect(401);
});


//-************************************

//***************************************update user name */

/*test("Should return that username is updated", async () => {
    const signup = await request(app).post("/auth/signup").send({
        email: "ahmed.elgarf@gmail.com",
        username: "ahmedelgarf94",
        password: "password123",
        name: "Ahmed Elgarf",
        gender: "male",
        birth_date: "1999-04-10T00:00:00.000Z",
        isVerified: true
    }).expect(200);
    const login = await request(app)
        .post("/auth/login")
        .send({ email_or_username: "ahmedelgarf94", password: "password123" })
        .expect(200);
    const user = await getUser("ahmedelgarf94");
    const response = await request(app)
        .put("/update-username")
        .set("Authorization", "Bearer " + user.tokens[0].token)
        .send({
            username: "ammaryassereng"
        })
        .expect(200);
});

test("Should return error when updating username for unauthanticated users", async () => {
    const signup = await request(app).post("/auth/signup").send({
        email: "ahmed.elgarf@gmail.com",
        username: "ahmedelgarf94",
        password: "password123",
        name: "Ahmed Elgarf",
        gender: "male",
        birth_date: "1999-04-10T00:00:00.000Z",
        isVerified: true
    }).expect(200);
    const user = await getUser("ahmedelgarf94");
    const response = await request(app)
        .put("/update-username")
        .send({
            username: "ammaryassereng"
        })
        .expect(401);
});

//******************************************************************************** */

//******************************************************count notifications */
/*test("Should return all notification of the user", async () => {
    const login = await request(app)
        .post("/auth/login")
        .send({ email_or_username: userOne.username, password: userOne.password })
        .expect(200);
    const user = await getUser(userOne.username);
    const response = await request(app)
        .get("/count-notifications")
        .set("Authorization", "Bearer " + user.tokens[0].token)
        .send()
        .expect(200);
});

test("Should return error when trying to get all notification of unauthanticated user", async () => {
    const user = await getUser(userOne.username);
    const response = await request(app)
        .get("/count-notifications")
        .send()
        .expect(401);
});
//******************************************************************************** */

//************************************************************check user */
/*test("Should return if the username is found", async () => {
    const response = await request(app)
        .post("/check-user")
        .send({email_or_username: userOne.username})
        .expect(200);
});

test("Should return error that the username is not found", async () => {
    const response = await request(app)
        .post("/check-user")
        .send({email_or_username: "invalidusername"})
        .expect(404);
});
//************************************************************************ */



//************************************************************get locations */
/*test("Should return the locations", async () => {
    const login = await request(app)
        .post("/auth/login")
        .send({ email_or_username: userOne.username, password: userOne.password })
        .expect(200);
    const user = await getUser(userOne.username);
    const response = await request(app)
        .get("/get-locations")
        .set("Authorization", "Bearer " + user.tokens[0].token)
        .send({email_or_username: userOne.username})
        .expect(200);
});

//************************************************************************ */

//******************************************************media list */

/*test("Should get media list", async () => {
  
    const login = await request(app)
        .post("/auth/login")
        .send({ email_or_username: userOne.username, password: userOne.password })
        .expect(200);

    const user = await getUser(userOne.username);

    const response = await request(app)
        .get("/media/list/" + userOne.username + "/1/2")
        .set("Authorization", "Bearer " + user.tokens[0].token)
        .send()
        .expect(200);
});

test("Should return not found user", async () => {
  
    const login = await request(app)
        .post("/auth/login")
        .send({ email_or_username: userOne.username, password: userOne.password })
        .expect(200);

    const user = await getUser(userOne.username);

    const response = await request(app)
        .get("/media/list/" + "invalidusername" + "/1/2")
        .set("Authorization", "Bearer " + user.tokens[0].token)
        .send()
        .expect(404);
});

test("Should return error for unauthanticated user", async () => {

    const response = await request(app)
        .get("/media/list/" + userThree.username + "/1/2")
        .send()
        .expect(401);
});
//************************************************************************** */

//******************************************************************read notification */
/*test("Should make the notification read", async () => {
    const login = await request(app)
        .post("/auth/login")
        .send({ email_or_username: userOne.username, password: userOne.password })
        .expect(200);
    const user = await getUser(userOne.username);
    const response = await request(app)
        .put("/read-notification")
        .set("Authorization", "Bearer " + user.tokens[0].token)
        .send({notificationId:notificationOneId})
        .expect(200);
});

test("Should return user not found for the notification", async () => {
    const login = await request(app)
        .post("/auth/login")
        .send({ email_or_username: userTwo.username, password: userTwo.password })
        .expect(200);
    const user = await getUser(userTwo.username);
    const response = await request(app)
        .put("/read-notification")
        .set("Authorization", "Bearer " + user.tokens[0].token)
        .send({notificationId:notificationOneId})
        .expect(404);
});

test("Should return error for unauthanticated user for the notification", async () => {
    const response = await request(app)
        .put("/read-notification")
        .send({notificationId:notificationOneId})
        .expect(401);
});
//******************************************************* */


//*******************************************************liked list */

/*test("Should get liked list", async () => {
    const login = await request(app)
        .post("/auth/login")
        .send({ email_or_username: userOne.username, password: userOne.password })
        .expect(200);
    const user = await getUser(userOne.username);
    const likeTweet= await request(app)
        .post("/status/like")
        .set("Authorization", "Bearer " + user.tokens[0].token)
        .send(
            {
                id: tweetOneId
            })
        .expect(404);
    const response = await request(app)
        .get("/liked/list/ " + userOne.username + "/1/2")
        .set("Authorization", "Bearer " + user.tokens[0].token)
        .send()
        .expect(200);
});

//****************************************************************************** */