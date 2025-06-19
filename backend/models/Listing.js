const mongoose = require('mongoose');

const ListingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  images: [{
    url: String,
    publicId: String
  }],
  type: {
    type: String,
    required: [true, 'Property type is required'],
    enum: ['room', 'flat', 'house', 'plot', 'backroom']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['rent', 'sale'],
    default: 'rent'
  },
  region: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Region',
    required: [true, 'Region is required']
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Owner is required']
  },
  amenities: [{
    type: String,
    enum: ['wifi', 'electricity', 'water', 'parking', 'security', 'furnished']
  }],
  deposit: {
    type: Number,
    min: [0, 'Deposit cannot be negative']
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  contactInfo: {
    phone: String,
    whatsapp: String,
    email: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
ListingSchema.index({ type: 1, category: 1, isAvailable: 1 });
ListingSchema.index({ price: 1 });
ListingSchema.index({ region: 1 });
ListingSchema.index({ owner: 1 });
ListingSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Listing', ListingSchema);