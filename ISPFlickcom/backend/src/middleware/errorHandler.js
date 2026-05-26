// ── Global Error Handler Middleware ──
const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err.message);
  console.error(err.stack);

  // Joi validation error
  if (err.isJoi) {
    return res.status(400).json({
      success: false,
      error: 'Validation error',
      details: err.details?.map(d => ({
        field: d.path?.[0],
        message: d.message,
      })),
    });
  }

  // Custom app error
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
    });
  }

  // Unknown error
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message,
  });
};

// ── Custom AppError class ──
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

module.exports = { errorHandler, AppError };
