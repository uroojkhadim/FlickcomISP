const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const supabase = require('../config/supabase');
const { validate, registerSchema, loginSchema } = require('../middleware/validation');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

// ══════════════════════════════════════════════════════════
// Helper: Generate JWT Access + Refresh tokens
// ══════════════════════════════════════════════════════════
const generateTokens = (user) => {
  const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
  const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

  if (!JWT_ACCESS_SECRET || !JWT_REFRESH_SECRET) {
    throw new Error('JWT secrets are not configured in .env file');
  }

  const payload = {
    sub: user.id,
    user_id: user.user_id,
    email: user.email,
    role: user.role,
    iss: process.env.JWT_ISSUER || 'isp-service-platform',
  };

  const accessToken = jwt.sign(payload, JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRY || '24h',
  });

  const refreshToken = jwt.sign(
    { sub: user.id, type: 'refresh' },
    JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRY || '7d' }
  );

  return { accessToken, refreshToken, expiresIn: 86400 };
};

// ══════════════════════════════════════════════════════════
// Helper: Safe user object (no password_hash)
// ══════════════════════════════════════════════════════════
const safeUser = (user) => {
  const { password_hash, ...rest } = user;
  return rest;
};

// ══════════════════════════════════════════════════════════
// Helper: Generate sequential user_id
// ══════════════════════════════════════════════════════════
const generateUserId = async () => {
  const { count } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true });
  const nextNum = String((count || 0) + 1).padStart(5, '0');
  return `CUST${nextNum}`;
};

// ──────────────────────────────────────────────────────────
// POST /api/auth/register
// ──────────────────────────────────────────────────────────
router.post('/register', validate(registerSchema), async (req, res, next) => {
  try {
    const { name, cnic, address, email, phone, password } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    // Check if email already exists
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('email', normalizedEmail)
      .maybeSingle();

    if (existing) {
      return res.status(409).json({ success: false, error: 'Email already registered' });
    }

    const password_hash = await bcrypt.hash(password, 12);
    const user_id = await generateUserId();

    const { data: newUser, error } = await supabase
      .from('users')
      .insert({
        user_id,
        name,
        cnic,
        address,
        email: normalizedEmail,
        phone,
        password_hash,
        role: 'customer',
        status: 'pending_approval',
      })
      .select()
      .single();

    if (error) throw error;

    const tokens = generateTokens(newUser);
    return res.status(201).json({
      success: true,
      message: 'Registration successful. Await admin approval.',
      tokens,
      user: safeUser(newUser),
    });
  } catch (err) {
    next(err);
  }
});

// ──────────────────────────────────────────────────────────
// POST /api/auth/login
// ──────────────────────────────────────────────────────────
router.post('/login', validate(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    // 1. Fetch user from DB
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', normalizedEmail)
      .single();

    if (error || !user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    // 2. Check if account is locked
    if (user.account_locked && user.locked_until && new Date(user.locked_until) > new Date()) {
      const minutesLeft = Math.ceil((new Date(user.locked_until) - new Date()) / 60000);
      return res.status(403).json({
        success: false,
        error: `Account temporarily locked. Try again in ${minutesLeft} minute(s).`,
      });
    }

    // 3. Verify password with bcrypt
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      const attempts = (user.login_attempt_count || 0) + 1;
      const updateData = { login_attempt_count: attempts };

      if (attempts >= 5) {
        updateData.account_locked = true;
        updateData.locked_until = new Date(Date.now() + 30 * 60 * 1000).toISOString(); // 30 min
      }

      await supabase.from('users').update(updateData).eq('id', user.id);
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    // 4. Check account status
    if (user.status === 'suspended') {
      return res.status(403).json({ success: false, error: 'Account suspended. Contact support.' });
    }

    // 5. Reset login attempts on success
    await supabase.from('users').update({
      login_attempt_count: 0,
      account_locked: false,
      locked_until: null,
      last_login: new Date().toISOString(),
    }).eq('id', user.id);

    // 6. Generate tokens
    const tokens = generateTokens(user);

    // 7. Return safe response (NO password_hash)
    return res.status(200).json({
      success: true,
      tokens,
      user: safeUser(user),
    });
  } catch (err) {
    next(err);
  }
});

// ──────────────────────────────────────────────────────────
// POST /api/auth/refresh
// ──────────────────────────────────────────────────────────
router.post('/refresh', async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ success: false, error: 'Refresh token required' });
    }

    const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    } catch (err) {
      return res.status(401).json({ success: false, error: 'Invalid or expired refresh token' });
    }

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', decoded.sub)
      .single();

    if (error || !user) {
      return res.status(401).json({ success: false, error: 'User not found' });
    }

    const tokens = generateTokens(user);
    return res.status(200).json({ success: true, tokens });
  } catch (err) {
    next(err);
  }
});

// ──────────────────────────────────────────────────────────
// POST /api/auth/logout
// ──────────────────────────────────────────────────────────
router.post('/logout', verifyToken, async (req, res) => {
  // With JWT, logout is handled client-side (delete token from storage).
  // If you want server-side blacklisting, add a token_blacklist table.
  return res.status(200).json({ success: true, message: 'Logged out successfully' });
});

// ──────────────────────────────────────────────────────────
// POST /api/auth/forgot-password
// ──────────────────────────────────────────────────────────
router.post('/forgot-password', async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, error: 'Email is required' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const { data: user } = await supabase
      .from('users')
      .select('id, email')
      .eq('email', normalizedEmail)
      .maybeSingle();

    // Always return success to prevent email enumeration
    if (!user) {
      return res.status(200).json({
        success: true,
        message: 'If this email exists, a reset link has been sent.',
      });
    }

    // Generate a short-lived reset token
    const resetToken = jwt.sign(
      { sub: user.id, type: 'password_reset' },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: '1h' }
    );

    // TODO: Send reset email with resetToken via your email provider
    console.log(`🔑 Password reset token for ${user.email}: ${resetToken}`);

    return res.status(200).json({
      success: true,
      message: 'If this email exists, a reset link has been sent.',
    });
  } catch (err) {
    next(err);
  }
});

// ──────────────────────────────────────────────────────────
// POST /api/auth/reset-password
// ──────────────────────────────────────────────────────────
router.post('/reset-password', async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ success: false, error: 'Token and new password are required' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    } catch (err) {
      return res.status(401).json({ success: false, error: 'Invalid or expired reset token' });
    }

    if (decoded.type !== 'password_reset') {
      return res.status(401).json({ success: false, error: 'Invalid token type' });
    }

    const password_hash = await bcrypt.hash(newPassword, 12);
    const { error } = await supabase
      .from('users')
      .update({ password_hash, account_locked: false, login_attempt_count: 0 })
      .eq('id', decoded.sub);

    if (error) throw error;

    return res.status(200).json({ success: true, message: 'Password reset successfully' });
  } catch (err) {
    next(err);
  }
});

// ──────────────────────────────────────────────────────────
// GET /api/auth/me  (verify token & return user info)
// ──────────────────────────────────────────────────────────
router.get('/me', verifyToken, async (req, res, next) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', req.user.sub)
      .single();

    if (error || !user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    return res.status(200).json({ success: true, user: safeUser(user) });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
