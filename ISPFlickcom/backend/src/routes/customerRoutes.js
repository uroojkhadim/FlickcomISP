const express = require('express');
const multer = require('multer');
const path = require('path');
const supabase = require('../config/supabase');
const { verifyToken } = require('../middleware/authMiddleware');
const { validate, complaintSchema, initiatePaymentSchema } = require('../middleware/validation');

const router = express.Router();

// Configure multer for avatar uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `avatar-${Date.now()}${ext}`);
  }
});
const upload = multer({ storage: storage, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB limit


// All customer routes require authentication
router.use(verifyToken);

// ══════════════════════════════════════════════════
// GET /api/customer/dashboard
// ══════════════════════════════════════════════════
router.get('/dashboard', async (req, res, next) => {
  try {
    const userId = req.user.sub;

    // Fetch user details
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('user_id, name, email, status, avatar_url')
      .eq('id', userId)
      .single();

    if (userError) throw userError;

    // Fetch active package/subscription
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select(`
        id, start_date, end_date,
        package:package_id (name, mb_limit)
      `)
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();

    // Fetch usage stats (mocked or aggregated from logs)
    // For now, assuming basic structure matching model
    const usage = {
      total_mb: subscription?.package?.mb_limit || 0,
      used_mb: subscription ? Math.floor(Math.random() * subscription.package.mb_limit * 0.8) : 0, // Mocked usage
    };
    usage.remaining_mb = Math.max(0, usage.total_mb - usage.used_mb);

    // Fetch active/unpaid bills
    const { data: active_bills } = await supabase
      .from('bills')
      .select('id, bill_number, amount_pkr, due_date, status')
      .eq('user_id', userId)
      .in('status', ['unpaid', 'partially_paid', 'overdue']);

    const dashboard = {
      user,
      current_package: subscription ? {
        name: subscription.package.name,
        start_date: subscription.start_date,
        expiry_date: subscription.end_date,
      } : null,
      usage,
      active_bills: active_bills || [],
    };

    res.json({ success: true, dashboard });
  } catch (err) {
    next(err);
  }
});

// ══════════════════════════════════════════════════
// GET /api/customer/payments
// ══════════════════════════════════════════════════
router.get('/payments', async (req, res, next) => {
  try {
    const { data: payments, error } = await supabase
      .from('payments')
      .select(`
        id, transaction_id, method, amount_pkr, status, payment_date,
        bill:bill_id (bill_number)
      `)
      .eq('user_id', req.user.sub)
      .order('payment_date', { ascending: false });

    if (error) throw error;
    res.json({ success: true, payments });
  } catch (err) {
    next(err);
  }
});

// ══════════════════════════════════════════════════
// GET /api/customer/bills
// ══════════════════════════════════════════════════
router.get('/bills', async (req, res, next) => {
  try {
    const { data: bills, error } = await supabase
      .from('bills')
      .select('*')
      .eq('user_id', req.user.sub)
      .order('due_date', { ascending: false });

    if (error) throw error;
    res.json({ success: true, bills });
  } catch (err) {
    next(err);
  }
});

// ══════════════════════════════════════════════════
// GET /api/customer/complaints
// ══════════════════════════════════════════════════
router.get('/complaints', async (req, res, next) => {
  try {
    const { data: complaints, error } = await supabase
      .from('complaints')
      .select('*')
      .eq('user_id', req.user.sub)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ success: true, complaints });
  } catch (err) {
    next(err);
  }
});

// ══════════════════════════════════════════════════
// POST /api/customer/complaints
// ══════════════════════════════════════════════════
router.post('/complaints', validate(complaintSchema), async (req, res, next) => {
  try {
    const { title, message, category } = req.body;
    
    // Auto-generate complaint ticket number
    const ticketNo = `TKT-${Date.now()}`;

    const { data: complaint, error } = await supabase
      .from('complaints')
      .insert({
        user_id: req.user.sub,
        ticket_number: ticketNo,
        title,
        message,
        category,
        status: 'open',
        priority: req.body.priority || 'medium',
      })
      .select()
      .single();

    if (error) throw error;

    // Notify Admin
    const { createAdminNotification } = require('../utils/adminNotifier');
    await createAdminNotification(
        'New Support Ticket',
        `${ticketNo}: ${title} (Category: ${category})`,
        'complaint',
        ticketNo // Using human-readable ticket number
    );

    // Create notification for customer
    await supabase.from('notifications').insert({
      user_id: req.user.sub,
      title: 'Complaint Submitted',
      message: `Your complaint (${ticketNo}) has been received and is being reviewed.`,
      type: 'system',
    });

    res.status(201).json({ success: true, complaint });
  } catch (err) {
    next(err);
  }
});

