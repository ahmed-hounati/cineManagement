const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    film: { type: mongoose.Schema.Types.ObjectId, ref: 'Film' },
    text: { type: String, required: true }
}, {
    timestamps: true,
});

module.exports = mongoose.model('Comment', commentSchema);