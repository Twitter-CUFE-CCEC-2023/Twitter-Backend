const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FollowUserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      index: true,
      ref: "user",
    },
    followingUsername: {
      type: String,
      required: true,
      index: true,
      ref: "user",
    },
  },
  {
    timestamps: true,
  }
);

const FollowUser = mongoose.model("followUser", FollowUserSchema);

module.exports = FollowUser;
