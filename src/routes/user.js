const express = require("express");
const User = require("../models/user");
const fellowUser = require("../models/followUser");
const router = express.Router();


router.get('/followers/list/:username', async (req, res) => {
    const _username = req.params.username
    try {
        const users = await fellowUser.find({
            followingUsername:  _username
        })
        if (!users) {
            return res.status(404).send()
        }
        res.send(users)
    } catch (error) {
        res.status(500).send()
    }
})

router.get('/following/list/:username', async (req, res) => {
    const _username = req.params.username
    try {
        const users = await fellowUser.find({
            username:  _username
        })
        if (!users) {
            return res.status(404).send()
        }
        res.send(users)
        console.log(users)
    } catch (error) {
        res.status(500).send()
    }
})





module.exports = router;
