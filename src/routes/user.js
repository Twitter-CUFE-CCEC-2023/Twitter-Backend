const express = require("express");
const router = express.Router();
const notificationModel = require("./../models/notification.js");
require("./../models/constants/notificationType.js");
require("./../models/tweet.js");
require("./../models/user.js");

router.get("/notifications/list", async (req, res) => {
  try {
    const id = req.body.userId;
    let count = 2;
    let page = 1;

    if(req.body.count) {
        try{
            count = parseInt(req.body.count);
        }
        catch(err) {
            return res.status(400).send({error_message: "Invalid count"});
        }
    }

    if (req.body.page) {
      try {
        page = parseInt(req.body.page);
      } catch (err) {
        return res.status(400).send({ error_message: "Invalid page number" });
      }
    }

    const result = await notificationModel
      .find({ userId: id })
      .sort({ createdAt: -1 })
      .limit(count)
      .skip(count * 2)
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
