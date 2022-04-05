const express = require("express");
const User = require("../models/user");
const followUserModel = require("../models/followUser");
const router = express.Router();
const notificationModel = require("./../models/notification.js");
const tweetModel = require("./../models/tweet");
const userModel = require("./../models/user.js");
require("./../models/constants/notificationType.js");

router.get("/notifications/list", async (req, res) => {
  try {
    const id = req.body.userId;
    const user = await userModel.findOne({ _id: id }).select("username -_id");
    const username = user["username"];
    const count = 2;

    if (isNaN(req.body.page) && req.body.page != "" && req.body.page != null) {
      return res.status(400).send({ message: "Invalid page number" });
    }

    const page = req.body.page === "" ? 1 : parseInt(req.body.page);
    const result = await notificationModel
      .find({ userId: id })
      .sort({ createdAt: -1 })
      .skip(count * (page - 1))
      .limit(count)
      .populate({
        path: "relatedUserId",
        select: "username name profilePicture -_id",
      })
      .populate({
        path: "notificationTypeId",
        select: "name -_id",
      })
      .populate({
        path: "tweetId",
      });

        if (!result) {
            res.status(404).send({ error_message: "Notifications not found" });
        }

    // for (let i = 0; i < result.length; i++) {
    //   const tweet = result[i]["tweetId"];
    //   tweetModel.getTweetInfobyId(tweet["_id"], username).then((tweetInfo) => {
    //     result[i]["tweetInfo"] = tweetInfo;
    //   });
    // }

    res.status(200).send(result);
  } catch (err) {
    //res.status(500).send({ message: "Error in getting notifications" });
    res.status(500).send(err);
  }
});

router.get('/followers/list/:username', async (req, res) => {
    const _username = req.params.username
    const count = 10;

    try {
        if (isNaN(req.body.page) && req.body.page != "" && req.body.page != null) {
            return res.status(400).send({ message: "Invalid page number" });
        }

        const page = req.body.page === "" ? 1 : parseInt(req.body.page);
        const _id = await User.findOne({
            username: _username
        }).select('_id')
        if (!_id) {
            return res.status(404).send({ error_message: "User not found" });
        }
        const users = await followUserModel
            .find({ followingUserId: _id })
            .sort({ createdAt: -1 })
            .skip(count * (page - 1))
            .limit(count)
            .populate({
                path: "userId",
                select: "username name bio profilePicture -_id",
            });

        if (!users) {
            return res.status(404).send({ error_message: "Followers not found" })
        }
        res.send(users)
    } catch (error) {
        res.status(500).send(error.toString())
    }
})

router.get('/following/list/:username', async (req, res) => {
    const _username = req.params.username
    const count = 10;
    try {
        if (isNaN(req.body.page) && req.body.page != "" && req.body.page != null) {
            return res.status(400).send({ message: "Invalid page number" });
        }

        const page = req.body.page === "" ? 1 : parseInt(req.body.page);
        const _id = await User.findOne({
            username: _username
        }).select('_id')
        if (!_id) {
            return res.status(404).send({ error_message: "User not found" });
        }
        const users = await followUserModel
            .find({ userId: _id })
            .sort({ createdAt: -1 })
            .skip(count * (page - 1))
            .limit(count)
            .populate({
                path: "userId",
                select: "username name bio profilePicture -_id",
            });
        if (!users) {
            return res.status(404).send({ error_message: "Following not found" })
        }
        res.send(users)
    } catch (error) {
        res.status(500).send(error.toString())
    }
})


module.exports = router;
