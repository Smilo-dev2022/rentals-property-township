const express = require('express');
const User = require('../models/User');
const Listing = require('../models/Listing');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .select('-password')
      .populate('savedListings', 'title price type images region');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ error: 'Could not fetch profile' });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, phone, avatar } = req.body;
    
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update allowed fields
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (avatar) user.avatar = avatar;

    await user.save();

    const updatedUser = await User.findById(req.user.userId).select('-password');
    
    res.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (err) {
    console.error('Update profile error:', err);
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ error: errors.join(', ') });
    }
    res.status(500).json({ error: 'Could not update profile' });
  }
});

// @route   POST /api/users/save-listing/:listingId
// @desc    Save/unsave a listing
// @access  Private
router.post('/save-listing/:listingId', auth, async (req, res) => {
  try {
    const { listingId } = req.params;
    
    const user = await User.findById(req.user.userId);
    const listing = await Listing.findById(listingId);
    
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    const isAlreadySaved = user.savedListings.includes(listingId);
    
    if (isAlreadySaved) {
      // Remove from saved listings
      user.savedListings = user.savedListings.filter(
        id => id.toString() !== listingId
      );
      await user.save();
      
      res.json({ message: 'Listing removed from saved', saved: false });
    } else {
      // Add to saved listings
      user.savedListings.push(listingId);
      await user.save();
      
      res.json({ message: 'Listing saved successfully', saved: true });
    }
  } catch (err) {
    console.error('Save listing error:', err);
    res.status(500).json({ error: 'Could not save listing' });
  }
});

// @route   GET /api/users/my-listings
// @desc    Get user's own listings
// @access  Private (Landlord/Admin)
router.get('/my-listings', auth, authorize('landlord', 'admin'), async (req, res) => {
  try {
    const listings = await Listing.find({ owner: req.user.userId })
      .populate('region', 'name township city province')
      .sort('-createdAt');

    res.json({ listings });
  } catch (err) {
    console.error('Get my listings error:', err);
    res.status(500).json({ error: 'Could not fetch listings' });
  }
});

module.exports = router;