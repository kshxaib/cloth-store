import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

// Define User schema inline to avoid import issues
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');

        const adminEmail = process.env.ADMIN_EMAIL || 'admin@divine.com';

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: adminEmail });

        if (existingAdmin) {
            console.log(`\n✅ Admin user already exists!`);
            console.log('\nAdmin Login Credentials:');
            console.log('Email:', existingAdmin.email);
            console.log('Password: Use your registered password');
            process.exit(0);
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);

        // Create admin user
        const admin = await User.create({
            name: 'Admin',
            email: adminEmail,
            password: hashedPassword,
            role: 'admin'
        });

        console.log('\n✅ Admin user created successfully!');
        console.log('\nAdmin Login Credentials:');
        console.log('Email:', admin.email);
        console.log('Password: admin123');
        console.log('\n⚠️  IMPORTANT: Change this password after first login!');
        console.log('\n🔐 You can now login at: http://localhost:5173/login');

        process.exit(0);
    } catch (error) {
        console.error(`\n❌ Error: ${error.message}`);
        if (error.code === 11000) {
            console.error('Admin user with this email already exists!');
        }
        process.exit(1);
    }
};

createAdmin();
