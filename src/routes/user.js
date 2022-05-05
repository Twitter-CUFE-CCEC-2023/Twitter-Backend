const express = require("express");
const router = express.Router();
const notificationModel = require("./../models/notification.js");
const tweetModel = require("./../models/tweet");
const userModel = require("./../models/user.js");
const Like = require("../models/like");
const auth = require("../middleware/auth");
const UserVapidKeys = require("../models/userVapidKeys");
const NotificationSubscription = require("../models/notificationsSub");
const { detect } = require("detect-browser");
require("./../models/constants/notificationType.js");

const browser = detect();

router.get("/notifications/list/:page?/:count?", auth, async (req, res) => {
  try {
    const user = req.user;
    if (
      req.params.page != undefined &&
      (isNaN(req.params.page) || req.params.page <= 0)
    ) {
      return res.status(400).send({ message: "Invalid page number" });
    }
    if (
      (isNaN(req.params.count) || req.params.count <= 0) &&
      req.params.count != undefined
    ) {
      return res.status(400).send({ message: "Invalid count per page number" });
    }
    const count =
      req.params.count != undefined ? parseInt(req.params.count) : 10;
    const page = req.params.page != undefined ? parseInt(req.params.page) : 1;

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

router.get(
  "/follower/list/:username/:page?/:count?",
  auth,
  async (req, res) => {
    try {
      const _username = req.params.username;
      if (
        req.params.page != undefined &&
        (isNaN(req.params.page) || req.params.page <= 0)
      ) {
        return res.status(400).send({ message: "Invalid page number" });
      }
      if (
        (isNaN(req.params.count) || req.params.count <= 0) &&
        req.params.count != undefined
      ) {
        return res
          .status(400)
          .send({ message: "Invalid count per page number" });
      }
      const count =
        req.params.count != undefined ? parseInt(req.params.count) : 10;
      const page = req.params.page != undefined ? parseInt(req.params.page) : 1;

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
        userFollower.is_followed = req.user.followings.includes(
          userFollower.id
        );
        followers.push(userFollower);
      }
      res.status(200).send({ followers: followers });
    } catch (error) {
      res.status(500).send("Internal server Error");
    }
  }
);

router.get(
  "/following/list/:username/:page?/:count?",
  auth,
  async (req, res) => {
    try {
      const _username = req.params.username;
      if (
        req.params.page != undefined &&
        (isNaN(req.params.page) || req.params.page <= 0)
      ) {
        return res.status(400).send({ message: "Invalid page number" });
      }
      if (
        (isNaN(req.params.count) || req.params.count <= 0) &&
        req.params.count != undefined
      ) {
        return res
          .status(400)
          .send({ message: "Invalid count per page number" });
      }
      const count =
        req.params.count != undefined ? parseInt(req.params.count) : 10;
      const page = req.params.page != undefined ? parseInt(req.params.page) : 1;

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
        userFollowing.is_followed = req.user.followings.includes(
          userFollowing.id
        );
        followings.push(userFollowing);
      }
      res.status(200).send({ followings: followings });
    } catch (error) {
      res.status(500).send({ message: "Internal Server Error" });
    }
  }
);

router.get("/info/:username", auth, async (req, res) => {
  const _username = req.params.username;
  try {
    if (_username === req.user.username) {
      const userObj = await userModel.generateUserObject(req.user);
      return res.status(200).send({ user: userObj });
    }
    const user = await userModel.findOne({
      username: _username,
    });
    if (!user) {
      return res.status(404).send({ error_message: "User not found" });
    }
    const userObj = await userModel.generateUserObject(user);
    res.status(200).send({ user: userObj });
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

router.post("/user/follow", auth, async (req, res) => {
  const user1 = req.user;
  const user2 = await userModel.findOne({
    username: req.body.username,
  });
  if (!user2) {
    return res.status(404).send({ error_message: "User not found" });
  }
  if (user1._id == user2._id) {
    return res.status(400).send({ error: "You cannot follow yourself" });
  }
  if (user1.followings.includes(user2._id)) {
    return res
      .status(400)
      .send({ error: "You are already following this user" });
  }
  try {
    const _followeruser = user1.followings.concat(user2._id);
    const _followinguser = user2.followers.concat(user1._id);
    const followerUser = await userModel.findByIdAndUpdate(
      user1._id,
      { followings: _followeruser },
      { new: true, runValidators: true }
    );
    const followingUser = await userModel.findByIdAndUpdate(
      user2._id,
      { followers: _followinguser },
      { new: true, runValidators: true }
    );
    if (!followingUser || !followerUser) {
      return res.status(404).send({ error_message: "User not found" });
    }
    const user = await userModel.generateUserObject(followingUser);
    res.status(200).send({
      user: user,
      message: "User Followed successfully",
    });
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

router.post("/user/unfollow", auth, async (req, res) => {
  const user1 = req.user;
  const user2 = await userModel.findOne({
    username: req.body.username,
  });
  if (!user2) {
    return res.status(404).send({ error: "User not found" });
  }
  if (!user1.followings.includes(user2._id)) {
    return res.status(400).send({ error: "You are not following this user" });
  }
  try {
    const _followeruser = user1.followings.filter((id) => id == user2._id);
    const _followinguser = user2.followers.filter((id) => id == user1._id);
    const followerUser = await userModel.findByIdAndUpdate(
      user1._id,
      { followings: _followeruser },
      { new: true, runValidators: true }
    );
    const followingUser = await userModel.findByIdAndUpdate(
      user2._id,
      { followers: _followinguser },
      { new: true, runValidators: true }
    );
    if (!followingUser || !followerUser) {
      return res.status(404).send({ error: "User not found" });
    }
    const user = await userModel.generateUserObject(followingUser);
    res.status(200).send({
      user: user,
      message: "User Unfollowed successfully",
    });
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

router.get("/liked/list/:username/:page?/:count?", auth, async (req, res) => {
  try {
    if (
      req.params.page != undefined &&
      (isNaN(req.params.page) || req.params.page <= 0)
    ) {
      return res.status(400).send({ message: "Invalid page number" });
    }
    if (
      (isNaN(req.params.count) || req.params.count <= 0) &&
      req.params.count != undefined
    ) {
      return res.status(400).send({ message: "Invalid count per page number" });
    }
    const count =
      req.params.count != undefined ? parseInt(req.params.count) : 10;
    const page = req.params.page != undefined ? parseInt(req.params.page) : 1;
    const tweets = await Like.find({ likerUsername: req.params.username })
      .sort({ createdAt: -1 })
      .populate({
        path: "tweetId",
      })
      .skip(count * (page - 1))
      .limit(count);

    const likedTweets = [];
    for (let i = 0; i < tweets.length; i++) {
      const tweet = await tweetModel.getTweetObject(
        tweets[i].tweetId,
        req.user.username
      );
      likedTweets.push(tweet);
    }
    res.status(200).send({
      tweets: likedTweets,
      message: "Tweets have been retrieved successfully",
    });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

router.get("/vapid-key", auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const vapidKeys = await UserVapidKeys.findOne({ userId: userId });
    if (vapidKeys) {
      return res.status(200).send({
        publicKey: vapidKeys.publicKey,
      });
    } else {
      return res.status(404).send({
        message: "Vapid keys not found",
      });
    }
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

router.get("/subscription", auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const subscription = await NotificationSubscription.findOne({
      userId: userId,
    });
    if (subscription) {
      return res.status(200).send({
        subscription: subscription.subscription,
      });
    } else {
      return res.status(404).send({
        message: "Subscription not found",
      });
    }
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

router.post("/add-subscription", auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const subscription = req.body.subscription;

    const userSub = new NotificationSubscription({
      userId: userId,
      subscription: subscription,
      browser: browser.name,
      version: browser.version,
      os: browser.os,
    });
    console.log(userSub);
    await userSub.save();
    res.status(200).send({
      message: "Subscription added successfully",
    });
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

module.exports = router;
