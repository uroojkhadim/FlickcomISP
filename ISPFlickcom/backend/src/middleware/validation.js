const Joi = require('joi');

// ── Registration Schema ──
const registerSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  cnic: Joi.string().pattern(/^\d{5}-\d{7}-\d{1}$/).required()
    .messages({ 'string.pattern.base': 'CNIC must be in format 12345-6789012-3' }),
  address: Joi.string().min(10).required(),
  email: Joi.string().email({ tlds: { allow: false } }).required(),
  phone: Joi.string().pattern(/^\+92\d{10}$/).required()
    .messages({ 'string.pattern.base': 'Phone must be in format +923001234567' }),
  password: Joi.string().min(8).max(128).required()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
    .messages({ 'string.pattern.base': 'Password must contain uppercase, lowercase, number, and special character' }),
});

// ── Login Schema ──
const loginSchema = Joi.object({
  email: Joi.string().email({ tlds: { allow: false } }).required(),
  password: Joi.string().required(),
});

// ── Complaint Schema ──
const complaintSchema = Joi.object({
  title: Joi.string().min(5).max(200).required(),
  message: Joi.string().min(20).required(),
  category: Joi.string().valid('billing', 'speed', 'disconnection', 'other').default('other'),
});

// ── Package Schema ──
const packageSchema = Joi.object({
  name: Joi.string().max(50).required(),
  description: Joi.string().allow('').optional(),
  mb_limit: Joi.number().integer().positive().required(),
  validity_days: Joi.number().integer().positive().required(),
  price_pkr: Joi.number().positive().required(),
  old_customer_price_pkr: Joi.number().positive().optional(),
  display_order: Joi.number().integer().optional(),
});

// ── Bill Generation Schema ──
const billGenerateSchema = Joi.object({
  user_ids: Joi.array().items(Joi.string().uuid()).min(1).required(),
  amount: Joi.number().positive().required(),
  due_date: Joi.date().iso().required(),
  package_id: Joi.string().uuid().optional(),
});

// ── Payment Schema ──
const initiatePaymentSchema = Joi.object({
  package_id: Joi.string().uuid().required(),
  payment_method: Joi.string().valid('jazzcash', 'easypaisa', 'bank').required(),
  phone: Joi.string().pattern(/^\+92\d{10}$/).required(),
});

// ── Validation Middleware ──
const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.details.map(d => ({
          field: d.path[0],
          message: d.message.replace(/"/g, ''),
        })),
      });
    }
    req.body = value; // Use sanitized values
    next();
  };
};

module.exports = {
  registerSchema,
  loginSchema,
  complaintSchema,
  packageSchema,
  billGenerateSchema,
  initiatePaymentSchema,
  validate,
};
