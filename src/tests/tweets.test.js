const request = require("supertest");
const app = require("./testApp");
const mongoose = require("mongoose");
const config = require("../config");
const Tweets = require("../models/tweet");
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


afterAll(() => {
    mongoose.connection.close();
});


id = new mongoose.Types.ObjectId()

const tweet1 = {
    _id: id,
    username: "zikaaaaaa",
    content: "I am the first tweet"
}

const tweet2 = {
    username: "zikaaaaaa",
    parentId: id,
    isRetweeted: true,
    content: "I am the second tweet"
}

const userOne = {
    name:"Amr Zaki",
    username: "zikaaaaaa",
    dateOfBirth: "2000-01-01T00:00:00.000Z",
    email: "zika@gmail.com",
    password: "myPassw@ord123",
}

beforeEach(async () => {
    await User.deleteMany({});
    await new User(userOne).save();
    await Tweets.deleteMany({});
    await new Tweets(tweet1).save()
    await new Tweets(tweet2).save()
});

test('getting a tweet and the writing user from the tweet id', async()=>{
    await request(app).get('/status/tweet/' + id).send({}).expect(200)
})

test('getting the tweets by the username', async()=> {
    await request(app).get('/status/tweets/list/' + userOne.username).send({}).expect(200)
})

test('deleting a tweet', async()=>{
    await request(app).delete('/status/tweet/delete').send({
        id:id
    }).expect(200)
})