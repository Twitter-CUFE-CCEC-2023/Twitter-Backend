const express = require("express");
const mongoose = require("mongoose");

const adminRoutes = require("./routes/admin");
const userRoutes = require("./routes/user");
const tweetRoutes = require("./routes/tweet");
const timelineRoutes = require("./routes/timeline");

const app = express();
const port = process.env.Port || 3000;

const connectionurl = "mongodb://localhost:27017/twitter-clone";

app.use(express.json());
app.use(adminRoutes);
app.use(userRoutes);
app.use(tweetRoutes);
app.use(timelineRoutes);

app.listen(port, () => {
  mongoose.connect(
    connectionurl,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    (error, result) => {
      if (error) {
        console.log("Error in connecting to database");
      } else {
        console.log("Database connected successfully");
      }
    }
  );
});
