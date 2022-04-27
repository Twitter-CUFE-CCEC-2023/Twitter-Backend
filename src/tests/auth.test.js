const request = require("supertest");
const app = require("./testApp");
const mongoose = require("mongoose");
const config = require("../config");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

const connectionurl = config.testConnectionString;

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

test("Test: normal user signup", async () => {
  const response = await request(app)
    .post("/auth/signup")
    .send({
      email: "mostafa.abdelbrr@hotmail.com",
      username: "MostafaA",
      password: "myPassw@ord123",
      name: "Mostafa Abdelbrr",
      gender: "male",
      birth_date: "2000-01-01T00:00:00.000Z",
    })
    .expect(200);
});

test("Test: conflict user signup", async () => {
  await request(app)
    .post("/auth/signup")
    .send({
      email: "mostafa.abdelbrr@hotmail.com",
      username: "MostafaA",
      password: "myPassw@ord123",
      name: "Mostafa Abdelbrr",
      gender: "male",
      birth_date: "2000-01-01T00:00:00.000Z",
    })
    .expect(200);
  const response = await request(app)
    .post("/auth/signup")
    .send({
      email: "mostafa.abdelbrr@hotmail.com",
      username: "MostafaA",
      password: "myPassw@ord123",
      name: "Mostafa Abdelbrr",
      gender: "male",
      birth_date: "2000-01-01T00:00:00.000Z",
    })
    .expect(409);
});

test("Test: user signup with missing data", async () => {
  const response = await request(app)
    .post("/auth/signup")
    .send({
      email: "",
      username: "test",
      password: "myPassw@ord123",
      name: "Mostafa Abdelbrr",
      birth_date: "2000-01-01T00:00:00.000Z",
    })
    .expect(400);
});

test("Test: request resending verification code with username.", async () => {
  const signup = await request(app).post("/auth/signup").send({
    email: "mostafa.abdelbrr@hotmail.com",
    username: "MostafaA",
    password: "myPassw@ord123",
    name: "Mostafa Abdelbrr",
    gender: "male",
    birth_date: "2000-01-01T00:00:00.000Z",
  });
  const response = await request(app)
    .post("/auth/resend-verification")
    .send({ email_or_username: "MostafaA" })
    .expect(200);
});

test("Test: request resending verification code with email.", async () => {
  const signup = await request(app).post("/auth/signup").send({
    email: "mostafa.abdelbrr@hotmail.com",
    username: "MostafaA",
    password: "myPassw@ord123",
    name: "Mostafa Abdelbrr",
    gender: "male",
    birth_date: "2000-01-01T00:00:00.000Z",
  });
  const response = await request(app)
    .post("/auth/resend-verification")
    .send({ email_or_username: "mostafa.abdelbrr@hotmail.com" })
    .expect(200);
});

test("Test: request resending verification code with wrong data.", async () => {
  const signup = await request(app).post("/auth/signup").send({
    email: "mostafa.abdelbrr@hotmail.com",
    username: "MostafaA",
    password: "myPassw@ord123",
    name: "Mostafa Abdelbrr",
    gender: "male",
    birth_date: "2000-01-01T00:00:00.000Z",
  });
  const response = await request(app)
    .post("/auth/resend-verification")
    .send({ email_or_username: "hello" })
    .expect(404);
});

test("Test: request resending verification code with missing data.", async () => {
  const signup = await request(app).post("/auth/signup").send({
    email: "mostafa.abdelbrr@hotmail.com",
    username: "MostafaA",
    password: "myPassw@ord123",
    name: "Mostafa Abdelbrr",
    gender: "male",
    birth_date: "2000-01-01T00:00:00.000Z",
  });
  const response = await request(app)
    .post("/auth/resend-verification")
    .send({ email_or_username: "" })
    .expect(400);
});

test("Test: user verification.", async () => {
  const signup = await request(app).post("/auth/signup").send({
    email: "mostafa.abdelbrr@hotmail.com",
    username: "MostafaA",
    password: "myPassw@ord123",
    name: "Mostafa Abdelbrr",
    gender: "male",
    birth_date: "2000-01-01T00:00:00.000Z",
  });
  const user = await getUser("MostafaA");
  const response = await request(app)
    .put("/auth/verify-credentials")
    .send({ id: user._id, verificationCode: user.verificationCode })
    .expect(200);
});

