const express = require("express");
const User = require("../models/user");
const fellowUserModel = require("../models/followUser");
const router = express.Router();
const notificationModel = require("./../models/notification.js");
require("./../models/constants/notificationType.js");
require("./../models/tweet.js");
require("./../models/user.js");

router.get("/notifications/list", async (req, res) => {
    try {
        const id = req.body.userId;
        const count = 2;
        if (isNaN(req.body.page)) {
            return res.status(400).send({ message: "Invalid page number" });
        }

        const page = parseInt(req.body.page);
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
            });

        if (!result) {
            res.status(404).send({ error_message: "Notifications not found" });
        }

        res.status(200).send(result);
    } catch (err) {
        //res.status(500).send({ message: "Error in getting notifications" });
        res.status(500).send(err.toString());
    }
});


router.get('/followers/list/:username', async (req, res) => {
    const _username = req.params.username
    const count = 10;
    try {
        const users = await fellowUserModel.find({
            followingUsername: _username
        }).sort({
            createdAt: -1
        }).skip(
            count * (req.body.page - 1)
        ).limit(
            count
        ).populate({
            path: "followerId",
            select: "username name bio -_id",
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
        const users = await fellowUserModel.find({
            username: _username
        }).sort({
            createdAt: -1
        }).skip(
            count * (req.body.page - 1)
        ).limit(
            count
        ).populate({
            path: "followingId",
            select: "username name bio -_id",
        });
        if (!users) {
            return res.status(404).send({ error_message: "Following not found" })
        }
        res.send(users)
        console.log(users)
    } catch (error) {
        res.status(500).send(error.toString())
    }
})





module.exports = router;
