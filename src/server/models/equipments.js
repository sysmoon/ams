const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EquipmentsSchema = new Schema({
  equipment: {
    type: String
  },
  used_by: {
    type: Schema.Types.ObjectId,
    ref: 'role'
  },
  count: {
    type: Int
  },
  new_or_used: {
    type: String
  }
});

mongoose.model('equipment', EquipmentsSchema)
