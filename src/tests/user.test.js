const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("./testApp");
const mongoose = require("mongoose");
const config = require("../config");
const User = require("../models/user");
const notificationModel = require("./../models/notification.js");
require("dotenv").config();


const connectionurl = config.testConnectionString;

const userOneId = new mongoose.Types.ObjectId();
const userTwoId = new mongoose.Types.ObjectId();

const userOne = {
    _id: userOneId,
    name: "Amr Zaki",
    username: "zikaaaaa",
    birth_date: "2000-01-01T00:00:00.000Z",
    email: "zika@gmail.com",
    password: "myPassw@ord123",
    followers: [userTwoId],
    followings: [userTwoId],
    gender:"Male",
    tokens: [{ token: jwt.sign({ _id: userOneId }, " "+ process.env.JWT_SECRET) }]
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
    gender:"Male",
    tokens: [{ token: jwt.sign({ _id: userOneId }, " "+process.env.JWT_SECRET) }]
}

const notificationOne = {
    userId: userOneId,
    notificationTypeId: "6240cd218b70b6ccc7a22cdf",
}
const notificationTwo = {
    userId: userOneId,
    notificationTypeId: "6240cd6b3516844208b542d4",
}


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
    await new User(userOne).save();
    await new User(userTwo).save();
    await new notificationModel(notificationOne).save();
    await new notificationModel(notificationTwo).save();
});




/*test("Should get following list", async () => {
    const response = await request(app)
        .get("/following/list/" + userOne.username)
        .send()
        .expect(200);
});*/

/*test("Testing that no user is found with this username", async () => {
    const response = await request(app)
        .get("/following/list/me5aaaaa")
        .send()
        .expect(404);
});*/

test("Should get followers list", async () => {
    const response = await request(app)
        .get("/follower/list/" + userTwo.username+1)
        .set("Authorization", `Bearer ${ userOne.tokens[0].token}`)
        .send()
        .expect(200);
});

/*test("Testing that no user is found with this username", async () => {
    const response = await request(app)
        .get("/following/list/drammar")
        .send()
        .expect(404);
});

test("Should get notifications list", async () => {
    const response = await request(app)
        .get("/notifications/list")
        .send({
            userId: userOneId,
        })
        .expect(200);
});

test("Testing when sending Invalid ID", async () => {
    const response = await request(app)
        .get("/notifications/list")
        .send({
            userId: "5e9f8f9f8b70b6ccc7a22cdf",
        })
        .expect(500);
});*/
