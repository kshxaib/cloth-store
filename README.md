# Divine - Men's Clothing E-Commerce Store

A full-stack MERN (MongoDB, Express, React, Node.js) e-commerce application for men's clothing with admin dashboard, JWT authentication, and Cloudinary image management.

## 🚀 Features

### Customer Features
- Browse products by category with search and filters
- Product details with image gallery and size selection
- Shopping cart with quantity management
- Secure checkout with order placement
- User authentication (register/login)
- Order history and tracking
- Responsive design for all devices

### Admin Features
- Complete dashboard with sales statistics
- Product management (create, edit, delete with image upload)
- Category management
- Order management with status updates
- Low stock alerts
- Top selling products analytics
- User management

### Technical Features
- **Backend**: Express.js REST API with MongoDB
- **Frontend**: React with Vite and Tailwind CSS
- **Authentication**: JWT stored in httpOnly cookies
- **Authorization**: Role-based access control (user/admin)
- **Image Management**: Cloudinary integration
- **State Management**: React Context API
- **Form Validation**: React Hook Form

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account or local MongoDB
- Cloudinary account (for image uploads)
- npm or yarn

## 🛠️ Installation

### 1. Clone and Navigate
```bash
cd cloth-store
```

### 2. Backend Setup

```bash
cd backend

# Create .env file
copy .env.example .env

# Edit .env and add your credentials:
# - MongoDB connection string
# - JWT secret
# - Admin email
# - Cloudinary credentials

# Install dependencies (if not already installed)
npm install
```

### 3. Frontend Setup

```bash
cd ../frontend

# Dependencies should already be installed
# If not:
npm install
```

### 4. Environment Variables

**Backend (.env)**:
```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
ADMIN_EMAIL=admin@divine.com
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
FRONTEND_URL=http://localhost:5173
```

**Frontend (.env)** - Already created:
```env
VITE_API_URL=http://localhost:5000/api
```

## 🏃‍♂️ Running the Application

### Start Backend (Terminal 1)
```bash
cd backend
npm run dev
```
Server will run on `http://localhost:5000`

### Start Frontend (Terminal 2)
```bash
cd frontend
npm run dev
```
Frontend will run on `http://localhost:5173`

### Optional: Seed Database
```bash
cd backend
npm run seed
```
This will create sample categories and products.

## 👤 Admin Access

The first user to register with the email specified in `ADMIN_EMAIL` environment variable will automatically become an admin.

**Steps to create admin:**
1. Set `ADMIN_EMAIL=admin@divine.com` in backend `.env`
2. Register a new account with that exact email
3. You now have admin access!

## 📁 Project Structure

```
cloth-store/
├── backend/
│   ├── controllers/      # Request handlers
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   ├── middleware/      # Auth & error middleware
│   ├── utils/           # Cloudinary config
│   ├── seed/            # Database seeding
│   └── server.js        # Entry point
│
├── frontend/
│   ├── src/
│   │   ├── api/         # API client functions
│   │   ├── components/  # Reusable components
│   │   ├── context/     # Auth context
│   │   ├── pages/       # Route pages
│   │   │   └── admin/   # Admin pages
│   │   ├── App.jsx      # Main app component
│   │   └── main.jsx     # Entry point
│   └── ...
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (admin)
- `PUT /api/categories/:id` - Update category (admin)
- `DELETE /api/categories/:id` - Delete category (admin)

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart` - Update cart
- `DELETE /api/cart` - Clear cart

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/my` - Get user orders
- `GET /api/orders` - Get all orders (admin)
- `PUT /api/orders/:id/status` - Update order status (admin)

### Admin
- `GET /api/admin/stats` - Get dashboard statistics

## 🎨 UI/UX Highlights

- **Modern Design**: Clean interface with Tailwind CSS
- **Brand Colors**: Custom "Divine" color palette
- **Typography**: Google Fonts (Inter & Outfit)
- **Animations**: Smooth transitions and hover effects
- **Responsive**: Mobile-first design approach
- **Loading States**: Spinners for better UX
- **Error Handling**: Clear error messages

## 📦 NPM Scripts

### Backend
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run seed` - Seed database with sample data

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🔒 Security Features

- Passwords hashed with bcrypt
- JWT tokens stored in httpOnly cookies
- CORS configured for credentials
- Input validation on forms
- Protected routes for authenticated users
- Admin-only routes for admins
- Stock validation on orders

## 🚧 Future Enhancements

- Email notifications for orders
- Payment integration (Stripe)
- Product reviews and ratings
- Wishlist functionality
- Inventory management
- Sales analytics graphs
- Product recommendations
- Multi-currency support

## 🤝 Contributing

This is a learning project. Feel free to fork and modify as needed.

## 📝 License

MIT

## 👥 Support

For issues or questions, please create an issue in the repository.

---

**Built with ❤️ using the MERN Stack**
