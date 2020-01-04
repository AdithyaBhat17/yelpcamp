const express = require('express');

const { isLoggedIn, isValidId } = require('../middlewares');
const Comment = require('../models/comment');
const Campground = require('../models/campground');

const router = express.Router();

// Add a comment
router.post('/', isLoggedIn, async (req, res) => {
  const campground = await Campground.findOne({ _id: req.body.campgroundId });
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
});

// Delete a comment
router.delete('/:id', [isLoggedIn, isValidId], async (req, res) => {
  const comment = await Comment.findOne({ _id: req.params.id });
  if (!comment) {
    return res
      .status(404)
      .send({ success: false, message: 'Comment not found' });
  }

  const campground = await Campground.findOne({ comments: req.params.id });

  if (comment.author !== req.user.username) {
    return res.status(403).send({
      success: false,
      message: 'You can only delete your own comments'
    });
  }

  if (campground) {
    const index = campground.comments.indexOf(comment._id);
    campground.comments.splice(index, 1);
    await Promise.all([comment.remove(), campground.save()]);
  } else {
    await comment.remove();
  }

  res.send({ success: true, message: 'Successfully deleted comment' });
});

module.exports = router;
