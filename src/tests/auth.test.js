const request = require("supertest");
const app = require("./testApp");
const mongoose = require("mongoose");
const config = require("../config");
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
});

afterAll(() => {
  mongoose.connection.close();
});

test("Testing normal user signup", async () => {
  const response = await request(app)
    .post("/auth/signup")
    .send({
      email: "mostafa.abdelbrr@hotmail.com",
      username: "MostafaA",
      password: "myPassw@ord123",
      name: "Mostafa Abdelbrr",
      dateOfBirth: "2000-01-01T00:00:00.000Z",
    })
    .expect(200);
});

test("Testing conflict user signup", async () => {
  await request(app)
    .post("/auth/signup")
    .send({
      email: "mostafa.abdelbrr@hotmail.com",
      username: "MostafaA",
      password: "myPassw@ord123",
      name: "Mostafa Abdelbrr",
      dateOfBirth: "2000-01-01T00:00:00.000Z",
    })
    .expect(200);
  const response = await request(app)
    .post("/auth/signup")
    .send({
      email: "mostafa.abdelbrr@hotmail.com",
      username: "MostafaA",
      password: "myPassw@ord123",
      name: "Mostafa Abdelbrr",
      dateOfBirth: "2000-01-01T00:00:00.000Z",
    })
    .expect(409);
});

test("Testing user signup with missing data", async () => {
  const response = await request(app)
    .post("/auth/signup")
    .send({
      email: "",
      username: "test",
      password: "myPassw@ord123",
      name: "Mostafa Abdelbrr",
      dateOfBirth: "2000-01-01T00:00:00.000Z",
    })
    .expect(400);
});

test("Testing user login with username", async () => {
  const signup = await request(app).post("/auth/signup").send({
    email: "mostafa.abdelbrr@hotmail.com",
    username: "MostafaA",
    password: "myPassw@ord123",
    name: "Mostafa Abdelbrr",
    dateOfBirth: "2000-01-01T00:00:00.000Z",
  });
  const response = await request(app)
    .post("/auth/login")
    .send({ email_or_username: "MostafaA", password: "myPassw@ord123" })
    .expect(200);
});

test("Testing user login with email", async () => {
  const signup = await request(app).post("/auth/signup").send({
    email: "mostafa.abdelbrr@hotmail.com",
    username: "MostafaA",
    password: "myPassw@ord123",
    name: "Mostafa Abdelbrr",
    dateOfBirth: "2000-01-01T00:00:00.000Z",
  });
  const response = await request(app)
    .post("/auth/login")
    .send({ email_or_username: "MostafaA", password: "myPassw@ord123" })
    .expect(200);
});

test("Testing user login with missing data", async () => {
  // jest.setTimeout(10000);
  const signup = await request(app).post("/auth/signup").send({
    email: "mostafa.abdelbrr@hotmail.com",
    username: "MostafaA",
    password: "myPassw@ord123",
    name: "Mostafa Abdelbrr",
    dateOfBirth: "2000-01-01T00:00:00.000Z",
  });
  const response = await request(app)
    .post("/auth/login")
    .send({ email_or_username: "", password: "myPassw@ord123" })
    .expect(401);
});

test("Testing user login with wrong passwrod", async () => {
  const signup = await request(app).post("/auth/signup").send({
    email: "mostafa.abdelbrr@hotmail.com",
    username: "MostafaA",
    password: "myPassw@ord123",
    name: "Mostafa Abdelbrr",
    dateOfBirth: "2000-01-01T00:00:00.000Z",
  });
  const response = await request(app)
    .post("/auth/login")
    .send({ email_or_username: "MostafaA", password: "yPassw@ord123" })
    .expect(401);
});

test("Testing user password reset with username.", async () => {
const signup = await request(app).post("/auth/signup").send({
  email: "mostafa.abdelbrr@hotmail.com",
  username: "MostafaA",
  password: "myPassw@ord123",
  name: "Mostafa Abdelbrr",
  dateOfBirth: "2000-01-01T00:00:00.000Z",
});
  const user = await User.verifyCreds("MostafaA", "myPassw@ord123");
  const token = user.verificationCode;
  const response = await request(app)
    .post("/auth/reset-password")
    .send({
      email_or_username: "MostafaA",
      password: "myPassw@ord123456",
      verificationCode: token,
    })
    .expect(200);
});

