const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
    },
    content: {
      type: String,
      required: true,
      trim: true,
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

const Notification = mongoose.model("notification", NotificationSchema);

module.exports = Notification;
