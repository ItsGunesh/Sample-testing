from flask import Flask, request, jsonify

import razorpay
import requests
import hashlib
import json
import spacy

app = Flask(__name__)  # Corrected from _name_ to __name__

# Razorpay API Keys (replace with your actual Razorpay API Key ID and Secret)
RAZORPAY_KEY_ID = 'YOUR_RAZORPAY_KEY_ID'
RAZORPAY_KEY_SECRET = 'YOUR_RAZORPAY_KEY_SECRET'

# Razorpay client initialization
razorpay_client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))

# Endpoint to process commands from the frontend
@app.route('/process_command', methods=['POST'])
def process_command():
    data = request.get_json()
    command = data.get('command', '').lower()

    # Simple response logic based on the command
    if 'make payment' in command:
        # Logic to initialize a payment with Razorpay
        amount = 500  # Amount in paise (i.e., 5 INR)
        currency = 'INR'
        payment = razorpay_client.order.create({'amount': amount, 'currency': currency})
        return jsonify({'reply': f'Payment initiated with order ID: {payment["id"]}'})
    elif 'status' in command:
        # Example to check payment status (requires a valid order ID)
        order_id = 'YOUR_ORDER_ID'
        order = razorpay_client.order.fetch(order_id)
        return jsonify({'reply': f'Order status is: {order["status"]}'})
    else:
        return jsonify({'reply': "I didn't understand that command. Please try again."})

if __name__ == '__main__':
    app.run(debug=True)