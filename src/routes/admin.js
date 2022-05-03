const express = require("express");
const banUser = require("../models/banUser");
const User = require("../models/user");
const Tweet = require("../models/tweet");
const Like = require("../models/like");
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
    return res.status(400).send({ message: "Invalid updates!" });
  }
  try {
    banuser.save();
    const user = await User.findByIdAndUpdate(
      req.body.userId,
      { isBanned: true },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).send({ message: "User is not found" });
    }

    res.status(200).send({
      user: user,
      message: "User Banned successfully",
    });
  } catch (e) {
    res.status(500).send({ message: "Internal server error" });
  }
});

router.post("/dashboard/unban", auth, async (req, res) => {
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
      return res.status(404).send({ message: "User is not found" });
    }

    if (!banuser) {
      return res.status(404).send({ message: "User is not banned" });
    }

    res.status(200).send({
      user: user,
      message: "User was unbanned successfully",
    });
  } catch (e) {
    res.status(500).send({ message: "Internal server error" });
  }
});

router.get("/dashboard/users", auth, async (req, res) => {
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
    res.status(500).send({ message: "Internal server error" });
  }
});

// router.get("/dashboard/tweets",auth, async (req, res) => {
//   let count = 0;
//   let now = new Date();
//   let lastWeeek = new Date() - 7 * 24 * 60 * 60 * 1000;
//   if (req.body.start_date > req.body.end_date) {
//     return res.status(400).send({ error: "Invalid filters!" });
//   }
//   try {
//     if (req.body.start_date && req.body.end_date) {
//       count = await Tweet.count({
//         createdAt: { $gte: req.body.start_date, $lte: req.body.end_date },
//       });
//     } else if (req.body.start_date) {
//       count = await Tweet.count({
//         createdAt: { $gte: req.body.start_date, $lte: now },
//       });
//     } else if (req.body.end_date) {
//       count = await Tweet.count({
//         createdAt: { $gte: lastWeeek, $lte: req.body.end_date },
//       });
//     } else {
//       count = await Tweet.count({
//         createdAt: { $lte: now, $gte: lastWeeek },
//       });
//     }

