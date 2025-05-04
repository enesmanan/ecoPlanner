// Login functionality for ecoPlanner

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const rememberMe = document.getElementById('remember').checked;
            
            // Simple validation
            if (!email || !password) {
                alert('Please enter both email and password');
                return;
            }
            
            // For demo purposes, we'll use hardcoded credentials
            // In a real app, this would be an API call
            if (email === 'demo@ecoplanner.com' && password === 'password') {
                // Save user session
                if (rememberMe) {
                    localStorage.setItem('eco_planner_user', JSON.stringify({
                        email: email,
                        name: 'Jane Smith',
                        loggedIn: true
                    }));
                } else {
                    sessionStorage.setItem('eco_planner_user', JSON.stringify({
                        email: email,
                        name: 'Jane Smith',
                        loggedIn: true
                    }));
                }
                
                // Redirect to dashboard
                window.location.href = 'dashboard.html';
            } else {
                // For demo, also allow any login
                if (rememberMe) {
                    localStorage.setItem('eco_planner_user', JSON.stringify({
                        email: email,
                        name: 'Jane Smith',
                        loggedIn: true
                    }));
                } else {
                    sessionStorage.setItem('eco_planner_user', JSON.stringify({
                        email: email,
                        name: 'Jane Smith',
                        loggedIn: true
                    }));
                }
                
                // Redirect to dashboard
                window.location.href = 'dashboard.html';
            }
        });
    }
    
    // Check if user is already logged in
    function checkUserLoggedIn() {
        const localUser = localStorage.getItem('eco_planner_user');
        const sessionUser = sessionStorage.getItem('eco_planner_user');
        
        if (localUser || sessionUser) {
            const user = JSON.parse(localUser || sessionUser);
            if (user && user.loggedIn) {
                // If on login page, redirect to dashboard
                if (window.location.pathname.includes('index.html') || 
                    window.location.pathname === '/' || 
                    window.location.pathname === '') {
                    window.location.href = 'dashboard.html';
                }
            }
        } else {
            // If not logged in and not on login page, redirect to login
            if (!window.location.pathname.includes('index.html') && 
                window.location.pathname !== '/' &&
                window.location.pathname !== '') {
                window.location.href = 'index.html';
            }
        }
    }
    
    // For demo purposes, we'll skip the automatic redirect
    // Uncomment this to enable automatic login check
    // checkUserLoggedIn();
    
    // Add animation to login form
    const loginContainer = document.querySelector('.login-container');
    if (loginContainer) {
        loginContainer.style.opacity = 0;
        loginContainer.style.transform = 'translateY(20px)';
        loginContainer.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        setTimeout(() => {
            loginContainer.style.opacity = 1;
            loginContainer.style.transform = 'translateY(0)';
        }, 100);
    }
});

// Function to handle logout
function logout() {
    localStorage.removeItem('eco_planner_user');
    sessionStorage.removeItem('eco_planner_user');
    window.location.href = 'index.html';
}

// Add event listener to logout links
document.addEventListener('DOMContentLoaded', function() {
    const logoutLinks = document.querySelectorAll('a[href="index.html"]');
    
    logoutLinks.forEach(link => {
        if (link.querySelector('i.fa-sign-out-alt')) {
            link.addEventListener('click', function(event) {
                event.preventDefault();
                logout();
            });
        }
    });
});