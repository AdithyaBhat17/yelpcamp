const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  text: String,
  author: String
});

module.exports = mongoose.model('Comment', CommentSchema);
