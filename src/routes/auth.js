const express = require("express");
const User = require("../models/user.js");
const auth = require("../middleware/auth");
const config = require("../config");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const NotificationSubscription = require("../models/notificationsSub");
const cookieParser = require("cookie-parser");

const router = express.Router();

module.exports = router;

router.use(cookieParser("twittercloneteamone"));
router.use(passport.initialize());
// router.use(passport.session());

passport.use(
  new GoogleStrategy(
    {
      clientID: config.googleClientID,
      clientSecret: config.googleClientSecret,
      callbackURL: "https://backlb.twittercloneteamone.tk/auth/google/callback",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, cb) => {
      try {
        req.user = await User.googleAuth(profile);
        return cb(null, profile);
      } catch (err) {
        //return cb(err, profile);
        return cb(null, profile);
      }
    }
  )
);

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["openid", "email", "profile"],
    session: false,
  })
);

router.get(
  "/auth/google/callback",

  passport.authenticate("google", { session: false }),
  async (req, res) => {
    try {
      const user = new User(req.user);
      if (user) {
        const token = await user.generateAuthToken();
        const authTokenInfo = { token: token };
        if (req.body.remember_me) {
          authTokenInfo["token_expiration_date"] = new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
          );
        } else {
          authTokenInfo["token_expiration_date"] = new Date(
            new Date().setHours(new Date().getHours() + 24)
          );
        }
        user.tokens = user.tokens.concat(authTokenInfo);
        await User.updateOne(
          { _id: user._id },
          { $set: { tokens: user.tokens } }
        );

        const userObj = await User.generateUserObject(user);
        res.cookie(
          "res",
          {
            access_token: token,
            user: userObj,
            token_expiration_date: authTokenInfo["token_expiration_date"],
            message: "User logged in successfully",
            status: 200,
          },
          { domain: ".twittercloneteamone.tk" }
        );
        res.redirect("http://localhost:3000/GoogleRedirect");
      } else {
        req.cookie(
          "res",
          {
            status: 401,
            message: "The enetered credentials are invalid.",
          },
          { domain: ".twittercloneteamone.tk" }
        );
        res.redirect("http://localhost:3000/GoogleRedirect");
      }
    } catch (err) {
      req.cookie(
        "res",
        {
          status: 500,
          message:
            "The server encountered an unexpected condition which prevented it from fulfilling the request.",
        },
        { domain: ".twittercloneteamone.tk" }
      );
      res.status(500).send({
        message:
          "The server encountered an unexpected condition which prevented it from fulfilling the request.",
      });
    }
  }
);

router.post("/auth/signup", async (req, res) => {
  try {
    const user = new User(req.body);

    if (!(await User.checkConflict(user.email, user.username))) {
      const savedUser = await user.save();
      if (!savedUser) {
        return res.status(400).send({ error: "User not saved" });
      }

      if (!req.body.password) {
        await user.sendVerifyEmail(user.email, user.verificationCode);
      }
      const userObj = await User.generateUserObject(savedUser);
      res.status(200).send({
        user: userObj,
        message: "User Signed up successfully",
      });
    } else {
      const user = await User.getUserByUsernameOrEmail(req.body.email);
      if (req.body.password && !user.password) {
        user.password = req.body.password;
        const savedUser = await user.save();
        if (!savedUser) {
          return res.status(400).send({ error: "User not saved" });
        } else {
          const userObj = await User.generateUserObject(savedUser);
          res.status(200).send({
            user: userObj,
            message: "Sign up is complete and password was added successfully",
          });
        }
      } else {
        res.status(409).send({ message: "User already exists" });
      }
    }
  } catch (err) {
    if (err.name == "ValidationError") {
      res.status(400).send(err.toString());
    } else {
      res.status(500).send(err.toString());
    }
  }
});

