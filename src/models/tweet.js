const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const likeModel = require("./../models/like");

const TweetSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      index: true,
      ref: "user",
    },
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
      default: null,
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
    tweetInfo: {},
    attachments: [
      {
        type: Schema.Types.ObjectId,
        default: [],
        ref: "attachment",
        index: true,
      },
    ],
    mentions: [
      {
        username: {
          type: String,
        },
        default: [],
      },
    ],
  },
  {
    timestamps: true,
  }
);

TweetSchema.statics.getTweetInfobyId = async (tweetId, username) => {
  try {
    const tweetInfo = {};

    tweetInfo["likesCount"] = await likeModel.count({ tweetId: tweetId });
    tweetInfo["retweetsCount"] = await Tweet.count({
      parentId: tweetId,
      isRetweeted: true,
    });
    tweetInfo["repliesCount"] = await Tweet.count({
      parentId: tweetId,
      isRetweeted: false,
    });

    const likedTweet = await likeModel.findOne({
      tweetId: tweetId,
      likerUsername: username,
    });
    if (likedTweet) {
      tweetInfo["isLiked"] = true;
    } else {
      tweetInfo["isLiked"] = false;
    }

    const retweetedTweet = await Tweet.findOne({
      parentId: tweetId,
      isRetweeted: true,
      username: username,
    });
    if (retweetedTweet) {
      tweetInfo["isRetweeted"] = true;
    } else {
      tweetInfo["isRetweeted"] = false;
    }

    tweetInfo["quoteRepliesCount"] = await Tweet.count({
      parentId: tweetId,
      isRetweeted: true,
      quoteComment: { $ne: null },
    });
    return tweetInfo;
  } catch (err) {
    throw err;
  }
};

const Tweet = mongoose.model("tweet", TweetSchema);

module.exports = Tweet;
