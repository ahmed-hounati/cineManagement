const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true },
    status: { type: String, required: true },
    subscribe: { type: String },
    role: { type: String, default: 'client' },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Film' }]
}, {
    timestamps: true,
});

module.exports = mongoose.model('User', userSchema);
