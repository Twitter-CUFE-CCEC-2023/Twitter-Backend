const express = require("express");
const Tweet = require('../models/tweet')
const User = require("../models/user");

const router = express.Router();

router.delete('/status/tweet/delete', async (req, res)=>{
    try{
        const tweet = await Tweet.findByIdAndDelete(req.body.id)

        if(!tweet){
            return res.status(404).send()
        }

        res.status(200).send({
            tweet: tweet,
            message: 'tweet deleted successfully'
        })
        
    }
    catch{
        res.status(500).send()
    }
})

router.get('/status/tweets/list/:username', async (req, res)=>{
    try{
        //console.log(req.params.username)
        //console.log(req.query.include_replies)
        tweets = undefined
        if(req.query.include_replies == "true")
        {
            tweets = await Tweet.find({ username: req.params.username}).sort({ createdAt: -1 })  
        }
        else
        {
            tweets = await Tweet.find({ username: req.params.username, parentId: null}).sort({ createdAt: -1 })
        }
        if(!tweets){
            return res.status(404).send()
        }
        res.status(200).send({
            tweets: tweets,
            message: 'tweets retrieved successfully'
        })
    }
    catch{
        res.status(500).send()
    }
})

router.get('/status/tweet/:id', async(req, res)=>{
    try{
        tweet = undefined
        if(req.query.include_my_retweet	== "true")
        {
            tweet = await Tweet.findById(req.params.id)
        }
        else
        {
            tweet = await Tweet.findOne({_id:req.params.id,isRetweeted:false})
        }
        if(!tweet){
            return res.status(404).send()
        }
        user = await User.findOne({username: tweet.username})  
        if(!user){
            return res.status(404).send()
        }
        res.status(200).send({
            tweet: tweet,
            user: user,
            message: 'tweets and user retrieved successfully'
        })
    }
    catch{
        res.status(500).send()
    }
})

module.exports = router;
