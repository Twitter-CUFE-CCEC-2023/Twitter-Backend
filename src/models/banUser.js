const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BanUserSchema = Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
      ref: "user",
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
  },
  {
    timestamps: true,
  }
);

const BanUser = mongoose.model("banUser", BanUserSchema);

module.exports = BanUser;
