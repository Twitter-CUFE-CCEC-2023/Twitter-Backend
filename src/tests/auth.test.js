const request = require("supertest");
const app = require("./testApp");
const mongoose = require("mongoose");
const config = require("../config");
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

test("Testing conflcit user signup", async () => {
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