test("Test: user verification - Check DB.", async () => {
  const signup = await request(app).post("/auth/signup").send({
    email: "mostafa.abdelbrr@hotmail.com",
    username: "MostafaA",
    password: "myPassw@ord123",
    name: "Mostafa Abdelbrr",
    gender: "male",
    birth_date: "2000-01-01T00:00:00.000Z",
  });
  const user = await getUser("MostafaA");
  const response = await request(app)
    .put("/auth/verify-credentials")
    .send({ id: user._id, verificationCode: user.verificationCode });
  const verifiedUser = await getUser("MostafaA");
  expect(verifiedUser.isVerified).toBe(true);
});

test("Test: user verification with wrong verification code.", async () => {
  const signup = await request(app).post("/auth/signup").send({
    email: "mostafa.abdelbrr@hotmail.com",
    username: "MostafaA",
    password: "myPassw@ord123",
    name: "Mostafa Abdelbrr",
    gender: "male",
    birth_date: "2000-01-01T00:00:00.000Z",
  });
  const user = await getUser("MostafaA");
  const response = await request(app)
    .put("/auth/verify-credentials")
    .send({ id: user._id, verificationCode: "-1" })
    .expect(401);
});

test("Test: user verification with wrong verification code - Check DB.", async () => {
  const signup = await request(app).post("/auth/signup").send({
    email: "mostafa.abdelbrr@hotmail.com",
    username: "MostafaA",
    password: "myPassw@ord123",
    name: "Mostafa Abdelbrr",
    gender: "male",
    birth_date: "2000-01-01T00:00:00.000Z",
  });
  const user = await getUser("MostafaA");
  const response = await request(app)
    .put("/auth/verify-credentials")
    .send({ id: user._id, verificationCode: "-1" });
  const verifiedUser = await getUser("MostafaA");
  expect(verifiedUser.isVerified).toBe(false);
});

test("Test: user verification with missing data.", async () => {
  const signup = await request(app).post("/auth/signup").send({
    email: "mostafa.abdelbrr@hotmail.com",
    username: "MostafaA",
    password: "myPassw@ord123",
    name: "Mostafa Abdelbrr",
    gender: "male",
    birth_date: "2000-01-01T00:00:00.000Z",
  });
  const user = await getUser("MostafaA");
  const response = await request(app)
    .put("/auth/verify-credentials")
    .send({ id: "", verificationCode: "" })
    .expect(400);
});

test("Test: user login with username.", async () => {
  const signup = await request(app).post("/auth/signup").send({
    email: "mostafa.abdelbrr@hotmail.com",
    username: "MostafaA",
    password: "myPassw@ord123",
    name: "Mostafa Abdelbrr",
    gender: "male",
    birth_date: "2000-01-01T00:00:00.000Z",
  });
  const user = await getUser("MostafaA");
  const verification = await request(app)
    .put("/auth/verify-credentials")
    .send({ id: user._id, verificationCode: user.verificationCode });
  const response = await request(app)
    .post("/auth/login")
    .send({ email_or_username: "MostafaA", password: "myPassw@ord123" })
    .expect(200);
});

test("Test: user login with email.", async () => {
  const signup = await request(app).post("/auth/signup").send({
    email: "mostafa.abdelbrr@hotmail.com",
    username: "MostafaA",
    password: "myPassw@ord123",
    name: "Mostafa Abdelbrr",
    gender: "male",
    birth_date: "2000-01-01T00:00:00.000Z",
  });
  const user = await getUser("MostafaA");
  const verification = await request(app)
    .put("/auth/verify-credentials")
    .send({ id: user._id, verificationCode: user.verificationCode });
  const response = await request(app)
    .post("/auth/login")
    .send({ email_or_username: "MostafaA", password: "myPassw@ord123" })
    .expect(200);
});

test("Test: user login without verification.", async () => {
  const signup = await request(app).post("/auth/signup").send({
    email: "mostafa.abdelbrr@hotmail.com",
    username: "MostafaA",
    password: "myPassw@ord123",
    name: "Mostafa Abdelbrr",
    gender: "male",
    birth_date: "2000-01-01T00:00:00.000Z",
  });
  const user = await getUser("MostafaA");

  const response = await request(app)
    .post("/auth/login")
    .send({ email_or_username: "MostafaA", password: "myPassw@ord123" })
    .expect(401);
});


