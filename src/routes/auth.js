const express = require("express");
const User = require("../models/user.js");

const router = express.Router();

module.exports = router;

router.post("/auth/signup", async (req, res) => {
  try {
    const user = new User(req.body);

    if (!(await User.checkConflict(user.email, user.username))) {
      
      await user.save();
      const token = await user.generateAuthToken();
      await user.sendVerifyEmail(user.email, user.verificationCode);
      

      res.status(200).send({
        access_token: token,
        user: user,
        token_expiration_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        message: "User Signed up successfully",
      });
    } else {
      res.status(409).send({ error_message: "User already exists" });
    }
  } catch (err) {
    if (err.name == "ValidationError") {
      res.status(400).send(err.toString());
    } else {
      res.status(500).send(err.toString() + "\n" + typeof err);
    }
  }
});
