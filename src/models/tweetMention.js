const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TweetMentionsSchema = new Schema(
  {
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
  },
  {
    timestamps: true,
  }
);

const TweetMention = mongoose.model("tweetMention", TweetMentionsSchema);

module.exports = TweetMention;
