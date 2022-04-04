const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "",
    pass: "",
  },
});

const Schema = mongoose.Schema;
const birthInformationAccess = require("./../../seed-data/constants/birthInformationAccess");

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
  user.verificationCode = await User.getVerificationCode();
  next();
});

UserSchema.statics.checkConflict = async function (email) {
  const user = await User.findOne({ email });
  if (user) {
    return true;
  }
  return false;
};

UserSchema.methods.generateAuthToken = async function () {
  user = this;
  const token = jwt.sign(
    {
      _id: user._id,
      username: user.username
    },
    "CCEC-23-Twitter-Clone-CUFE-CHS"
  );
  await user.save();
  return token;
};

UserSchema.statics.getVerificationCode = async function () {
  var verification_code = "";
  for (var iteration = 0; iteration < 6; iteration++) {
    verification_code += Math.floor(Math.random() * 10);
  }
  return verification_code;
};

UserSchema.methods.sendVerifyEmail = async function (email, verification_code) {
  const mailOptions = {
    from: process.env.verification_email,
    to: email,
    subject: "Verification email",
    text: "Thank you for singing up for an account on our site!\n\nPlease verify your account, below you can find your verification code which is valid for 24 hours.\n\nYour verification code is: \n" + verification_code + "\nBest Regards.",
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
    return verification_code;
  });
};

const User = mongoose.model("user", UserSchema);

module.exports = User;
