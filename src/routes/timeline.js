const express = require("express");
const tweetModel = require("./../models/tweet");
const userModel = require("./../models/user");
const followUserModel = require("./../models/followUser");

const router = express.Router();

router.get("/home", async (req, res) => {
  try {
    const count = 2;

    if (isNaN(req.body.page) && req.body.page != "" && req.body.page != null) {
      return res.status(400).send({ message: "Invalid page number" });
    }

    if (!req.body.userId) {
      return res.status(400).send({ message: "User Id is required" });
    }

    const page = req.body.page === "" ? 1 : parseInt(req.body.page);
    const userId = req.body.userId;
    const followingIds = await followUserModel
      .find({ followingUserId: userId })
      .select("userId -_id");
    const usersIds = [
      userId,
      ...followingIds.map((item) => item.userId.toString()),
    ];
    const usernames = await (
      await userModel.find({ _id: { $in: usersIds } }).select("username -_id")
    ).map((item) => item.username);
    const result = await tweetModel
      .find({ username: { $in: usernames } })
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
        usernames[0]
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

module.exports = router;
