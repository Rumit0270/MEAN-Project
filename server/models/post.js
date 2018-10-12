const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  imagePath: {
    type: String,
    required: true
  },
  creator: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true
  }
});

var Post = mongoose.model('Post', postSchema);

module.exports = Post;
