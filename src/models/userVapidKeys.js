const mongoose = require("mongoose");
const Schema = mongoose.Schema;
require("./user");

const UserVapidKeysSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
      ref: "user",
    },
    publicKey: {
      type: String,
      required: true,
      trim: true,
    },
    privateKey: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const UserVapidKeys = mongoose.model("userVapidKeys", UserVapidKeysSchema);

module.exports = UserVapidKeys;