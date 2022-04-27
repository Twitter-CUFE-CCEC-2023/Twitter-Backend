const express = require("express");
const Tweet = require("../models/tweet");
const User = require("../models/user");
const Like = require("../models/like");
const auth = require("../middleware/auth");
const router = express.Router();

router.delete("/status/tweet/delete", auth, async (req, res) => {
  try {
    const tweet = await Tweet.findByIdAndDelete(req.body.id);
    if (!tweet) {
      return res.status(404).send({ message: "Tweet not found" });
    }

    await Like.deleteMany({ tweetId: req.body.id });

    const tweetObj = await Tweet.getTweetObject(tweet, req.user.username);

    res.status(200).send({
      tweet: tweetObj,
      message: "Tweet deleted successfully",
    });
  } catch {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

router.get(
  "/status/tweets/list/:username/:page/:count",
  auth,
  async (req, res) => {
    try {
      let count = 10;
      if (isNaN(req.params.page) || req.params.page <= 0) {
        return res.status(400).send({ message: "Invalid page number" });
      }

      if (!isNaN(req.params.count) && req.params.count >= 0) {
        count = req.params.count;
      }
      const page = parseInt(req.params.page);
      let tweets = undefined;
      tweets = await Tweet.find({ username: req.params.username })
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
        const tweetObject = await Tweet.getTweetObject(
          tweets[i],
          req.user.username,
          false
        );
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
        tweets: tweetObjects,
      });
    } catch (error) {
      res.status(500).send({ message: "Internal Server Error" });
    }
  }
);

router.get("/status/tweet/:id",auth, async (req, res) => {
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
    });
    await like.save();

    const tweetObj = await Tweet.getTweetObject(tweet, req.user.username);
    res.status(200).send({
      tweet: tweetObj,
      message: "Like is added successfully",
    });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
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

router.post("/status/tweet/post", auth, async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = [
      "content",
      "replied_to_tweet",
      "mentions",
      "media_urls",
      "notify"
    ];
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
    );
    if (!isValidOperation) {
      return res.status(400).send({ message: "Invalid request parameters" });
    }

    if (req.body.content.length > 280 || req.body.content.length == 0) {
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
      //attachment_urls	: req.body.urls,
      //media_ids	: req.body.media_ids,
      //notify : req.body.notify
    });
    await tweet.save();

    const tweetObj = await Tweet.getTweetObject(tweet, req.user.username);
    res.status(200).send({
      tweet: tweetObj,
      message: "Tweet posted successfully",
    });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

module.exports = router;
