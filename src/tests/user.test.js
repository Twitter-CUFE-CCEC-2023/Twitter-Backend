const request = require("supertest");
const jwt = require("jsonwebtoken");
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


  afterAll(() => {
    mongoose.connection.close();
  });


  test("Should get following list", async () => {
    const response = await request(app)
      .get("/following/list/:amrzaki")
      .send()
      .expect(200);
  });
  