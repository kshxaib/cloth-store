import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

dotenv.config();

// Sample categories
const categories = [
    {
        name: 'Shirts',
        slug: 'shirts',
        description: 'Formal and casual shirts for men',
    },
    {
        name: 'T-Shirts',
        slug: 't-shirts',
        description: 'Comfortable cotton t-shirts',
    },
    {
        name: 'Jeans',
        slug: 'jeans',
        description: 'Denim jeans in various styles',
    },
    {
        name: 'Shorts',
        slug: 'shorts',
        description: 'Summer shorts and casual wear',
    },
    {
        name: 'Jackets',
        slug: 'jackets',
        description: 'Jackets and outerwear',
    },
    {
        name: 'Hoodies',
        slug: 'hoodies',
        description: 'Comfortable hoodies and sweatshirts',
    },
];

// Sample users (non-admin)
const sampleUsers = [
    {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'user'
    },
    {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'password123',
        role: 'user'
    },
    {
        name: 'Mike Johnson',
        email: 'mike@example.com',
        password: 'password123',
        role: 'user'
    },
];

// Product images mapping
const productImages = {
    'Classic White Oxford Shirt': 'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=800&q=80',
    'Black Formal Shirt': 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80',
    'Classic Black T-Shirt': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
    'White Crew Neck T-Shirt': 'https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=800&q=80',
    'Slim Fit Blue Jeans': 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80',
    'Black Skinny Jeans': 'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=800&q=80',
    'Khaki Chino Shorts': 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800&q=80',
    'Black Leather Jacket': 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80',
    'Gray Pullover Hoodie': 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80',
    'Black Zip Hoodie': 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80',
};

// Comprehensive product data for each category
const productTemplates = {
    Shirts: [
        {
            title: 'Classic White Oxford Shirt',
            description: 'Timeless white Oxford shirt perfect for formal and business casual occasions.',
            price: 49.99,
            sizes: [
                { size: 'S', stock: 15 },
                { size: 'M', stock: 20 },
                { size: 'L', stock: 18 },
                { size: 'XL', stock: 12 },
            ],
            colors: ['White'],
            featured: true,
        },
        {
            title: 'Black Formal Shirt',
            description: 'Elegant black formal shirt with slim fit design.',
            price: 55.00,
            sizes: [
                { size: 'S', stock: 10 },
                { size: 'M', stock: 16 },
                { size: 'L', stock: 15 },
                { size: 'XL', stock: 8 },
            ],
            colors: ['Black'],
            featured: true,
        },
    ],
    'T-Shirts': [
        {
            title: 'Classic Black T-Shirt',
            description: 'Essential black crew neck t-shirt made from 100% cotton.',
            price: 19.99,
            sizes: [
                { size: 'S', stock: 25 },
                { size: 'M', stock: 30 },
                { size: 'L', stock: 28 },
                { size: 'XL', stock: 20 },
            ],
            colors: ['Black'],
            featured: true,
        },
        {
            title: 'White Crew Neck T-Shirt',
            description: 'Classic white t-shirt with a comfortable fit.',
            price: 18.99,
            sizes: [
                { size: 'S', stock: 22 },
                { size: 'M', stock: 28 },
                { size: 'L', stock: 25 },
                { size: 'XL', stock: 18 },
            ],
            colors: ['White'],
            featured: true,
        },
    ],
    Jeans: [
        {
            title: 'Slim Fit Blue Jeans',
            description: 'Modern slim fit jeans in classic blue denim.',
            price: 69.99,
            sizes: [
                { size: '30', stock: 12 },
                { size: '32', stock: 18 },
                { size: '34', stock: 16 },
                { size: '36', stock: 10 },
            ],
            colors: ['Blue'],
            featured: true,
        },
        {
            title: 'Black Skinny Jeans',
            description: 'Trendy black skinny jeans with stretch fabric.',
            price: 74.99,
            sizes: [
                { size: '30', stock: 10 },
                { size: '32', stock: 15 },
                { size: '34', stock: 14 },
                { size: '36', stock: 8 },
            ],
            colors: ['Black'],
            featured: true,
        },
    ],
    Shorts: [
        {
            title: 'Khaki Chino Shorts',
            description: 'Classic khaki chino shorts perfect for summer.',
            price: 39.99,
            sizes: [
                { size: 'S', stock: 18 },
                { size: 'M', stock: 22 },
                { size: 'L', stock: 20 },
                { size: 'XL', stock: 14 },
            ],
            colors: ['Khaki'],
            featured: false,
        },
    ],
    Jackets: [
        {
            title: 'Black Leather Jacket',
            description: 'Premium leather jacket with classic design.',
            price: 199.99,
            sizes: [
                { size: 'S', stock: 6 },
                { size: 'M', stock: 10 },
                { size: 'L', stock: 8 },
                { size: 'XL', stock: 5 },
            ],
            colors: ['Black'],
            featured: true,
        },
    ],
    Hoodies: [
        {
            title: 'Gray Pullover Hoodie',
            description: 'Cozy pullover hoodie in soft fleece.',
            price: 54.99,
            sizes: [
                { size: 'S', stock: 16 },
                { size: 'M', stock: 22 },
                { size: 'L', stock: 20 },
                { size: 'XL', stock: 14 },
            ],
            colors: ['Gray'],
            featured: true,
        },
        {
            title: 'Black Zip Hoodie',
            description: 'Classic zip-up hoodie with kangaroo pockets.',
            price: 59.99,
            sizes: [
                { size: 'S', stock: 14 },
                { size: 'M', stock: 20 },
                { size: 'L', stock: 18 },
                { size: 'XL', stock: 12 },
            ],
            colors: ['Black'],
            featured: false,
        },
    ],
};

