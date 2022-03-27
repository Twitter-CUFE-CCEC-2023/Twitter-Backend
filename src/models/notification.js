const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Notification = mongoose.model("notification", {
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
  dateCreated: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Notification;