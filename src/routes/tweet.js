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

router.get('/status/tweets/list/:username?include_replies=true', async (req, res)=>{
    /*try{
        const tweets = await Tweet.find({ username: req.params.username, include_replies: req.params.include_replies})
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
    }*/
})


module.exports = router;
