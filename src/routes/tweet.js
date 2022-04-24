const express = require("express");
const Tweet = require("../models/tweet");
const User = require("../models/user");
const auth = require("../middleware/auth");
const router = express.Router();

router.delete("/status/tweet/delete", auth, async (req, res) => {
  try {
    const tweet = await Tweet.findByIdAndDelete(req.body.id);

    if (!tweet) {
      return res.status(404).send({ message: "Tweet not found" });
    }

    const tweetObj = await Tweet.getTweetObject(tweet);

    res.status(200).send({
      tweet: tweet,
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
        const tweetObject = await Tweet.getTweetObject(tweets[i], false);
        if (req.query.include_replies === "true") {
          const tweetObjectWithReplies = await Tweet.getTweetReplies(
            tweetObject
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

router.get("/status/tweet/:id", async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.id).populate({
      path: "userId",
    });

    if (!tweet) {
      return res.status(404).send({ message: "Invalid Tweet Id" });
    }

    const tweetObject = await Tweet.getTweetObject(tweet);
    if (req.query.include_replies === "true") {
      const tweetWithReplies = await Tweet.getTweetReplies(tweetObject);
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
    res.status(500).send({ message: "Internal Server Error" });
  }
});

module.exports = router;
