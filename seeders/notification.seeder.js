const Seeder = require("mongoose-data-seed").Seeder;
const notificationModel = require("./../src/models/notification");

const { data } = require("./../seed-data/notification");

class NotificationSeeder extends Seeder {
  async shouldRun() {
    return notificationModel
      .countDocuments()
      .exec()
      .then((count) => count === 0);
  }

  async run() {
    return notificationModel.create(data);
  }
}

module.exports = NotificationSeeder;
