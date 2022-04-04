const Tweet = require("../src/models/tweet");
const mongoose = require("mongoose");

const tweets = [
    {
        _id: "624a4052e28fb9d9c024671a",
        userId: "624a4a94c66738f13854b474",
        content: "Be a life-long learner, and stay a life-long learner.",
    },
    {
        _id: "624a48f143bd949036986953",
        userId: "624a4fbf3f392aefdb4dd1c8",
        content: "The best way to predict the future is to create it.",
    },
    {
        _id: "624a48f7244f88876b5bed2b",
        userId: "624a4a94c66738f13854b474",
        content: "The only way to do great work is to love what you do.",
    },
    {
        _id: "624a48fc091dc5e9ef70605e",
        userId: "624a4fbf3f392aefdb4dd1c8",
        content: "Be yourself; everyone else is already taken.",
    },
    {
        _id: "624a49017e14fbfa14e5b5b4",
        userId: "624a4a94c66738f13854b474",
        content: "If you can dream it, you can do it.",
    },
    {
        _id: "624a4906062642bd2fa6e585",
        userId: "624a4fbf3f392aefdb4dd1c8",
        content: "The harder you work for something, the greater you’ll feel when you achieve it.",
    },
    {
        _id: "624a49097e14fbfa14e5b5b5",
        userId: "624a4a94c66738f13854b474",
        content: "Be the change that you wish to see in the world.",
    },
    {
        _id: "624a490d7e14fbfa14e5b5b6",
        userId: "624a4fbf3f392aefdb4dd1c8",
        content: "Because you’re special, you’re unique, and you’re loved.",
    },
    {
        _id: "624a49117e14fbfa14e5b5b7",
        userId: "624a4a94c66738f13854b474",
        content: "Become who you are and you’ll be successful.",
    },
    {
        _id: "624a4914062642bd2fa6e586",
        userId: "624a4fbf3f392aefdb4dd1c8",
        content: "Practice makes perfect.",
    },
]
module.exports = tweets;