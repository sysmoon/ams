const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TeamsSchema = new Schema({
  manager: {type: String},
  office: {type: String},
  extension_number: {type: String},
  mascot: {type: String},
  cleaning_duty: {type: String},
  project: {type: String},
  peoples: [{
    type: Schema.Types.ObjectId,
    ref: 'people'
  }]
});

module.export = mongoose.model('team', TeamsSchema);
