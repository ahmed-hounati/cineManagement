const mongoose = require('mongoose');

const salleSchema = new mongoose.Schema({
    name: { type: String, required: true },
    capacity: { type: String, required: true },
    status: { type: String, required: true }
}, {
    timestamps: true,
});

module.exports = mongoose.model('salle', salleSchema);
