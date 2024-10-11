const mongoose = require('mongoose');

const filmSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    duration: { type: String, required: true },
    status: { type: String, required: true },
    image: { type: String, required: true },
    video: { type: String, required: true },
    category: { type: String, required: true },
    ratings: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        rating: { type: Number, required: true, min: 1, max: 5 }
    }]

}, {
    timestamps: true,
});

module.exports = mongoose.model('Film', filmSchema);
