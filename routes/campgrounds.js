const cloudinary = require('cloudinary').v2;
const express = require('express');

const { isLoggedIn, isValidId } = require('../middlewares');
const Campground = require('../models/campground');

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret
});

// Show all campgrounds
router.get('/', async (req, res) => {
  try {
    const campgrounds = await Campground.find({});

    res.send({ success: true, campgrounds });
  } catch (err) {
    res.status(500).send({ success: false, err });
  }
});

// Add new campground
router.post('/', isLoggedIn, async (req, res) => {
  try {
    const image = await cloudinary.uploader.upload(req.body.file, {
      folder: 'campgrounds'
    });
    const campground = new Campground({
      name: req.body.name,
      image: image.url,
      price: req.body.price,
      description: req.body.description,
      author: req.user.username
    });
    await campground.save();

    res.send({ success: true, campground });
  } catch (err) {
    res.status(500).send({ success: false, err });
  }
});

// Shows info on one campground
router.get('/:id', isValidId, async (req, res) => {
  try {
    const campground = await Campground.findOne({
      _id: req.params.id
    }).populate('comments');
    if (!campground) {
      return res
        .status(404)
        .send({ success: false, message: 'Campground not found' });
    }

    res.send(campground);
  } catch (err) {
    res.status(500).send({ success: false, err });
  }
});

// Update a campground
router.put('/:id', [isLoggedIn, isValidId], async (req, res) => {
  try {
    const campground = await Campground.findOne({
      _id: req.params.id
    });
    if (!campground) {
      return res
        .status(404)
        .send({ success: false, message: 'Campground not found' });
    }
    if (campground.author !== req.user.username) {
      return res.status(403).send({
        success: false,
        message: 'You can only edit your own campgrounds.'
      });
    }

    campground.overwrite({
      name: req.body.name,
      image: req.body.image,
      description: req.body.description,
      price: req.body.price
    });
    await campground.save();

    res.send({ success: true, campground });
  } catch (err) {
    res.send(500).send({ success: false, err });
  }
});

// Delete a campground
router.delete('/:id/delete', [isLoggedIn, isValidId], async (req, res) => {
  try {
    const campground = await Campground.findOne({ _id: req.params.id });
    if (!campground) {
      return res
        .status(404)
        .send({ success: false, message: 'Campground not found' });
    }
    if (campground.author !== req.user.username) {
      return res.status(403).send({
        success: false,
        message: 'You can only delete your own campgrounds.'
      });
    }

    await campground.remove();

    res.send({
      success: true,
      message: 'Successfully deleted ' + campground.name + '!'
    });
  } catch (err) {
    res.status(500).send({ success: false, err });
  }
});

module.exports = router;
