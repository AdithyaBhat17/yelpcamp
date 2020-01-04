const mongoose = require('mongoose');

const CampgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  author: String,
  price: String,
  description: String,
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment'
    }
  ]
});

module.exports = mongoose.model('Campground', CampgroundSchema);
