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

    res.status(200).send({
      tweet: tweet,
      message: "tweet deleted successfully",
    });
  } catch {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

router.get("/status/tweets/list/:username", auth, async (req, res) => {
  try {
    let count = 10;
    if (isNaN(req.body.page) || req.body.page <= 0) {
      return res.status(400).send({ message: "Invalid page number" });
    }

    if (!isNaN(req.body.count) && req.body.count >= 0) {
      count = req.body.count;
    }

    let tweets = undefined;
    if (req.query.include_replies === true) {
      tweets = await Tweet.find({ username: req.params.username })
        .sort({
          createdAt: -1,
        })
        .skip(count * (page - 1))
        .limit(count);
    } else {
      tweets = await Tweet.find({
        username: req.params.username,
        parentId: null,
      })
        .sort({ createdAt: -1 })
        .skip(count * (page - 1))
        .limit(count);
    }
    if (!tweets) {
      return res.status(404).send({ message: "Invalid username" });
    }

    const getTweets = tweets.map(async (item) => {
      const tweetInfo = await Tweet.getTweetInfobyId(
        item._id,
        req.params.username
      );
      if (tweetInfo.error) {
        return item;
      }
      item.tweetInfo = tweetInfo;
      return item;
    });

    Promise.all(getTweets)
      .then((tweets) => {
        res.status(200).send(tweets);
      })
      .catch((error) => {
        throw error;
      });
  } catch {
    res.status(500).send();
  }
});

router.get("/status/tweet/:id", async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.id).populate({
      path: "userId",
      select: "username name profile_picture -_id",
    });

    if (!tweet) {
      return res.status(404).send({ "message": "Invalid Tweet Id" });
    }
    const tweetWithInfo = await Tweet.getTweetInfobyId(
      tweet._id,
      tweet.username
    );

    tweet.tweetInfo = tweetWithInfo;

    res.status(200).send({
      tweet: tweet,
      message: "Tweet has been retrieved successfully",
    });
  } catch (err) {
    //res.status(500).send({ "message": "Internal Server Error" });
    res.status(500).send(err.toString());
  }
});

module.exports = router;
