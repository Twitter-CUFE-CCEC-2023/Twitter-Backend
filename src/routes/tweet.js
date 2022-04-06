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
        tweet = await Tweet.findById(req.params.id).populate({path:"userId",select:"username name profile_picture -_id"})

        if(!tweet){
            return res.status(400).send("invalid input")
        }
        const answer = await Tweet.getTweetInfobyId(tweet._id,tweet.username)
        
        if(answer.error){
            throw answer.error
        }

        res.status(200).send({
            tweet: answer,
            message: 'tweets and user retrieved successfully'
        })
    }
    catch{
        res.status(500).send()
    }
})

module.exports = router;
