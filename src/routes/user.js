const express = require("express");
const router = express.Router();
const notificationModel = require("./../models/notification.js");
require("./../models/constants/notificationType.js");
require("./../models/tweet.js");
require("./../models/user.js");

router.get("/notifications/list", async (req, res) => {
  try {
    const id = req.body.userId;
    const count = 1;

    if (isNaN(req.body.page)) {
      return res.status(400).send({ message: "Invalid page number" });
    }

    page = parseInt(req.body.page);
    const result = await notificationModel
      .find({ userId: id })
      .sort({ createdAt: -1 })
      .limit(count)
      .skip((page - 1) * count)
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