//     res.status(200).send({
//       count: count,
//       message: "Tweets counted successfully",
//     });
//   } catch (e) {
//     res.status(500).send({"message": "Internal server error"});
//   }
// });

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
        }).populate({
          path: "userId",
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
        }).populate({
          path: "userId",
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
        }).populate({
          path: "userId",
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
        }).populate({
          path: "userId",
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
        }).populate({
          path: "userId",
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
        }).populate({
          path: "userId",
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
        }).populate({
          path: "userId",
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
        }).populate({
          path: "userId",
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
        }).populate({
          path: "userId",
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
        }).populate({
          path: "userId",
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
        }).populate({
          path: "userId",
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
        }).populate({
          path: "userId",
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

// router.get("/dashboard/likes", auth, async (req, res) => {
//   let count = null;
//   let avg = null;
//   let now = new Date();
//   let lastWeeek = new Date() - 7 * 24 * 60 * 60 * 1000;
//   lastWeeek = new Date(lastWeeek);

//   const oneDay = 1000 * 60 * 60 * 24;
//   let diffInTime = null;
//   let diffInDays = null;
//   if (req.body.start_date > req.body.end_date) {
//     return res.status(400).send({ error: "Invalid filters!" });
//   }
//   try {
//     const userGender = await User.find({
//       gender: req.body.gender,
//     }).select("username");

//     const userLocation = await User.find({
//       location: req.body.location,
//     }).select("username");

//     const userBoth = await User.find({
//       gender: req.body.gender,
//       location: req.body.location,
//     }).select("username");

//     if (req.body.location && req.body.gender) {
//       if (req.body.start_date && req.body.end_date) {
//         req.body.start_date = new Date(req.body.start_date);
//         req.body.end_date = new Date(req.body.end_date);
//         diffInTime =
//           req.body.end_date.getTime() - req.body.start_date.getTime();
//         diffInDays = Math.round(diffInTime / oneDay);

//         count = await Like.count({
//           likerUsername: userBoth,
//           createdAt: { $gte: req.body.start_date, $lte: req.body.end_date },
//         }).populate({
//           path: "likerUsername",
//         });
//         avg = count / diffInDays;
//       } else if (req.body.start_date) {
//         req.body.start_date = new Date(req.body.start_date);
//         req.body.end_date = new Date(req.body.end_date);
//         diffInTime = now.getTime() - req.body.start_date.getTime();
//         diffInDays = Math.round(diffInTime / oneDay);
//         count = await Like.count({
//           likerUsername: userBoth,
//           createdAt: { $gte: req.body.start_date, $lte: now },
//         }).populate({
//           path: "likerUsername",
//         });
//         avg = count / diffInDays;
//       } else if (req.body.end_date) {
//         req.body.start_date = new Date(req.body.start_date);
//         req.body.end_date = new Date(req.body.end_date);
//         diffInTime = req.body.end_date.getTime() - lastWeeek.getTime();
//         diffInDays = Math.round(diffInTime / oneDay);
//         count = await Like.count({
//           likerUsername: userBoth,
//           createdAt: { $gte: lastWeeek, $lte: req.body.end_date },
//         }).populate({
//           path: "likerUsername",
//         });
//         avg = count / diffInDays;
//       } else {
//         req.body.start_date = new Date(req.body.start_date);
//         req.body.end_date = new Date(req.body.end_date);
//         diffInTime = now.getTime() - lastWeeek.getTime();
//         diffInDays = Math.round(diffInTime / oneDay);
//         count = await Like.count({
//           likerUsername: userBoth,
//           createdAt: { $lte: now, $gte: lastWeeek },
//         }).populate({
//           path: "likerUsername",
//         });
//         avg = count / diffInDays;
//       }
//     } else if (req.body.location) {
//       if (req.body.start_date && req.body.end_date) {
//         req.body.start_date = new Date(req.body.start_date);
//         req.body.end_date = new Date(req.body.end_date);
//         diffInTime =
//           req.body.end_date.getTime() - req.body.start_date.getTime();
//         diffInDays = Math.round(diffInTime / oneDay);
//         count = await Like.count({
//           likerUsername: userLocation,
//           createdAt: { $gte: req.body.start_date, $lte: req.body.end_date },
//         }).populate({
//           path: "likerUsername",
//         });
//         avg = count / diffInDays;
//       } else if (req.body.start_date) {
//         req.body.start_date = new Date(req.body.start_date);
//         req.body.end_date = new Date(req.body.end_date);
//         diffInTime = now.getTime() - req.body.start_date.getTime();
//         diffInDays = Math.round(diffInTime / oneDay);
//         count = await Like.count({
//           likerUsername: userLocation,
//           createdAt: { $gte: req.body.start_date, $lte: now },
//         }).populate({
//           path: "likerUsername",
//         });
//         avg = count / diffInDays;
//       } else if (req.body.end_date) {
//         req.body.start_date = new Date(req.body.start_date);
//         req.body.end_date = new Date(req.body.end_date);
//         diffInTime = req.body.end_date.getTime() - lastWeeek.getTime();
//         diffInDays = Math.round(diffInTime / oneDay);
//         count = await Like.count({
//           likerUsername: userLocation,
//           createdAt: { $gte: lastWeeek, $lte: req.body.end_date },
//         }).populate({
//           path: "likerUsername",
//         });
//         avg = count / diffInDays;
//       } else {
//         req.body.start_date = new Date(req.body.start_date);
//         req.body.end_date = new Date(req.body.end_date);
//         diffInTime = now.getTime() - lastWeeek.getTime();
//         diffInDays = Math.round(diffInTime / oneDay);
//         count = await Like.count({
//           likerUsername: userLocation,
//           createdAt: { $lte: now, $gte: lastWeeek },
//         }).populate({
//           path: "likerUsername",
//         });
//         avg = count / diffInDays;
//       }
//     } else if (req.body.gender) {
//       if (req.body.start_date && req.body.end_date) {
//         req.body.start_date = new Date(req.body.start_date);
//         req.body.end_date = new Date(req.body.end_date);
//         diffInTime =
//           req.body.end_date.getTime() - req.body.start_date.getTime();
//         diffInDays = Math.round(diffInTime / oneDay);
//         count = await Like.count({
//           likerUsername: userGender,
//           createdAt: { $gte: req.body.start_date, $lte: req.body.end_date },
//         }).populate({
//           path: "likerUsername",
//         });
//         avg = count / diffInDays;
//       } else if (req.body.start_date) {
//         req.body.start_date = new Date(req.body.start_date);
//         req.body.end_date = new Date(req.body.end_date);
//         diffInTime = now.getTime() - req.body.start_date.getTime();
//         diffInDays = Math.round(diffInTime / oneDay);
//         count = await Like.count({
//           likerUsername: userGender,
//           createdAt: { $gte: req.body.start_date, $lte: now },
//         }).populate({
//           path: "likerUsername",
//         });
//         avg = count / diffInDays;
//       } else if (req.body.end_date) {
//         req.body.start_date = new Date(req.body.start_date);
//         req.body.end_date = new Date(req.body.end_date);
//         diffInTime = req.body.end_date.getTime() - lastWeeek.getTime();
//         diffInDays = Math.round(diffInTime / oneDay);
//         count = await Like.count({
//           likerUsername: userGender,
//           createdAt: { $gte: lastWeeek, $lte: req.body.end_date },
//         }).populate({
//           path: "likerUsername",
//         });
//         avg = count / diffInDays;
//       } else {
//         req.body.start_date = new Date(req.body.start_date);
//         req.body.end_date = new Date(req.body.end_date);
//         diffInTime = now.getTime() - lastWeeek.getTime();
//         diffInDays = Math.round(diffInTime / oneDay);
//         count = await Like.count({
//           likerUsername: userGender,
//           createdAt: { $lte: now, $gte: lastWeeek },
//         }).populate({
//           path: "likerUsername",
//         });
//         avg = count / diffInDays;
//       }
//     } else {
//       if (req.body.start_date && req.body.end_date) {
//         req.body.start_date = new Date(req.body.start_date);
//         req.body.end_date = new Date(req.body.end_date);
//         diffInTime =
//           req.body.end_date.getTime() - req.body.start_date.getTime();
//         diffInDays = Math.round(diffInTime / oneDay);
//         count = await Like.count({
//           createdAt: { $gte: req.body.start_date, $lte: req.body.end_date },
//         });
//         avg = count / diffInDays;
//       } else if (req.body.start_date) {
//         req.body.start_date = new Date(req.body.start_date);
//         req.body.end_date = new Date(req.body.end_date);
//         diffInTime = now.getTime() - req.body.start_date.getTime();
//         diffInDays = Math.round(diffInTime / oneDay);
//         count = await Like.count({
//           createdAt: { $gte: req.body.start_date, $lte: now },
//         });
//         avg = count / diffInDays;
//       } else if (req.body.end_date) {
//         req.body.start_date = new Date(req.body.start_date);
//         req.body.end_date = new Date(req.body.end_date);
//         diffInTime = req.body.end_date.getTime() - lastWeeek.getTime();
//         diffInDays = Math.round(diffInTime / oneDay);
//         count = await Like.count({
//           createdAt: { $gte: lastWeeek, $lte: req.body.end_date },
//         });
//         avg = count / diffInDays;
//       } else {
//         req.body.start_date = new Date(req.body.start_date);
//         req.body.end_date = new Date(req.body.end_date);
//         diffInTime = now.getTime() - lastWeeek.getTime();
//         diffInDays = Math.round(diffInTime / oneDay);
//         count = await Like.count({
//           createdAt: { $lte: now, $gte: lastWeeek },
//         });
//         avg = count / diffInDays;
//       }
//     }

//     res.status(200).send({
//       count: count,
//       message: "Likes counted successfully",
//     });
//   } catch (e) {
//     res.status(500).send({ message: e.message });
//   }
// });
///////////////////////////////////////////////Tweets////////////////////////////////////////////////////////////
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
        }).populate({
          path: "userId",
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
        }).populate({
          path: "userId",
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
        }).populate({
          path: "userId",
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
        }).populate({
          path: "userId",
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
        }).populate({
          path: "userId",
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
        }).populate({
          path: "userId",
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
        }).populate({
          path: "userId",
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
        }).populate({
          path: "userId",
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
        }).populate({
          path: "userId",
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
        }).populate({
          path: "userId",
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
        }).populate({
          path: "userId",
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
        }).populate({
          path: "userId",
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
