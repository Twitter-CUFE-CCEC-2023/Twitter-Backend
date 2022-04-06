const request = require("supertest");
const app = require("./testApp");
const mongoose = require("mongoose");
const config = require("../config");
const banUser = require("../models/banUser")
const User = require("../models/user");

const connectionurl = config.testConnectionSting;

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

beforeEach(async () => {
    await User.deleteMany({});
    await new User(userOne).save();
    await new User(userTwo).save();
});


afterAll(() => {
    mongoose.connection.close();
});

id = new mongoose.Types.ObjectId()

const userOne = {
    _id: id,
    name:"Amr Zaki",
    username: "zikaaaaaa",
    dateOfBirth: "2000-01-01T00:00:00.000Z",
    email: "zika@gmail.com",
    password: "myPassw@ord123",
    location: "Al haram",
    isBanned: true
}

const userTwo = {
    name:"Abd el rahman",
    username: "abdoooooo",
    dateOfBirth: "2000-01-01T00:00:00.000Z",
    email: "abdo@gmail.com",
    password: "myPassw@ord456",
    location: "Al mohandessen",
    isBanned: true
}

test('get a user by loactaion', async()=>{
    await request(app).get('/dashboard/users').send({
        location: "Al mohandessen"
    }).expect(200)
});

test('ban user', async()=>{
    await request(app).post('/dashboard/ban').send({
        userId: id,
        banDuration: 2,
        reason: "ay 7aga",
        isPermanent: false
    }).expect(200)
})

test('unban user', async()=>{
    await request(app).post('/dashboard/unban').send({
        userId: id
    }).expect(200)
})

