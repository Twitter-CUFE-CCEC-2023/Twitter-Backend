const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notificationTypechema = new Schema({
  name: {
    type: String,
    required: true,
  },
});

const NotificationType = mongoose.model(
  "notificationType",
  notificationTypechema
);

module.exports = NotificationType;
