const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    seance: { type: String, required: true },
    places: { type: Array, required: true },
    status: { type: String, required: true }
}, {
    timestamps: true,
});

module.exports = mongoose.model('Reservation', reservationSchema);
