const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Tweet = mongoose.model("tweet", {
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    index: true,
    ref: "user",
  },
  parentId: {
    type: Schema.Types.ObjectId,
    index: true,
    ref: "tweet",
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxLength: 280,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  quoteComment: {
    type: String,
    default: null,
  },
  isRetweeted: {
    type: Boolean,
    default: false,
  },
});

module.exports = Tweet;
