const express = require("express");
const User = require("../models/user");
const followUserModel = require("../models/followUser");
const router = express.Router();
const notificationModel = require("./../models/notification");
require("./../models/constants/notificationType");
require("./../models/tweet");

router.get("/notifications/list", async (req, res) => {
    try {
        const id = req.body.userId;
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



module.exports = router;