const seedDatabase = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect("mongodb+srv://khanshoaibro100_db_user:jcVznJtnraqP6otQ@divinedb.ad32kci.mongodb.net/?appName=divinedb");
        console.log('MongoDB Connected');

        // Clear existing data
        await Category.deleteMany({});
        await Product.deleteMany({});
        await User.deleteMany({});
        console.log('✓ Cleared existing data');

        // Insert categories
        const createdCategories = await Category.insertMany(categories);
        console.log(`✓ Inserted ${createdCategories.length} categories`);

        // Create users
        const usersToCreate = [];
        for (const userData of sampleUsers) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(userData.password, salt);
            usersToCreate.push({
                ...userData,
                password: hashedPassword,
            });
        }
        const createdUsers = await User.insertMany(usersToCreate);
        console.log(`✓ Inserted ${createdUsers.length} users`);

        // Create products for each category
        const allProducts = [];
        for (const category of createdCategories) {
            const categoryProducts = productTemplates[category.name] || [];

            for (const productTemplate of categoryProducts) {
                const imageUrl = productImages[productTemplate.title] || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&q=80';

                allProducts.push({
                    ...productTemplate,
                    category: category._id,
                    images: [
                        {
                            url: imageUrl,
                            public_id: `${category.slug}_${productTemplate.title.toLowerCase().replace(/\s+/g, '_')}`,
                        },
                    ],
                });
            }
        }

        const createdProducts = await Product.insertMany(allProducts);
        console.log(`\n\n✓ Database seeded successfully with ${createdProducts.length} products!\n`);
        console.log('📝 Sample Users (password for all: password123):');
        sampleUsers.forEach(user => {
            console.log(`   - ${user.name}: ${user.email}`);
        });
        console.log('\n💡 Next steps:');
        console.log('1. Login with any sample user above');
        console.log('2. Register with ADMIN_EMAIL to become admin');
        console.log('3. Browse products at http://localhost:5173\n');

        process.exit(0);
    } catch (error) {
        console.error(`Error seeding database: ${error.message}`);
        process.exit(1);
    }
};

seedDatabase();
