const mongoose = require("mongoose");
const config = require("./src/config");
const userRoleSeeder = require("./seeders/user-role.seeder");
const notificationTypeSeeder = require("./seeders/notification-type.seeder");
const birthInformationAccessSeeder = require("./seeders/birth-information-access.seeder");
const userSeeder = require("./seeders/user.seeder");

/**
 * Seeders List
 * order is important
 * @type {Object}
 */
module.exports.seedersList = {
  userRoleSeeder,
  notificationTypeSeeder,
  birthInformationAccessSeeder,
  userSeeder,
};
/**
 * Connect to mongodb implementation
 * @return {Promise}
 */
module.exports.connect = async () =>
  await mongoose.connect(config.devConnectionSting, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
/**
 * Drop/Clear the database implementation
 * @return {Promise}
 */
module.exports.dropdb = async () => mongoose.connection.db.dropDatabase();
