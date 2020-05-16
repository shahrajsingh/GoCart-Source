const mongoose = require('mongoose');

const schema = mongoose.Schema;

const product = new schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  discription: { type: String, required: true },
  price: { type: String, required: true },
  seller_id: { type: mongoose.Schema.Types.ObjectId, ref: "userSchema", required: true },
  sellername: { type: String, required: true }
});

module.exports = mongoose.model('Product', product);
