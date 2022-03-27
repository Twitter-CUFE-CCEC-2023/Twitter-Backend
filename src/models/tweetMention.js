const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TweetMention = mongoose.model("tweetMention", {
  userId: {
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

module.exports = TweetMention;