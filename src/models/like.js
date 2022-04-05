const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LikeSchema = new Schema(
  {
    likerId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
      ref: "user",
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
