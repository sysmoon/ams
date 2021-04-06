const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SoftwaresSchema = new Schema({
  software: {
    type: String
  },
  used_by: [{
    type: Schema.Types.ObjectId,
    ref: 'role'
  }],
  developed_by: {
    type: String
  },
  description: {
    type: String
  }
});

mongoose.model('software', SoftwaresSchema)
