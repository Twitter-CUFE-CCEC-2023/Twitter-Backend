const userRole = require('./constants/userRole');

const users = [
  {
    _id: "624a4a94c66738f13854b474",
    name: "Amr Zaki",
    username: "amrzaki",
    email: "amrzaki2000.az@gmail.com",
    password: "12345678",
    dateOfBirth: "2000-10-17",
    roleId: userRole.defaultRole._id,
    isVerified: true
  },
  {
    _id: "624a4fbf3f392aefdb4dd1c8",
    name: "Ahmed Ibrahim",
    username: "ahmedElgarf",
    email: "ahmedelgarf@gmail.com",
    password: "12345678",
    dateOfBirth: "1999-4-10",
    roleId: userRole.adminRole._id,
    isVerified: true
  },
];

exports.data = users;
