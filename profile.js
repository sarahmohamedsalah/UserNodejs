const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('./db');

const router = express.Router();
const JWT_SECRET = 'your_jwt_secret';

// Get user profile
router.get('/', (req, res) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).send('Access denied');

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).send('Invalid token');
        const userId = decoded.userId;

        const userQuery = 'SELECT username, firstname, lastname FROM user WHERE id = ?';
        db.query(userQuery, [userId], (err, userResults) => {
            if (err) return res.status(500).send('Database error');
            const user = userResults[0];
            if (!user) return res.status(404).send('User not found');

            const connectQuery = 'SELECT connect_date, ip FROM user_connect WHERE id_user = ?';
            db.query(connectQuery, [userId], (err, connectResults) => {
                if (err) return res.status(500).send('Database error');
                res.json({ user, connections: connectResults });
            });
        });
    });
});

module.exports = router;
