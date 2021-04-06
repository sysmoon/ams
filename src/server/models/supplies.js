const Schema = moongoose.Schema;

const SuppliesSchema = new Schema({
  role: {
    type: String
  },
  teams: [{
    type: Schema.Types.ObjectId,
    ref: 'team'
  }]
});

mongoose.model('supply', SuppliesSchema)
