const API_URL = 'http://localhost:3000/api';

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const loginContainer = document.getElementById('loginContainer');
    const registerContainer = document.getElementById('registerContainer');
    const toggleRegister = document.getElementById('toggleRegister');
    const toggleLogin = document.getElementById('toggleLogin');
    const successMessage = document.getElementById('successMessage');

    // Form toggle
    toggleRegister.addEventListener('click', (e) => {
        e.preventDefault();
        loginContainer.classList.add('hidden');
        registerContainer.classList.remove('hidden');
    });

    toggleLogin.addEventListener('click', (e) => {
        e.preventDefault();
        registerContainer.classList.add('hidden');
        loginContainer.classList.remove('hidden');
    });

    // Login form submission
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        clearLoginErrors();

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const submitBtn = document.getElementById('loginSubmitBtn');

        // Client-side validation
        if (!validateClientSide(username, password)) {
            return;
        }

        // Submit to server
        submitBtn.disabled = true;
        submitBtn.textContent = 'Logging in...';

        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                // Store username and redirect to dashboard
                localStorage.setItem('loggedInUser', data.user.username);
                showSuccess(`Welcome, ${data.user.username}!`);
                // Redirect to dashboard after 2 seconds
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 2000);
            } else {
                showLoginError(data.message);
            }
        } catch (error) {
            showLoginError('Connection error. Please try again.');
            console.error('Login error:', error);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Login';
        }
    });

    // Register form submission
    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        clearRegisterErrors();

        const username = document.getElementById('regUsername').value.trim();
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('regConfirmPassword').value;
        const submitBtn = document.getElementById('registerSubmitBtn');

        // Client-side validation
        if (!validateRegistration(username, password, confirmPassword)) {
            return;
        }

        // Submit to server
        submitBtn.disabled = true;
        submitBtn.textContent = 'Registering...';

        try {
            const response = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password, confirmPassword })
            });

            const data = await response.json();

            if (response.ok) {
                // Store username and redirect to dashboard
                localStorage.setItem('loggedInUser', data.user.username);
                showSuccess(`Registration successful! Welcome, ${data.user.username}!`);
                // Redirect to dashboard after 2 seconds
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 2000);
            } else {
                showRegisterError(data.message);
            }
        } catch (error) {
            showRegisterError('Connection error. Please try again.');
            console.error('Register error:', error);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Register';
        }
    });

    // Input validation feedback
    document.getElementById('username').addEventListener('input', function() {
        validateUsernameFormat(this.value, 'usernameError');
    });

    document.getElementById('password').addEventListener('input', function() {
        validatePasswordFormat(this.value, 'passwordError');
    });

    document.getElementById('regUsername').addEventListener('input', function() {
        validateUsernameFormat(this.value, 'regUsernameError');
    });

    document.getElementById('regPassword').addEventListener('input', function() {
        validatePasswordFormat(this.value, 'regPasswordError');
    });

    document.getElementById('regConfirmPassword').addEventListener('input', function() {
        const password = document.getElementById('regPassword').value;
        const errorEl = document.getElementById('regConfirmPasswordError');
        if (this.value && this.value !== password) {
            errorEl.textContent = 'Passwords do not match';
        } else {
            errorEl.textContent = '';
        }
    });
});

function validateClientSide(username, password) {
    let isValid = true;

    if (!username.includes('_') || username.length > 5) {
        document.getElementById('usernameError').textContent =
            'Username must contain an underscore and be no more than 5 characters.';
        isValid = false;
    }

    const hasMinLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!hasMinLength || !hasUppercase || !hasNumber || !hasSpecialChar) {
        document.getElementById('passwordError').textContent =
            'Password must be at least 8 characters, contain a capital letter, a number, and a special character.';
        isValid = false;
    }

    return isValid;
}

function validateRegistration(username, password, confirmPassword) {
    let isValid = true;

    if (!username.includes('_') || username.length > 5) {
        document.getElementById('regUsernameError').textContent =
            'Username must contain an underscore and be no more than 5 characters.';
        isValid = false;
    }

    const hasMinLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!hasMinLength || !hasUppercase || !hasNumber || !hasSpecialChar) {
        document.getElementById('regPasswordError').textContent =
            'Password must be at least 8 characters, contain a capital letter, a number, and a special character.';
        isValid = false;
    }

    if (password !== confirmPassword) {
        document.getElementById('regConfirmPasswordError').textContent = 'Passwords do not match';
        isValid = false;
    }

    return isValid;
}

function validateUsernameFormat(username, errorElementId) {
    const errorEl = document.getElementById(errorElementId);
    if (!username.includes('_') || username.length > 5) {
        errorEl.textContent = 'Username must contain an underscore and be ≤5 characters.';
    } else {
        errorEl.textContent = '';
    }
}

function validatePasswordFormat(password, errorElementId) {
    const errorEl = document.getElementById(errorElementId);
    const hasMinLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password && (!hasMinLength || !hasUppercase || !hasNumber || !hasSpecialChar)) {
        errorEl.textContent = '✗ 8+ chars, uppercase, number, special char required';
    } else if (password) {
        errorEl.textContent = '✓ Password is strong';
        errorEl.style.color = '#00d4ff';
    } else {
        errorEl.textContent = '';
    }
}

function clearLoginErrors() {
    document.getElementById('usernameError').textContent = '';
    document.getElementById('passwordError').textContent = '';
}

function clearRegisterErrors() {
    document.getElementById('regUsernameError').textContent = '';
    document.getElementById('regPasswordError').textContent = '';
    document.getElementById('regConfirmPasswordError').textContent = '';
}

function showLoginError(message) {
    document.getElementById('passwordError').textContent = message;
}

function showRegisterError(message) {
    document.getElementById('regConfirmPasswordError').textContent = message;
}

function showSuccess(message) {
    document.getElementById('loginContainer').classList.add('hidden');
    document.getElementById('registerContainer').classList.add('hidden');
    document.getElementById('successMessage').classList.remove('hidden');
    document.getElementById('successText').textContent = message;
}