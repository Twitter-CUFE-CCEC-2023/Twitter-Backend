const request = require("supertest");
const app = require("./testApp");
const mongoose = require("mongoose");
const config = require("../config");
const Tweets = require("../models/tweet");
const User = require("../models/user");
const auth = require("../middleware/auth");

const connectionurl = config.testConnectionString;

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
id2 = new mongoose.Types.ObjectId()

const tweet1 = {
    _id: id,
    userId:id2,
    username: "zikaaaaaa",
    content: "I am the first tweet"
}

const tweet2 = {
    username: "zikaaaaaa",
    userId: id2,
    parentId: id,
    isRetweeted: true,
    content: "I am the second tweet"
}

const userOneId = new mongoose.Types.ObjectId();
const userTwoId = new mongoose.Types.ObjectId();
const userThreeId = new mongoose.Types.ObjectId();

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

test("Should like a tweet", async () => {
    const login = await request(app)
        .post("/auth/login")
        .send({ email_or_username: userOne.email, password: userOne.password })
        .expect(200);

    const user = await getUser(userOne.username);
    const response = await request(app)
        .post("/status/like")
        .set("Authorization", "Bearer " + user.tokens[0].token)
        .send(
            {
                tweetId: tweet1._id
            }
        )
        .expect(200);
});

test("Should unlike a tweet", async () => {
    const login = await request(app)
        .post("/auth/login")
        .send({ email_or_username: userOne.email, password: userOne.password })
        .expect(200);

    const user = await getUser(userOne.username);
    const response = await request(app)
        .post("/status/like")
        .set("Authorization", "Bearer " + user.tokens[0].token)
        .send(
            {
                tweetId: tweet1._id
            }
        )
        .expect(200);
        const unfollow = await request(app)
        .post("/status/unlike")
        .set("Authorization", "Bearer " + user.tokens[0].token)
        .send(
            {
                tweetId: tweet1._id
            }
        )
        .expect(200);
});