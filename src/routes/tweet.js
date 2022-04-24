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
  } catch {
    res.status(500).send({ "message": "Internal Server Error" });
  }
});


/*
  Questions?    V.I.P ZIKA review

  1) the project allows the same user to like the same tweet more than once, is that acceptable?
    
  2) the auth part !!

*/

router.post("/status/like", async(req,res)=>{
  try{

    ExistingLike = await Like.findOne({
      tweetId:req.body.id,
      likerUsername:req.body.username
    })

    if(ExistingLike){
      return res.status(400).send();
    }


    let tweet = await Tweet.findById(req.body.id);
    if (!tweet) {
      return res.status(400).send();
    }
    let like = new Like({
      tweetId:req.body.id,
      likerUsername:req.body.username 
    });
    /*if(await Like.checkConflict(req.body.id,req.body.username))
    {
      return res.status(400).send("user already liked this tweet before");
    }*/
    await like.save();
    const tweetInfo = await Tweet.getTweetInfobyId(tweet._id, tweet.username);
    if(!tweetInfo)
    {
      return res.status(400).send();
    }
    tweet.tweetInfo = tweetInfo;
    res.status(200).send({
      tweet: tweet,
      message: "Like is added successfully"
    });
  } catch(error){
    res.status(500).send(error.toString());
  }
})


/*
  Qeustions? V.I.P ZIKA review, Please with extra attention

  1) show example of the mentions 

  2) can 2 tweets exist with the same content for the same user? \
        I think it is possible

  3) auth!

*/

router.post("/status/tweet/post", async(req,res)=>{
  try{

    const updates = Object.keys(req.body)
    const allowedUpdates = ['content','userId','username'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
      return res.status(400).send()
    }
    tweet = new Tweet({
      content : req.body.content,
      userId : req.body.userId,
      username: req.body.username,
      replying : req.body.replying,
      mentions	: req.body.mentions,
      attachment_urls	: req.body.urls,
      media_ids	: req.body.media_ids,
      notify : req.body.notify
    })
    if(!tweet)
    {
      return res.status(400).send();
    }

    await tweet.save();

  

    res.status(200).send({
      tweet: tweet,
      message: "Tweet posted successfully"
    });    
  } catch (error){
    res.status(500).send(error.toString());
  }
})

module.exports = router;
