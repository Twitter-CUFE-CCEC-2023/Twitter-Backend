const express = require("express");
const router = express.Router();
const notificationModel = require("./../models/notification.js");
const tweetModel = require("./../models/tweet");
const userModel = require("./../models/user");
const auth = require("../middleware/auth");
require("./../models/constants/notificationType.js");

router.get("/notifications/list", auth, async (req, res) => {
  try {
    const user = req.user;
    const username = user["username"];
    let count = 10;

    if (isNaN(req.body.page) || req.body.page <= 0) {
      return res.status(400).send({ message: "Invalid page number" });
    }

    if (!isNaN(req.body.count) && req.body.count >= 0) {
      count = req.body.count;
    }

    const page = parseInt(req.body.page);
    const result = await notificationModel
      .find({ userId: user._id })
      .sort({ createdAt: -1 })
      .skip(count * (page - 1))
      .limit(count)
      .populate({
        path: "relatedUserId",
      })
      .populate({
        path: "notificationTypeId",
      })
      .populate({
        path: "tweetId",
      });

    if (!result) {
      res.status(404).send({ error_message: "Notifications not found" });
    }

    const notifications = [];
    for (let i = 0; i < result.length; i++) {
      const notificationObject = await notificationModel.getNotificationObject(
        result[i]
      );
      notifications.push(notificationObject);
    }
    res.status(200).send({ notifications: notifications });
  } catch (err) {
    res.status(500).send(err.toString());
  }
});

router.get("/follower/list/:username", auth, async (req, res) => {
  const _username = req.params.username;
  let count = 10;

  try {
    if (isNaN(req.body.page) || req.body.page <= 0) {
      return res.status(400).send({ message: "Invalid page number" });
    }

    if (!isNaN(req.body.count) && req.body.count >= 0) {
      count = req.body.count;
    }

    const page = parseInt(req.body.page);
    const user = await userModel.findOne({
      username: _username,
    });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const userFollowers = await userModel
      .findOne({
        username: _username,
      })
      .select("followers -_id")
      .populate({
        path: "followers",
      })
      .skip(count * (page - 1))
      .limit(count);

    if (!userFollowers) {
      return res.status(404).send({ message: "Followers not found" });
    }

    const followers = [];
    for (let i = 0; i < userFollowers.followers.length; i++) {
      const userFollower = await userModel.generateUserObject(
        userFollowers.followers[i]
      );
      followers.push(userFollower);
    }
    res.status(200).send({ followers: followers });
  } catch (error) {
    res.status(500).send("Internal server Error");
  }
});

router.get("/following/list/:username", auth, async (req, res) => {
  const _username = req.params.username;
  let count = 10;

  try {
    if (isNaN(req.body.page) || req.body.page <= 0) {
      return res.status(400).send({ message: "Invalid page number" });
    }

    if (!isNaN(req.body.count) && req.body.count >= 0) {
      count = req.body.count;
    }

    const page = parseInt(req.body.page);
    const user = await userModel.findOne({
      username: _username,
    });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const userFollowings = await userModel
      .findOne({
        username: _username,
      })
      .select("followings -_id")
      .populate({
        path: "followings",
      })
      .skip(count * (page - 1))
      .limit(count);

    if (!userFollowings) {
      return res.status(404).send({ message: "Followings not found" });
    }

    const followings = [];
    for (let i = 0; i < userFollowings.followings.length; i++) {
      const userFollowing = await userModel.generateUserObject(
        userFollowings.followings[i]
      );
      followings.push(userFollowing);
    }
    res.status(200).send({ followings: followings });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

module.exports = router;
