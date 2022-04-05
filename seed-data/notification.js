const notificationType = require("./../seed-data/constants/notificationType");

const notifications = [
  {
    _id: "624a6598ce588b8cd1e84f6f",
    userId: "624a4a94c66738f13854b474",
    content: "Yousuf Mokhtar has retweeted your tweet",
    notificationTypeId: notificationType.retweet._id,
    relatedUserId: "624a52d75ff69df002d25035",
    isRead: true,
  },
  {
    _id: "624a6956a807a4016790d545",
    userId: "624a4a94c66738f13854b474",
    content: "Yousuf Mokhtar has liked your tweet",
    notificationTypeId: notificationType.like._id,
    relatedUserId: "624a52d75ff69df002d25035",
    isRead: true,
  },
  {
    _id: "624a6962a85ed5a6d6ca9373",
    userId: "624a4a94c66738f13854b474",
    tweetId: "624a48f7244f88876b5bed2b",
    notificationTypeId: notificationType.reply._id,
    relatedUserId: "624a52d75ff69df002d25035",
    isRead: true,
  },
  {
    _id: "624a696f57adc725989d2de5",
    userId: "624a4a94c66738f13854b474",
    tweetId: "624a49017e14fbfa14e5b5b4",
    notificationTypeId: notificationType.reply._id,
    relatedUserId: "624a52d75ff69df002d25035",
    isRead: false,
  },
  {
    _id: "624a697cfa996c1c12f79541",
    userId: "624a4a94c66738f13854b474",
    content: "Yousuf Mokhtar started following you",
    notificationTypeId: notificationType.follow._id,
    relatedUserId: "624a52d75ff69df002d25035",
    isRead: false,
  },
  {
    _id: "624b88a4b51501b30d71386e",
    userId: "624a4a94c66738f13854b474",
    tweetId: "624a4914062642bd2fa6e586",
    notificationTypeId: notificationType.followingTweet._id,
    relatedUserId: "624a52d75ff69df002d25035",
    isRead: false,
  },
];

exports.data = notifications;