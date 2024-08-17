const mongoose = require('mongoose');

const associationSchema = new mongoose.Schema({
    pin: { type: String, required: true },
    photos: [String],
    videos: [String],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Association', associationSchema);
