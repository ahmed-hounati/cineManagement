const mongoose = require('mongoose');

const seanceSchema = new mongoose.Schema({
    showTime: { type: String, required: true },
    description: { type: String, required: true },
    durationTime: { type: String, required: true },
    film: { type: mongoose.Schema.Types.ObjectId, ref: 'Film', required: true },
    salle: { type: mongoose.Schema.Types.ObjectId, ref: 'salle', required: true },
    status: { type: String, required: true }
}, {
    timestamps: true,
});

module.exports = mongoose.model('Seance', seanceSchema);
