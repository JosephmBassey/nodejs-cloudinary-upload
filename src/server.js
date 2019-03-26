const express = require('express');
const morgan = require('morgan');
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

const storage = multer.diskStorage({
  destination: path.join(__dirname, 'public/uploads'),
  filename: (req, file, cb) => {
      cb(null, new Date().getTime() + path.extname(file.originalname));
  }
});
app.use(multer({storage}).single('image'));

const photoRoute =  require('./routes')


app.use('/image', photoRoute);

app.get('/', (req, res) => {
  res.send('Nodejs Image Upload With Cloudinary!');
});

mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true
})
    .then(db => console.log(`DB is connected`))
    .catch(err => console.error(err));
app.listen(4000, () => {
  console.log('Example app listening on port port!');
});

