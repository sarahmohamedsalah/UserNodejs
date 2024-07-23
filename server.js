const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');
const authRoutes = require('./auth');
const profileRoutes = require('./profile');

const app = express();
app.use(bodyParser.json());

db.connect(err => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to database');
});

app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
