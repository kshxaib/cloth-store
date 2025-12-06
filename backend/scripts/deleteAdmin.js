import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const deleteAdminUser = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');

        const adminEmail = process.env.ADMIN_EMAIL || 'admin@divine.com';

        const deletedUser = await User.findOneAndDelete({ email: adminEmail });

        if (deletedUser) {
            console.log(`✓ Deleted user with email: ${adminEmail}`);
        } else {
            console.log(`No user found with email: ${adminEmail}`);
        }

        process.exit(0);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

deleteAdminUser();
