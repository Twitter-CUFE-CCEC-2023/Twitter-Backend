const request = require("supertest");
const app = require("./testApp");
const mongoose = require("mongoose");
const config = require("../config");
const Tweets = require("../models/tweet");
const User = require("../models/user");
const auth = require("../middleware/auth");
const jwt = require("jsonwebtoken");
const notificationModel = require("./../models/notification.js");
require("dotenv").config();


const connectionurl = config.testConnectionString;

beforeAll(async() => {
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
    await User.deleteMany({});
    await Tweets.deleteMany({});
});


afterAll(() => {
    mongoose.connection.close();
});

const userOneId = new mongoose.Types.ObjectId();
const userTwoId = new mongoose.Types.ObjectId();

id = new mongoose.Types.ObjectId()
id2 = new mongoose.Types.ObjectId()

const userOne = {
    _id: userOneId,
    name: "Amr Zaki",
    username: "zikaaaaa",
    birth_date: "2000-01-01T00:00:00.000Z",
    email: "zika@gmail.com",
    password: "myPassw@ord123",
    gender: "Male",
    tokens: [{ token: jwt.sign({ _id: userOneId }, " " + process.env.JWT_SECRET) }],
    isVerified: true
}

const userTwo = {
    _id: userTwoId,
    name: "Ahmed Elgarf",
    username: "elgarf",
    birth_date: "1999-10-10T00:00:00.000Z",
    email: "elgarf@gmail.com",
    password: "TTFTTSTTD",
    gender: "Male",
    tokens: [{ token: jwt.sign({ _id: userTwoId }, " " + process.env.JWT_SECRET) }],
    isVerified: true
}

/*const userOne = {
    _id: id,
    name: "Amr Zaki",
    username: "zikaaaaa",
    birth_date: "2000-01-01T00:00:00.000Z",
    email: "zika@gmail.com",
    password: "myPassw@ord123",
    followers: [id2],
    followings: [id2],
    gender:"Male",
    tokens: [{ token: jwt.sign({ _id: id }, " "+ process.env.JWT_SECRET) }],
    isVerified:true
}

const userTwo = {
    _id: id2,
    name: "Ahmed Elgarf",
    username: "elgarf",
    birth_date: "1999-10-10T00:00:00.000Z",
    email: "elgarf@gmail.com",
    password: "TTFTTSTTD",
    followers: [id],
    followings: [id],
    gender:"Male",
    tokens: [{ token: jwt.sign({ _id: id2 }, " "+process.env.JWT_SECRET) }],
    isVerified:true
}*/

async function getUser  (username_email) {
    const user = await User.find({
      $or: [{ email: username_email }, { username: username_email }],
    });
    if (user[0]) {
      return new User(user[0]);
    } else {
      return null;
    }
  };

/*const tweet1 = {
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

const userOne = {
    _id: id2,
    name:"Amr Zaki",
    username: "zikaaaaaa",
    dateOfBirth: "2000-01-01T00:00:00.000Z",
    email: "zika@gmail.com",
    password: "myPassw@ord123",
}*/

/*beforeEach(async () => {
    //await User.deleteMany({});
    //await new User(userOne).save();
    //await new User(userTwo).save();
    //await Tweets.deleteMany({});
    
});*/

/*test("Should get following list", async () => {
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
        .set("Authorization", Bearer  + user.tokens[0].token)
        .send()
        .expect(200);
});*/

test('post a tweet' , async()=>{
    /*const signup = await request(app).post("/auth/signup").send({
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

    const user = await getUser("MostafaA");*/

    const signup = await request(app).post("/auth/signup").send({
        email: userOne.email,
        username: userOne.username,
        password: userOne.password,
        name: userOne.name,
        gender: userOne.gender,
        birth_date: userOne.birth_date,
        isVerified: userOne.isVerified
    }).expect(200);

    const login = await request(app)
    .post("/auth/login")
    .send({ email_or_username: userOne.username, password: userOne.password })
    .expect(200);

    const user = await getUser(userOne.username);

    const response = await request(app).post('/status/tweet/post')
    .set("Authorization", "Bearer " + user.tokens[0].token)
    .send({
        content : "this is a tweet"
    }).expect(200);
})

test('get user tweets', async=>{

    const signup = await request(app).post("/auth/signup").send({
        email: userTwo.email,
        username: userTwo.username,
        password: userTwo.password,
        name: userTwo.name,
        gender: userTwo.gender,
        birth_date: userTwo.birth_date,
        isVerified: userTwo.isVerified
    }).expect(200);

    const login = await request(app)
    .post("/auth/login")
    .send({ email_or_username: userTwo.username, password: userTwo.password })
    .expect(200);

    const user = await getUser(userTwo.username);

    const response = await request(app).post("/status/tweets/list/" + userOne.username + "/1/10")
    .set("Authorization", "Bearer " + user.tokens[0].token)
    .send({
        content : "this is a tweet"
    }).expect(200);

})



/*test('getting a tweet and the writing user from the tweet id', async()=>{
    await request(app).get('/status/tweet/' + id).send({}).expect(200)
})

test('getting the tweets by the username', async()=> {
    await request(app).get('/status/tweets/list/' + userOne.username).send({}).expect(200)
})

test('deleting a tweet', async()=>{
    await request(app).delete('/status/tweet/delete').send({
        id:id
    }).expect(200)
})*/