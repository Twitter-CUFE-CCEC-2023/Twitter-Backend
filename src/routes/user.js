const express = require("express");
const router = express.Router();
const Notification = require("./../models/notification");
const NotificationType = require("./../../seed-data/constants/notificationType");
const Tweet = require("./../models/tweet");
const User = require("./../models/user");
const Like = require("../models/like");
const auth = require("../middleware/auth");
const NotificationSubscription = require("../models/notificationsSub");
const webPush = require("web-push");
require("./../models/constants/notificationType");

router.get(
  "/notifications/list/:page?/:count?",

  auth,
  async (req, res) => {
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
        return res
          .status(400)
          .send({ message: "Invalid count per page number" });
      }
      const count =
        req.params.count != undefined ? parseInt(req.params.count) : 10;
      const page = req.params.page != undefined ? parseInt(req.params.page) : 1;

      const result = await Notification.find({ userId: user._id })
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
        const notificationObject = await Notification.getNotificationObject(
          result[i]
        );
        notifications.push(notificationObject);
      }
      res.status(200).send({ notifications: notifications });
    } catch (err) {
      res.status(500).send(err.toString());
    }
  }
);

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

      const user = await User.findOne({
        username: _username,
      });
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }

      const userFollowers = await User.findOne({
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
        const userFollower = await User.generateUserObject(
          userFollowers.followers[i],
          req.user.username
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

      const user = await User.findOne({
        username: _username,
      });
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }

      const userFollowings = await User.findOne({
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
        const userFollowing = await User.generateUserObject(
          userFollowings.followings[i],
          req.user.username
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
      const userObj = await User.generateUserObject(req.user);
      return res.status(200).send({ user: userObj });
    }
    const user = await User.findOne({
      username: _username,
    });
    if (!user) {
      return res.status(404).send({ error_message: "User not found" });
    }
    const userObj = await User.generateUserObject(user, req.user.username);
    res.status(200).send({ user: userObj });
  } catch (error) {
    res.status(500).send(error.toString());
  }
});
router.post("/user/follow", auth, async (req, res) => {
  const user1 = req.user;
  const user2 = await User.findOne({
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
    const followerUser = await User.findByIdAndUpdate(
      user1._id,
      { followings: _followeruser },
      { new: true, runValidators: true }
    );
    const followingUser = await User.findByIdAndUpdate(
      user2._id,
      { followers: _followinguser },
      { new: true, runValidators: true }
    );
    if (!followingUser || !followerUser) {
      return res.status(404).send({ error_message: "User not found" });
    }

    await Notification.sendNotification(
      user2._id,
      "You have received a new notification",
      `${user1.username} started following you`
    );
    const notification = new Notification({
      userId: user2._id,
      content: `${user1.username} started following you`,
      relatedUserId: user1._id,
      notificationTypeId: NotificationType.follow._id,
    });
    await notification.save();

    const user = await User.generateUserObject(
      followingUser,
      req.user.username
    );
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
  const user2 = await User.findOne({
    username: req.body.username,
  });
  if (!user2) {
    return res.status(404).send({ error: "User not found" });
  }
  if (!user1.followings.includes(user2._id)) {
    return res.status(400).send({ error: "You are not following this user" });
  }
  try {
    const _followeruser = user1.followings.filter(
      (id) => id != user2._id.toString()
    );
    const _followinguser = user2.followers.filter(
      (id) => id != user1._id.toString()
    );
    const followerUser = await User.findByIdAndUpdate(
      user1._id,
      { followings: _followeruser },
      { new: true, runValidators: true }
    );
    const followingUser = await User.findByIdAndUpdate(
      user2._id,
      { followers: _followinguser },
      { new: true, runValidators: true }
    );
    if (!followingUser || !followerUser) {
      return res.status(404).send({ error: "User not found" });
    }
    const user = await User.generateUserObject(
      followingUser,
      req.user.username
    );
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
      const tweet = await Tweet.getTweetObject(
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
    const vapidKeys = webPush.generateVAPIDKeys();
    if (vapidKeys) {
      return res.status(200).send({
        publicKey: vapidKeys.publicKey,
        privateKey: vapidKeys.privateKey,
      });
    } else {
      return res.status(500).send({
        message: "Vapid keys could not be generated",
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
    const publicKey = req.body.publicKey;
    const privateKey = req.body.privateKey;

    const userSub = new NotificationSubscription({
      userId: userId,
      subscription: subscription,
      publicKey: publicKey,
      privateKey: privateKey,
    });
    console.log(userSub);
    const saved = await userSub.save();
    if (saved) {
      return res
        .status(200)
        .send({ message: "Subscription added successfully" });
    } else {
      return res
        .status(500)
        .send({ message: "Subscription could not be added" });
    }
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

router.put("/user/update-profile", auth, async (req, res) => {
  const user1 = req.user;
  const allowedUpdates = [
    "name",
    "birth_date",
    "profile_image_url",
    "cover_image_url",
    "location",
    "bio",
    "website",
  ];
  const updates = Object.keys(req.body);
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    invalidUpdates = updates.filter(
      (update) => !allowedUpdates.includes(update)
    );
    return res.status(400).send({
      message:
        "Invalid updates! " +
        "You can't change the following: " +
        invalidUpdates,
    });
  }
  try {
    const user = await User.findByIdAndUpdate(user1._id, req.body, {
      new: true,
      runValidators: true,
    });
    const gen_user = await User.generateUserObject(user, req.user.username);
    validUpdates = updates.filter((update) => allowedUpdates.includes(update));
    res.status(200).send({
      user: gen_user,
      message:
        "User updated successfully " +
        "The following have been updated: " +
        validUpdates,
    });
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

router.get("/search/:username", auth, async (req, res) => {
  try {
    const _username = req.params.username;
    const users = await User.find({});
    if (users.length == 0) {
      return res.status(404).send({ message: "User not found" });
    }
    const gen_users = [];
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      if (user.username.includes(_username)) {
        const gen_user = await User.generateUserObject(user);
        gen_users.push(gen_user);
      }
    }

    if (gen_users == 0) {
      return res.status(404).send({ message: "User not found" });
    }
    res.status(200).send({
      users: gen_users,
      message: "Users have been retrieved successfully",
    });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

router.put("/read-notification", auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const notificationId = req.body.notificationId;
    const notification = await Notification.findOne({
      _id: notificationId,
      userId: userId,
    });
    if (!notification) {
      return res.status(404).send({ message: "Notifiction is not found" });
    }
    const notificationRead = await Notification.findByIdAndUpdate(
      notificationId,
      {
        isRead: true,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    const notificationObject = await Notification.getNotificationObject(
      notificationRead
    );
    res.status(200).send({
      message: "Notification has been read successfully",
      notification: notificationObject,
    });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

router.post("/check-user", async (req, res) => {
  try {
    const email_or_username = req.body.email_or_username;
    const user = await User.findOne({
      $or: [{ email: email_or_username }, { username: email_or_username }],
    });
    if (user) {
      return res.status(200).send({
        message: "User found",
        is_found: true,
      });
    } else {
      return res.status(404).send({
        message: "User not found",
        is_found: false,
      });
    }
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

router.get("/get-locations", async (req, res) => {
  //select users grouped by location
  try {
    const users = await User.find({});
    const locations = [];
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      if (user.location != "") {
        if (!locations.includes(user.location)) {
          locations.push(user.location);
        }
      }
    }
    res.status(200).send({
      locations: locations,
      message: "Locations have been retrieved successfully",
    });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

router.get("/count-notifications", auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const notificationsCount = await Notification.find({
      userId: userId,
      isRead: false,
    }).count();
    res.status(200).send({
      count: notificationsCount,
      message: "Notification count has been retrieved successfully",
    });
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

module.exports = router;
