const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LikeSchema = new Schema(
  {
    likerUsername: {
      type: String,
      required: true,
      index: true,
      ref: "user",
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
      ref: "user"
    },
    tweetId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
      ref: "tweet",
    },
  },
  {
    timestamps: true
  }
);

const Like = mongoose.model("like", LikeSchema);

module.exports = Like;
