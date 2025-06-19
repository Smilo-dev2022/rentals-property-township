const mongoose = require('mongoose');

const RegionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Region name is required'],
    trim: true,
    maxlength: [100, 'Region name cannot exceed 100 characters']
  },
  township: {
    type: String,
    required: [true, 'Township is required'],
    trim: true,
    maxlength: [100, 'Township name cannot exceed 100 characters']
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true,
    maxlength: [100, 'City name cannot exceed 100 characters']
  },
  province: {
    type: String,
    required: [true, 'Province is required'],
    enum: [
      'Eastern Cape',
      'Free State',
      'Gauteng',
      'KwaZulu-Natal',
      'Limpopo',
      'Mpumalanga',
      'Northern Cape',
      'North West',
      'Western Cape'
    ]
  },
  coordinates: {
    latitude: {
      type: Number,
      min: [-35, 'Invalid latitude'],
      max: [-22, 'Invalid latitude']
    },
    longitude: {
      type: Number,
      min: [16, 'Invalid longitude'],
      max: [33, 'Invalid longitude']
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create compound index for efficient searching
RegionSchema.index({ township: 1, city: 1, province: 1 });
RegionSchema.index({ name: 'text', township: 'text', city: 'text' });

module.exports = mongoose.model('Region', RegionSchema);