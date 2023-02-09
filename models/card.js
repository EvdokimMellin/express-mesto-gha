const mongoose = require('mongoose');
require('mongoose-type-url');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    // required: true,
    // minlength: 2,
    // maxlength: 30,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator(value) {
        return /https?:\/\/[\S]+/.test(value);
      },
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  likes: {
    type: Array,
    required: true,
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
