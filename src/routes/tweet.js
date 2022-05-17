const express = require("express");
const Tweet = require("../models/tweet");
const User = require("../models/user");
const Like = require("../models/like");
const auth = require("../middleware/auth");
const Notification = require("../models/notification");
const mongoose = require("mongoose");
const NotificationType = require("./../../seed-data/constants/notificationType");
const upload = require("../services/fileUpload");
const { uploadMedia } = require("../services/s3");
const config = require("./../config");
const router = express.Router();

router.delete("/status/tweet/delete", auth, async (req, res) => {
  try {
    const tweet = await Tweet.findByIdAndDelete(req.body.id);
    if (!tweet) {
      return res.status(404).send({ message: "Tweet not found" });
    }

    await Like.deleteMany({ tweetId: req.body.id });

    await Tweet.deleteMany({ parentId: req.body.id });

    await Notification.deleteMany({ tweetId: req.body.id });

    const tweetObj = await Tweet.getTweetObject(tweet, req.user.username);

    res.status(200).send({
      tweet: tweetObj,
      message: "Tweet deleted successfully",
    });
  } catch {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

router.get("/status/tweets/list/:username/:page?/:count?",auth,async (req, res) => {
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
        return res
          .status(400)
          .send({ message: "Invalid count per page number" });
      }
      const count =
        req.params.count != undefined ? parseInt(req.params.count) : 10;
      const page = req.params.page != undefined ? parseInt(req.params.page) : 1;

      let tweets = undefined;
      tweets = await Tweet.find({ username: req.params.username, parentId: null })
        .sort({
          createdAt: -1,
        })
        .skip(count * (page - 1))
        .limit(count);

      if (!tweets) {
        return res.status(404).send({ message: "Invalid username" });
      }

      const tweetObjects = [];
      for (let i = 0; i < tweets.length; i++) {

        console.log(tweets[i].id)

        if (tweets[i] == null)
          continue;

        const tweetObject = await Tweet.getTweetObject(
          tweets[i],
          req.user.username,
          false
        );

        if(tweetObject.is_reply === true)
        {
          tweetObject.RelpiedToUser = {};
          tweetObject.parentTweetID = {};
          parentTweet = await Tweet.findById(tweets[i].parentId);
          if(parentTweet != null)
          {
            tweetObject.parentTweetID = parentTweet.id;
            user = await User.findById(
              parentTweet.userId
            )
            .select("-tokens");
            if(!user)
            {
              return res.status(404).send({ message: "User of replied tweet is not found" });
            }
            else
            {
              tweetObject.RelpiedToUser = user;
            }
          }
        }

        if (req.query.include_replies === "true") {
          const tweetObjectWithReplies = await Tweet.getTweetReplies(
            tweetObject,
            req.user.username
          );
          tweetObjects.push(tweetObjectWithReplies);
        } else {
          tweetObjects.push(tweetObject);
        }
      }

      res.status(200).send({
        tweets: tweetObjects
      });
    } catch (error) {
      res.status(500).send(error.toString());
    }
  }
);

router.get("/status/tweet/:id", auth, async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.id).populate({
      path: "userId",
    });

    if (!tweet) {
      return res.status(404).send({ message: "Invalid Tweet Id" });
    }

    const tweetObject = await Tweet.getTweetObject(tweet, req.user.username);
    if (req.query.include_replies === "true") {
      const tweetWithReplies = await Tweet.getTweetReplies(
        tweetObject,
        req.user.username
      );
      res.status(200).send({
        tweet: tweetWithReplies,
        message: "Tweet has been retrieved successfully",
      });
    } else {
      res.status(200).send({
        tweet: tweetObject,
        message: "Tweet has been retrieved successfully",
      });
    }
  } catch (err) {
    res.status(500).send(err.toString());
  }
});

router.post("/status/like", auth, async (req, res) => {
  try {
    ExistingLike = await Like.findOne({
      tweetId: req.body.id,
      likerUsername: req.user.username,
    });

    if (ExistingLike) {
      return res.status(400).send({ message: "User already liked this tweet" });
    }

    const tweet = await Tweet.findById(req.body.id);
    if (!tweet) {
      return res.status(404).send({ message: "Invalid Tweet Id" });
    }

    const like = new Like({
      tweetId: req.body.id,
      likerUsername: req.user.username,
      userId: req.user._id,
    });
    await like.save();

    if (tweet.userId !== req.user._id) {
      const tweetObj = await Tweet.getTweetObject(tweet, req.user.username);
      await Notification.sendNotification(
        tweetObj.user.id,
        "You have recieved a new notification",
        `${req.user.username} liked your tweet`
      );
      const notification = new Notification({
        userId: tweetObj.user.id,
        content: `${req.user.username} liked your tweet`,
        relatedUserId: req.user._id,
        notificationTypeId: NotificationType.like._id,
        tweetId: tweetObj.id,
      });
      await notification.save();
    }

    res.status(200).send({
      tweet: tweetObj,
      message: "Like is added successfully",
    });
  } catch (error) {
    res.status(500).send({ message: error.toString() });
  }
});

