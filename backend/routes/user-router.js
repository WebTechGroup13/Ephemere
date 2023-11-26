// backend/routes/user-router.js
const express = require('express');
const UserCtrl = require('../controllers/user-ctrl');
const router = express.Router();

// Route to create a new user
router.post('/api/user/register', async (req, res) => {
    try {
        console.log('Received a user registration request:', req.body); // Log the incoming request data
        const newUser = await UserCtrl.createUser(req.body); // Delegate to the controller
        console.log('User created successfully:', newUser); // Log the created user data
        res.status(201).json(newUser); // Send a success response
    } catch (error) {
        console.error('Error creating user:', error); // Log any errors that occur
        res.status(500).json({ error: 'Failed to create user' }); // Send an error response
    }
});
// Route for user login
router.post('/api/user/login', UserCtrl.loginUser);


module.exports = router;
