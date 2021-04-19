const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RolesSchema = new Schema({
  role: {
    type: String
  },
  job: {
    type: String,
  },
  requirement: {
    type: String
  }
});

module.export = mongoose.model('role', RolesSchema);
