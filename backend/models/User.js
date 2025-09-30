const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  id: { type: String, required: true },
  division: { type: String, required: true },
  district: { type: String, required: true },
  upazila: { type: String, required: true },
  details: { type: String, required: true },
  isDefault: { type: Boolean, default: false }
});

const orderSchema = new mongoose.Schema({
  id: { type: String, required: true },
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  userPhone: { type: String, required: true },
  items: [{
    product: {
      id: { type: String, required: true },
      name: { type: Map, of: String, required: true },
      price: { type: Number, required: true },
      imageUrl: { type: String },
      category: { type: String },
      description: { type: Map, of: String }
    },
    quantity: { type: Number, required: true }
  }],
  totalAmount: { type: Number, required: true },
  shippingAddress: addressSchema,
  paymentDetails: {
    method: { type: String, required: true },
    senderNumber: { type: String },
    transactionId: { type: String },
    senderAccountName: { type: String },
    senderAccountNumber: { type: String }
  },
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Cancellation Requested'],
    default: 'Pending'
  },
  orderDate: { type: String, required: true }
});

const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
  profilePictureUrl: { type: String },
  addresses: [addressSchema],
  orders: [orderSchema]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
