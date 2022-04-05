const like = {
  _id: "6240cd218b70b6ccc7a22cdf",
  name: "Like",
};

const retweet = {
  _id: "6240cd3dde42068d353a2bdf",
  name: "Retweet",
};

const follow = {
  _id: "6240cd6b3516844208b542d4",
  name: "Follow",
};

const reply = {
  _id: "6240cd8b8b70b6ccc7a22ce0",
  name: "Reply",
};

const followingTweet = {
  _id: "6240cddde4571e2cf49463f4",
  name: "Following Tweet",
};

const accountUpdate = {
  _id: "6240cf6f53dab85c8756307f",
  name: "Account Update",
};

const notificationTypes = [
  like,
  follow,
  reply,
  followingTweet,
  retweet,
  accountUpdate,
];

exports.data = notificationTypes;
exports.like = like;
exports.follow = follow;
exports.reply = reply;
exports.followingTweet = followingTweet;
exports.retweet = retweet;
exports.accountUpdate = accountUpdate;