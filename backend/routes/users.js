const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
// Note: You will need to create these auth middleware files
// const { auth, adminAuth } = require('../middleware/auth'); 

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email or phone already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = `user_${Date.now()}`;

    const user = new User({
      id: userId,
      name,
      email,
      phone,
      passwordHash: hashedPassword,
      role: 'customer',
      profilePictureUrl: `https://i.pravatar.cc/150?u=${Date.now()}`,
      addresses: [],
      orders: []
    });

    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// A placeholder for auth middleware until it is created.
const auth = (req, res, next) => next();
const adminAuth = (req, res, next) => next();


// Get logged in user
router.get('/me', auth, async (req, res) => {
  try {
    // This will need to be updated once you have real auth middleware
    // const user = await User.findOne({ id: req.user.id }); 
    const user = await User.findOne(); // Temporary find
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const updates = req.body;
    delete updates.passwordHash; // Don't allow password update here
    delete updates.role; // Don't allow role change

    // This will need to be updated once you have real auth middleware
    // const user = await User.findOneAndUpdate( { id: req.user.id }, ...
    const user = await User.findOneAndUpdate(
      { }, // Temporary find
      updates,
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all users (admin only)
router.get('/', auth, adminAuth, async (req, res) => {
  try {
    const users = await User.find().select('-passwordHash');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete user (admin only)
router.delete('/:userId', auth, adminAuth, async (req, res) => {
  try {
    const { userId } = req.params;
    // This will need to be updated once you have real auth middleware
    // if (userId === req.user.id) {
    //   return res.status(400).json({ message: 'Cannot delete your own account' });
    // }

    const user = await User.findOneAndDelete({ id: userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add order
router.post('/order', auth, async (req, res) => {
  try {
    const { items, totalAmount, shippingAddress, paymentDetails } = req.body;

    // This will need to be updated once you have real auth middleware
    // const user = await User.findOne({ id: req.user.id });
    const user = await User.findOne(); // Temporary find
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const orderId = `order_${Date.now()}`;
    const order = {
      id: orderId,
      userId: user.id,
      userName: user.name,
      userPhone: user.phone,
      items,
      totalAmount,
      shippingAddress,
      paymentDetails,
      status: 'Pending',
      orderDate: new Date().toISOString()
    };

    user.orders.push(order);
    await user.save();

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all orders (admin only)
router.get('/orders', auth, adminAuth, async (req, res) => {
  try {
    const users = await User.find().select('orders');
    const allOrders = users.flatMap(user =>
      user.orders.map(order => ({
        ...order.toObject(),
        userName: user.name,
        userId: user.id,
        userPhone: user.phone
      }))
    );
    res.json(allOrders.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update order status (admin only)
router.put('/order/:orderId/status', auth, adminAuth, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const user = await User.findOne({ 'orders.id': orderId });
    if (!user) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // In a real app, you would access subdocuments differently
    let orderToUpdate;
    for (const order of user.orders) {
        if (order.id === orderId) {
            orderToUpdate = order;
            break;
        }
    }
    
    if (!orderToUpdate) {
      return res.status(404).json({ message: 'Order not found' });
    }

    orderToUpdate.status = status;
    await user.save();

    res.json({ message: 'Order status updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

