// Check for browser compatibility
if (!('webkitSpeechRecognition' in window)) {
    alert("Sorry, your browser does not support speech recognition.");
} else {
    const recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    // HTML elements
    const chatInput = document.getElementById('chatInput');
    const messagesDiv = document.getElementById('messages');

    // Start recognition
    recognition.onstart = function () {
        messagesDiv.innerHTML += '<p><i>Listening...</i></p>';
    };

    recognition.onresult = function (event) {
        const command = event.results[0][0].transcript.toLowerCase();
        messagesDiv.innerHTML += `<p><strong>You:</strong> ${command}</p>`;

        // Check for activation command
        if (command.includes("hello upi")) {
            // Start recognition again for the payment command
            recognition.start();
        } else if (command.includes("send")) {
            handlePaymentCommand(command);
        }
    };

    recognition.onerror = function (event) {
        messagesDiv.innerHTML += `<p><i>Error occurred in recognition: ${event.error}</i></p>`;
    };

    // Handle payment command
    function handlePaymentCommand(command) {
        // Extract amount and person from the command
        const amountMatch = command.match(/send (\d+) to (\w+)/);
        if (amountMatch) {
            const amount = amountMatch[1];
            const person = amountMatch[2];

            messagesDiv.innerHTML += `<p><strong>Processing payment of ${amount} to ${person}...</strong></p>`;
            
            // Send payment data to backend
            fetch('/process-payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ amount, person })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    messagesDiv.innerHTML += `<p><strong>Transaction successful!</strong> ${data.message}</p>`;
                } else {
                    messagesDiv.innerHTML += `<p><strong>Transaction failed!</strong> ${data.message}</p>`;
                }
            })
            .catch(error => {
                messagesDiv.innerHTML += `<p><strong>Error:</strong> ${error.message}</p>`;
            });
        } else {
            messagesDiv.innerHTML += `<p><strong>Invalid command format!</strong></p>`;
        }
    }

    // Start listening for the first command
    recognition.start();
}
