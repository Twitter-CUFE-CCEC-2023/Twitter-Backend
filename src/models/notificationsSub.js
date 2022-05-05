const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const webPush = require("web-push");
const { detect } = require("detect-browser");
require("./user");

const browser = detect();

const NotificationsSubSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
      ref: "user",
    },
    browser: {
      type: String,
      required: true,
      trim: true,
    },
    os: {
      type: String,
      required: true,
      trim: true,
    },
    version: {
      type: String,
      required: true,
      trim: true,
    },
    subscription: {
      type: Object,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

NotificationsSubSchema.statics.sendNotification = async function (
  userId,
  title,
  body
) {
  const vapidKeys = await UserVapidKeys.findOne({ userId: req.user._id });
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
  const subscription = await NotificationsSub.findOne({
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

const NotificationsSubModel = mongoose.model(
  "notificationsSub",
  NotificationsSubSchema
);

module.exports = NotificationsSubModel;
