const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BanUser = mongoose.model("banUser", {
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    index: true,
    ref: "user",
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  banDuration: {
    type: Number,
    required: true,
  },
  reason: {
    type: String,
    required: true,
    trim: true,
  },
  isPermanent: {
    type: Boolean,
    default: false,
  },
});

module.exports = BanUser;