router.post("/auth/resend-verification", async (req, res) => {
  try {
    if (req.body.email_or_username) {
      const user = await User.getUserByUsernameOrEmail(
        req.body.email_or_username
      );
      if (user) {
        await user.sendVerifyEmail(user.email, user.verificationCode);
        res.status(200).send({ message: "Verification email sent" });
      } else {
        res.status(404).send({ error_message: "User not found." });
      }
    } else {
      res.status(400).send({
        error_message:
          "The server cannot or will not process the request due to something that is perceived to be a client error",
      });
    }
  } catch (err) {
    res.status(500).send({
      error_message:
        "The server encountered an unexpected condition which prevented it from fulfilling the request.",
    });
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
      const token = await user.generateAuthToken();
      const authTokenInfo = { token: token };
      if (req.body.remember_me) {
        authTokenInfo["token_expiration_date"] = new Date(
          Date.now() + 7 * 24 * 60 * 60 * 1000
        );
      } else {
        authTokenInfo["token_expiration_date"] = new Date(
          new Date().setHours(new Date().getHours() + 24)
        );
      }
      user.tokens = user.tokens.concat(authTokenInfo);
      await User.updateOne(
        { _id: user._id },
        { $set: { tokens: user.tokens } }
      );

      //remove all user related notification subs to avoid expired subscriptions
      await NotificationSubscription.deleteMany({ user: user._id });

      const userObj = await User.generateUserObject(user);
      res.status(200).send({
        access_token: token,
        user: userObj,
        token_expiration_date: authTokenInfo["token_expiration_date"],
        message: "User logged in successfully",
      });
    } else {
      res
        .status(401)
        .send({ message: "The enetered credentials are invalid." });
    }
  } catch (err) {
    res.status(500).send({
      message:
        "The server encountered an unexpected condition which prevented it from fulfilling the request.",
    });
  }
});
router.post("/auth/send-reset-password", async (req, res) => {
  try {
    if (req.body.email_or_username) {
      const user = await User.getUserByUsernameOrEmail(
        req.body.email_or_username
      );
      if (user) {
        const resetPasswordCode = await User.generateResetPasswordCode();
        user.resetPasswordCode = resetPasswordCode;
        user.resetPasswordCodeExpiration = new Date(
          Date.now() + 24 * 60 * 60 * 1000
        );
        await User.updateOne(
          { _id: user._id },
          {
            resetPasswordCode: user.resetPasswordCode,
            resetPasswordCodeExpiration: user.resetPasswordCodeExpiration,
          }
        );
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
    const user = await User.getUserByUsernameOrEmail(
      req.body.email_or_username
    );
    if (user) {
      if (
        user.resetPasswordCode == req.body.resetPasswordCode &&
        user.resetPasswordCodeExpiration > Date.now() &&
        req.body.password
      ) {
        user.password = req.body.password;
        await user.save();
        // await user.sendVerifyResetEmail(user.email, user.verificationCode);

        res
          .status(200)
          .send({ message: "Password has been updated successfully." });
      } else if (
        user.resetPasswordCode == req.body.resetPasswordCode &&
        user.resetPasswordCodeExpiration > Date.now() &&
        !req.body.password
      ) {
        res
          .status(200)
          .send({ message: "Verification code is correct." });
      } else {
        res.status(401).send({ message: "The verification code is invalid." });
      }
    } else {
      res.status(400).send({
        message:
          "The server cannot or will not process the request due to something that is perceived to be a client error.",
      });
    }
  } catch (err) {
    res.status(500).send({
      message:
        "The server encountered an unexpected condition which prevented it from fulfilling the request.",
    });
  }
});

router.put("/auth/update-password", auth, async (req, res) => {
  try {
    const user = req.user;
    const verifiedUser = await User.verifyCreds(user.email, req.body.old_password);
    if (verifiedUser) {
      user.password = req.body.new_password;
      await user.save();
      res
        .status(200)
        .send({ message: "Password has been updated successfully." });
    } else {
      res.status(401).send({ message: "Wrong credentials or invalid token" });
    }
  } catch (err) {
    res.status(500).send({
      message:
        err.toString(),
    });
  }
});

router.put("/auth/verify-credentials", async (req, res) => {
  try {
    if (req.body.email_or_username && req.body.verificationCode) {
      const user = await User.findOne({
        $or: [
          { email: req.body.email_or_username },
          { username: req.body.email_or_username },
        ],
      });
      if (user) {
        if (
          user.verificationCode == req.body.verificationCode &&
          new Date() < user.verificationCodeExpiration
        ) {
          const userVerified = await User.findByIdAndUpdate(
            { _id: user._id },
            { $set: { isVerified: true } },
            {
              new: true,
            }
          );
          if (!userVerified) {
            throw new Error();
          }
          const userObj = await User.generateUserObject(userVerified);
          res.status(200).send({
            user: userObj,
            message: "User verified successfully.",
          });
        } else {
          res
            .status(401)
            .send({ message: "The verification code is invalid." });
        }
      }
    } else {
      res.status(400).send({
        message:
          "The server cannot or will not process the request due to something that is perceived to be a client error.",
      });
    }
  } catch (err) {
    res.status(500).send({
      message:
        "The server encountered an unexpected condition which prevented it from fulfilling the request.",
    });
  }
});
