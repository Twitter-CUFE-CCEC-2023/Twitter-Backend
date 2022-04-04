const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const birthInformationSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
});

const BirthInformationAccess = mongoose.model(
  "birthInformationAccess",
  birthInformationSchema
);

module.exports = BirthInformationAccess;
