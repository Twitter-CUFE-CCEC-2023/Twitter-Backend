const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Like = mongoose.model("like", {
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
  dateCreated: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Like;