const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SuppliesSchema = new Schema({
  role: {
    type: String
  },
  teams: [{
    type: Schema.Types.ObjectId,
    ref: 'team'
  }]
});

module.export = mongoose.model('supply', SuppliesSchema);
