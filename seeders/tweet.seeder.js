const Seeder = require("mongoose-data-seed").Seeder;
const tweetModel = require("./../src/models/tweet");

const { data } = require("./../seed-data/tweet");

class TweetSeeder extends Seeder {
  async shouldRun() {
    return tweetModel
      .countDocuments()
      .exec()
      .then((count) => count === 0);
  }

  async run() {
    return tweetModel.create(data);
  }
}

module.exports = TweetSeeder;
