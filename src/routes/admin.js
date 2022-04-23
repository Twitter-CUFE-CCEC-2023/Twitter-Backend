const express = require("express");
const banUser = require("../models/banUser");
const User = require("../models/user");
const Tweet = require("../models/tweet");
const Like = require("../models/like");
const router = express.Router();

router.post("/dashboard/ban", async (req, res) => {
  const banuser = new banUser(req.body);
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    "userId",
    "isBanned",
    "banDuration",
    "reason",
    "isPermanent",
  ];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }
  try {
    banuser.save();
    const user = await User.findByIdAndUpdate(
      req.body.userId,
      { isBanned: true },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).send();
    }

    res.status(200).send({
      user: user,
      message: "User Banned successfully",
    });
  } catch (e) {
    res.status(500).send(e);
  }
});




router.post("/dashboard/unban", async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["userId", "isBanned"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }
  try {
    const user = await User.findByIdAndUpdate(
      req.body.userId,
      { isBanned: false },
      { new: true, runValidators: true }
    );
    const banuser = await banUser.deleteOne({ userId: req.body.userId });

    if (!user) {
      return res.status(404).send();
    }

    res.status(200).send({
      user: user,
      message: "User unBanned successfully",
    });
  } catch (e) {
    res.status(500).send(e);
  }
});




router.get("/dashboard/users", async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["location", "gender"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid filters!" });
  }
  let user = null;
  const count = 10;
  const page = 1;
  try {
    if (
      req.body.location != "" &&
      req.body.gender != "" &&
      req.body.location &&
      req.body.gender
    ) {
      user = await User.find({
        location: req.body.location,
        gender: req.body.gender,
      })
        .sort({ createdAt: -1 })
        .skip(count * (page - 1))
        .limit(count);
    } else if (req.body.location != "" && req.body.location) {
      user = await User.find({
        location: req.body.location,
      })
        .sort({ createdAt: -1 })
        .skip(count * (page - 1))
        .limit(count);
    } else if (req.body.gender != "" && req.body.gender) {
      user = await User.find({
        gender: req.body.gender,
      })
        .sort({ createdAt: -1 })
        .skip(count * (page - 1))
        .limit(count);
    } else {
      user = await User.find({})
        .sort({ createdAt: -1 })
        .skip(count * (page - 1))
        .limit(count);
    }
    res.status(200).send({
      user: user,
      message: "Users have been retrived successfully",
    });
  } catch (e) {
    res.status(500).send(e);
  }
});




router.get("/dashboard/tweets", async (req, res) => {
  let count = null;
  let now = new Date();
  let lastWeeek = new Date() - 7 * 24 * 60 * 60 * 1000;
  if (req.body.start_date > req.body.end_date) {
    return res.status(400).send({ error: "Invalid filters!" });
  }
  try {
    if (req.body.start_date && req.body.end_date) {
      count = await Tweet.count({
        createdAt: { $gte: req.body.start_date,$lte: req.body.end_date },
      });
    } else if (req.body.start_date) {
      count = await Tweet.count({
        createdAt: { $gte: req.body.start_date,$lte:now},
      });
    } else if (req.body.end_date) {
      // if (req.body.end_date < lastWeeek) {
      //   return res.status(400).send({ error: "Invalid filters!" });
      // }
      count = await Tweet.count({
        createdAt: { $gte: lastWeeek ,$lte: req.body.end_date},
      });
    } else {
      count = await Tweet.count({
        createdAt: { $lte: now,$gte: lastWeeek},

      });
    }

    res.status(200).send({
      count: count,
      message: "Tweets counted successfully",
    });
  } catch (e) {
    res.status(500).send(e);
  }
});






router.get("/dashboard/retweets", async (req, res) => {
  let count = null;
  let now = new Date();
  let lastWeeek = new Date() - 7 * 24 * 60 * 60 * 1000;
  if (req.body.start_date > req.body.end_date) {
    return res.status(400).send({ error: "Invalid filters!" });
  }
  try {
    if (req.body.start_date && req.body.end_date) {
      count = await Tweet.count({
        createdAt: { $gte: req.body.start_date,$lte: req.body.end_date },
        isRetweeted:true
      });
    } else if (req.body.start_date) {
      count = await Tweet.count({
        createdAt: { $gte: req.body.start_date,$lte:now},
        isRetweeted:true
      });
    } else if (req.body.end_date) {
      // if (req.body.end_date < lastWeeek) {
      //   return res.status(400).send({ error: "Invalid filters!" });
      // }
      count = await Tweet.count({
        createdAt: { $gte: lastWeeek ,$lte: req.body.end_date},
        isRetweeted:true
      });
    } else {
      count = await Tweet.count({
        createdAt: { $lte: now,$gte: lastWeeek},
        isRetweeted:true
      });
    }

    res.status(200).send({
      count: count,
      message: "Retweets counted successfully",
    });
  } catch (e) {
    res.status(500).send(e);
  }
});





router.get("/dashboard/likes", async (req, res) => {
  let count = null;
  let now = new Date();
  let lastWeeek = new Date() - 7 * 24 * 60 * 60 * 1000;
  if (req.body.start_date > req.body.end_date) {
    return res.status(400).send({ error: "Invalid filters!" });
  }
  try {
    if (req.body.start_date && req.body.end_date) {
      count = await Like.count({
        createdAt: { $gte: req.body.start_date,$lte: req.body.end_date },
      });
    } else if (req.body.start_date) {
      count = await Like.count({
        createdAt: { $gte: req.body.start_date,$lte:now},
      });
    } else if (req.body.end_date) {
      // if (req.body.end_date < lastWeeek) {
      //   return res.status(400).send({ error: "Invalid filters!" });
      // }
      count = await Like.count({
        createdAt: { $gte: lastWeeek ,$lte: req.body.end_date},
      });
    } else {
      count = await Like.count({
        createdAt: { $lte: now,$gte: lastWeeek},

      });
    }

    res.status(200).send({
      count: count,
      message: "Likes counted successfully",
    });
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;
