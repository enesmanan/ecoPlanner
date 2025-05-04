// Planner functionality for ecoPlanner

document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables
    const planForm = document.getElementById('submit-plan');
    const planText = document.getElementById('plan-text');
    const planList = document.querySelector('.plan-list');
    const dateNavPrev = document.querySelector('.date-nav.prev');
    const dateNavNext = document.querySelector('.date-nav.next');
    const currentDateDisplay = document.getElementById('current-date');
    
    let currentDate = new Date();
    
    if (currentDateDisplay) {
        updateDateDisplay();
    }
    
    // Update date display
    function updateDateDisplay() {
        currentDateDisplay.textContent = formatDate(currentDate);
        loadPlans(currentDate);
    }
    
    // Event listeners for date navigation
    if (dateNavPrev) {
        dateNavPrev.addEventListener('click', function() {
            currentDate.setDate(currentDate.getDate() - 1);
            updateDateDisplay();
        });
    }
    
    if (dateNavNext) {
        dateNavNext.addEventListener('click', function() {
            currentDate.setDate(currentDate.getDate() + 1);
            updateDateDisplay();
        });
    }
    
    // Submit plan
    if (planForm) {
        planForm.addEventListener('click', function() {
            if (!planText.value.trim()) {
                alert('Please enter your plan!');
                return;
            }
            
            const newPlan = {
                time: formatTime(new Date()),
                text: planText.value,
                date: currentDate.toISOString().split('T')[0]
            };
            
            savePlan(newPlan);
            addPlanToDisplay(newPlan);
            planText.value = '';
            
            // Show success message
            showNotification('Plan added successfully!');
        });
    }
    
    // Save plan to localStorage
    function savePlan(plan) {
        const plans = getPlans();
        plan.id = Date.now();
        plans.push(plan);
        localStorage.setItem('eco_planner_plans', JSON.stringify(plans));
    }
    
    // Get plans from localStorage
    function getPlans() {
        return JSON.parse(localStorage.getItem('eco_planner_plans')) || [];
    }
    
    // Load plans for specific date
    function loadPlans(date) {
        if (!planList) return;
        
        const plans = getPlans();
        const dateString = date.toISOString().split('T')[0];
        const filteredPlans = plans.filter(plan => plan.date === dateString);
        
        // Clear existing plans
        planList.innerHTML = '';
        
        // Add filtered plans to display
        filteredPlans.forEach(plan => {
            addPlanToDisplay(plan);
        });
    }
    
    // Add plan to display
    function addPlanToDisplay(plan) {
        if (!planList) return;
        
        const planItem = document.createElement('div');
        planItem.className = 'plan-item';
        planItem.dataset.id = plan.id;
        
        planItem.innerHTML = `
            <div class="plan-time">${plan.time}</div>
            <div class="plan-details">
                <h4>${plan.text.split('\n')[0]}</h4>
                <p>${plan.text.split('\n').slice(1).join('\n') || 'No additional details'}</p>
            </div>
            <div class="plan-actions">
                <button class="edit-plan"><i class="fas fa-edit"></i></button>
                <button class="delete-plan"><i class="fas fa-trash"></i></button>
            </div>
        `;
        
        planList.appendChild(planItem);
        
        // Add event listeners for edit and delete
        const editBtn = planItem.querySelector('.edit-plan');
        const deleteBtn = planItem.querySelector('.delete-plan');
        
        editBtn.addEventListener('click', function() {
            editPlan(plan.id);
        });
        
        deleteBtn.addEventListener('click', function() {
            deletePlan(plan.id);
        });
    }
    
    // Edit plan
    function editPlan(id) {
        const plans = getPlans();
        const plan = plans.find(p => p.id == id);
        
        if (plan) {
            planText.value = plan.text;
            
            // Change submit button to update
            planForm.innerHTML = '<i class="fas fa-save"></i> Update';
            planForm.dataset.editing = id;
            
            // Add cancel button
            const cancelBtn = document.createElement('button');
            cancelBtn.className = 'cancel-edit-btn';
            cancelBtn.innerHTML = '<i class="fas fa-times"></i> Cancel';
            cancelBtn.style.marginRight = '10px';
            cancelBtn.style.backgroundColor = 'var(--error-color)';
            
            planForm.parentNode.insertBefore(cancelBtn, planForm);
            
            cancelBtn.addEventListener('click', function() {
                resetForm();
            });
            
            // Update event listener
            const originalClickListener = planForm.onclick;
            planForm.onclick = function() {
                if (!planText.value.trim()) {
                    alert('Please enter your plan!');
                    return;
                }
                
                updatePlan(id, planText.value);
                resetForm();
                
                // Show success message
                showNotification('Plan updated successfully!');
            };
            
            // Store original listener to restore later
            planForm.dataset.originalListener = originalClickListener;
        }
    }
    
    // Reset form after editing
    function resetForm() {
        planText.value = '';
        
        // Restore submit button
        planForm.innerHTML = '<i class="fas fa-paper-plane"></i> Submit';
        delete planForm.dataset.editing;
        
        // Remove cancel button if it exists
        const cancelBtn = document.querySelector('.cancel-edit-btn');
        if (cancelBtn) {
            cancelBtn.remove();
        }
        
        // Restore original event listener
        if (planForm.dataset.originalListener) {
            planForm.onclick = planForm.dataset.originalListener;
            delete planForm.dataset.originalListener;
        }
    }
    
    // Update plan
    function updatePlan(id, newText) {
        const plans = getPlans();
        const planIndex = plans.findIndex(p => p.id == id);
        
        if (planIndex !== -1) {
            plans[planIndex].text = newText;
            localStorage.setItem('eco_planner_plans', JSON.stringify(plans));
            
            // Update display
            loadPlans(currentDate);
        }
    }
    
    // Delete plan
    function deletePlan(id) {
        if (confirm('Are you sure you want to delete this plan?')) {
            const plans = getPlans();
            const updatedPlans = plans.filter(p => p.id != id);
            
            localStorage.setItem('eco_planner_plans', JSON.stringify(updatedPlans));
            
            // Update display
            loadPlans(currentDate);
            
            // Show success message
            showNotification('Plan deleted successfully!');
        }
    }
    
    // Show notification
    function showNotification(message) {
        // Create notification element if it doesn't exist
        let notification = document.querySelector('.notification');
        
        if (!notification) {
            notification = document.createElement('div');
            notification.className = 'notification';
            notification.style.position = 'fixed';
            notification.style.bottom = '20px';
            notification.style.right = '20px';
            notification.style.padding = '10px 20px';
            notification.style.backgroundColor = 'var(--success-color)';
            notification.style.color = 'white';
            notification.style.borderRadius = 'var(--border-radius)';
            notification.style.boxShadow = 'var(--box-shadow)';
            notification.style.zIndex = '1000';
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(20px)';
            notification.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            
            document.body.appendChild(notification);
        }
        
        // Set notification message
        notification.textContent = message;
        
        // Show notification
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        }, 10);
        
        // Hide notification after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(20px)';
            
            // Remove notification after animation completes
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
    
    // Chat functionality
    const chatInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-message');
    const chatMessages = document.getElementById('chat-messages');
    
    if (sendButton && chatInput && chatMessages) {
        sendButton.addEventListener('click', sendMessage);
        
        chatInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                sendMessage();
            }
        });
    }
    
    function sendMessage() {
        if (!chatInput.value.trim()) return;
        
        // Add user message
        addMessage('user', chatInput.value);
        
        // Get AI response
        const userMessage = chatInput.value;
        chatInput.value = '';
        
        // Show typing indicator
        showTypingIndicator();
        
        // Simulate AI thinking time
        setTimeout(() => {
            // Remove typing indicator
            removeTypingIndicator();
            
            // Add AI response
            const aiResponse = getAIResponse(userMessage);
            addMessage('ai', aiResponse);
            
            // Scroll to bottom
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 1500);
    }
    
    function addMessage(type, text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        // Parse links and format text
        messageContent.innerHTML = formatMessageText(text);
        
        const messageTime = document.createElement('div');
        messageTime.className = 'message-time';
        messageTime.textContent = formatTime(new Date());
        
        messageDiv.appendChild(messageContent);
        messageDiv.appendChild(messageTime);
        
        chatMessages.appendChild(messageDiv);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    function formatMessageText(text) {
        // Convert URLs to links
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        text = text.replace(urlRegex, url => `<a href="${url}" target="_blank">${url}</a>`);
        
        // Convert line breaks to <br>
        text = text.replace(/\n/g, '<br>');
        
        return `<p>${text}</p>`;
    }
    
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message ai typing-indicator';
        typingDiv.innerHTML = `
            <div class="message-content">
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        
        // Add CSS for typing animation
        if (!document.getElementById('typing-style')) {
            const style = document.createElement('style');
            style.id = 'typing-style';
            style.textContent = `
                .typing-dots {
                    display: flex;
                    gap: 5px;
                    padding: 10px 0;
                }
                
                .typing-dots span {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background-color: var(--text-light);
                    animation: typing-animation 1.5s infinite ease-in-out;
                }
                
                .typing-dots span:nth-child(1) {
                    animation-delay: 0s;
                }
                
                .typing-dots span:nth-child(2) {
                    animation-delay: 0.3s;
                }
                
                .typing-dots span:nth-child(3) {
                    animation-delay: 0.6s;
                }
                
                @keyframes typing-animation {
                    0%, 100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(-5px);
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    function removeTypingIndicator() {
        const typingIndicator = document.querySelector('.typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    // Simple AI response function
    function getAIResponse(message) {
        message = message.toLowerCase();
        
        if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
            return "Hello there! How can I help with your sustainability goals today?";
        } else if (message.includes('help')) {
            return "I'm here to help! I can provide tips on sustainable living, suggest eco-friendly activities, or answer questions about reducing your carbon footprint.";
        } else if (message.includes('grocery') || message.includes('shopping')) {
            return "For eco-friendly grocery shopping, I recommend:\n- Bringing reusable bags\n- Buying local and seasonal produce\n- Looking for products with minimal packaging\n- Supporting organic farmers when possible\n- Making a shopping list to avoid impulse buys that may go to waste";
        } else if (message.includes('energy') || message.includes('electricity')) {
            return "To reduce energy consumption:\n- Use LED bulbs instead of incandescent\n- Unplug electronics when not in use\n- Use power strips with switches\n- Consider a smart thermostat\n- Wash clothes in cold water\n- Air dry clothes when possible";
        } else if (message.includes('water')) {
            return "Water conservation tips:\n- Take shorter showers\n- Fix leaky faucets\n- Install water-efficient fixtures\n- Collect rainwater for plants\n- Only run full loads in dishwashers and washing machines";
        } else if (message.includes('waste') || message.includes('recycle')) {
            return "Reducing waste:\n- Try a zero-waste challenge for a week\n- Always recycle properly according to local guidelines\n- Compost food scraps\n- Use reusable containers instead of disposable ones\n- Repair items instead of replacing them when possible";
        } else if (message.includes('transportation') || message.includes('travel') || message.includes('car')) {
            return "Eco-friendly transportation:\n- Consider walking or biking for short trips\n- Use public transportation when available\n- Carpool with colleagues or friends\n- Maintain your vehicle properly for better fuel efficiency\n- Consider an electric or hybrid vehicle for your next purchase";
        } else if (message.includes('food') || message.includes('eating') || message.includes('diet')) {
            return "Sustainable eating habits:\n- Reduce meat consumption (especially red meat)\n- Buy local, seasonal produce\n- Plan meals to reduce food waste\n- Try plant-based alternatives\n- Grow your own herbs or vegetables if possible";
        } else if (message.includes('thank')) {
            return "You're welcome! Let me know if you need any other sustainability tips or advice!";
        } else {
            return "That's an interesting topic! For sustainable living, consider starting with small daily habits like reducing single-use plastics, conserving water and energy, and supporting local businesses. Would you like more specific advice on any particular area of sustainability?";
        }
    }
    
    // Add eco-suggestions to plan
    const addToPlanButtons = document.querySelectorAll('.add-to-plan');
    if (addToPlanButtons) {
        addToPlanButtons.forEach(button => {
            button.addEventListener('click', function() {
                const suggestionItem = button.closest('.suggestion-item');
                const title = suggestionItem.querySelector('h4').textContent;
                const description = suggestionItem.querySelector('p').textContent;
                
                planText.value = `${title}\n${description}`;
                
                // Scroll to plan input
                planText.scrollIntoView({ behavior: 'smooth' });
                
                // Focus on textarea
                planText.focus();
            });
        });
    }
});