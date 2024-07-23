const db = require('../db');

class UserModel {
    async createUser(username, hashedPassword, firstname, lastname) {
        try {
            const query = 'INSERT INTO user (username, password, firstname, lastname) VALUES (?, ?, ?, ?)';
            const [result] = await db.promise().query(query, [username, hashedPassword, firstname, lastname]);
            return result.insertId; // Assuming your user table has an auto-increment ID
        } catch (error) {
            throw error;
        }
    }

    async getUserByUsername(username) {
        try {
            const query = 'SELECT * FROM user WHERE username = ?';
            const [rows] = await db.promise().query(query, [username]);
            return rows[0]; // Assuming username is unique; returning the first match
        } catch (error) {
            throw error;
        }
    }

    async getUserById(id) {
        try {
            const query = 'SELECT * FROM user WHERE id = ?';
            const [rows] = await db.promise().query(query, [id]);
            return rows[0]; // Assuming ID is unique; returning the first match
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new UserModel();
