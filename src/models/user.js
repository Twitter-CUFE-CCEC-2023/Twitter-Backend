const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
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
      unique: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
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
      default: "",
    },
    bio: {
      type: String,
      trim: true,
      maxLength: 160,
      default: "",
    },
    website: {
      type: String,
      trim: true,
      maxLength: 100,
      default: "",
    },
    verificationCode: {
      type: Number,
      required: true,
      default: -1,
    },
    verificationCodeExpiration: {
      type: Date,
      required: true,
      default: new Date(new Date().setHours(new Date().getHours() + 1)),
    },
    resetPasswordCode: {
      type: Number,
      required: true,
      default: -1,
    },
    resetPasswordCodeExpiration: {
      type: Date,
      default: new Date(new Date().setHours(new Date().getHours() + 1)),
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
    profilePicture: {
      type: String,
      trim: true,
      default: "",
    },
    coverPicture: {
      type: String,
      trim: true,
      default: "",
    },
    roleId: {
      type: Schema.Types.ObjectId,
      ref: "userRole",
      index: true,
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
    monthDayBirthAccessId: {
      type: Schema.Types.ObjectId,
      ref: "birthInformationAccess",
    },
    yearBirthAccessId: {
      type: Schema.Types.ObjectId,
      ref: "birthInformationAccess",
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("user", UserSchema);

module.exports = User;
