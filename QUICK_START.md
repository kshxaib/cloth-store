# Quick Start Guide

## 1. Configure Backend Environment

Create `backend/.env` file with your credentials:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/divine
PORT=5000
JWT_SECRET=your_very_secure_random_string_here
JWT_EXPIRES_IN=7d
ADMIN_EMAIL=admin@divine.com
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=your_cloudinary_secret
FRONTEND_URL=http://localhost:5173
```

## 2. Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## 3. Seed Sample Data (Optional)

```bash
cd backend
npm run seed
```

This creates:
- 5 categories (Shirts, T-Shirts, Jeans, Shorts, Jackets)
- 4 sample products

## 4. Create Admin Account

1. Open http://localhost:5173
2. Click "Register"
3. Use email: `admin@divine.com` (or whatever you set in ADMIN_EMAIL)
4. Complete registration
5. You now have admin access! Go to `/admin`

## 5. Test the Application

### User Features:
- Browse products at `/products`
- Search and filter
- View product details
- Add to cart
- Complete checkout
- View orders in profile

### Admin Features:
- Dashboard at `/admin`
- Manage products at `/admin/products`
- View statistics and analytics

## Troubleshooting

**Backend won't start:**
- Check MongoDB connection string
- Ensure MongoDB Atlas IP whitelist includes your IP

**Images won't upload:**
- Verify Cloudinary credentials
- Check API keys are correct

**Frontend can't connect:**
- Ensure backend is running on port 5000
- Check VITE_API_URL in frontend/.env

**Admin access not working:**
- Email must EXACTLY match ADMIN_EMAIL in backend/.env
- Register a new account with that email

## Next Steps

1. Customize the brand colors in `frontend/tailwind.config.js`
2. Add real product images via Cloudinary
3. Test all user flows
4. Deploy to production (Vercel/Netlify + Railway/Render)

Enjoy your Divine e-commerce store! 🎉
