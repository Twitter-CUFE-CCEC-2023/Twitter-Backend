const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TweetSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
      ref: "user",
    },
    parentId: {
      type: Schema.Types.ObjectId,
      index: true,
      ref: "tweet",
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxLength: 280,
    },
    quoteComment: {
      type: String,
      default: null,
    },
    isRetweeted: {
      type: Boolean,
      default: false,
    },
    attachments: {
      type: [Schema.Types.ObjectId],
      default: [],
      ref: "attachment",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const Tweet = mongoose.model("tweet", TweetSchema);

module.exports = Tweet;
