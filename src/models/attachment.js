const mongoose = require("mongoose");

const Attachment = mongoose.model("attachment", {
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
  dateCreated: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Attachment;