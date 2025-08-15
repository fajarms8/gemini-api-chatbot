// script.js

document.addEventListener('DOMContentLoaded', () => {
    const chatForm = document.getElementById('chat-form');
    const userInput = document.getElementById('user-input');
    const chatBox = document.getElementById('chat-box');

    /**
     * Creates a new message element and appends it to the chat box.
     * @param {string} content - The text content of the message.
     * @param {string} sender - The sender of the message ('user' or 'bot').
     * @returns {HTMLElement} The created message element.
     */
    const addMessageToChatBox = (content, sender) => {
        const messageElement = document.createElement('div');
        // Add classes for styling based on the sender
        messageElement.classList.add('message', `${sender}-message`);
        messageElement.textContent = content;
        chatBox.appendChild(messageElement);

        // Automatically scroll to the latest message
        chatBox.scrollTop = chatBox.scrollHeight;

        return messageElement;
    };

    /**
     * Handles the form submission to send a message to the chatbot API.
     * @param {Event} e - The form submission event.
     */
    const handleChatSubmit = async (e) => {
        e.preventDefault();

        const userMessage = userInput.value.trim();
        if (!userMessage) {
            return; // Don't send empty messages
        }

        // 1. Add the user's message to the chat box
        addMessageToChatBox(userMessage, 'user');

        // Clear the input field for the next message
        userInput.value = '';

        // 2. Show a temporary "Thinking..." bot message
        const thinkingMessageElement = addMessageToChatBox('Thinking...', 'bot');

        try {
            // 3. Send the user's message as a POST request to the backend
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: [{
                        role: 'user',
                        content: userMessage
                    }]
                }),
            });

            if (!response.ok) {
                // Handle server-side errors (e.g., 500 Internal Server Error)
                throw new Error(`Server responded with status: ${response.status}`);
            }

            const data = await response.json();

            // 4. Replace the "Thinking..." message with the AI's reply
            if (data && data.result) {
                thinkingMessageElement.textContent = data.result;
            } else {
                // Handle cases where the response is ok but there's no result
                thinkingMessageElement.textContent = 'Sorry, no response received.';
            }
        } catch (error) {
            console.error('Error fetching chat response:', error);
            // 5. If an error occurs, show a failure message
            thinkingMessageElement.textContent = 'Failed to get response from server.';
        }
    };

    chatForm.addEventListener('submit', handleChatSubmit);
});
