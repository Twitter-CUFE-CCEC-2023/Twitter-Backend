const express = require("express");
const router = express.Router();
const notificationModel = require("./../models/notification.js");
const tweetModel = require("./../models/tweet");
const userModel = require("./../models/user");
const auth = require("../middleware/auth");
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


router.get('/info/:username',  async (req, res) => {
  const _username = req.params.username
  try {
      const user=await User.findOne({
        username: _username
      }).select('username name bio profilePicture -_id')
      if (!user) {
          return res.status(404).send({ error_message: "User not found" })
      }
      res.send(user)
  } catch (error) {
      res.status(500).send(error.toString())
  }
})

router.post('/user/follow/:username', async (req, res) => {
  const user1= await User.findOne({
    username:req.params.username
  })
  if (!user1) {
    return res.status(404).send()
}
  const user2= await User.findOne({
    username:req.body.username
  })
  if (!user2) {
    return res.status(404).send()
}
if(user1.username==user2.username){
  return res.status(400).send({error:'You cannot follow yourself'})
}
  const _followuser=new followUserModel({
    userId:user1._id,
    followingUserId:user2._id
  })
  try {
      _followuser.save().then(result=>{
        res.status(200).send({
          message:"User Followed successfully"
        })
      })
  } catch (error) {
      res.status(500).send(error.toString())
  }
})

router.delete('/user/unfollow/:username', async (req, res) => {
  const user1= await User.findOne({
    username:req.params.username
  })
  if (!user1) {
    return res.status(404).send()
}
  const user2= await User.findOne({
    username:req.body.username
  })
  if (!user2) {
    return res.status(404).send()
}
const followuser=await followUserModel.findOne({
  userId:user1._id,
  followingUserId:user2._id
})
if(!followuser){
  return res.status(404).send({error:'User not found'})
}
try {
    await followUserModel.findOneAndDelete({
      userId:user1._id,
      followingUserId:user2._id
    })
    res.status(200).send({
      message:"User Unfollowed successfully"
    })
  } catch (error) {
      res.status(500).send(error.toString())
  }
})

module.exports = router;
