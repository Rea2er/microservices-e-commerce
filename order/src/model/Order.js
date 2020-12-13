const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: mongoose.Schema.Types.Date,
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Good',
  },
});

module.exports = mongoose.model('Order', orderSchema);
