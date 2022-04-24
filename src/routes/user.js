const express = require("express");
const router = express.Router();
const notificationModel = require("./../models/notification.js");
const tweetModel = require("./../models/tweet");
const userModel = require("./../models/user.js");
const Like = require("../models/like");
const auth = require("../middleware/auth");
const { default: mongoose } = require("mongoose");
require("./../models/constants/notificationType.js");

router.get("/notifications/list", auth, async (req, res) => {
  try {
    const user = req.user;
    const username = user["username"];
    let count = 10;

    if (isNaN(req.body.page) || req.body.page <= 0) {
      return res.status(400).send({ message: "Invalid page number" });
    }

    if (!isNaN(req.body.count) && req.body.count >= 0) {
      count = req.body.count;
    }

    const page = req.body.page === "" ? 1 : parseInt(req.body.page);
    const result = await notificationModel
      .find({ userId: user._id })
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

    const getNotifications = result.map(async (item) => {
      if (!item.tweetId) {
        return item;
      }
      const tweetInfo = await tweetModel.getTweetInfobyId(
        item.tweetId,
        username
      );
      if (tweetInfo.error) {
        return item;
      }
      item.tweetId.tweetInfo = tweetInfo;
      return item;
    });

    Promise.all(getNotifications)
      .then((result) => {
        res.status(200).send(result);
      })
      .catch((error) => {
        throw error;
      });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Error in getting notifications" });
  }
});

router.get("/follower/list/:username", auth, async (req, res) => {
  const _username = req.params.username;
  let count = 10;

  try {
    if (isNaN(req.body.page) || req.body.page <= 0) {
      return res.status(400).send({ message: "Invalid page number" });
    }

    if (!isNaN(req.body.count) && req.body.count >= 0) {
      count = req.body.count;
    }

    const page = req.body.page === "" ? 1 : parseInt(req.body.page);
    const user = await userModel.findOne({
      username: _username,
    });
    if (!user) {
      return res.status(404).send({ error_message: "User not found" });
    }

    const userFollowers = await userModel
      .findOne({
        username: _username,
      })
      .select("followers -_id")
      .populate({
        path: "followers",
        select: "username name bio profilePicture -_id",
      })
      .skip(count * (page - 1))
      .limit(count);

    if (!userFollowers) {
      return res.status(404).send({ error_message: "Followers not found" });
    }
    res.send(userFollowers);
  } catch (error) {
    res.status(500).send("Internal server Error");
  }
});

router.get("/following/list/:username", auth, async (req, res) => {
  const _username = req.params.username;
  let count = 10;

  try {
    if (isNaN(req.body.page) || req.body.page <= 0) {
      return res.status(400).send({ message: "Invalid page number" });
    }

    if (!isNaN(req.body.count) && req.body.count >= 0) {
      count = req.body.count;
    }

    const page = req.body.page === "" ? 1 : parseInt(req.body.page);
    const user = await userModel.findOne({
      username: _username,
    });
    if (!user) {
      return res.status(404).send({ error_message: "User not found" });
    }

    const userFollowings = await userModel
      .findOne({
        username: _username,
      })
      .select("followings -_id")
      .populate({
        path: "followings",
        select: "username name bio profilePicture -_id",
      })
      .skip(count * (page - 1))
      .limit(count);

    if (!userFollowings) {
      return res.status(404).send({ error_message: "Followings not found" });
    }
    res.send(userFollowings);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});


/*

  Questions?  V.I.P ZIKA review

  1) should each tweet returns accompanied by its tweet info ? 

  2) auth ? 

*/

router.get("/liked/list/:username", async(req, res)=>{
  try{
    let likes = await Like.find({likerUsername:req.params.username});
    if(!likes)
    {
      res.status(400).send();
    }

    const tweets = await Like
    .find({ likerUsername: req.params.username })
    .sort({ createdAt: -1 })
    .populate({
        path: "tweetId",
    });


    const getTweets = tweets.map(async (item) => {
      const tweetInfo = await tweetModel.getTweetInfobyId(
        item._id,
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
  }  catch(error){
    res.status(500).send(error.toString())
  }
})

module.exports = router;
