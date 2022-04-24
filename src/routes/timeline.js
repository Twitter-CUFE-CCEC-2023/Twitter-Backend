const express = require("express");
const tweetModel = require("../models/tweet");
const userModel = require("../models/user");
const auth = require("../middleware/auth");
const router = express.Router();

router.get("/home", auth, async (req, res) => {
  try {
    let count = 10;

    if (isNaN(req.body.page) || req.body.page <= 0) {
      return res.status(400).send({ message: "Invalid page number" });
    }

    if (!isNaN(req.body.count) && req.body.count >= 0) {
      count = req.body.count;
    }

    const page = parseInt(req.body.page);
    const usersIds = [req.user._id, ...req.user.followings];

    const result = await tweetModel
      .find({ userId: { $in: usersIds } })
      .sort({ createdAt: -1 })
      .skip(count * (page - 1))
      .limit(count)
      .populate({
        path: "userId",
      });

    const tweets = [];
    for (let i = 0; i < result.length; i++) {
      const tweet_without_replies = await tweetModel.getTweetObject(result[i]);
      const tweet = await tweetModel.getTweetReplies(tweet_without_replies);
      tweets.push(tweet);
    }
    res.status(200).send({ tweets: tweets });
  } catch (error) {
    //res.status(500).send({"message": "Internal Server Error"});
    res.status(500).send(error.toString());
  }
});

module.exports = router;
