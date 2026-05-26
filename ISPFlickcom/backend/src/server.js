require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/authRoutes');
const customerRoutes = require('./routes/customerRoutes');
const adminRoutes = require('./routes/adminRoutes');
const packageRoutes = require('./routes/packageRoutes');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// ── Security ──
app.use(helmet());
app.use(cors({
  origin: function (origin, callback) {
    // Allow any origin during development (crucial for Flutter Web dynamic ports)
    callback(null, true);
  },
  credentials: true,
}));

// ── Rate Limiting ──
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { success: false, error: 'Too many requests. Please try again later.' },
});
app.use('/api/auth', limiter);

// ── Body Parsing ──
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── Logging ──
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// ── Static Files (Uploads) ──
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ── Health Check ──
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── Routes ──
app.use('/api/auth', authRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/packages', packageRoutes);

// ── 404 Handler ──
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

// ── Global Error Handler ──
app.use(errorHandler);

// ── Start Server ──
app.listen(PORT, () => {
  console.log(`🚀 ISP Backend running on http://localhost:${PORT}`);
  console.log(`📋 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
