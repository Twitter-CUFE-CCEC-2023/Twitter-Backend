const request = require("supertest");
const app = require("./testApp");
const mongoose = require("mongoose");
const config = require("../config");
const Tweets = require("../models/tweet");
const User = require("../models/user");

id = new mongoose.Types.ObjectId()

const tweet1 = {
    _id: id,
    username: "zikaaaaaa"
}

const tweet2 = {
    username: "zikaaaaaa",
    parentId: id,
    isRetweeted: true
}

const userOne = {
    name:"Amr Zaki",
    username: "zikaaaaaa",
    dateOfBirth: "2000-01-01T00:00:00.000Z",
    email: "zika@gmail.com",
    password: "myPassw@ord123",
}

beforeEach(async () => {
    await new User(userOne).save()
    await new Tweets(tweet1).save()
    await new Tweets(tweet2).save()
})

test('deleting a tweet', async()=>{
    await request(app).delete('/status/tweet/delete').send({
        id:id
    }).expect(200)
})