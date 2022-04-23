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
      return res.status(404).send();
    }

    res.status(200).send({
      tweet: tweet,
      message: "tweet deleted successfully",
    });
  } catch {
    res.status(500).send();
  }
});

router.get("/status/tweets/list/:username", auth, async (req, res) => {
  try {
    tweets = undefined;
    if (req.query.include_replies == "true") {
      tweets = await Tweet.find({ username: req.params.username }).sort({
        createdAt: -1,
      });
    } else {
      tweets = await Tweet.find({
        username: req.params.username,
        parentId: null,
      }).sort({ createdAt: -1 });
    }
    if (!tweets) {
      return res.status(400).send();
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

    /*res.status(200).send({
            tweets: tweets,
            message: 'tweets retrieved successfully'
        })*/
  } catch {
    res.status(500).send();
  }
});

router.get("/status/tweet/:id", async (req, res) => {
  try {
    let tweet = undefined;
    tweet = await Tweet.findById(req.params.id).populate({
      path: "userId",
      select: "username name profile_picture -_id",
    });

    if (!tweet) {
      return res.status(400).send("invalid input");
    }
    const answer = await Tweet.getTweetInfobyId(tweet._id, tweet.username);

    if (!answer) {
      return res.status(400).send("invalid input");
    }

    tweet.tweetInfo = answer;

    res.status(200).send({
      tweet: tweet,
      message: "tweets and user retrieved successfully",
    });
  } catch {
    res.status(500).send();
  }
});


/*
  Questions?    V.I.P ZIKA review

  1) the project allows the same user to like the same tweet more than once, is that acceptable?
    
  3) the auth part !!

*/

router.post("/status/like", async(req,res)=>{
  try{
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

module.exports = router;
