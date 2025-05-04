// Chatbot functionality
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const chatForm = document.getElementById('chat-form');
    const userInput = document.getElementById('user-input');
    const chatMessages = document.getElementById('chat-messages');
    const newChatButton = document.getElementById('new-chat');
    const imageUpload = document.getElementById('image-upload');
    const uploadPreview = document.getElementById('upload-preview');
    
    // Track if we have an image ready to send
    let currentUploadedImage = null;
    
    // API endpoint
    //const API_URL = 'http://localhost:5000/api/chat';
    const API_URL = 'http://0.0.0.0:10000/api/chat';

    
    // Initialize textarea auto-resize
    userInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });
    
    // Handle image upload
    imageUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        if (!file.type.match('image.*')) {
            alert('Lütfen sadece görsel dosyaları yükleyin.');
            return;
        }
        
        // Preview the image
        const reader = new FileReader();
        reader.onload = function(e) {
            uploadPreview.innerHTML = `
                <img src="${e.target.result}" alt="Yüklenen görsel">
                <button id="remove-image" class="remove-image-btn"><i class="fas fa-times"></i></button>
            `;
            
            // Add remove button functionality
            document.getElementById('remove-image').addEventListener('click', function() {
                uploadPreview.innerHTML = '';
                imageUpload.value = '';
                currentUploadedImage = null;
            });
            
            currentUploadedImage = {
                file: file,
                dataUrl: e.target.result
            };
            
            // Scroll to show the uploaded image
            chatMessages.scrollTop = chatMessages.scrollHeight;
        };
        reader.readAsDataURL(file);
    });
    
    // Send a message to the chatbot
    async function sendMessage(message, imageFile = null) {
        // Don't send empty messages
        if (!message.trim() && !imageFile) return;
        
        // Add user message to the UI
        addMessage(message, 'user', imageFile ? currentUploadedImage.dataUrl : null);
        
        // Show typing indicator
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'message bot-message typing-indicator';
        typingIndicator.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `;
        chatMessages.appendChild(typingIndicator);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        try {
            const formData = new FormData();
            formData.append('message', message);
            
            if (imageFile) {
                formData.append('image', imageFile);
            }
            
            const response = await fetch(API_URL, {
                method: 'POST',
                body: formData
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Remove typing indicator
            typingIndicator.remove();
            
            // Add bot response to the UI
            addMessage(data.response, 'bot');
            
            // Clear the current uploaded image after sending
            if (imageFile) {
                currentUploadedImage = null;
                uploadPreview.innerHTML = '';
                imageUpload.value = '';
            }
            
        } catch (error) {
            console.error('Error:', error);
            
            // Remove typing indicator
            typingIndicator.remove();
            
            // Show error message
            addMessage('Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.', 'bot');
        }
    }
    
    // Add a message to the chat UI
    function addMessage(message, sender, imageUrl = null) {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${sender}-message`;
        
        // Create avatar
        const avatarElement = document.createElement('div');
        avatarElement.className = 'message-avatar';
        
        if (sender === 'user') {
            avatarElement.innerHTML = '<i class="fas fa-user"></i>';
        } else {
            avatarElement.innerHTML = '<i class="fas fa-robot"></i>';
        }
        
        // Create message content
        const contentElement = document.createElement('div');
        contentElement.className = 'message-content';
        
        // Format message with new lines
        const formattedMessage = message.replace(/\n/g, '<br>');
        contentElement.innerHTML = `<p>${formattedMessage}</p>`;
        
        // Add image if present
        if (imageUrl) {
            contentElement.innerHTML += `<img src="${imageUrl}" alt="Kullanıcı görseli">`;
        }
        
        // Add timestamp
        const timeElement = document.createElement('div');
        timeElement.className = 'message-time';
        const now = new Date();
        timeElement.textContent = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        contentElement.appendChild(timeElement);
        
        // Assemble message
        if (sender === 'user') {
            messageElement.appendChild(contentElement);
            messageElement.appendChild(avatarElement);
        } else {
            messageElement.appendChild(avatarElement);
            messageElement.appendChild(contentElement);
        }
        
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Handle form submission
    chatForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const message = userInput.value;
        userInput.value = '';
        userInput.style.height = 'auto';
        
        // Send the message and image if available
        if (currentUploadedImage) {
            sendMessage(message, currentUploadedImage.file);
        } else {
            sendMessage(message);
        }
    });
    
    // Handle new chat button
    newChatButton.addEventListener('click', async function() {
        try {
            // Show loading state
            newChatButton.disabled = true;
            newChatButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Yükleniyor...';
            
            // Call the API to reset the chat
            const response = await fetch(`${API_URL}/reset`, {
                method: 'POST'
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            // Clear the chat UI
            chatMessages.innerHTML = '';
            
            // Add welcome message
            addMessage('Merhaba! Ben sürdürülebilirlik danışmanınızım. Bana hayatınız, alışkanlıklarınız veya ilgilendiğiniz herhangi bir konu hakkında bilgi verebilirsiniz. Size sürdürülebilir yaşam için kişiselleştirilmiş öneriler sunabilirim. Ayrıca görsel yükleyerek de analiz yaptırabilirsiniz.', 'bot');
            
            // Clear any uploaded image
            currentUploadedImage = null;
            uploadPreview.innerHTML = '';
            imageUpload.value = '';
            
        } catch (error) {
            console.error('Error:', error);
            alert('Sohbeti sıfırlarken bir hata oluştu. Lütfen tekrar deneyin.');
        } finally {
            // Reset button state
            newChatButton.disabled = false;
            newChatButton.innerHTML = '<i class="fas fa-plus"></i> Yeni Sohbet';
        }
    });
    
    // Make textarea submit on Enter (but allow Shift+Enter for new line)
    userInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            chatForm.dispatchEvent(new Event('submit'));
        }
    });
}); 