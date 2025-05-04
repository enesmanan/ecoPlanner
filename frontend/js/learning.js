// Learning path functionality for ecoPlanner

document.addEventListener('DOMContentLoaded', function() {
    // Category tabs functionality
    const categoryTabs = document.querySelectorAll('.tab-btn');
    const courseCards = document.querySelectorAll('.course-card');
    
    if (categoryTabs && courseCards) {
        // Set up click handlers for category tabs
        categoryTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                // Remove active class from all tabs
                categoryTabs.forEach(t => t.classList.remove('active'));
                
                // Add active class to clicked tab
                this.classList.add('active');
                
                // Get selected category
                const category = this.dataset.category;
                
                // Filter courses
                filterCourses(category);
            });
        });
        
        // Filter courses based on category
        function filterCourses(category) {
            courseCards.forEach(card => {
                const courseCategory = card.querySelector('.course-category');
                
                if (category === 'all' || (courseCategory && courseCategory.classList.contains(category))) {
                    // Animate card appearance
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    // Animate card disappearance
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        }
    }
    
    // Course buttons functionality
    const courseButtons = document.querySelectorAll('.course-btn');
    
    if (courseButtons) {
        courseButtons.forEach(button => {
            button.addEventListener('click', function() {
                const courseCard = button.closest('.course-card');
                const courseTitle = courseCard.querySelector('h3').textContent;
                const courseCategory = courseCard.querySelector('.course-category').textContent;
                
                // Check if course is completed, in progress, or not started
                if (courseCard.classList.contains('completed')) {
                    // For completed courses
                    showCourseReview(courseTitle, courseCategory);
                } else if (courseCard.classList.contains('in-progress')) {
                    // For in-progress courses
                    continueCourse(courseTitle, courseCategory);
                } else {
                    // For new courses
                    startCourse(courseTitle, courseCategory);
                }
            });
        });
    }
    
    // Function to show course details modal
    function showCourseModal(title, content, buttons) {
        // Create modal container
        const modalContainer = document.createElement('div');
        modalContainer.className = 'course-modal-container';
        modalContainer.style.position = 'fixed';
        modalContainer.style.top = '0';
        modalContainer.style.left = '0';
        modalContainer.style.width = '100%';
        modalContainer.style.height = '100%';
        modalContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        modalContainer.style.display = 'flex';
        modalContainer.style.justifyContent = 'center';
        modalContainer.style.alignItems = 'center';
        modalContainer.style.zIndex = '1000';
        modalContainer.style.opacity = '0';
        modalContainer.style.transition = 'opacity 0.3s ease';
        
        // Create modal content
        const modalContent = document.createElement('div');
        modalContent.className = 'course-modal';
        modalContent.style.backgroundColor = 'white';
        modalContent.style.borderRadius = 'var(--border-radius)';
        modalContent.style.boxShadow = 'var(--box-shadow)';
        modalContent.style.padding = '2rem';
        modalContent.style.maxWidth = '600px';
        modalContent.style.width = '90%';
        modalContent.style.maxHeight = '80vh';
        modalContent.style.overflow = 'auto';
        modalContent.style.transform = 'translateY(20px)';
        modalContent.style.transition = 'transform 0.3s ease';
        
        // Modal header
        const modalHeader = document.createElement('div');
        modalHeader.className = 'modal-header';
        modalHeader.style.display = 'flex';
        modalHeader.style.justifyContent = 'space-between';
        modalHeader.style.alignItems = 'center';
        modalHeader.style.marginBottom = '1.5rem';
        
        const modalTitle = document.createElement('h2');
        modalTitle.textContent = title;
        modalTitle.style.margin = '0';
        
        const closeButton = document.createElement('button');
        closeButton.innerHTML = '&times;';
        closeButton.style.background = 'none';
        closeButton.style.border = 'none';
        closeButton.style.fontSize = '1.5rem';
        closeButton.style.cursor = 'pointer';
        closeButton.style.padding = '0 0.5rem';
        
        closeButton.addEventListener('click', function() {
            closeModal();
        });
        
        modalHeader.appendChild(modalTitle);
        modalHeader.appendChild(closeButton);
        
        // Modal body
        const modalBody = document.createElement('div');
        modalBody.className = 'modal-body';
        modalBody.innerHTML = content;
        modalBody.style.marginBottom = '1.5rem';
        
        // Modal footer
        const modalFooter = document.createElement('div');
        modalFooter.className = 'modal-footer';
        modalFooter.style.display = 'flex';
        modalFooter.style.justifyContent = 'flex-end';
        modalFooter.style.gap = '1rem';
        
        // Add buttons to footer
        buttons.forEach(btn => {
            const button = document.createElement('button');
            button.textContent = btn.text;
            button.className = btn.class || '';
            button.style.padding = '0.6rem 1.2rem';
            button.style.borderRadius = 'var(--border-radius)';
            button.style.cursor = 'pointer';
            
            if (btn.primary) {
                button.style.backgroundColor = 'var(--primary-color)';
                button.style.color = 'white';
                button.style.border = 'none';
            } else {
                button.style.backgroundColor = 'var(--light-color)';
                button.style.color = 'var(--text-color)';
                button.style.border = 'none';
            }
            
            button.addEventListener('click', function() {
                if (btn.handler) {
                    btn.handler();
                }
                closeModal();
            });
            
            modalFooter.appendChild(button);
        });
        
        // Assemble modal
        modalContent.appendChild(modalHeader);
        modalContent.appendChild(modalBody);
        modalContent.appendChild(modalFooter);
        modalContainer.appendChild(modalContent);
        
        // Add to document
        document.body.appendChild(modalContainer);
        
        // Force reflow to enable transition
        modalContainer.offsetHeight;
        
        // Show modal with animation
        modalContainer.style.opacity = '1';
        modalContent.style.transform = 'translateY(0)';
        
        // Function to close modal
        function closeModal() {
            modalContainer.style.opacity = '0';
            modalContent.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                document.body.removeChild(modalContainer);
            }, 300);
        }
        
        // Close on outside click
        modalContainer.addEventListener('click', function(event) {
            if (event.target === modalContainer) {
                closeModal();
            }
        });
        
        // Close on escape key
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                closeModal();
            }
        });
    }
    
    // Show review for completed courses
    function showCourseReview(title, category) {
        const content = `
            <div class="course-review">
                <p>You've already completed the <strong>${title}</strong> course in the <span class="category-tag" style="display: inline-block; padding: 0.3rem 0.6rem; border-radius: 2rem; font-size: 0.8rem; margin: 0.3rem 0; font-weight: 500; background-color: #C8E6C9; color: #1B5E20;">${category}</span> category.</p>
                
                <div class="course-stats" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1.5rem 0;">
                    <div class="stat-item" style="background-color: var(--light-color); padding: 1rem; border-radius: var(--border-radius); text-align: center;">
                        <div style="font-size: 1.8rem; font-weight: 700; color: var(--primary-color);">98%</div>
                        <div style="font-size: 0.9rem; color: var(--text-light);">Completion</div>
                    </div>
                    <div class="stat-item" style="background-color: var(--light-color); padding: 1rem; border-radius: var(--border-radius); text-align: center;">
                        <div style="font-size: 1.8rem; font-weight: 700; color: var(--primary-color);">4.9</div>
                        <div style="font-size: 0.9rem; color: var(--text-light);">Your Rating</div>
                    </div>
                </div>
                
                <h3>What you've learned:</h3>
                <ul>
                    <li>Core principles of ${category.toLowerCase()} sustainability</li>
                    <li>Practical daily habits for eco-friendly living</li>
                    <li>Advanced techniques for reducing environmental impact</li>
                    <li>How to influence others in your community</li>
                </ul>
                
                <h3>Your achievements:</h3>
                <div style="display: flex; gap: 1rem; margin: 1rem 0;">
                    <div style="text-align: center;">
                        <div style="font-size: 1.5rem; color: var(--primary-color);"><i class="fas fa-medal"></i></div>
                        <div style="font-size: 0.8rem;">Course Complete</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-size: 1.5rem; color: var(--primary-color);"><i class="fas fa-star"></i></div>
                        <div style="font-size: 0.8rem;">Top Performer</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-size: 1.5rem; color: var(--primary-color);"><i class="fas fa-certificate"></i></div>
                        <div style="font-size: 0.8rem;">Expert Status</div>
                    </div>
                </div>
            </div>
        `;
        
        const buttons = [
            {
                text: 'Start Again',
                primary: true,
                handler: function() {
                    console.log('Starting course again: ' + title);
                }
            },
            {
                text: 'View Certificate',
                handler: function() {
                    console.log('Viewing certificate for: ' + title);
                }
            }
        ];
        
        showCourseModal(title + ' - Review', content, buttons);
    }
    
    // Continue in-progress courses
    function continueCourse(title, category) {
        const progress = title === 'Water Conservation' ? 60 : 25; // Hardcoded for demo
        
        const content = `
            <div class="course-continue">
                <p>You're currently working through the <strong>${title}</strong> course in the <span class="category-tag" style="display: inline-block; padding: 0.3rem 0.6rem; border-radius: 2rem; font-size: 0.8rem; margin: 0.3rem 0; font-weight: 500; background-color: #BBDEFB; color: #0D47A1;">${category}</span> category.</p>
                
                <div class="progress-container" style="margin: 1.5rem 0;">
                    <div class="progress-label" style="display: flex; justify-content: space-between; font-size: 0.9rem; margin-bottom: 0.5rem;">
                        <span>Progress: ${progress}%</span>
                        <span>${Math.round(progress / 100 * 5)} of 5 modules</span>
                    </div>
                    <div class="progress-bar" style="height: 10px; background-color: var(--light-color); border-radius: 5px; overflow: hidden;">
                        <div class="progress-filled" style="height: 100%; background-color: var(--primary-color); border-radius: 5px; width: ${progress}%;"></div>
                    </div>
                </div>
                
                <h3>Your current module:</h3>
                <div class="current-module" style="background-color: var(--light-color); padding: 1rem; border-radius: var(--border-radius); margin-top: 0.5rem;">
                    <h4 style="margin-top: 0;">Module ${Math.round(progress / 100 * 5)}: Advanced ${category} Techniques</h4>
                    <p>Learn how to implement advanced sustainability techniques in your daily life.</p>
                    <div style="font-size: 0.9rem; color: var(--text-light);">
                        <span><i class="fas fa-clock"></i> 20 mins remaining</span>
                    </div>
                </div>
                
                <h3>Up next:</h3>
                <div class="next-modules" style="display: flex; flex-direction: column; gap: 0.8rem; margin-top: 0.5rem;">
                    <div style="background-color: var(--light-color); padding: 0.8rem; border-radius: var(--border-radius); opacity: 0.7;">
                        <h4 style="margin-top: 0; margin-bottom: 0.3rem;">Module ${Math.round(progress / 100 * 5) + 1}: Community Impact</h4>
                        <div style="font-size: 0.9rem; color: var(--text-light);">
                            <span><i class="fas fa-clock"></i> 30 mins</span>
                        </div>
                    </div>
                    <div style="background-color: var(--light-color); padding: 0.8rem; border-radius: var(--border-radius); opacity: 0.5;">
                        <h4 style="margin-top: 0; margin-bottom: 0.3rem;">Module ${Math.round(progress / 100 * 5) + 2}: Global Perspectives</h4>
                        <div style="font-size: 0.9rem; color: var(--text-light);">
                            <span><i class="fas fa-clock"></i> 25 mins</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        const buttons = [
            {
                text: 'Continue Learning',
                primary: true,
                handler: function() {
                    console.log('Continuing course: ' + title);
                }
            },
            {
                text: 'Reset Progress',
                handler: function() {
                    if (confirm('Are you sure you want to reset your progress for this course?')) {
                        console.log('Resetting progress for: ' + title);
                    }
                }
            }
        ];
        
        showCourseModal(title + ' - Continue Learning', content, buttons);
    }
    
    // Start new courses
    function startCourse(title, category) {
        const content = `
            <div class="course-start">
                <p>You're about to start the <strong>${title}</strong> course in the <span class="category-tag" style="display: inline-block; padding: 0.3rem 0.6rem; border-radius: 2rem; font-size: 0.8rem; margin: 0.3rem 0; font-weight: 500; background-color: #F8BBD0; color: #880E4F;">${category}</span> category.</p>
                
                <div class="course-banner" style="margin: 1.5rem 0; border-radius: var(--border-radius); overflow: hidden;">
                    <img src="https://images.pexels.com/photos/1072824/pexels-photo-1072824.jpeg" alt="${title}" style="width: 100%; height: 200px; object-fit: cover;">
                </div>
                
                <h3>What you'll learn:</h3>
                <ul>
                    <li>Core principles of ${category.toLowerCase()} sustainability</li>
                    <li>Practical daily habits for eco-friendly living</li>
                    <li>How to measure and track your impact</li>
                    <li>Advanced techniques to reduce your environmental footprint</li>
                </ul>
                
                <h3>Course details:</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; margin: 1rem 0;">
                    <div style="background-color: var(--light-color); padding: 1rem; border-radius: var(--border-radius); text-align: center;">
                        <div style="font-size: 1.2rem; font-weight: 700; color: var(--text-color);">5</div>
                        <div style="font-size: 0.8rem; color: var(--text-light);">Modules</div>
                    </div>
                    <div style="background-color: var(--light-color); padding: 1rem; border-radius: var(--border-radius); text-align: center;">
                        <div style="font-size: 1.2rem; font-weight: 700; color: var(--text-color);">60 min</div>
                        <div style="font-size: 0.8rem; color: var(--text-light);">Duration</div>
                    </div>
                    <div style="background-color: var(--light-color); padding: 1rem; border-radius: var(--border-radius); text-align: center;">
                        <div style="font-size: 1.2rem; font-weight: 700; color: var(--text-color);">Beginner</div>
                        <div style="font-size: 0.8rem; color: var(--text-light);">Level</div>
                    </div>
                </div>
                
                <p style="font-style: italic; color: var(--text-light);">This course will help you develop sustainable habits related to ${category.toLowerCase()} that you can incorporate into your daily routine.</p>
            </div>
        `;
        
        const buttons = [
            {
                text: 'Start Learning',
                primary: true,
                handler: function() {
                    console.log('Starting course: ' + title);
                    
                    // Update course card to show in-progress
                    const courseCards = document.querySelectorAll('.course-card');
                    courseCards.forEach(card => {
                        const cardTitle = card.querySelector('h3').textContent;
                        if (cardTitle === title) {
                            card.classList.add('in-progress');
                            
                            // Add progress badge
                            const cardImage = card.querySelector('.course-image');
                            if (!cardImage.querySelector('.course-badge')) {
                                const badge = document.createElement('div');
                                badge.className = 'course-badge';
                                badge.innerHTML = '<i class="fas fa-spinner"></i> In Progress';
                                cardImage.appendChild(badge);
                            }
                            
                            // Update button text
                            const button = card.querySelector('.course-btn');
                            if (button) {
                                button.textContent = 'Continue';
                            }
                            
                            // Add progress bar
                            const courseContent = card.querySelector('.course-content');
                            const courseMeta = card.querySelector('.course-meta');
                            
                            if (courseMeta) {
                                const progressDiv = document.createElement('div');
                                progressDiv.className = 'course-progress';
                                progressDiv.innerHTML = `
                                    <div class="progress-label">
                                        <span>Progress: 0%</span>
                                    </div>
                                    <div class="progress-bar">
                                        <div class="progress-filled" style="width: 0%"></div>
                                    </div>
                                `;
                                
                                courseContent.insertBefore(progressDiv, courseContent.querySelector('.course-btn'));
                                
                                // Animate progress bar
                                setTimeout(() => {
                                    const progressFilled = progressDiv.querySelector('.progress-filled');
                                    const progressLabel = progressDiv.querySelector('.progress-label span');
                                    if (progressFilled && progressLabel) {
                                        progressFilled.style.width = '5%';
                                        progressLabel.textContent = 'Progress: 5%';
                                    }
                                }, 1000);
                            }
                        }
                    });
                }
            },
            {
                text: 'Save for Later',
                handler: function() {
                    console.log('Saving course for later: ' + title);
                    showNotification('Course saved to your list!');
                }
            }
        ];
        
        showCourseModal(title + ' - Course Overview', content, buttons);
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
});