test("Testing user password reset with email.", async () => {
  const signup = await request(app).post("/auth/signup").send({
    email: "mostafa.abdelbrr@hotmail.com",
    username: "MostafaA",
    password: "myPassw@ord123",
    name: "Mostafa Abdelbrr",
    dateOfBirth: "2000-01-01T00:00:00.000Z",
  });
  const user = await User.verifyCreds("MostafaA", "myPassw@ord123");
  const token = user.verificationCode;
  const response = await request(app)
    .post("/auth/reset-password")
    .send({
      email_or_username: "mostafa.abdelbrr@hotmail.com",
      password: "myPassw@ord123456",
      verificationCode: token,
    })
    .expect(200);
});

test("Testing user password reset with wrong verification code.", async () => {
  const signup = await request(app).post("/auth/signup").send({
    email: "mostafa.abdelbrr@hotmail.com",
    username: "MostafaA",
    password: "myPassw@ord123",
    name: "Mostafa Abdelbrr",
    dateOfBirth: "2000-01-01T00:00:00.000Z",
  });
  const user = await User.verifyCreds("MostafaA", "myPassw@ord123");
  const token = user.verificationCode;
  const response = await request(app)
    .post("/auth/reset-password")
    .send({
      email_or_username: "MostafaA",
      password: "myPassw@ord123456",
      verificationCode: "-1",
    })
    .expect(401);
});

test("Testing user password reset with missing credentials.", async () => {
  const signup = await request(app).post("/auth/signup").send({
    email: "mostafa.abdelbrr@hotmail.com",
    username: "MostafaA",
    password: "myPassw@ord123",
    name: "Mostafa Abdelbrr",
    dateOfBirth: "2000-01-01T00:00:00.000Z",
  });
  const user = await User.verifyCreds("MostafaA", "myPassw@ord123");
  const token = user.verificationCode;
  const response = await request(app)
    .post("/auth/reset-password")
    .send({
      email_or_username: "",
      password: "myPassw@ord123456",
      verificationCode: "-1",
    })
    .expect(400);
});

test("Testing user password update with email.", async () => {
  const signup = await request(app).post("/auth/signup").send({
    email: "mostafa.abdelbrr@hotmail.com",
    username: "MostafaA",
    password: "myPassw@ord123",
    name: "Mostafa Abdelbrr",
    dateOfBirth: "2000-01-01T00:00:00.000Z",
  });
  const response = await request(app)
    .post("/auth/update-password")
    .send({
      email_or_username: "mostafa.abdelbrr@hotmail.com",
      password: "myPassw@ord123",
      new_password: "myPassword@123",
    })
    .expect(200);
});

test("Testing user password update with username.", async () => {
  const signup = await request(app).post("/auth/signup").send({
    email: "mostafa.abdelbrr@hotmail.com",
    username: "MostafaA",
    password: "myPassw@ord123",
    name: "Mostafa Abdelbrr",
    dateOfBirth: "2000-01-01T00:00:00.000Z",
  });
  const response = await request(app)
    .post("/auth/update-password")
    .send({
      email_or_username: "MostafaA",
      password: "myPassw@ord123",
      new_password: "myPassword@123",
    })
    .expect(200);
});

test("Testing user password update with wrong password.", async () => {
  const signup = await request(app).post("/auth/signup").send({
    email: "mostafa.abdelbrr@hotmail.com",
    username: "MostafaA",
    password: "myPassw@ord123",
    name: "Mostafa Abdelbrr",
    dateOfBirth: "2000-01-01T00:00:00.000Z",
  });
  const response = await request(app)
    .post("/auth/update-password")
    .send({
      email_or_username: "MostafaA",
      password: "myPassw@ord1234",
      new_password: "myPassword@123",
    })
    .expect(401);
});

test("Testing user password update with missing data.", async () => {
  const signup = await request(app).post("/auth/signup").send({
    email: "mostafa.abdelbrr@hotmail.com",
    username: "MostafaA",
    password: "myPassw@ord123",
    name: "Mostafa Abdelbrr",
    dateOfBirth: "2000-01-01T00:00:00.000Z",
  });
  const response = await request(app)
    .post("/auth/update-password")
    .send({
      email_or_username: "",
      password: "myPassw@ord123",
      new_password: "myPassword@123",
    })
    .expect(401);
});