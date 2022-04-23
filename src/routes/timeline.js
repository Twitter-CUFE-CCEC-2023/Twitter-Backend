const express = require("express");
const tweetModel = require("./../models/tweet");
const userModel = require("./../models/user");
const auth = require("../middleware/auth");
const router = express.Router();

router.get("/home",auth, async (req, res) => {
  try {
    let count = 10;

    if (isNaN(req.body.page) || req.body.page <= 0) {
      return res.status(400).send({ message: "Invalid page number" });
    }

    if (!isNaN(req.body.count) && req.body.count >= 0) {
      count = req.body.count;
    }

    const page = req.body.page === "" ? 1 : parseInt(req.body.page);
    const usersIds = [
      req.user._id,
      ...req.user.followings,
    ];

    const result = await tweetModel
      .find({ userId: { $in: usersIds } })
      .sort({ createdAt: -1 })
      .skip(count * (page - 1))
      .limit(count)
      .populate({
        path: "userId",
        select: "username name profilePicture -_id",
      });

    const getTweets = result.map(async (item) => {
      const tweetInfo = await tweetModel.getTweetInfobyId(
        item._id,
        req.user.username
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

  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/", async (req, res) => {
  // const user = await userModel.findOne({}).select("username -_id");
  // console.log(user);
  res.status(200).send({"test": "check working"});
});


module.exports = router;
