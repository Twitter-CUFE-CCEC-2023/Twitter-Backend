const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AttachmentSchema = new Schema(
  {
    fileName: {
      type: String,
      required: true,
      trim: true,
    },
    fileType: {
      type: String,
      required: true,
      trim: true,
    },
    filePath: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Attachment = mongoose.model("attachment", AttachmentSchema);

module.exports = Attachment;
