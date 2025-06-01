document.addEventListener('DOMContentLoaded', function() {
    // Toggle password visibility
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            // Toggle eye icon
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    }
    
    // Form submission
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const rememberMe = document.getElementById('remember').checked;
            
            // Simple validation
            if (!username || !password) {
                alert('Please enter both username and password');
                return;
            }
            
            // Here you would typically send the login data to a server
            // For this example, we'll just simulate a successful login
            
            console.log('Login attempt:', {
                username,
                password: '********', // Don't log actual passwords
                rememberMe
            });
            
            // Simulate login process
            simulateLogin(username);
        });
    }
    
    // Simulate login process with loading state
    function simulateLogin(username) {
        const loginButton = document.querySelector('.login-button');
        const originalText = loginButton.textContent;
        
        // Show loading state
        loginButton.textContent = 'Logging in...';
        loginButton.disabled = true;
        
        // Simulate API call delay
        setTimeout(() => {
            // Store user info in localStorage if needed
            localStorage.setItem('user', JSON.stringify({
                username: username,
                isLoggedIn: true,
                loginTime: new Date().toISOString()
            }));
            
            // Redirect to main page
            window.location.href = 'index.html';
        }, 1500);
    }
    
    // Social login buttons (for demonstration)
    const socialButtons = document.querySelectorAll('.social-icon');
    
    socialButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            event.preventDefault();
            
            const platform = this.classList.contains('facebook') ? 'Facebook' :
                            this.classList.contains('google') ? 'Google' :
                            this.classList.contains('twitter') ? 'Twitter' : 'Unknown';
            
            alert(`${platform} login is not implemented in this demo.`);
        });
    });
    
    // Check if user is already logged in
    function checkLoginStatus() {
        const user = JSON.parse(localStorage.getItem('user'));
        
        if (user && user.isLoggedIn) {
            // User is already logged in, redirect to main page
            // Uncomment the line below to enable auto-redirect
            // window.location.href = 'index.html';
        }
    }
    
    // Uncomment to enable auto login check
    // checkLoginStatus();
});
