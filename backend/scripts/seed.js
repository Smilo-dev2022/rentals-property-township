/* Seed script for Cassie Rentals */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('../models/User');
const Region = require('../models/Region');
const Listing = require('../models/Listing');

dotenv.config({ path: require('path').join(__dirname, '..', '.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/cassie-rentals';

async function seed() {
  let mongod;
  try {
    try {
      await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
      console.log('Connected to MongoDB');
    } catch (err) {
      console.warn('MongoDB not available, starting in-memory server for seeding...');
      mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
      console.log('Connected to in-memory MongoDB');
    }

    // Clear collections
    await Promise.all([
      User.deleteMany({}),
      Region.deleteMany({}),
      Listing.deleteMany({})
    ]);

    // Create regions
    const regions = await Region.insertMany([
      { name: 'Orlando East', township: 'Soweto', city: 'Johannesburg', province: 'Gauteng' },
      { name: 'Katlehong Central', township: 'Katlehong', city: 'Germiston', province: 'Gauteng' },
      { name: 'KwaMashu A', township: 'KwaMashu', city: 'Durban', province: 'KwaZulu-Natal' }
    ]);

    // Create users
    const [admin, landlord, tenant] = await User.insertMany([
      { name: 'Admin User', email: 'admin@cassie.co.za', password: 'password', role: 'admin', phone: '27810000000' },
      { name: 'Landlord One', email: 'landlord@cassie.co.za', password: 'password', role: 'landlord', phone: '27820000000' },
      { name: 'Tenant One', email: 'tenant@cassie.co.za', password: 'password', role: 'tenant', phone: '27830000000' }
    ]);

    // Create listings
    await Listing.insertMany([
      {
        title: 'Cozy Room in Soweto',
        description: 'Nice room with WiFi and electricity included',
        price: 1500,
        type: 'room',
        category: 'rent',
        region: regions[0]._id,
        owner: landlord._id,
        amenities: ['wifi', 'electricity'],
        contactInfo: { phone: '27820000000', whatsapp: '27820000000', email: 'landlord@cassie.co.za' },
        isAvailable: true
      },
      {
        title: 'Modern Flat in Katlehong',
        description: 'Two bedroom flat with parking',
        price: 3500,
        type: 'flat',
        category: 'rent',
        region: regions[1]._id,
        owner: landlord._id,
        amenities: ['parking', 'water'],
        contactInfo: { phone: '27820000000', whatsapp: '27820000000', email: 'landlord@cassie.co.za' },
        isAvailable: true
      }
    ]);

    console.log('Seed data inserted');
  } catch (err) {
    console.error('Seed error:', err);
  } finally {
    await mongoose.disconnect();
    if (mongod) {
      await mongod.stop();
    }
    console.log('Disconnected from MongoDB');
  }
}

seed();

