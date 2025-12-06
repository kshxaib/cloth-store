import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');

        const adminEmail = process.env.ADMIN_EMAIL || 'admin@divine.com';

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: adminEmail });

        if (existingAdmin) {
            console.log(`Admin user already exists with email: ${adminEmail}`);
            console.log('Admin details:', {
                name: existingAdmin.name,
                email: existingAdmin.email,
                role: existingAdmin.role
            });
            process.exit(0);
        }

        // Create admin user
        const admin = await User.create({
            name: 'Admin',
            email: adminEmail,
            password: 'admin123', // Change this password after first login
            role: 'admin'
        });

        console.log('\n✅ Admin user created successfully!');
        console.log('\nAdmin Login Credentials:');
        console.log('Email:', admin.email);
        console.log('Password: admin123');
        console.log('\n⚠️  Please change the password after first login!');

        process.exit(0);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        console.error(error);
        process.exit(1);
    }
};

createAdmin();
