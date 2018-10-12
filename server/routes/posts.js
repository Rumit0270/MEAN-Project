const express = require('express');
const Post = require('../models/post');
const _ = require('lodash');
const multer = require('multer');

const router = express.Router();
const { authenticate } = require('./../middleware/authenticate');

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
};


// save the photo to disk
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = null;
    if(!isValid) {
      error = new Error('Invalid MIME type');
    }
    callback(error, "server/images");
  },
  filename: (req, file, callback) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    callback(null, name + '-' + Date.now() + '.' + ext);
  }
});

// save the post
router.post('', authenticate, multer({storage: storage}).single("image"), (req, res) => {
  const url = req.protocol + "://" + req.get("host");

  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
    creator: req.user.id
  });

  post.save().then((doc) => {
    res.status(201).json({
      message: 'Post added Successfully',
      post: {
        id: doc._id,
        title: doc.title,
        content: doc.content,
        imagePath: doc.imagePath,
        creator: doc.creator
      }
    });
  }, (err) => {
    res.status(401).send(err);
  });
});

// return all posts
router.get('',async (req, res, next) => {

  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.currentPage;

  const postQuery = Post.find();
  if(pageSize && currentPage) {

    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }

  try {
    const posts = await postQuery;
    const count = await Post.countDocuments();

    res.status(200).json({
      message: 'Posts fetched successfully',
      posts: posts,
      totalPosts: count
    });
  } catch(err) {
    res.status(500).send({
      message: 'Cannot retrieve the posts'
    });
  }

});


// delete a post
router.delete('/:id', authenticate, (req, res, next) => {
  var id = req.params.id;

  Post.findOneAndDelete({
    _id: id,
    creator: req.user.id
  }).then((doc) => {
    if (doc) {
      res.status(200).json({
        message: 'Successfully deleted'
      });
    } else {
      res.status(401).json({
        message: 'Not Authorized'
      });
    }
  }, (err) => {
    console.log('could not delete the doc' + err);
  });
});


// update the post
router.patch('/:id', authenticate, multer({storage: storage}).single("image"), (req, res) => {
  var id =  req.params.id;
  var body = _.pick(req.body, ['title', 'content']);

  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename
  }

  Post.findOneAndUpdate({
    _id: id,
    creator: req.user.id
  }, {
    $set: {
      content: body.content,
      title: body.title,
      imagePath
    }
  }, {new: true}).then((doc) => {
    if(doc) {
      res.status(200).send({
        message: 'Successfully updated',
        doc: doc
      });
    } else {
      res.status(401).send({
        message: 'Not authorized'
    });
    }

  });;
});


module.exports = router;
