const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Simple in-memory user database (replace with actual DB in production)
const usersDatabase = [
    { id: 1, username: 'T1_t', password: 'SecurePass123!' },
    { id: 2, username: 'Admin_', password: 'AdminPass123!' }
];

// Login endpoint
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: 'Username and password are required.'
        });
    }

    // Find user
    const user = usersDatabase.find(u => u.username === username);
    
    if (!user) {
        return res.status(401).json({
            success: false,
            message: 'Invalid username or password.'
        });
    }

    // Verify password (in production, use bcrypt)
    if (user.password !== password) {
        return res.status(401).json({
            success: false,
            message: 'Invalid username or password.'
        });
    }

    // Successful login
    return res.status(200).json({
        success: true,
        message: 'Login successful!',
        user: {
            id: user.id,
            username: user.username
        }
    });
});

// Register endpoint
app.post('/api/register', (req, res) => {
    const { username, password, confirmPassword } = req.body;

    // Validate input
    if (!username || !password || !confirmPassword) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required.'
        });
    }

    // Check username format
    if (!username.includes('_') || username.length > 5) {
        return res.status(400).json({
            success: false,
            message: 'Username must contain an underscore and be no more than 5 characters.'
        });
    }

    // Check password match
    if (password !== confirmPassword) {
        return res.status(400).json({
            success: false,
            message: 'Passwords do not match.'
        });
    }

    // Check password complexity
    const hasMinLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!hasMinLength || !hasUppercase || !hasNumber || !hasSpecialChar) {
        return res.status(400).json({
            success: false,
            message: 'Password must be at least 8 characters, contain a capital letter, a number, and a special character.'
        });
    }

    // Check if username already exists
    if (usersDatabase.find(u => u.username === username)) {
        return res.status(409).json({
            success: false,
            message: 'Username already exists.'
        });
    }

    // Create new user
    const newUser = {
        id: usersDatabase.length + 1,
        username: username,
        password: password // In production, hash this with bcrypt
    };

    usersDatabase.push(newUser);

    return res.status(201).json({
        success: true,
        message: 'Registration successful!',
        user: {
            id: newUser.id,
            username: newUser.username
        }
    });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'Server is running' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log('Available endpoints:');
    console.log('  POST /api/login - Login with username and password');
    console.log('  POST /api/register - Register a new user');
    console.log('  GET /api/health - Health check');
});