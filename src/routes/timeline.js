const express = require("express");
const Tweet = require("../models/tweet");
require("../models/user");
const auth = require("../middleware/auth");
const router = express.Router();

router.get("/home/:page?/:count?", auth, async (req, res) => {
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

    const usersIds = [req.user._id, ...req.user.followings];
    const result = await Tweet.find({ userId: { $in: usersIds }, parentId: null})
      .sort({ createdAt: -1 })
      .skip(count * (page - 1))
      .limit(count)
      .populate({
        path: "userId",
      });
    const tweets = [];
    for (let i = 0; i < result.length; i++) {
      const tweet = await Tweet.getTweetObject(result[i], req.user.username);
      tweets.push(tweet);
    }
    res.status(200).send({ tweets: tweets });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

router.get("/", async (req, res) => {
  // const user = await userModel.findOne({}).select("username -_id");
  // console.log(user);
  res.status(200).send({ test: "check working" });
});

module.exports = router;
