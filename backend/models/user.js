const mongoose = require('mongoose');
const unique = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {type: String, required: true,unique: true},
  password: {type: String, required: true},
  name: {type: String,required: true},
  cart: {type: []},
  orders: {type: []},
});
userSchema.plugin(unique);
module.exports = mongoose.model('User',userSchema);
