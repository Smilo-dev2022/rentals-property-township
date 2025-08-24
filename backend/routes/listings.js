const express = require('express');
const Listing = require('../models/Listing');
const Region = require('../models/Region');
const { auth, authorize, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/listings
// @desc    Get all listings with filters
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      type,
      category,
      minPrice,
      maxPrice,
      region,
      township,
      amenities,
      page = 1,
      limit = 12,
      sort = '-createdAt'
    } = req.query;

    // Build filter object
    const filter = { isAvailable: true };

    if (type) filter.type = type;
    if (category) filter.category = category;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (region) filter.region = region;
    if (amenities) {
      const amenityArray = amenities.split(',').map((a) => a.toLowerCase());
      filter.amenities = { $in: amenityArray };
    }

    // If township provided, resolve matching Region ids and filter by them
    if (township) {
      const regionDocs = await Region.find({
        township: new RegExp(township, 'i'),
        isActive: true
      }).select('_id');
      const regionIds = regionDocs.map((r) => r._id);
      if (regionIds.length === 0) {
        // No regions match township -> return empty result fast
        return res.json({ listings: [], totalPages: 0, currentPage: Number(page), total: 0 });
      }
      filter.region = { $in: regionIds };
    }

    // Execute query with pagination
    const listings = await Listing.find(filter)
      .populate('region', 'name township city province')
      .populate('owner', 'name email phone')
      .sort(sort)
      .limit(Number(limit) * 1)
      .skip((Number(page) - 1) * Number(limit))
      .exec();

    const total = await Listing.countDocuments(filter);

    res.json({
      listings,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      total
    });
  } catch (err) {
    console.error('Get listings error:', err);
    res.status(500).json({ error: 'Could not fetch listings' });
  }
});

// @route   GET /api/listings/:id
// @desc    Get single listing
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate('region', 'name township city province')
      .populate('owner', 'name email phone');

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    // Increment view count
    listing.views += 1;
    await listing.save();

    res.json({ listing });
  } catch (err) {
    console.error('Get listing error:', err);
    res.status(500).json({ error: 'Error fetching listing' });
  }
});

// @route   POST /api/listings
// @desc    Create new listing
// @access  Private (Landlord/Admin)
router.post('/', auth, authorize('landlord', 'admin'), async (req, res) => {
  try {
    const listingData = {
      ...req.body,
      owner: req.user.userId
    };

    const newListing = new Listing(listingData);
    await newListing.save();

    const populatedListing = await Listing.findById(newListing._id)
      .populate('region', 'name township city province')
      .populate('owner', 'name email phone');

    res.status(201).json({
      message: 'Listing created successfully',
      listing: populatedListing
    });
  } catch (err) {
    console.error('Create listing error:', err);
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ error: errors.join(', ') });
    }
    res.status(500).json({ error: 'Could not create listing' });
  }
});

module.exports = router;