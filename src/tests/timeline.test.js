const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("./testApp");
const mongoose = require("mongoose");
const config = require("../config");
const User = require("../models/user");
const followUserModel = require("../models/followUser");
const notificationModel = require("./../models/notification.js");
const tweetModel = require("./../models/tweet");
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

const tweetOne={
    username: "zikaaaaa",
    userId: userOneId,
    content:"this is my first tweet",
}
const tweetTwo={
    username: "zikaaaaa",
    userId: userOneId,
    content:"this is my second tweet",
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
    await tweetModel.deleteMany({});
    await new User(userOne).save();
    await new User(userTwo).save();
    await new tweetModel(tweetOne).save();
    await new tweetModel(tweetTwo).save();
  });

  test("Should get Tweets list", async () => {
    const response = await request(app)
        .get("/home")
        .send({
            userId: userOneId,
        })
        .expect(200);
});

test("Testing that user ID is required", async () => {
    const response = await request(app)
        .get("/home")
        .send({
            userId: "",
        })
        .expect(400);
});