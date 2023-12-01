// controllers/setup-admin.js
const { User } = require('../models/user-model');
require('dotenv').config();
const bcrypt = require('bcryptjs');

// Accessing admin credentials from environment variables
const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;
console.log('admin email:', process.env.ADMIN_EMAIL);
console.log('admin password:', process.env.ADMIN_PASSWORD);

// Inside a setup or initialization function
const setupAdmin = async () => {
try {
    const adminExists = await User.findOne({ email: adminEmail });

    if (!adminExists) {
        // const salt = await bcrypt.genSalt(10);
        // const hashedAdminPassword = await bcrypt.hash(adminPassword, 10);
        const adminUser = new User({
            email: adminEmail,
            password: adminPassword,
            role: 'admin'
        });

        await adminUser.save();
        console.log('Admin user created successfully.', {
            email: adminEmail,
            password: adminPassword,
            role: 'admin'
        });
        console.log('Hashed password in the database:', adminUser.password);
    } else {
        console.log('Admin user already exists.');
    }
    } catch (error) {
        console.error('Error creating admin user:', error);
    }
};

const deleteAdminUser = async () => {
    try {
        const adminUser = await User.findOneAndDelete({ role: 'admin' });
        if (!adminUser) {
            console.log('Admin user not found.');
            return;
        }
        console.log('Admin user deleted successfully:', adminUser);
    } catch (error) {
        console.error('Error deleting admin user:', error);
    }
};

// Call this function during server startup or wherever is appropriate
// deleteAdminUser();
setupAdmin();

module.exports = {
    setupAdmin,
};