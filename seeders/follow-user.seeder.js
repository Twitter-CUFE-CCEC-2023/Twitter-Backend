const Seeder = require("mongoose-data-seed").Seeder;
const followUserModel = require("./../src/models/followUser");

const { data } = require("./../seed-data/followUser");

class FollowUserSeeder extends Seeder {
  async shouldRun() {
    return followUserModel
      .countDocuments()
      .exec()
      .then((count) => count === 0);
  }

  async run() {
    return followUserModel.create(data);
  }
}

module.exports = FollowUserSeeder;