// ══════════════════════════════════════════════════
// GET /api/customer/notifications
// ══════════════════════════════════════════════════
router.get('/notifications', async (req, res, next) => {
  try {
    const { limit = 20, offset = 0, unread_only = false } = req.query;

    let query = supabase
      .from('notifications')
      .select('*')
      .eq('user_id', req.user.sub)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (unread_only === 'true') {
      query = query.eq('is_read', false);
    }

    const { data: notifications, error } = await query;
    if (error) throw error;

    res.json({ success: true, notifications });
  } catch (err) {
    next(err);
  }
});

// ══════════════════════════════════════════════════
// PUT /api/customer/notifications/:id/read
// ══════════════════════════════════════════════════
router.put('/notifications/:id/read', async (req, res, next) => {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', req.params.id)
      .eq('user_id', req.user.sub);

    if (error) throw error;
    res.json({ success: true, message: 'Notification marked as read' });
  } catch (err) {
    next(err);
  }
});

// ══════════════════════════════════════════════════
// POST /api/customer/notifications/read-all
// ══════════════════════════════════════════════════
router.post('/notifications/read-all', async (req, res, next) => {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', req.user.sub)
      .eq('is_read', false);

    if (error) throw error;
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (err) {
    next(err);
  }
});

// ══════════════════════════════════════════════════
// POST /api/customer/payment/initiate
// ══════════════════════════════════════════════════
router.post('/payment/initiate', validate(initiatePaymentSchema), async (req, res, next) => {
  try {
    const { package_id, payment_method, phone } = req.body;

    // Verify package
    const { data: pkg, error: pkgError } = await supabase
      .from('packages')
      .select('*')
      .eq('id', package_id)
      .single();

    if (pkgError || !pkg) return res.status(404).json({ success: false, error: 'Package not found' });

    // In a real app, you would integrate with JazzCash/EasyPaisa APIs here
    // For now, we simulate a pending payment

    const transactionId = `TXN-${Date.now()}`;

    const { data: payment, error: payError } = await supabase
      .from('payments')
      .insert({
        user_id: req.user.sub,
        amount_pkr: pkg.price_pkr,
        method: payment_method,
        status: 'pending',
        transaction_id: transactionId,
      })
      .select()
      .single();

    if (payError) throw payError;

    // Notify Admin of payment
    const { createAdminNotification } = require('../utils/adminNotifier');
    await createAdminNotification(
        'Payment Initiated',
        `A payment of Rs. ${pkg.price_pkr} was initiated via ${payment_method}.`,
        'bill',
        transactionId // Using transaction ID
    );

    res.json({
      success: true,
      message: 'Payment initiated',
      payment,
      payment_url: `https://dummy-gateway.com/pay/${transactionId}`, // Mock URL
    });
  } catch (err) {
    next(err);
  }
});

// ══════════════════════════════════════════════════
// CHAT ROUTES
// ══════════════════════════════════════════════════

// GET /api/customer/chat/messages
router.get('/chat/messages', async (req, res, next) => {
  try {
    const { data: messages, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('user_id', req.user.sub)
      .order('created_at', { ascending: true });

    if (error) throw error;
    res.json({ success: true, messages });
  } catch (err) {
    next(err);
  }
});

// POST /api/customer/chat/send
router.post('/chat/send', async (req, res, next) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ success: false, error: 'Message is required' });

    const { data: chatMessage, error } = await supabase
      .from('chat_messages')
      .insert({
        user_id: req.user.sub,
        sender_id: req.user.sub,
        message,
      })
      .select()
      .single();

    if (error) throw error;

    // Notify Admin of new message
    const { createAdminNotification } = require('../utils/adminNotifier');
    await createAdminNotification(
        'New Chat Message',
        `New message from customer.`,
        'chat',
        req.user.sub
    );

    res.status(201).json({ success: true, message: chatMessage });
  } catch (err) {
    next(err);
  }
});

// ══════════════════════════════════════════════════
// PROFILE ROUTES
// ══════════════════════════════════════════════════

// PUT /api/customer/profile/update
router.put('/profile/update', async (req, res, next) => {
  try {
    const { name, address, phone, avatar_url } = req.body;
    
    const updateData = {};
    if (name) updateData.name = name;
    if (address) updateData.address = address;
    if (phone) updateData.phone = phone;
    if (avatar_url) updateData.avatar_url = avatar_url;

    const { data: user, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', req.user.sub)
      .select('id, name, email, avatar_url, phone, address, user_id')
      .single();

    if (error) throw error;
    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
});

// POST /api/customer/profile/upload-avatar
router.post('/profile/upload-avatar', upload.single('avatar'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }
    
    // Usually the server would return its exact base URL or an abstraction. 
    // We'll use a relative path /uploads or dynamic based on host.
    const host = req.get('host');
    const protocol = req.protocol;
    const avatar_url = `${protocol}://${host}/uploads/${req.file.filename}`;

    // Optionally auto-update user in DB
    const { data: user, error } = await supabase
      .from('users')
      .update({ avatar_url })
      .eq('id', req.user.sub)
      .select('id, name, email, avatar_url, phone, address, user_id')
      .single();

    if (error) throw error;

    res.json({ success: true, avatar_url, user });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
