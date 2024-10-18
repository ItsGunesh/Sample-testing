// server.js

const express = require('express');
const bodyParser = require('body-parser');
const Razorpay = require('razorpay');
const path = require('path'); // Import path module

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '../public'))); // Adjust path to serve public files

// Razorpay instance
const razorpay = new Razorpay({
    key_id: 'rzp_test_B7oDoeCewt5dgr',
    key_secret: '28Ddxgj7iMYCMosrSi8jJxEu'
});

// Mock database for users
const users = {
    rishi: { merchantId: 'P9GTBIcYKh6YH3' },
    john: { merchantId: 'merchant_id_for_john' },
    doe: { merchantId: 'merchant_id_for_doe' },
    // Add more users as needed
};

app.post('/process-payment', async (req, res) => {
    const { amount, person } = req.body;

    // Check if person exists and get their merchant ID
    const user = users[person];
    if (!user) {
        return res.json({ success: false, message: 'Recipient not found.' });
    }

    const merchantId = user.merchantId;

    // Payment options
    const options = {
        amount: amount * 100, // Amount in paise
        currency: 'INR',
        receipt: `receipt_order_${Math.random()}`,
        notes: {
            user: 'Your Name', // Change accordingly
            recipient: person,
            merchantId: merchantId // Optional: Include merchant ID in notes if needed
        }
    };

    // Create payment
    try {
        const response = await razorpay.orders.create(options);
        // Simulate payment processing
        // Here, you can integrate with your actual payment workflow

        // Respond back with success message
        res.json({ success: true, message: `Successfully sent ₹${amount} to ${person}.`, orderId: response.id });
    } catch (error) {
        res.json({ success: false, message: 'Payment processing failed. Please try again later.' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
