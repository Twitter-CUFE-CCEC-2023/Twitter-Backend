const mongoose = require("mongoose");
const config = require("./src/config");
const userRoleSeeder = require("./seeders/user-role.seeder");

/**
 * Seeders List
 * order is important
 * @type {Object}
 */
module.exports.seedersList = { userRoleSeeder };
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
