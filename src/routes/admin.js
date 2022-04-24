const express = require("express");
const banUser = require("../models/banUser");
const User = require("../models/user");
const auth = require("../middleware/auth");
const router = express.Router();

router.post("/dashboard/ban", auth, async (req, res) => {
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
      return res.status(404).send({ message: "User not found" });
    }

    const userObject = await User.generateUserObject(user);

    res.status(200).send({
      user: userObject,
      message: "User Banned successfully",
    });
  } catch (e) {
    res.status(500).send({ message: "Internal Server Error" });
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

    if (!user) {
      return res.status(404).send({"message": "User not found"});
    }

    await banUser.deleteOne({ userId: req.body.userId });
    const userObject = await User.generateUserObject(user);

    res.status(200).send({
      user: userObject,
      message: "User Unbanned successfully",
    });
  } catch (e) {
    res.status(500).send({"message": "Internal Server Error"});
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

module.exports = router;
