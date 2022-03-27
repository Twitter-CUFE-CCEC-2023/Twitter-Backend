const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FollowUser = mongoose.model("followUser", {
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    index: true,
    ref: "user",
  },
  followingUserId: {
    type: Schema.Types.ObjectId,
    required: true,
    index: true,
    ref: "user",
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
});

module.exports = FollowUser;