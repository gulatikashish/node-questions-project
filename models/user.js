const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const lastMod = require('./plugin'); //plugin to add field to the eisting collection

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    validate: {
      validator: function(v) {
        return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          v,
        );
      },
      message: '{VALUE} is not a valid email!',
    },
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Password in required'],
  },
});
// userSchema.plugin(lastMod);
const User = mongoose.model('User', userSchema);

module.exports = User;
