const Seeder = require("mongoose-data-seed").Seeder;
const birthInformationModel = require("./../src/models/constants/birthInformationAccess");

const { data } = require("./../seed-data/constants/birthInformationAccess");

class BirthInformationAccessSeeder extends Seeder {
  async shouldRun() {
    return birthInformationModel
      .countDocuments()
      .exec()
      .then((count) => count === 0);
  }

  async run() {
    return birthInformationModel.create(data);
  }
}

module.exports = BirthInformationAccessSeeder;
