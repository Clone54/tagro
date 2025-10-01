const express = require('express');
const router = express.Router();

// @route   POST /api/sms/send-otp
// @desc    Pretend to send an OTP and return it for verification
// @access  Public
router.post('/send-otp', (req, res) => {
    try {
        // In a real application, you would use a service like Twilio here.
        // For now, we will generate a random 6-digit OTP.
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        console.log(`Generated OTP for ${req.body.phone}: ${otp}`);
        console.log(`Pretending to send SMS to ${req.body.phone} with OTP: ${otp}`);

        // Send the OTP back in a JSON response so the frontend can use it.
        // Your Register.tsx is expecting this exact format: { otp: "123456" }
        res.status(200).json({ otp: otp, success: true });

    } catch (error) {
        console.error('Error in send-otp route:', error);
        res.status(500).json({ message: 'Server error while sending OTP', success: false });
    }
});


module.exports = router;
