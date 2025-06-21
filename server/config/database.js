const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/flower-shop', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected Successfully: ${conn.connection.host}`);
    
    // Connection event listeners
    mongoose.connection.on('connected', () => {
      console.log('MongoDB - Connection established');
    });

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB - Connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB - Connection disconnected');
    });

  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
