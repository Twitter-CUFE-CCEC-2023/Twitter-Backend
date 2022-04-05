const express = require("express");

const adminRoutes = require("../routes/admin");
const userRoutes = require("../routes/user");
const tweetRoutes = require("../routes/tweet");
const timelineRoutes = require("../routes/timeline");
const authRoutes = require("../routes/auth");

const app = express();

app.use(express.json());
app.use(adminRoutes);
app.use(userRoutes);
app.use(tweetRoutes);
app.use(timelineRoutes);
app.use(authRoutes);

module.exports = app;