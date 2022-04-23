const express = require("express");
const User = require("../models/user.js");
const auth = require("../middleware/auth");

const router = express.Router();

module.exports = router;

router.post("/auth/signup", async (req, res) => {
  try {
    const user = new User(req.body);

    if (!(await User.checkConflict(user.email, user.username))) {
      await user.save();
      // const token = await user.generateAuthToken();
      await user.sendVerifyEmail(user.email, user.verificationCode);

      res.status(200).send({
        // access_token: token,
        user: user,
        // token_expiration_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
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

// login route
router.post("/auth/login", async (req, res) => {
  const user = await User.verifyCreds(
    req.body.email_or_username,
    req.body.password
  );
  try {
    if (user) {
      const token = { "token": await user.generateAuthToken() }.toString();
      user.tokens.push({token});
      await User.updateOne({ _id: user._id }, { $set: { tokens: user.tokens } });
      res.status(200).send({
        access_token: token,
        user: user,
        role: user.role,
        token_expiration_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        message: "User logged in successfully",
      });
    } else {
      res
        .status(401)
        .send({ message: "The enetered credentials are invalid." });
    }
  } catch (err) {
    res
      .status(500)
      .send({
        message:
          "The server encountered an unexpected condition which prevented it from fulfilling the request.",
      });
  }
});

router.post("/auth/send-reset-password", async (req, res) => {
  try {
    if (req.body.email_or_username) {
      const user = await User.getUserByUsernameOrEmail(req.body.email_or_username);
      if (user) {
        const resetPasswordCode = await User.generateResetPasswordCode();
        user.resetPasswordCode = resetPasswordCode;
        user.resetPasswordCodeExpiration = new Date(Date.now() + 24 * 60 * 60 * 1000);
        await User.updateOne({_id:user._id}, {resetPasswordCode: user.resetPasswordCode, resetPasswordCodeExpiration: user.resetPasswordCodeExpiration});
        await user.sendVerifyResetEmail(user.email, user.resetPasswordCode);
        res.status(200).send({
          message: "Reset password email has been sent successfully.",
        });
      } else {
        res
          .status(404)
          .send({ message: "User email and username are not found." });
      }
    } else {
      res.status(400).send({
        message:
          "The server cannot or will not process the request due to something that is perceived to be a client error",
      });
    }
  } catch (err) {
    res.status(500).send({
      message:
        "The server encountered an unexpected condition which prevented it from fulfilling the request.",
    });
  }
});

// Reset password
router.put("/auth/reset-password", async (req, res) => {
  try {
    const user = await User.getUserByUsernameOrEmail(req.body.email_or_username);
    if (user) {
      if (user.resetPasswordCode == req.body.resetPasswordCode) {
        user.password = req.body.password;
        await user.save();
        // await user.sendVerifyResetEmail(user.email, user.verificationCode);

        res
          .status(200)
          .send({ message: "Password has been updated successfully." });
      } else {
        res.status(401).send({ message: "The verification code is invalid." });
      }
    } else {
      res
        .status(400)
        .send({
          message:
            "The server cannot or will not process the request due to something that is perceived to be a client error.",
        });
    }
  } catch (err) {
    res
      .status(500)
      .send({
        message:
          "The server encountered an unexpected condition which prevented it from fulfilling the request.",
      });
  }
});

router.put("/auth/update-password", auth, async (req, res) => {
  try {
    const user = req.user;
    if (user) {
      user.password = req.body.new_password;
      await user.save();

      res
        .status(200)
        .send({ message: "Password has been updated successfully." });
    } else {
      res.status(401).send({ message: "Wrong credentials." });
    }
  } catch (err) {
    res.status(500).send({
      message:
        "The server encountered an unexpected condition which prevented it from fulfilling the request.",
    });
  }
});
