const express = require("express");
const banUser = require("../models/banUser");
const User = require("../models/user");
const Tweet = require("../models/tweet");
const Like = require("../models/like");
const UserRole = require("../models/constants/userRole");
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
    "accessToken",
  ];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    return res.status(400).send({ message: "Invalid updates!" });
  }
  try {
    const adminId = await UserRole.find({
      name: "Admin",
    }).select("_id");

    if (adminId[0]._id.equals(req.user.roleId)) {
      const user = await User.findByIdAndUpdate(
        req.body.userId,
        { isBanned: true },
        { new: true, runValidators: true }
      );

      if (!user) {
        return res.status(404).send({ message: "User is not found" });
      }

      banuser.save();
      res.status(200).send({
        user: user,
        message: "User Banned successfully",
      });
    } else return res.status(401).send({ message: "You are not authorized" });
  } catch (e) {
    res.status(500).send({ message: "Internal server error" });
  }
});

router.post("/dashboard/unban", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["userId", "isBanned", "accessToken"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }
  try {
    const adminId = await UserRole.find({
      name: "Admin",
    }).select("_id");
    if (adminId[0]._id.equals(req.user.roleId)) {
      const user = await User.findByIdAndUpdate(
        req.body.userId,
        { isBanned: false },
        { new: true, runValidators: true }
      );
      const banuser = await banUser.deleteOne({ userId: req.body.userId });

      if (!user) {
        return res.status(404).send({ message: "User is not found" });
      }

      if (!banuser) {
        return res.status(404).send({ message: "User is not banned" });
      }

      res.status(200).send({
        user: user,
        message: "User was unbanned successfully",
      });
    } else return res.status(401).send({ message: "You are not authorized" });
  } catch (e) {
    res.status(500).send({ message: "Internal server error" });
  }
});

