// User model (Bonus: mock user support for persistence)
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  cart: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
