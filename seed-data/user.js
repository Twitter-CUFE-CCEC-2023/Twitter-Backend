const userRole = require('./constants/userRole');

const users = [
  {
    _id: "624a4a94c66738f13854b474",
    name: "Amr Zaki",
    username: "amrzaki",
    email: "amrzaki2000.az@gmail.com",
    password: "12345678",
    gender: "Male",
    dateOfBirth: "2000-10-17",
    roleId: userRole.defaultRole._id,
    isVerified: true,
    followers: ["YoussMokh"],
    followings: ["YoussMokh"],
  },
  {
    _id: "624a4fbf3f392aefdb4dd1c8",
    name: "Ahmed Elgarf",
    username: "ahmedElgarf",
    email: "ahmedelgarf94@gmail.com",
    password: "12345678",
    gender: "Male",
    dateOfBirth: "1999-4-10",
    roleId: userRole.adminRole._id,
    isVerified: true,
  },
  {
    _id: "624a52d75ff69df002d25035",
    name: "Yousuf Mokhtar",
    username: "YoussMokh",
    email: "mekha2000@gmail.com",
    password: "1234567890",
    gender: "Male",
    dateOfBirth: "2000-5-10",
    roleId: userRole.defaultRole._id,
    isVerified: true,
    followers: ["amrzaki"],
    followings: ["amrzaki"],
  },
];

exports.data = users;