router.delete("/status/unlike", auth, async (req, res) => {
  try {
    const like = await Like.findOne({
      tweetId: req.body.id,
      likerUsername: req.user.username,
    });

    if (!like) {
      return res.status(400).send({ message: "Invalid tweet id" });
    }

    const tweet = await Tweet.findById(req.body.id);
    if (!tweet) {
      return res.status(404).send({ message: "Invalid Tweet Id" });
    }
    const unliked = await Like.deleteOne({ _id: like._id });
    if (!unliked) {
      throw new Error();
    }

    const tweetObj = await Tweet.getTweetObject(
      await Tweet.findById(req.body.id),
      req.user.username
    );
    res.status(200).send({
      tweet: tweetObj,
      message: "Tweet has been unliked successfully",
    });
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

router.post(
  "/status/tweet/post",
  auth,
  upload.array("media"),
  async (req, res) => {
    try {
      const updates = Object.keys(req.body);

      const allowedUpdates = [
        "content",
        "replied_to_tweet",
        "mentions",
        "media",
      ];
      const isValidOperation = updates.every((update) =>
        allowedUpdates.includes(update)
      );
      if (!isValidOperation) {
        return res.status(400).send({ message: "Invalid request parameters" });
      }

      if (
        req.body.content.length > 280 ||
        (req.body.content.length == 0 && req.files.length == 0)
      ) {
        return res
          .status(400)
          .send({ message: "Tweet content length is invalid" });
      }

      const tweet = new Tweet({
        content: req.body.content,
        userId: req.user._id,
        username: req.user.username,
        parentId: req.body.replied_to_tweet,
        mentions: req.body.mentions,
      });
      if (req.files) {
        for (let i = 0; i < req.files.length; i++) {
          const result = await uploadMedia(req.files[i]);
          const url = `${config.baseUrl}/media/${result.Key}`;
          tweet.attachments.push(url);
        }
      }
      await tweet.save();

      if (tweet.parentId) {
        const parentTweet = await Tweet.findById(tweet.parentId);
        if (parentTweet.userId !== req.user._id) {
          await Notification.sendNotification(
            parentTweet.userId,
            "You have recieved a new notification",
            `${req.user.username} has replied to your tweet`
          );
          const notification = new Notification({
            userId: parentTweet.userId,
            content: `${req.user.username} has replied to your tweet`,
            relatedUserId: req.user._id,
            notificationTypeId: NotificationType.reply._id,
            tweetId: tweet._id,
          });
          await notification.save();
        }
      } else {
        const user = await User.findById(req.user._id).select("followers -_id");
        const userFollowers = user.followers;
        for (let i = 0; i < userFollowers.length; i++) {
          await Notification.sendNotification(
            userFollowers[i],
            "You have recieved a new notification",
            `${req.user.username} has posted a new tweet`
          );
          const notification = new Notification({
            userId: userFollowers[i],
            content: `${req.user.username} has posted a new tweet`,
            relatedUserId: req.user._id,
            notificationTypeId: NotificationType.followingTweet._id,
            tweetId: tweet._id,
          });
          await notification.save();
        }
      }
      const tweetObj = await Tweet.getTweetObject(tweet, req.user.username);
      res.status(200).send({
        tweet: tweetObj,
        message: "Tweet posted successfully",
      });
    } catch (error) {
      res.status(500).send(error.toString());
    }
  }
);

router.post("/status/retweet", auth, async (req, res) => {
  try {
    const user = req.user;
    const tweet = await Tweet.findById(req.body.id);
    if (!tweet) {
      return res.status(404).send({ message: "Invalid tweet id" });
    }
    const retweeted = await Tweet.findOne({
      userId: user._id,
      parentId: tweet._id,
      isRetweeted: true,
      quoteComment: null,
    });

    if (retweeted) {
      return res
        .status(400)
        .send({ message: "You have already retweeted this tweet" });
    }

    const retweet = new Tweet(tweet);
    //retweet._id = new mongoose.Types.ObjectId();
    retweet.userId = user._id;
    retweet.username = user.username;
    retweet.parentId = tweet._id;
    retweet.isRetweeted = true;
    const saved = await retweet.save();
    if (!saved) {
      throw new Error();
    }
    const retweetObject = await Tweet.getTweetObject(retweet, user.username);
    return res
      .status(200)
      .send({ tweet: retweetObject, message: "Retweeted successfully" });
  } catch (e) {
    return res.status(500).send({ message: "Internal Server Error" });
  }
});

router.get("/status/retweeters/:id/:page/:count", auth, async (req, res) => {
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

    retweets = await Tweet.find({
      parentId: req.params.id,
      isRetweeted: true,
      quoteComment: null,
    })
      .select("userId")
      .sort({
        createdAt: -1,
      })
      .skip(count * (page - 1))
      .limit(count);

    if (!retweets) {
      return res.status(404).send({ message: "Invalid Tweet Id" });
    }

    retweeters = [];

    for (i = 0; i < retweets.length; i++) {
      user = await User.findById(retweets[i].userId);
      retweeters.push(await User.findById(retweets[i].userId));
    }
    res.status(200).send({
      retweeters: retweeters,
      message: "Retweeters have been retrieved successfully",
    });
  } catch (e) {
    return res.status(500).send({ message: "Internal Server Error" });
  }
});

router.delete("/status/unretweet", auth, async (req, res) => {
  try {
    tweetExist = await Tweet.findOne({
      _id: req.body.id,
      isRetweeted: true,
      quoteComment: null,
    });

    if (!tweetExist) {
      return res
        .status(400)
        .send({ message: "tweet doesn't exist or not a retweet" });
    }

    await Tweet.findByIdAndDelete(req.body.id);

    res.status(200).send({
      tweet: tweetExist,
      message: "tweet has been Unretweeted successfully",
    });
  } catch (e) {
    return res.status(500).send({ message: "Internal Server Error" });
  }
});

module.exports = router;
