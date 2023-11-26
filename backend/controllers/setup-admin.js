// controllers/setup-admin.js
const { User } = require('../models/user-model');
const bcrypt = require('bcryptjs');

// Accessing admin credentials from environment variables
const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;
console.log('admin email:', process.env.ADMIN_EMAIL);
console.log('admin password:', process.env.ADMIN_PASSWORD);

const saltRounds = 10;

// Validate admin credentials
const validateAdminCredentials = (email, password) => {
    return email === adminEmail && password === adminPassword;
};

// Inside a setup or initialization function
const setupAdmin = async () => {
try {
    const adminExists = await User.findOne({ email: adminEmail });

    if (!adminExists) {
        const hashedAdminPassword = await bcrypt.hash(adminPassword, saltRounds);
        const adminUser = new User({
            email: adminEmail,
            password: hashedAdminPassword,
            role: 'admin'
        });

        await adminUser.save();
        console.log('Admin user created successfully.', { email, password, role });
    } else {
        console.log('Admin user already exists.');
    }
} catch (error) {
    console.error('Error creating admin user:', error);
}
};

// Call this function during server startup or wherever is appropriate
setupAdmin();

module.exports = {
    validateAdminCredentials,
    setupAdmin,
};