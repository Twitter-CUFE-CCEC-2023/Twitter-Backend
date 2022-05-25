const request = require("supertest");
const app = require("./testApp");
const mongoose = require("mongoose");
const config = require("../config");
const banUser = require("../models/banUser")
const User = require("../models/user");


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

test('get a user by loactaion', async()=>{
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
    
    const User1 = await User.findOne({id: userTwo.id});

    await request(app)
    .post('/dashboard/users')
    .set("Authorization", "Bearer " + user.tokens[0].token)
    .send({
        location: User1.location
    }).expect(200)
});

/*test('ban user', async()=>{
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

    const User1 = await User.findOne({id: userTwo.id});


    await request(app)
    .post('/dashboard/ban')
    .set("Authorization", "Bearer " + user.tokens[0].token)
    .send({
        userId: User1.id,
        isBanned: false,
        banDuration: 2,
        reason: "ay 7aga",
        isPermanent: false
    }).expect(200)
})*/

/*test('unban user', async()=>{
    await request(app).post('/dashboard/unban').send({
        userId: id
    }).expect(200)
})
*/

test('retweets dashboard',async()=>{
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

    const User1 = await User.findOne({id: userTwo.id});

    await request(app)
    .post('/dashboard/retweets')
    .set("Authorization", "Bearer " + user.tokens[0].token)
    .expect(200);

})

test('likes dashboard',async()=>{
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

    const User1 = await User.findOne({id: userTwo.id});

    await request(app)
    .post('/dashboard/likes')
    .set("Authorization", "Bearer " + user.tokens[0].token)
    .expect(200);

})

test('tweets dashboard',async()=>{
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

    const User1 = await User.findOne({id: userTwo.id});

    await request(app)
    .post('/dashboard/tweets')
    .set("Authorization", "Bearer " + user.tokens[0].token)
    .expect(200);

})
