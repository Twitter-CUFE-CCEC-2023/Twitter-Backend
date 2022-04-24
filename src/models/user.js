const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const config = require("../config");
const tweetModel = require("./tweet");
const likeModel = require("./like");
const banUserModel = require("./banUser");
require("./constants/birthInformationAccess");
require("./constants/userRole");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.verificationEmail,
    pass: config.verificationPassword,
  },
});

const Schema = mongoose.Schema;
const birthInformationAccess = require("./../../seed-data/constants/birthInformationAccess");
const userRole = require("./../../seed-data/constants/userRole");

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
    birth_date: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    phone_number: {
      type: String,
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
    followers: [{ type: Schema.Types.ObjectId, ref: "user", index: true }],
    followings: [{ type: Schema.Types.ObjectId, ref: "user", index: true }],
    website: {
      type: String,
      trim: true,
      maxLength: 100,
      default: "",
    },
    verificationCode: {
      type: Number,
      default: -1,
    },
    verificationCodeExpiration: {
      type: Date,
      default: new Date(new Date().setHours(new Date().getHours() + 24)),
    },
    resetPasswordCode: {
      type: Number,
      default: -1,
    },
    resetPasswordCodeExpiration: {
      type: Date,
      default: new Date(new Date().setHours(new Date().getHours() + 24)),
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    tokens: [
      {
        token: {
          type: String,
        },
        token_expiration_date: {
          type: Date,
          default: new Date(new Date().setHours(new Date().getHours() + 24)),
        },
      },
    ],
    profile_picture: {
      type: String,
      trim: true,
      default: "",
    },
    cover_picture: {
      type: String,
      trim: true,
      default: "",
    },
    roleId: {
      type: Schema.Types.ObjectId,
      ref: "userRole",
      index: true,
      default: userRole.defaultRole
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
    monthDayBirthAccessId: {
      type: Schema.Types.ObjectId,
      ref: "birthInformationAccess",
      default: birthInformationAccess.followersAccess._id,
    },
    yearBirthAccessId: {
      type: Schema.Types.ObjectId,
      ref: "birthInformationAccess",
      default: birthInformationAccess.followersAccess._id,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 12);
  }
  if (user.isModified("resetCode")) {
    let resetCode = user.resetCode.toString();
    let lengthDiff = 6 - resetCode.length;
    for (let index = 0; index < lengthDiff; i++) {
      resetCode = "0" + resetCode;
    }
    user.resetCode = resetCode;
  }
  let verificationCode = (await User.getVerificationCode()).toString();
  let lengthDiff = 6 - verificationCode.length;
  for (let index = 0; index < lengthDiff; i++) {
    verificationCode = "0" + verificationCode;
  }
  user.verificationCode = verificationCode;
  next();
});

UserSchema.statics.checkConflict = async function (email) {
  const user = await User.findOne({ email });
  if (user) {
    return true;
  }
  return false;
};

// Verify user creds and check if username and password both are correct or if only the password is wrong.
UserSchema.statics.verifyCreds = async function (username_email, password) {
  const user = await User.findOne({
    $or: [{ email: username_email }, { username: username_email }],
  })
    .populate({ path: "roleId", select: "name" })
    .populate({
      path: "monthDayBirthAccessId",
      select: "name",
    })
    .populate({
      path: "yearBirthAccessId",
      select: "name",
    });

  if (user) {
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      return user;
    } else {
      return null;
    }
  } else {
    return null;
  }
};

UserSchema.statics.getUserByID = async function (id) {
  const user = await User.findOne({ _id: id });
  if (user) {
    return new User(user);
  }
  else {
    await null;
  }
};

UserSchema.statics.getUserByUsernameOrEmail = async function (username_email) {
  const user = await User.find({
    $or: [{ email: username_email }, { username: username_email }],
  });
  if (user[0]) {
    return new User(user[0]);
  } else {
    return null;
  }
};

UserSchema.methods.generateAuthToken = async function () {
  user = this;
  const token = jwt.sign(
    {
      _id: user._id,
      username: user.username,
    },
    "CCEC-23-Twitter-Clone-CUFE-CHS"
  );
  // await user.save();
  return token;
};

UserSchema.statics.getVerificationCode = async function () {
  let verificationCode = "";
  for (let iteration = 0; iteration < 6; iteration++) {
    verificationCode += "" + Math.floor(Math.random() * 10);
  }
  return verificationCode;
};

UserSchema.statics.generateResetPasswordCode = async function () {
  let resetCode = "";
  for (let iteration = 0; iteration < 6; iteration++) {
    resetCode += "" + Math.floor(Math.random() * 10);
  }
  return resetCode;
};

UserSchema.methods.sendVerifyEmail = async function (email, verificationCode) {
  const mailOptions = {
    from: process.env.verification_email,
    to: email,
    subject: "Verification email",
    text:
      "Thank you for signing up for an account on our site!\n\nPlease verify your account, below you can find your verification code which is valid for 24 hours.\n\nYour verification code is: \n" +
      verificationCode +
      "\n\nBest Regards.",
  };

  await transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      throw error;
    }
  });
  return verificationCode;
};

UserSchema.methods.sendVerifyResetEmail = async function (
  email,
  resetPasswordCode
) {
  const mailOptions = {
    from: process.env.verification_email,
    to: email,
    subject: "Password reset email",
    text:
      "Below you can find your password reset verification code which is valid for 24 hours.\n\nYour verification code is: \n" +
      resetPasswordCode +
      "\n\nPlease never share this code anywhere.\n\nBest Regards.",
  };

  await transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      throw error;
    }
  });
  return resetPasswordCode;
};

UserSchema.statics.generateUserObject = async function (user) {
  try {
    const tweetsCount = await tweetModel
      .find({ userId: user._id })
      .countDocuments();
    const likesCount = await likeModel
      .find({ likerUsername: user.username })
      .countDocuments();
    const banInfo = await banUserModel.findOne({ userId: user._id });

    const userObj = {
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      phone: user.phone_number,
      profile_image_url: user.profile_picture,
      cover_image_url: user.cover_picture,
      bio: user.bio,
      website: user.website,
      location: user.location,
      birth_date: user.birth_date,
      created_at: user.createdAt,
      role: user.roleId.name,
      followers_count: user.followers.length,
      following_count: user.followings.length,
      tweets_count: tweetsCount,
      likes_count: likesCount,
      isBanned: user.isBanned,
      isVerified: user.isVerified,
      month_day_access: user.monthDayBirthAccessId.name,
      year_access: user.yearBirthAccessId.name,
    };
    if (banInfo) {
      userObj.banDuration = banInfo.banDuration;
      userObj.permanentBan = banInfo.isPermanent;
    }
    return userObj;
  } catch (err) {
    return null;
  }
};

const User = mongoose.model("user", UserSchema);

module.exports = User;
