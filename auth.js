const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('./db');

// Register route
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    // Check if the email is already registered
    db.query('SELECT * FROM login WHERE email = ?', [email], async (error, results) => {
        if (results.length > 0) {
            return res.status(400).send('Email is already registered');
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user
        db.query(
            'INSERT INTO login (name, email, password) VALUES (?, ?, ?)',
            [name, email, hashedPassword],
            (error, results) => {
                if (error) {
                    return res.status(500).send('Error registering user');
                }
                res.status(201).send('User registered successfully');
            }
        );
    });
});

// Login route
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Check if user exists
    db.query('SELECT * FROM login WHERE email = ?', [email], async (error, results) => {
        if (results.length === 0) {
            return res.status(400).send('Email not found');
        }

        const user = results[0];

        // Compare passwords
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).send('Incorrect password');
        }

        // Set session data (assuming express-session is configured in app.js)
        req.session.userId = user.id;
        req.session.userName = user.name;
        res.status(200).send('Login successful');
    });
});

// Logout route
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Error logging out');
        }
        res.status(200).send('Logout successful');
    });
});

module.exports = router;
