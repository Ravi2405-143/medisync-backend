const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/medications', require('./routes/medications'));

// Root route
// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'MediSync Backend API is running!',
    endpoints: {
      auth: '/api/auth',
      medications: '/api/medications'
    }
  });
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/medisync')
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => console.log('❌ MongoDB connection error:', err));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 MediSync server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
});