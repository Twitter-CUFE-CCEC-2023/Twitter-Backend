const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = mongoose.model("user", {
  name: {
    type: String,
    required: true,
    trim: true,
    maxLength: 50,
  },
  username: {
    type: String,
    required: true,
    trim: true,
    minLength: 5,
    maxLength: 14,
    unique: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
    trim: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    trim: true,
    maxLength: 30,
  },
  bio: {
    type: String,
    trim: true,
    maxLength: 160,
  },
  website: {
    type: String,
    trim: true,
    maxLength: 100,
  },
  verificationCode: {
    type: Number
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  profilePicture: {
    type: String,
    trim: true,
  },
  coverPicture: {
    type: String,
    trim: true,
  },
  roleId: {
    type: Schema.Types.ObjectId,
    ref: "userRole",
    index: true
  },
  isBanned: {
    type: Boolean,
    default: false,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  monthDayBirthAccessId: {
    type: Schema.Types.ObjectId,
    ref: "birthInformationAccess",
  },
  yearBirthAccessId: {
    type: Schema.Types.ObjectId,
    ref: "birthInformationAccess",
  },
});

module.exports = User;