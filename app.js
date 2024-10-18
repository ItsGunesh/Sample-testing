function processUserCommand(command) {
    fetch('http://127.0.0.1:5000/process_command', { // Make sure the URL matches your Flask server
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: command })
    })
    .then(response => response.json())
    .then(data => {
        appendMessage('bot', data.reply);
    })
    .catch(error => {
        appendMessage('bot', 'Error processing the command.');
        console.error('Error:', error);
    });
}