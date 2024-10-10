const mongoose = require('mongoose');

const filmSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    duration: { type: String, required: true },
    status: { type: String, required: true },
    image: { type: String, required: true },

}, {
    timestamps: true,
});

module.exports = mongoose.model('Film', filmSchema);
