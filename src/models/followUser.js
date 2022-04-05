const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FollowUserSchema = new Schema(
  {
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
  },
  {
    timestamps: true,
  }
);

const FollowUser = mongoose.model("followUser", FollowUserSchema);

module.exports = FollowUser;
