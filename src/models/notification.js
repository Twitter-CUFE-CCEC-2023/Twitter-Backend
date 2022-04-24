const mongoose = require("mongoose");
const Schema = mongoose.Schema;
require("./user");
require("./tweet");

const NotificationSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
      ref: "user",
    },
    tweetId: {
      type: Schema.Types.ObjectId,
      index: true,
      ref: "tweet",
      default: null,
    },
    content: {
      type: String,
      trim: true,
      default: "",
    },
    notificationTypeId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
      ref: "notificationType",
    },
    relatedUserId: {
      type: Schema.Types.ObjectId,
      index: true,
      ref: "user",
      default: null,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

NotificationSchema.statics.getNotificationObject = async function (
  notification
) {
  let tweet = null,
    user = null;

  if (notification.tweetId != null) {
    const Tweet = mongoose.model("tweet");
    tweet = await Tweet.getTweetObject(notification.tweetId, notification.userId.username);
  }
  if (notification.relatedUserId != null) {
    const User = mongoose.model("user");
    user = await User.generateUserObject(notification.relatedUserId);
  }

  const notificationObject = {
    _id: notification._id,
    content: notification.content,
    notification_type: notification.notificationTypeId.name,
    related_user: user,
    tweet: tweet,
    is_read: notification.isRead,
    created_at: notification.createdAt,
  };
  return notificationObject;
};

const Notification = mongoose.model("notification", NotificationSchema);

module.exports = Notification;
