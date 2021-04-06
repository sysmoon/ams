const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PeoplesSchema = new Schema({
  first_name: {
    type: String
  },
  last_name: {
    type: String
  },
  sex: {
    type: String
  },
  blood_type: {
    type: String
  },
  serve_years: {
    type: String
  },
  role: {
    type: Schema.Types.ObjectId,
    ref: 'role'
  },
  team: {
    type: Schema.Types.ObjectId,
    ref: 'team'
  },
  from: {
    type: String
  }
});

mongoose.model('people', PeoplesSchema)
