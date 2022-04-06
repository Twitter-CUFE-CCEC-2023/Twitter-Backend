const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("./testApp");
const mongoose = require("mongoose");
const config = require("../config");
const User = require("../models/user");
const followUserModel = require("../models/followUser");
const notificationModel = require("./../models/notification.js");

const connectionurl = config.testConnectionString;

const userOneId= new mongoose.Types.ObjectId();
const userTwoId= new mongoose.Types.ObjectId();

const userOne = {
    _id: userOneId,
    name:"Amr Zaki",
    username: "zikaaaaa",
    dateOfBirth: "2000-01-01T00:00:00.000Z",
    email: "zika@gmail.com",
    password: "myPassw@ord123",
}

const userTwo = {
    _id: userTwoId,
    name:"Ahmed Elgarf",
    username: "elgarf",
    dateOfBirth: "1999-10-10T00:00:00.000Z",
    email: "elgarf@gmail.com",
    password: "TTFTTSTTD",
}

const followUserOne={
    userId: userOneId,
    followingUserId: userTwoId,
}
const followUserTwo={
    userId: userTwoId,
    followingUserId: userOneId,
}

const notificationOne={
    userId: userOneId,
    notificationTypeId:"6240cd218b70b6ccc7a22cdf",
}
const notificationTwo={
    userId: userTwoId,
    notificationTypeId:"6240cd218b70b6ccc7a22cdf",
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
    await new User(userOne).save();
    await new User(userTwo).save();
    await new followUserModel(followUserOne).save();
    await new followUserModel(followUserTwo).save();
    await new notificationModel(notificationOne).save();
    await new notificationModel(notificationTwo).save();
  });




test("Should get following list", async () => {
    const response = await request(app)
        .get("/following/list/zikaaaaa")
        .send()
        .expect(200);
});

test("Testing that no user is found with this username", async () => {
    const response = await request(app)
        .get("/following/list/me5aaaaa")
        .send()
        .expect(404);
});

test("Should get followers list", async () => {
    const response = await request(app)
        .get("/following/list/elgarf")
        .send()
        .expect(200);
});

test("Testing that no user is found with this username", async () => {
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

test("Testing that no user is found with this ID", async () => {
    const response = await request(app)
        .get("/notifications/list")
        .send({
            userId: "5e9f8f9f8b70b6ccc7a22cdf",
        })
        .expect(500);
});