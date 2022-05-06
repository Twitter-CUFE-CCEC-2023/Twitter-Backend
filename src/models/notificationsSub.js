const mongoose = require("mongoose");
const Schema = mongoose.Schema;
require("./user");

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

const NotificationsSubModel = mongoose.model(
  "notificationsSub",
  NotificationsSubSchema
);

module.exports = NotificationsSubModel;
