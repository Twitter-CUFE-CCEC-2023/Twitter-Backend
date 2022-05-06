const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const UserVapidKeys = require("./userVapidKeys");
const webPush = require("web-push");
const NotificationSub = require("./notificationsSub");
const { detect } = require("detect-browser");

require("./user");
require("./tweet");

const browser = detect();

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
    tweet = await Tweet.getTweetObject(notification.tweetId, notification.userId.username, false);
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

NotificationSchema.statics.sendNotification = async function (
  userId,
  title,
  body
) {
  const vapidKeys = await UserVapidKeys.findOne({ userId: userId });
  if (!vapidKeys) {
    return null;
  }
  const payload = {
    title: title,
    body: body,
  };
  const options = {
    vapidDetails: {
      subject: "mailto:noreply@twittcloneteamone.xyz",
      publicKey: vapidKeys.publicKey,
      privateKey: vapidKeys.privateKey,
    },
  };
  const subscription = await NotificationSub.findOne({
    userId: userId,
    browser: browser.name,
    os: browser.os,
    version: browser.version,
  });

  if (subscription) {
    console.log(subscription);
    webPush.sendNotification(
      subscription.subscription,
      JSON.stringify(payload),
      options
    );
  }
};

const Notification = mongoose.model("notification", NotificationSchema);

module.exports = Notification;