test("Test: user login with missing data", async () => {
  // jest.setTimeout(10000);
  const signup = await request(app).post("/auth/signup").send({
    email: "mostafa.abdelbrr@hotmail.com",
    username: "MostafaA",
    password: "myPassw@ord123",
    name: "Mostafa Abdelbrr",
    gender: "male",
    birth_date: "2000-01-01T00:00:00.000Z",
  });
  const user = await getUser("MostafaA");
  const verification = await request(app)
    .put("/auth/verify-credentials")
    .send({ id: user._id, verificationCode: user.verificationCode });
  const response = await request(app)
    .post("/auth/login")
    .send({ email_or_username: "", password: "myPassw@ord123" })
    .expect(401);
});

test("Test: user login with wrong passwrod", async () => {
  const signup = await request(app).post("/auth/signup").send({
    email: "mostafa.abdelbrr@hotmail.com",
    username: "MostafaA",
    password: "myPassw@ord123",
    name: "Mostafa Abdelbrr",
    gender: "male",
    birth_date: "2000-01-01T00:00:00.000Z",
  });
  const user = await getUser("MostafaA");
  const verification = await request(app)
    .put("/auth/verify-credentials")
    .send({ id: user._id, verificationCode: user.verificationCode });
  const response = await request(app)
    .post("/auth/login")
    .send({ email_or_username: "MostafaA", password: "yPassw@ord123" })
    .expect(401);
});

test("Test password reset request with username.", async () => {
  const signup = await request(app).post("/auth/signup").send({
    email: "mostafa.abdelbrr@hotmail.com",
    username: "MostafaA",
    password: "myPassw@ord123",
    name: "Mostafa Abdelbrr",
    gender: "male",
    birth_date: "2000-01-01T00:00:00.000Z",
  });

  const response = await request(app)
    .post("/auth/send-reset-password")
    .send({ email_or_username: "MostafaA" })
    .expect(200);
});

test("Test password reset request with email.", async () => {
  const signup = await request(app).post("/auth/signup").send({
    email: "mostafa.abdelbrr@hotmail.com",
    username: "MostafaA",
    password: "myPassw@ord123",
    name: "Mostafa Abdelbrr",
    gender: "male",
    birth_date: "2000-01-01T00:00:00.000Z",
  });
  const response = await request(app)
    .post("/auth/send-reset-password")
    .send({ email_or_username: "mostafa.abdelbrr@hotmail.com" })
    .expect(200);
});

test("Test password reset request with incorrect data.", async () => {
  const response = await request(app)
    .post("/auth/send-reset-password")
    .send({ email_or_username: "mostafa.abdelbrr@hotmail.com" })
    .expect(404);
});

test("Test password reset request with incomplete data.", async () => {
  const response = await request(app)
    .post("/auth/send-reset-password")
    .send({ email_or_username: "" })
    .expect(400);
});

test("Test: user password reset with username.", async () => {
  const signup = await request(app).post("/auth/signup").send({
    email: "mostafa.abdelbrr@hotmail.com",
    username: "MostafaA",
    password: "myPassw@ord123",
    name: "Mostafa Abdelbrr",
    gender: "male",
    birth_date: "2000-01-01T00:00:00.000Z",
  });
  const resetRequest = await request(app)
    .post("/auth/send-reset-password")
    .send({ email_or_username: "mostafa.abdelbrr@hotmail.com" });
  const user = await getUser("MostafaA");
  const resetPasswordCode = user.resetPasswordCode;
  const response = await request(app)
    .put("/auth/reset-password")
    .send({
      email_or_username: "MostafaA",
      password: "myPassw@ord123456",
      resetPasswordCode: resetPasswordCode,
    })
    .expect(200);
});

test("Test: user password reset with email.", async () => {
  const signup = await request(app).post("/auth/signup").send({
    email: "mostafa.abdelbrr@hotmail.com",
    username: "MostafaA",
    password: "myPassw@ord123",
    name: "Mostafa Abdelbrr",
    gender: "male",
    birth_date: "2000-01-01T00:00:00.000Z",
  });
  const resetRequest = await request(app)
    .post("/auth/send-reset-password")
    .send({ email_or_username: "mostafa.abdelbrr@hotmail.com" });
  const user = await getUser("MostafaA");
  const resetPasswordCode = user.resetPasswordCode;
  const response = await request(app)
    .put("/auth/reset-password")
    .send({
      email_or_username: "mostafa.abdelbrr@hotmail.com",
      password: "myPassw@ord123456",
      resetPasswordCode: resetPasswordCode,
    })
    .expect(200);
});

