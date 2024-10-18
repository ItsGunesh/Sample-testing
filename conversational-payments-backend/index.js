// index.js
const express = require('express');
const bodyParser = require('body-parser');
const Razorpay = require('razorpay');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// const RAZORPAY_KEY_SECRET='28Ddxgj7iMYCMosrSi8jJxEu';
// RAZORPAY_KEY_ID='rzp_test_B7oDoeCewt5dgr';

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Endpoint to create a payout
app.post('/create-payout', async (req, res) => {
    const { amount, merchant_id, user_id, pin } = req.body;

    // Validate the PIN (you should implement your own PIN validation)
    // Here you would typically verify the PIN against a database or authentication system
    if (pin !== 'your_pin_here') { // Replace with actual PIN validation
        return res.status(400).json({ status: 'error', message: 'Invalid PIN' });
    }

    try {
        const options = {
            amount: amount * 100, // Convert to smallest currency unit (e.g., paise for INR)
            currency: 'INR',
            receipt: `receipt_${new Date().getTime()}`,
            notes: {
                user_id: user_id,
                merchant_id: merchant_id,
            },
        };

        const response = await razorpay.payouts.create(options);
        res.json({ status: 'success', payout_id: response.id, amount: response.amount });
    } catch (error) {
        console.error('Error creating payout:', error);
        res.status(500).json({ status: 'error', message: 'Unable to create payout.' });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
