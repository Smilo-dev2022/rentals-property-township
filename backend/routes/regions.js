const express = require('express');
const Region = require('../models/Region');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/regions
// @desc    Get all regions
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { province, city, township, search } = req.query;
    
    // Build filter object
    const filter = { isActive: true };
    
    if (province) filter.province = province;
    if (city) filter.city = new RegExp(city, 'i');
    if (township) filter.township = new RegExp(township, 'i');
    
    // Text search across multiple fields
    if (search) {
      filter.$or = [
        { name: new RegExp(search, 'i') },
        { township: new RegExp(search, 'i') },
        { city: new RegExp(search, 'i') }
      ];
    }

    const regions = await Region.find(filter)
      .sort({ province: 1, city: 1, township: 1 })
      .select('name township city province coordinates');

    res.json({ regions });
  } catch (err) {
    console.error('Get regions error:', err);
    res.status(500).json({ error: 'Could not fetch regions' });
  }
});

// @route   GET /api/regions/provinces
// @desc    Get all provinces
// @access  Public
router.get('/provinces', async (req, res) => {
  try {
    const provinces = await Region.distinct('province', { isActive: true });
    res.json({ provinces: provinces.sort() });
  } catch (err) {
    console.error('Get provinces error:', err);
    res.status(500).json({ error: 'Could not fetch provinces' });
  }
});

// @route   GET /api/regions/townships/:province
// @desc    Get townships by province
// @access  Public
router.get('/townships/:province', async (req, res) => {
  try {
    const { province } = req.params;
    const townships = await Region.find(
      { province, isActive: true },
      'township city'
    ).sort({ township: 1 });
    
    res.json({ townships });
  } catch (err) {
    console.error('Get townships error:', err);
    res.status(500).json({ error: 'Could not fetch townships' });
  }
});

// @route   POST /api/regions
// @desc    Create new region
// @access  Private (Admin only)
router.post('/', auth, authorize('admin'), async (req, res) => {
  try {
    const newRegion = new Region(req.body);
    await newRegion.save();
    
    res.status(201).json({
      message: 'Region created successfully',
      region: newRegion
    });
  } catch (err) {
    console.error('Create region error:', err);
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ error: errors.join(', ') });
    }
    res.status(500).json({ error: 'Could not create region' });
  }
});

module.exports = router;