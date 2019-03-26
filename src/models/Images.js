const { Schema, model } = require('mongoose');

const imageSchema = new Schema({
    imageURL: String,
    public_id: String
});

module.exports = model('Image', imageSchema);