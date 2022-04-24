const mongoose = require("mongoose");
const Schema = mongoose.Schema;
require("./like");
require("./user");

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
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

TweetSchema.statics.getTweetObject = async function (tweet) {
  const Like = mongoose.model('like');

  const likesCount = await lLike.count({ tweetId: tweet._id });
  const retweetsCount = await Tweet.count({
    parentId: tweet._id,
    isRetweeted: true,
  });
  const repliesCount = await Tweet.count({
    parentId: tweet._id,
    isRetweeted: false,
  });
  const quotesCount = await Tweet.count({
    parentId: tweet._id,
    isRetweeted: true,
    quoteComment: { $ne: null },
  });
  const likedTweet = await Like.findOne({
    tweetId: tweet._id,
    likerUsername: tweet.username,
  });
  const retweetedTweet = await Tweet.findOne({
    parentId: tweet._id,
    isRetweeted: true,
    username: tweet.username,
  });
  const quotedTweet = await Tweet.findOne({
    parentId: tweet._id,
    isRetweeted: true,
    username: tweet.username,
    quoteComment: { $ne: null },
  });

  const User = mongoose.model('user');
  const user = await User.findOne({ username: tweet.username });
  const userObject = await User.generateUserObject(user);

  const tweetInfo = {
    id: tweet._id,
    content: tweet.content,
    user: userObject,
    likes_count: likesCount,
    retweets_count: retweetsCount,
    replies_count: repliesCount,
    quotes_count: quotesCount,
    is_liked: likedTweet ? true : false,
    is_retweeted: retweetedTweet ? true : false,
    is_quoted: quotedTweet ? true : false,
    is_reply: tweet.parentId ? true : false,
    quote_comment: quotedTweet ? quotedTweet.quoteComment : null,
    mentions: tweet.mentions,
    media: tweet.attachments,
    created_at: tweet.createdAt,
  };
  return tweetInfo;
};

TweetSchema.statics.getTweetReplies = async function (tweet) {
  const replyTweets = await Tweet.find({ parentId: tweet.id });
  tweet.replies = [];
  for (let i = 0; i < replyTweets.length; i++) {
    const tweet = replyTweets[i];
    const tweetObject = await Tweet.getTweetObject(tweet);
    tweet.replies.push(tweetObject);
  }
  return tweet;
};


const Tweet = mongoose.model("tweet", TweetSchema);

module.exports = Tweet;
