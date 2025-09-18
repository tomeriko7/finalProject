# E-Commerce Platform Project

## Project Overview
This is a full-stack e-commerce platform built with React.js for the frontend and Node.js/Express for the backend. It features a customer-facing storefront and an admin panel for managing products, categories, orders, and user accounts.

## Tech Stack

### Frontend
- React.js
- Material-UI components
- React Router for navigation
- Axios for API requests
- Context API for state management

### Backend
- Node.js with Express
- MongoDB for database
- Mongoose as ODM
- JWT for authentication
- Joi for validation
- Multer for file uploads

## Features

### Customer Features
- Browse products by category
- Search functionality
- Product filtering and sorting
- User registration and login
- Cart and checkout process
- Order history and tracking
- User profile management
- Product reviews

### Admin Features
- Dashboard with sales statistics
- Product management (CRUD operations)
- Category management
- Order management and status updates
- User management
- Content management for homepage
- Sales reports and analytics

## Admin Access

### Admin User Credentials
- **Username/Email**: tomer@mail.com
- **Password**: tomer1234

### Admin Panel Access
1. Navigate to `/admin` or click the "Admin Login" link
2. Enter the admin credentials above
3. You'll be redirected to the admin dashboard

## Getting Started

### Prerequisites
- Node.js (v14.x or higher)
- MongoDB (v4.x or higher)
- npm or yarn package manager

### Installation
1. Clone the repository
   ```bash
   git clone <repository-url>
   cd finalproject
   ```

2. Install dependencies for both frontend and backend
   ```bash
   # Install frontend dependencies
   cd front
   npm install
   
   # Install backend dependencies
   cd server
   npm install
   cd ..
   ```

3. Set up environment variables
   - Create a `.env` file in the root directory
   - Create a `.env` file in the server directory
   - Add the following variables:
     ```
     # Root .env
     REACT_APP_API_URL=http://localhost:5000/api
     
     # Server .env
     PORT=5000
     MONGODB_URI=mongodb://localhost:27017/ecommerce
     JWT_SECRET=your_jwt_secret_key
     NODE_ENV=development
     ```

### Data Import
The project includes CSV files for initial data that need to be imported into MongoDB. These files are located in the `CSV-FILES` directory in the root of the project:

1. User data import
   ```bash
   # Navigate to the server directory
   cd server
   
   # Import users from CSV to MongoDB
   node scripts/import-users.js
   ```

2. Product data import
   ```bash
   # Navigate to the server directory (if not already there)
   cd server
   
   # Import products from CSV to MongoDB
   node scripts/import-products.js
   ```

These imports will populate your database with initial users and products data required for the application to function properly.

### Running the Application
1. Start the backend server
   ```bash
   cd server
   npm start
   ```

2. Start the frontend application (in a new terminal)
   ```bash
   npm start
   ```

3. Access the application
   - Frontend: http://localhost:3000
   - Admin Panel: http://localhost:3000/admin
   - Backend API: http://localhost:5000/api

## API Documentation

### Main API Endpoints
- **Authentication**: `/api/auth` - User registration, login, and token refresh
- **Products**: `/api/products` - Product listing, details, and management
- **Categories**: `/api/categories` - Category listing and management
- **Orders**: `/api/orders` - Order creation, history, and management
- **Users**: `/api/users` - User profile management
- **Reviews**: `/api/reviews` - Product reviews
- **Statistics**: `/api/statistics` - Sales and performance data (admin only)

## Deployment

The application can be deployed to various environments:
- Frontend: Netlify, Vercel, or AWS Amplify
- Backend: Heroku, AWS Elastic Beanstalk, or DigitalOcean
- Database: MongoDB Atlas

## License
This project is licensed under the MIT License.