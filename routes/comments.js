const express = require('express');
const mongoose = require('mongoose');

const { isLoggedIn, isValidId } = require('../middlewares');
const Comment = require('../models/comment');
const Campground = require('../models/campground');

const router = express.Router();

// Add a comment
router.post('/', [isLoggedIn, isValidId], async (req, res) => {
  try {
    const campground = await Campground.findOne({ _id: req.params.id });
    if (!campground) {
      return res
        .status(400)
        .send({ success: false, message: 'Invalid campground' });
    }

    const comment = new Comment({
      text: req.body.comment,
      author: req.user.username
    });
    campground.comments.push(comment._id);
    await Promise.all([comment.save(), campground.save()]);

    res.send({ success: true, comment });
  } catch (err) {
    res.send(500).send({ success: false, err });
  }
});

// Delete a comment
router.delete('/:commentId', isLoggedIn, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.commentId)) {
      return res.status(400).send({ success: false, message: 'Invalid ID' });
    }

    const campground = await Campground.findOne({ _id: req.params.id });
    if (!campground) {
      return res
        .status(400)
        .send({ success: false, message: 'Invalid campground' });
    }

    const comment = await Comment.findOne({ _id: req.params.commentId });
    if (!comment) {
      return res
        .status(404)
        .send({ success: false, message: 'Comment not found' });
    }

    if (comment.author !== req.user.username) {
      return res.status(403).send({
        success: false,
        message: 'You can only delete your own comments'
      });
    }

    const index = campground.comments.indexOf(comment._id);
    if (index > -1) {
      campground.comments.splice(index, 1);
      await Promise.all([comment.remove(), campground.save()]);
    } else {
      await comment.remove();
    }

    res.send({ success: true, message: 'Successfully deleted comment' });
  } catch (err) {
    res.status(500).send({ success: false, err });
  }
});

module.exports = router;
