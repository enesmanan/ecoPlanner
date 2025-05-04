// Main JavaScript for ecoPlanner

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.nav-links') && !event.target.closest('.mobile-menu-btn')) {
            if (navLinks && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
            }
        }
    });
    
    // Notes saving functionality
    const saveNotesBtn = document.getElementById('save-notes');
    if (saveNotesBtn) {
        saveNotesBtn.addEventListener('click', function() {
            const notesText = document.getElementById('user-notes').value;
            saveNotes(notesText);
        });
    }
    
    // Load saved notes if they exist
    const userNotes = document.getElementById('user-notes');
    if (userNotes) {
        const savedNotes = localStorage.getItem('eco_planner_notes');
        if (savedNotes) {
            userNotes.value = savedNotes;
        }
    }
});

// Save notes to localStorage
function saveNotes(notes) {
    localStorage.setItem('eco_planner_notes', notes);
    
    // Show success message
    const saveBtn = document.getElementById('save-notes');
    const originalText = saveBtn.innerText;
    
    saveBtn.innerText = 'Saved!';
    saveBtn.style.backgroundColor = 'var(--success-color)';
    
    setTimeout(() => {
        saveBtn.innerText = originalText;
        saveBtn.style.backgroundColor = 'var(--primary-color)';
    }, 2000);
}

// Format current date
function formatDate(date) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Display current date if element exists
const currentDateElement = document.getElementById('current-date');
if (currentDateElement) {
    currentDateElement.textContent = formatDate(new Date());
}

// Save plan to localStorage
function savePlan(planText, time) {
    const plans = JSON.parse(localStorage.getItem('eco_planner_plans')) || [];
    
    // Create new plan object
    const newPlan = {
        id: Date.now(),
        time: time || formatTime(new Date()),
        text: planText,
        date: new Date().toISOString().split('T')[0] // Save just the date part
    };
    
    plans.push(newPlan);
    localStorage.setItem('eco_planner_plans', JSON.stringify(plans));
    
    return newPlan;
}

// Format time for display
function formatTime(date) {
    return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
    });
}

// Navigate profile dropdown
document.addEventListener('DOMContentLoaded', function() {
    const profileDropdown = document.querySelector('.profile-dropdown');
    const navProfile = document.querySelector('.nav-profile');
    
    if (navProfile && profileDropdown) {
        navProfile.addEventListener('click', function(event) {
            event.stopPropagation();
            profileDropdown.classList.toggle('show');
        });
        
        document.addEventListener('click', function(event) {
            if (!event.target.closest('.nav-profile')) {
                profileDropdown.classList.remove('show');
            }
        });
    }
});

// Add animation to cards
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.dashboard-card, .course-card, .team-member');
    
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = 1;
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        cards.forEach(card => {
            card.style.opacity = 0;
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(card);
        });
    } else {
        // Fallback for older browsers
        cards.forEach(card => {
            card.style.opacity = 1;
            card.style.transform = 'translateY(0)';
        });
    }
});