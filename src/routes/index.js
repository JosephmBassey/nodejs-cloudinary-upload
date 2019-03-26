const {
  Router
} = require('express');
const router = Router();
const cloudinary = require('cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const Image = require('../models/Images');
const fs = require('fs-extra');

router.get('/', async (req, res) => {
  const image = await Image.find();
  res.status(200).json({image});
});

router.post('/add', async (req, res) => {
  // Saving Image in Cloudinary
  try {
    const result = await cloudinary.v2.uploader.upload(req.file.path);
    const newImage = new Image({
      imageURL: result.url,
      public_id: result.public_id
    });
   const savedImage = await newImage.save();
    await fs.unlink(req.file.path);
    res.status(200).json(savedImage)
  } catch (e) {
   res.json(e)
  }
});

router.get('/delete/:imageId', async (req, res) => {
  const {
    imageId
  } = req.params;
  const image = await Image.findByIdAndRemove(imageId);
  const result = await cloudinary.v2.uploader.destroy(image.public_id);
  res.json({result})
});

module.exports = router;