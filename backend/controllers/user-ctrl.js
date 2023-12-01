// controllers/user-ctrls.js
const User = require('../models/user-model');
const bcrypt = require('bcryptjs');

// User Registration
const createUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Received a user registration request:', { email });
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      console.log('User already exists:', { email });
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({ email, password });
    await user.save();

    console.log('User created successfully:', { email });
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// User Login
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log('Received login request'); // Add this line for logging
  try {

    console.log('Received credentials:', email, password); // Log the received credentials

    // If not admin, proceed with regular user login logic
    const user = await User.findOne({ email, password });
    
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    // Compare password
    const isMatch = await user.comparePassword(password);
    if (isMatch) {
      // Passwords match - login successful
      return res.status(200).json({ message: 'Login successful', user });
    } else {
      // Passwords don't match
      return res.status(401).json({ message: 'Incorrect password' });
    }  
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};


module.exports = {
  createUser,
  loginUser,
};
