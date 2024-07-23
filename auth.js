const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db'); // Ensure correct path to db.js

const router = express.Router();
const JWT_SECRET = 'your_jwt_secret';

// Register user
router.post('/register', async (req, res) => {
    const { username, password, firstname, lastname } = req.body;
    if (!username || !password || !firstname || !lastname) {
        return res.status(400).send('All fields are required');
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = 'INSERT INTO user (username, password, firstname, lastname) VALUES (?, ?, ?, ?)';
        db.query(query, [username, hashedPassword, firstname, lastname], (err, results) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).send('Username already exists');
                }
                return res.status(500).send('Database error');
            }
            res.status(201).send('User registered successfully');
        });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).send('Server error');
    }
});

// Login user
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const ip = req.ip;

    if (!username || !password) {
        return res.status(400).send('Username and password required');
    }

    try {
        const query = 'SELECT * FROM user WHERE username = ?';
        db.query(query, [username], async (err, results) => {
            if (err) return res.status(500).send('Database error');
            const user = results[0];
            if (!user) return res.status(400).send('Invalid username or password');

            try {
                const passwordMatch = await bcrypt.compare(password, user.password);
                if (!passwordMatch) return res.status(400).send('Invalid username or password');

                const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });

                const connectQuery = 'INSERT INTO user_connect (id_user, connect_date, ip) VALUES (?, NOW(), ?)';
                db.query(connectQuery, [user.id, ip], (err) => {
                    if (err) return res.status(500).send('Database error');
                    res.json({ token });
                });
            } catch (error) {
                console.error('Error comparing passwords:', error);
                res.status(500).send('Server error');
            }
        });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).send('Server error');
    }
});

module.exports = router;