router.post("/dashboard/users", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["location", "gender", "accessToken", "count", "page"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid filters!" });
  }
  let user = null;
  let userCount = null;
  const count = req.body.count || 20;
  const page = req.body.page || 1;
  try {
    if (
      req.body.location &&
      req.body.gender
    ) {
      let gender = req.body.gender;
      let location = req.body.location;
      user = await User.find({
        location: location,
        gender: gender,
      })
        .sort({ createdAt: -1 })
        .skip(count * (page - 1))
        .limit(count);
    } else if (req.body.location) {
      let location = req.body.location;
      user = await User.find({
        location: location,
      })
        .sort({ createdAt: -1 })
        .skip(count * (page - 1))
        .limit(count);
    } else if (req.body.gender) {
      let gender = req.body.gender;
      user = await User.find({
        gender: gender,
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

    if (
      req.body.location &&
      req.body.gender
    ) {
      let gender = req.body.gender;
      let location = req.body.location;
      userCount = await User.count({
        location: location,
        gender: gender,
      });
    } else if (req.body.location) {
      let location = req.body.location;
      userCount = await User.count({
        location: location,
      });
    } else if (req.body.gender) {
      let gender = req.body.gender;
      userCount = await User.count({
        gender: gender,
      });
    } else {
      userCount = await User.count({});
    }

    res.status(200).send({
      user: user,
      count: userCount,
      message: "Users have been retrived successfully",
    });
  } catch (e) {
    res.status(500).send({ message: "Internal server error" });
  }
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////Retweets////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.get("/dashboard/retweets", auth, async (req, res) => {
  let count = null;
  let avg = null;
  let now = new Date();
  let lastWeeek = new Date() - 7 * 24 * 60 * 60 * 1000;
  lastWeeek = new Date(lastWeeek);

  const oneDay = 1000 * 60 * 60 * 24;
  let diffInTime = null;
  let diffInDays = null;
  if (req.body.start_date > req.body.end_date) {
    return res.status(400).send({ error: "Invalid filters!" });
  }
  try {
    const _idGender = await User.find({
      gender: req.body.gender,
    }).select("_id");

    const _idLocation = await User.find({
      location: req.body.location,
    }).select("_id");

    const _idBoth = await User.find({
      gender: req.body.gender,
      location: req.body.location,
    }).select("_id");

    if (req.body.location && req.body.gender) {
      if (req.body.start_date && req.body.end_date) {
        req.body.start_date = new Date(req.body.start_date);
        req.body.end_date = new Date(req.body.end_date);
        diffInTime =
          req.body.end_date.getTime() - req.body.start_date.getTime();
        diffInDays = Math.round(diffInTime / oneDay);

        count = await Tweet.count({
          userId: _idBoth,
          createdAt: { $gte: req.body.start_date, $lte: req.body.end_date },
          isRetweeted: true,
        });
        avg = count / diffInDays;
      } else if (req.body.start_date) {
        req.body.start_date = new Date(req.body.start_date);
        req.body.end_date = new Date(req.body.end_date);
        diffInTime = now.getTime() - req.body.start_date.getTime();
        diffInDays = Math.round(diffInTime / oneDay);
        count = await Tweet.count({
          userId: _idBoth,
          createdAt: { $gte: req.body.start_date, $lte: now },
          isRetweeted: true,
        });
        avg = count / diffInDays;
      } else if (req.body.end_date) {
        req.body.start_date = new Date(req.body.start_date);
        req.body.end_date = new Date(req.body.end_date);
        diffInTime = req.body.end_date.getTime() - lastWeeek.getTime();
        diffInDays = Math.round(diffInTime / oneDay);
        count = await Tweet.count({
          userId: _idBoth,
          createdAt: { $gte: lastWeeek, $lte: req.body.end_date },
          isRetweeted: true,
        });
        avg = count / diffInDays;
      } else {
        req.body.start_date = new Date(req.body.start_date);
        req.body.end_date = new Date(req.body.end_date);
        diffInTime = now.getTime() - lastWeeek.getTime();
        diffInDays = Math.round(diffInTime / oneDay);
        count = await Tweet.count({
          userId: _idBoth,
          createdAt: { $lte: now, $gte: lastWeeek },
          isRetweeted: true,
        });
        avg = count / diffInDays;
      }
    } else if (req.body.location) {
      if (req.body.start_date && req.body.end_date) {
        req.body.start_date = new Date(req.body.start_date);
        req.body.end_date = new Date(req.body.end_date);
        diffInTime =
          req.body.end_date.getTime() - req.body.start_date.getTime();
        diffInDays = Math.round(diffInTime / oneDay);
        count = await Tweet.count({
          userId: _idLocation,
          createdAt: { $gte: req.body.start_date, $lte: req.body.end_date },
          isRetweeted: true,
        });
        avg = count / diffInDays;
      } else if (req.body.start_date) {
        req.body.start_date = new Date(req.body.start_date);
        req.body.end_date = new Date(req.body.end_date);
        diffInTime = now.getTime() - req.body.start_date.getTime();
        diffInDays = Math.round(diffInTime / oneDay);
        count = await Tweet.count({
          userId: _idLocation,
          createdAt: { $gte: req.body.start_date, $lte: now },
          isRetweeted: true,
        });
        avg = count / diffInDays;
      } else if (req.body.end_date) {
        req.body.start_date = new Date(req.body.start_date);
        req.body.end_date = new Date(req.body.end_date);
        diffInTime = req.body.end_date.getTime() - lastWeeek.getTime();
        diffInDays = Math.round(diffInTime / oneDay);
        count = await Tweet.count({
          userId: _idLocation,
          createdAt: { $gte: lastWeeek, $lte: req.body.end_date },
          isRetweeted: true,
        });
        avg = count / diffInDays;
      } else {
        req.body.start_date = new Date(req.body.start_date);
        req.body.end_date = new Date(req.body.end_date);
        diffInTime = now.getTime() - lastWeeek.getTime();
        diffInDays = Math.round(diffInTime / oneDay);
        count = await Tweet.count({
          userId: _idLocation,
          createdAt: { $lte: now, $gte: lastWeeek },
          isRetweeted: true,
        });
        avg = count / diffInDays;
      }
    } else if (req.body.gender) {
      if (req.body.start_date && req.body.end_date) {
        req.body.start_date = new Date(req.body.start_date);
        req.body.end_date = new Date(req.body.end_date);
        diffInTime =
          req.body.end_date.getTime() - req.body.start_date.getTime();
        diffInDays = Math.round(diffInTime / oneDay);
        count = await Tweet.count({
          userId: _idGender,
          createdAt: { $gte: req.body.start_date, $lte: req.body.end_date },
          isRetweeted: true,
        });
        avg = count / diffInDays;
      } else if (req.body.start_date) {
        req.body.start_date = new Date(req.body.start_date);
        req.body.end_date = new Date(req.body.end_date);
        diffInTime = now.getTime() - req.body.start_date.getTime();
        diffInDays = Math.round(diffInTime / oneDay);
        count = await Tweet.count({
          userId: _idGender,
          createdAt: { $gte: req.body.start_date, $lte: now },
          isRetweeted: true,
        });
        avg = count / diffInDays;
      } else if (req.body.end_date) {
        req.body.start_date = new Date(req.body.start_date);
        req.body.end_date = new Date(req.body.end_date);
        diffInTime = req.body.end_date.getTime() - lastWeeek.getTime();
        diffInDays = Math.round(diffInTime / oneDay);
        count = await Tweet.count({
          userId: _idGender,
          createdAt: { $gte: lastWeeek, $lte: req.body.end_date },
          isRetweeted: true,
        });
        avg = count / diffInDays;
      } else {
        req.body.start_date = new Date(req.body.start_date);
        req.body.end_date = new Date(req.body.end_date);
        diffInTime = now.getTime() - lastWeeek.getTime();
        diffInDays = Math.round(diffInTime / oneDay);
        count = await Tweet.count({
          userId: _idGender,
          createdAt: { $lte: now, $gte: lastWeeek },
          isRetweeted: true,
        });
        avg = count / diffInDays;
      }
    } else {
      if (req.body.start_date && req.body.end_date) {
        req.body.start_date = new Date(req.body.start_date);
        req.body.end_date = new Date(req.body.end_date);
        diffInTime =
          req.body.end_date.getTime() - req.body.start_date.getTime();
        diffInDays = Math.round(diffInTime / oneDay);
        count = await Tweet.count({
          createdAt: { $gte: req.body.start_date, $lte: req.body.end_date },
          isRetweeted: true,
        });
        avg = count / diffInDays;
      } else if (req.body.start_date) {
        req.body.start_date = new Date(req.body.start_date);
        req.body.end_date = new Date(req.body.end_date);
        diffInTime = now.getTime() - req.body.start_date.getTime();
        diffInDays = Math.round(diffInTime / oneDay);
        count = await Tweet.count({
          createdAt: { $gte: req.body.start_date, $lte: now },
          isRetweeted: true,
        });
        avg = count / diffInDays;
      } else if (req.body.end_date) {
        req.body.start_date = new Date(req.body.start_date);
        req.body.end_date = new Date(req.body.end_date);
        diffInTime = req.body.end_date.getTime() - lastWeeek.getTime();
        diffInDays = Math.round(diffInTime / oneDay);
        count = await Tweet.count({
          createdAt: { $gte: lastWeeek, $lte: req.body.end_date },
          isRetweeted: true,
        });
        avg = count / diffInDays;
      } else {
        req.body.start_date = new Date(req.body.start_date);
        req.body.end_date = new Date(req.body.end_date);
        diffInTime = now.getTime() - lastWeeek.getTime();
        diffInDays = Math.round(diffInTime / oneDay);
        count = await Tweet.count({
          createdAt: { $lte: now, $gte: lastWeeek },
          isRetweeted: true,
        });
        avg = count / diffInDays;
      }
    }
    res.status(200).send({
      count: count,
      avgPerDay: avg,
      message: "Retweets counted successfully",
    });
  } catch (e) {
    res.status(500).send({ message: "Internal server error" });
  }
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////Likes////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.get("/dashboard/likes", auth, async (req, res) => {
  let count = null;
  let avg = null;
  let now = new Date();
  let lastWeeek = new Date() - 7 * 24 * 60 * 60 * 1000;
  lastWeeek = new Date(lastWeeek);
  const oneDay = 1000 * 60 * 60 * 24;
  let diffInTime = null;
  let diffInDays = null;
  if (req.body.start_date > req.body.end_date) {
    return res.status(400).send({ error: "Invalid filters!" });
  }
  try {
    const _idGender = await User.find({
      gender: req.body.gender,
    }).select("_id");

    const _idLocation = await User.find({
      location: req.body.location,
    }).select("_id");

    const _idBoth = await User.find({
      gender: req.body.gender,
      location: req.body.location,
    }).select("_id");
    if (req.body.location && req.body.gender) {
      if (req.body.start_date && req.body.end_date) {
        req.body.start_date = new Date(req.body.start_date);
        req.body.end_date = new Date(req.body.end_date);
        diffInTime =
          req.body.end_date.getTime() - req.body.start_date.getTime();
        diffInDays = Math.round(diffInTime / oneDay);

        count = await Like.count({
          createdAt: { $gte: req.body.start_date, $lte: req.body.end_date },
          userId: _idBoth,
        });
        avg = count / diffInDays;
      } else if (req.body.start_date) {
        req.body.start_date = new Date(req.body.start_date);
        req.body.end_date = new Date(req.body.end_date);
        diffInTime = now.getTime() - req.body.start_date.getTime();
        diffInDays = Math.round(diffInTime / oneDay);
        count = await Like.count({
          createdAt: { $gte: req.body.start_date, $lte: now },
          userId: _idBoth,
        });
        avg = count / diffInDays;
      } else if (req.body.end_date) {
        req.body.start_date = new Date(req.body.start_date);
        req.body.end_date = new Date(req.body.end_date);
        diffInTime = req.body.end_date.getTime() - lastWeeek.getTime();
        diffInDays = Math.round(diffInTime / oneDay);
        count = await Like.count({
          createdAt: { $gte: lastWeeek, $lte: req.body.end_date },
          userId: _idBoth,
        });
        avg = count / diffInDays;
      } else {
        req.body.start_date = new Date(req.body.start_date);
        req.body.end_date = new Date(req.body.end_date);
        diffInTime = now.getTime() - lastWeeek.getTime();
        diffInDays = Math.round(diffInTime / oneDay);
        count = await Like.count({
          createdAt: { $lte: now, $gte: lastWeeek },
          userId: _idBoth,
        });
        avg = count / diffInDays;
      }
    } else if (req.body.location) {
      if (req.body.start_date && req.body.end_date) {
        req.body.start_date = new Date(req.body.start_date);
        req.body.end_date = new Date(req.body.end_date);
        diffInTime =
          req.body.end_date.getTime() - req.body.start_date.getTime();
        diffInDays = Math.round(diffInTime / oneDay);
        count = await Like.count({
          createdAt: { $gte: req.body.start_date, $lte: req.body.end_date },
          userId: _idLocation,
        });
        avg = count / diffInDays;
      } else if (req.body.start_date) {
        req.body.start_date = new Date(req.body.start_date);
        req.body.end_date = new Date(req.body.end_date);
        diffInTime = now.getTime() - req.body.start_date.getTime();
        diffInDays = Math.round(diffInTime / oneDay);
        count = await Like.count({
          createdAt: { $gte: req.body.start_date, $lte: now },
          userId: _idLocation,
        });
        avg = count / diffInDays;
      } else if (req.body.end_date) {
        req.body.start_date = new Date(req.body.start_date);
        req.body.end_date = new Date(req.body.end_date);
        diffInTime = req.body.end_date.getTime() - lastWeeek.getTime();
        diffInDays = Math.round(diffInTime / oneDay);
        count = await Like.count({
          createdAt: { $gte: lastWeeek, $lte: req.body.end_date },
          userId: _idLocation,
        });
        avg = count / diffInDays;
      } else {
        req.body.start_date = new Date(req.body.start_date);
        req.body.end_date = new Date(req.body.end_date);
        diffInTime = now.getTime() - lastWeeek.getTime();
        diffInDays = Math.round(diffInTime / oneDay);
        count = await Like.count({
          createdAt: { $lte: now, $gte: lastWeeek },
          userId: _idLocation,
        });
        avg = count / diffInDays;
      }
    } else if (req.body.gender) {
      if (req.body.start_date && req.body.end_date) {
        req.body.start_date = new Date(req.body.start_date);
        req.body.end_date = new Date(req.body.end_date);
        diffInTime =
          req.body.end_date.getTime() - req.body.start_date.getTime();
        diffInDays = Math.round(diffInTime / oneDay);
        count = await Like.count({
          createdAt: { $gte: req.body.start_date, $lte: req.body.end_date },
          userId: _idGender,
        });
        avg = count / diffInDays;
      } else if (req.body.start_date) {
        req.body.start_date = new Date(req.body.start_date);
        req.body.end_date = new Date(req.body.end_date);
        diffInTime = now.getTime() - req.body.start_date.getTime();
        diffInDays = Math.round(diffInTime / oneDay);
        count = await Like.find({
          createdAt: { $gte: req.body.start_date, $lte: now },
          userId: _idGender,
        });
        avg = count / diffInDays;
      } else if (req.body.end_date) {
        req.body.start_date = new Date(req.body.start_date);
        req.body.end_date = new Date(req.body.end_date);
        diffInTime = req.body.end_date.getTime() - lastWeeek.getTime();
        diffInDays = Math.round(diffInTime / oneDay);
        count = await Like.count({
          createdAt: { $gte: lastWeeek, $lte: req.body.end_date },
          userId: _idGender,
        });
        avg = count / diffInDays;
      } else {
        req.body.start_date = new Date(req.body.start_date);
        req.body.end_date = new Date(req.body.end_date);
        diffInTime = now.getTime() - lastWeeek.getTime();
        diffInDays = Math.round(diffInTime / oneDay);
        count = await Like.count({
          createdAt: { $lte: now, $gte: lastWeeek },
          userId: _idGender,
        });
        avg = count / diffInDays;
      }
    } else {
      if (req.body.start_date && req.body.end_date) {
        req.body.start_date = new Date(req.body.start_date);
        req.body.end_date = new Date(req.body.end_date);
        diffInTime =
          req.body.end_date.getTime() - req.body.start_date.getTime();
        diffInDays = Math.round(diffInTime / oneDay);
        count = await Like.count({
          createdAt: { $gte: req.body.start_date, $lte: req.body.end_date },
        });
        avg = count / diffInDays;
      } else if (req.body.start_date) {
        req.body.start_date = new Date(req.body.start_date);
        req.body.end_date = new Date(req.body.end_date);
        diffInTime = now.getTime() - req.body.start_date.getTime();
        diffInDays = Math.round(diffInTime / oneDay);
        count = await Like.count({
          createdAt: { $gte: req.body.start_date, $lte: now },
        });
        avg = count / diffInDays;
      } else if (req.body.end_date) {
        req.body.start_date = new Date(req.body.start_date);
        req.body.end_date = new Date(req.body.end_date);
        diffInTime = req.body.end_date.getTime() - lastWeeek.getTime();
        diffInDays = Math.round(diffInTime / oneDay);
        count = await Like.count({
          createdAt: { $gte: lastWeeek, $lte: req.body.end_date },
        });
        avg = count / diffInDays;
      } else {
        req.body.start_date = new Date(req.body.start_date);
        req.body.end_date = new Date(req.body.end_date);
        diffInTime = now.getTime() - lastWeeek.getTime();
        diffInDays = Math.round(diffInTime / oneDay);
        count = await Like.count({
          createdAt: { $lte: now, $gte: lastWeeek },
        });
        avg = count / diffInDays;
      }
    }

    res.status(200).send({
      count: count,
      avgPerDay: avg,
      message: "Likes counted successfully",
    });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////Tweets////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.get("/dashboard/tweets", auth, async (req, res) => {
  let count = null;
  let avg = null;
  let now = new Date();
  let lastWeeek = new Date() - 7 * 24 * 60 * 60 * 1000;
  lastWeeek = new Date(lastWeeek);

  const oneDay = 1000 * 60 * 60 * 24;
  let diffInTime = null;
  let diffInDays = null;
  if (req.body.start_date > req.body.end_date) {
    return res.status(400).send({ error: "Invalid filters!" });
  }
  try {
    const _idGender = await User.find({
      gender: req.body.gender,
    }).select("_id");
    const _idLocation = await User.find({
      location: req.body.location,
    }).select("_id");

    const _idBoth = await User.find({
      gender: req.body.gender,
      location: req.body.location,
    }).select("_id");

    if (req.body.location && req.body.gender) {
      if (req.body.start_date && req.body.end_date) {
        req.body.start_date = new Date(req.body.start_date);
        req.body.end_date = new Date(req.body.end_date);
        diffInTime =
          req.body.end_date.getTime() - req.body.start_date.getTime();
        diffInDays = Math.round(diffInTime / oneDay);

        count = await Tweet.count({
          userId: _idBoth,
          createdAt: { $gte: req.body.start_date, $lte: req.body.end_date },
        });
        avg = count / diffInDays;
      } else if (req.body.start_date) {
        req.body.start_date = new Date(req.body.start_date);
        req.body.end_date = new Date(req.body.end_date);
        diffInTime = now.getTime() - req.body.start_date.getTime();
        diffInDays = Math.round(diffInTime / oneDay);
        count = await Tweet.count({
          userId: _idBoth,
          createdAt: { $gte: req.body.start_date, $lte: now },
        });
        avg = count / diffInDays;
      } else if (req.body.end_date) {
        req.body.start_date = new Date(req.body.start_date);
        req.body.end_date = new Date(req.body.end_date);
        diffInTime = req.body.end_date.getTime() - lastWeeek.getTime();
        diffInDays = Math.round(diffInTime / oneDay);
        count = await Tweet.count({
          userId: _idBoth,
          createdAt: { $gte: lastWeeek, $lte: req.body.end_date },
        });
        avg = count / diffInDays;
      } else {
        req.body.start_date = new Date(req.body.start_date);
        req.body.end_date = new Date(req.body.end_date);
        diffInTime = now.getTime() - lastWeeek.getTime();
        diffInDays = Math.round(diffInTime / oneDay);
        count = await Tweet.count({
          userId: _idBoth,
          createdAt: { $lte: now, $gte: lastWeeek },
        });
        avg = count / diffInDays;
      }
    } else if (req.body.location) {
      if (req.body.start_date && req.body.end_date) {
        req.body.start_date = new Date(req.body.start_date);
        req.body.end_date = new Date(req.body.end_date);
        diffInTime =
          req.body.end_date.getTime() - req.body.start_date.getTime();
        diffInDays = Math.round(diffInTime / oneDay);
        count = await Tweet.count({
          userId: _idLocation,
          createdAt: { $gte: req.body.start_date, $lte: req.body.end_date },
        });
        avg = count / diffInDays;
      } else if (req.body.start_date) {
        req.body.start_date = new Date(req.body.start_date);
        req.body.end_date = new Date(req.body.end_date);
        diffInTime = now.getTime() - req.body.start_date.getTime();
        diffInDays = Math.round(diffInTime / oneDay);
        count = await Tweet.count({
          userId: _idLocation,
          createdAt: { $gte: req.body.start_date, $lte: now },
        });
        avg = count / diffInDays;
      } else if (req.body.end_date) {
        req.body.start_date = new Date(req.body.start_date);
        req.body.end_date = new Date(req.body.end_date);
        diffInTime = req.body.end_date.getTime() - lastWeeek.getTime();
        diffInDays = Math.round(diffInTime / oneDay);
        count = await Tweet.count({
          userId: _idLocation,
          createdAt: { $gte: lastWeeek, $lte: req.body.end_date },
        });
        avg = count / diffInDays;
      } else {
        req.body.start_date = new Date(req.body.start_date);
        req.body.end_date = new Date(req.body.end_date);
        diffInTime = now.getTime() - lastWeeek.getTime();
        diffInDays = Math.round(diffInTime / oneDay);
        count = await Tweet.count({
          userId: _idLocation,
          createdAt: { $lte: now, $gte: lastWeeek },
        });
        avg = count / diffInDays;
      }
    } else if (req.body.gender) {
      if (req.body.start_date && req.body.end_date) {
        req.body.start_date = new Date(req.body.start_date);
        req.body.end_date = new Date(req.body.end_date);
        diffInTime =
          req.body.end_date.getTime() - req.body.start_date.getTime();
        diffInDays = Math.round(diffInTime / oneDay);
        count = await Tweet.count({
          userId: _idGender,
          createdAt: { $gte: req.body.start_date, $lte: req.body.end_date },
        });
        avg = count / diffInDays;
      } else if (req.body.start_date) {
        req.body.start_date = new Date(req.body.start_date);
        req.body.end_date = new Date(req.body.end_date);
        diffInTime = now.getTime() - req.body.start_date.getTime();
        diffInDays = Math.round(diffInTime / oneDay);
        count = await Tweet.count({
          userId: _idGender,
          createdAt: { $gte: req.body.start_date, $lte: now },
        });
        avg = count / diffInDays;
      } else if (req.body.end_date) {
        req.body.start_date = new Date(req.body.start_date);
        req.body.end_date = new Date(req.body.end_date);
        diffInTime = req.body.end_date.getTime() - lastWeeek.getTime();
        diffInDays = Math.round(diffInTime / oneDay);
        count = await Tweet.count({
          userId: _idGender,
          createdAt: { $gte: lastWeeek, $lte: req.body.end_date },
        });
        avg = count / diffInDays;
      } else {
        req.body.start_date = new Date(req.body.start_date);
        req.body.end_date = new Date(req.body.end_date);
        diffInTime = now.getTime() - lastWeeek.getTime();
        diffInDays = Math.round(diffInTime / oneDay);
        count = await Tweet.count({
          userId: _idGender,
          createdAt: { $lte: now, $gte: lastWeeek },
        });
        avg = count / diffInDays;
      }
    } else {
      if (req.body.start_date && req.body.end_date) {
        req.body.start_date = new Date(req.body.start_date);
        req.body.end_date = new Date(req.body.end_date);
        diffInTime =
          req.body.end_date.getTime() - req.body.start_date.getTime();
        diffInDays = Math.round(diffInTime / oneDay);
        count = await Tweet.count({
          createdAt: { $gte: req.body.start_date, $lte: req.body.end_date },
        });
        avg = count / diffInDays;
      } else if (req.body.start_date) {
        req.body.start_date = new Date(req.body.start_date);
        req.body.end_date = new Date(req.body.end_date);
        diffInTime = now.getTime() - req.body.start_date.getTime();
        diffInDays = Math.round(diffInTime / oneDay);
        count = await Tweet.count({
          createdAt: { $gte: req.body.start_date, $lte: now },
        });
        avg = count / diffInDays;
      } else if (req.body.end_date) {
        req.body.start_date = new Date(req.body.start_date);
        req.body.end_date = new Date(req.body.end_date);
        diffInTime = req.body.end_date.getTime() - lastWeeek.getTime();
        diffInDays = Math.round(diffInTime / oneDay);
        count = await Tweet.count({
          createdAt: { $gte: lastWeeek, $lte: req.body.end_date },
        });
        avg = count / diffInDays;
      } else {
        req.body.start_date = new Date(req.body.start_date);
        req.body.end_date = new Date(req.body.end_date);
        diffInTime = now.getTime() - lastWeeek.getTime();
        diffInDays = Math.round(diffInTime / oneDay);
        count = await Tweet.count({
          createdAt: { $lte: now, $gte: lastWeeek },
        });
        avg = count / diffInDays;
      }
    }

    res.status(200).send({
      count: count,
      avgPerDay: avg,
      message: "Tweets counted successfully",
    });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

module.exports = router;
