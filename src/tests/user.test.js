const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("./testApp");
const mongoose = require("mongoose");
const config = require("../config");
const User = require("../models/user");
const followUserModel = require("../models/followUser");
const connectionurl = config.testConnectionSting;

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
beforeEach(async () => {
    await User.deleteMany({});
    await new User(userOne).save();
    await new User(userTwo).save();
    await new followUserModel(followUserOne).save();
    await new followUserModel(followUserTwo).save();
  });

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
