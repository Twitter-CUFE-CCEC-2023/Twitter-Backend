const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserAttachmentSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
      ref: "user",
    },
    attachmentId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
      ref: "attachment",
    },
  },
  {
    timestamps: true,
  }
);

const UserAttachment = mongoose.model("userAttachment", UserAttachmentSchema);

module.exports = UserAttachment;
