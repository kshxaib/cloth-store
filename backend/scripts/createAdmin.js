import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const createAdmin = async () => {
    try {
        await mongoose.connect("mongodb+srv://khanshoaibro100_db_user:jcVznJtnraqP6otQ@divinedb.ad32kci.mongodb.net/?appName=divinedb");
        console.log('MongoDB Connected');

        const adminEmail = 'admin@divine.com';

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
            password: 'password', 
            role: 'admin'
        });

        console.log('\n✅ Admin user created successfully!');
        console.log('\nAdmin Login Credentials:');
        console.log('Email:', admin.email);
        console.log('Password: password');
        console.log('\n⚠️  Please change the password after first login!');

        process.exit(0);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        console.error(error);
        process.exit(1);
    }
};

createAdmin();
