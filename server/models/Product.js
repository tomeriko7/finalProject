import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  name: {
    type: String,
    required: [true, 'שם המוצר הוא שדה חובה'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'תיאור המוצר הוא שדה חובה']
  },
  price: {
    type: Number,
    required: [true, 'מחיר המוצר הוא שדה חובה'],
    min: [0, 'המחיר חייב להיות מספר חיי']
  },
  category: {
    type: String,
    required: [true, 'קטגוריה היא שדה חובה'],
    trim: true
  },
  stockQuantity: {
    type: Number,
    required: [true, 'כמות במלאי היא שדה חובה'],
    min: [0, 'הכמות במלאי חייבת להיות 0 או יותר']
  },
  imageUrl: {
    type: String,
    default: 'https://via.placeholder.com/150'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  discount: {
    type: Number,
    default: 0,
    min: [0, 'הנחה חייבת להיות 0 או יותר'],
    max: [100, 'הנחה לא יכולה לעלות על 100%']
  },
  tags: [{
    type: String,
    trim: true
  }],
  dateAdded: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create a compound index for better search performance
productSchema.index({ name: 'text', description: 'text', category: 'text', tags: 'text' });

const Product = mongoose.model('Product', productSchema);

export default Product;
