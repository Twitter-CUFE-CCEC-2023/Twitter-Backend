const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const config = require("./config");

const adminRoutes = require("./routes/admin");
const userRoutes = require("./routes/user");
const tweetRoutes = require("./routes/tweet");
const timelineRoutes = require("./routes/timeline");
const authRoutes = require("./routes/auth");
const mediaRoutes = require("./routes/media");

const app = express();
const port = 80;
const connectionurl = config.cloudConnectString;
// const corsOptions = {
//   origin: '*',
//   credentials: true,
// };

app.use(express.json());
app.use(cors({
  origin: "*",
}));

app.use(mediaRoutes);
app.use(adminRoutes);
app.use(userRoutes);
app.use(tweetRoutes);
app.use(timelineRoutes);
app.use(authRoutes);

app.listen(port, () => {
  mongoose.connect(
    connectionurl,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    (error, result) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Database connected successfully");
      }
    }
  );
});