test("Test: user password reset with wrong reset code.", async () => {
  const signup = await request(app).post("/auth/signup").send({
    email: "mostafa.abdelbrr@hotmail.com",
    username: "MostafaA",
    password: "myPassw@ord123",
    name: "Mostafa Abdelbrr",
    gender: "male",
    birth_date: "2000-01-01T00:00:00.000Z",
  });
  const resetRequest = await request(app)
    .post("/auth/send-reset-password")
    .send({ email_or_username: "mostafa.abdelbrr@hotmail.com" });
  const user = await getUser("MostafaA");
  const resetPasswordCode = user.resetPasswordCode;
  const response = await request(app)
    .put("/auth/reset-password")
    .send({
      email_or_username: "MostafaA",
      password: "myPassw@ord123456",
      resetPasswordCode: "-1",
    })
    .expect(401);
});

test("Test: user password reset with missing credentials.", async () => {
  const signup = await request(app).post("/auth/signup").send({
    email: "mostafa.abdelbrr@hotmail.com",
    username: "MostafaA",
    password: "myPassw@ord123",
    name: "Mostafa Abdelbrr",
    gender: "male",
    birth_date: "2000-01-01T00:00:00.000Z",
  });
  const resetRequest = await request(app)
    .post("/auth/send-reset-password")
    .send({ email_or_username: "mostafa.abdelbrr@hotmail.com" });
  const user = await getUser("MostafaA");
  const resetPasswordCode = user.resetPasswordCode;
  const response = await request(app)
    .put("/auth/reset-password")
    .send({
      email_or_username: "",
      password: "myPassw@ord123456",
      resetPasswordCode: "-1",
    })
    .expect(400);
});

test("Test: update user password.", async () => {
  const signup = await request(app).post("/auth/signup").send({
    email: "mostafa.abdelbrr@hotmail.com",
    username: "MostafaA",
    password: "myPassw@ord123",
    name: "Mostafa Abdelbrr",
    gender: "male",
    birth_date: "2000-01-01T00:00:00.000Z",
  });
  const login = await request(app)
    .post("/auth/login")
    .send({ email_or_username: "MostafaA", password: "myPassw@ord123" });
  const user = await getUser("MostafaA");
  const response = await request(app)
    .put("/auth/update-password")
    .set("Authorization", "Bearer " + user.tokens[0].token)
    .send({
      password: "myPassw@ord123",
      new_password: "myPassword@123",
    })
    .expect(200);
});

test("Test: update user password - check password in DB.", async () => {
  const signup = await request(app).post("/auth/signup").send({
    email: "mostafa.abdelbrr@hotmail.com",
    username: "MostafaA",
    password: "myPassw@ord123",
    name: "Mostafa Abdelbrr",
    gender: "male",
    birth_date: "2000-01-01T00:00:00.000Z",
  });
  const login = await request(app)
    .post("/auth/login")
    .send({ email_or_username: "MostafaA", password: "myPassw@ord123" });
  const user = await getUser("MostafaA");
  const newPassword = "myPassword@123";
  const response = await request(app)
    .put("/auth/update-password")
    .set("Authorization", "Bearer " + user.tokens[0].token)
    .send({
      password: "myPassw@ord123",
      new_password: newPassword,
    });
  const newUser = await getUser("MostafaA");
  const hashedPassword = await bcrypt.hash(newPassword, 12);
  expect(newUser.password).toBe(hashedPassword);
});

test("Test: user password update without login.", async () => {
  const response = await request(app)
    .put("/auth/update-password")
    .send({
      password: "myPassw@ord123",
      new_password: "myPassword@123",
    })
    .expect(401);
});

test("Test: user password update with missing data.", async () => {
  const signup = await request(app).post("/auth/signup").send({
    email: "mostafa.abdelbrr@hotmail.com",
    username: "MostafaA",
    password: "myPassw@ord123",
    name: "Mostafa Abdelbrr",
    gender: "male",
    birth_date: "2000-01-01T00:00:00.000Z",
  });
  const login = await request(app)
    .post("/auth/login")
    .send({ email_or_username: "MostafaA", password: "myPassw@ord123" });
  const user = await getUser("MostafaA");
  const response = await request(app)
    .put("/auth/update-password")
    .set("Authorization", "Bearer " + user.tokens[0].token)
    .send({
      password: "myPassw@ord123",
      new_password: "myPassword@123",
    })
    .expect(401);
});
