const express = require('express');
const supabase = require('../config/supabase');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');
const { validate, packageSchema, billGenerateSchema } = require('../middleware/validation');

const router = express.Router();

// All admin routes require authentication and 'admin' role
router.use(verifyToken, requireRole('admin', 'superadmin'));

// GET /api/admin/profile - queries users table using JWT sub
router.get('/profile', async (req, res, next) => {
  try {
    const { data: admin, error } = await supabase
      .from('users')
      .select('id, name, email, avatar_url, role')
      .eq('id', req.user.sub)
      .single();

    if (error) throw error;
    res.json({ success: true, data: admin });
  } catch (err) {
    next(err);
  }
});

// ══════════════════════════════════════════════════
// GET /api/admin/dashboard
// ══════════════════════════════════════════════════
router.get('/dashboard', async (req, res, next) => {
  try {
    const { count: total_customers } = await supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'customer');
    const { count: active_customers } = await supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'customer').eq('status', 'active');
    const { count: inactive_customers } = await supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'customer').eq('status', 'suspended');
    const { count: new_connections } = await supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'customer').eq('customer_type', 'new');
    const { count: pending_approvals } = await supabase.from('users').select('*', { count: 'exact', head: true }).eq('status', 'pending_approval');
    
    // Complaints & Packages
    const { count: active_complaints } = await supabase.from('complaints').select('*', { count: 'exact', head: true }).neq('status', 'resolved').neq('status', 'closed');
    const { count: active_packages } = await supabase.from('packages').select('*', { count: 'exact', head: true }).eq('is_active', true);
    
    // Bills & Payments
    const { count: pending_payments } = await supabase.from('bills').select('*', { count: 'exact', head: true }).eq('status', 'unpaid');
    const { data: bills } = await supabase.from('bills').select('amount_pkr').eq('status', 'unpaid');
    const total_overdue = bills?.reduce((sum, bill) => sum + Number(bill.amount_pkr), 0) || 0;

    // Revenue Chart Mock Analytics
    const revenue_chart = [
      { name: 'Jan', revenue: 120000 },
      { name: 'Feb', revenue: 145000 },
      { name: 'Mar', revenue: 190000 },
      { name: 'Apr', revenue: 210000 },
      { name: 'May', revenue: 250000 },
      { name: 'Jun', revenue: 280000 },
    ];

    // Connectivity / Complaint Analytics
    const complaint_chart = [
      { day: 'Mon', open: 5, resolved: 3 },
      { day: 'Tue', open: 8, resolved: 7 },
      { day: 'Wed', open: 4, resolved: 8 },
      { day: 'Thu', open: 3, resolved: 5 },
      { day: 'Fri', open: 7, resolved: 6 },
    ];

    res.json({
      success: true,
      stats: {
        total_customers: total_customers || 0,
        active_customers: active_customers || 0,
        inactive_customers: inactive_customers || 0,
        new_connections: new_connections || 0,
        pending_approvals: pending_approvals || 0,
        active_complaints: active_complaints || 0,
        active_packages: active_packages || 0,
        pending_payments: pending_payments || 0,
        total_overdue,
        revenue_chart,
        complaint_chart
      }
    });
  } catch (err) {
    next(err);
  }
});

// ══════════════════════════════════════════════════
// GET /api/admin/customers
// ══════════════════════════════════════════════════
router.get('/customers', async (req, res, next) => {
  try {
    const { status, limit = 50, offset = 0, search } = req.query;

    let query = supabase
      .from('users')
      .select(`
        id, user_id, name, email, phone, cnic, address, 
        status, customer_type, created_at, role
      `)
      .in('role', ['customer', 'reseller'])
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) {
      query = query.eq('status', status);
    }
    if (search) {
      query = query.or(`name.ilike.%${search}%,user_id.ilike.%${search}%,phone.ilike.%${search}%`);
    }

    const { data: customers, error, count } = await query;
    if (error) throw error;

    res.json({ success: true, data: customers, count });
  } catch (err) {
    next(err);
  }
});

// ══════════════════════════════════════════════════
// POST /api/admin/customers
// ══════════════════════════════════════════════════
router.post('/customers', async (req, res, next) => {
  try {
    const { name, cnic, address, email, phone, password, package_id } = req.body;
    const normalizedEmail = email.toLowerCase().trim();
    
    // Check if exists
    const { data: existing } = await supabase.from('users').select('id').or(`email.eq.${normalizedEmail},cnic.eq.${cnic},phone.eq.${phone}`).limit(1);
    if (existing && existing.length > 0) return res.status(409).json({ success: false, error: 'Email, CNIC, or phone already exists' });

    const bcrypt = require('bcryptjs');
    const password_hash = await bcrypt.hash(password, 10);
    
    // Generate next sequential ID safely ignoring gaps
    const { data: lastUser } = await supabase.from('users').select('user_id').not('user_id', 'is', null).order('created_at', { ascending: false }).limit(1);
    let nextNum = 1;
    if (lastUser && lastUser.length > 0 && lastUser[0].user_id.startsWith('CUST')) {
        nextNum = parseInt(lastUser[0].user_id.replace('CUST', ''), 10) + 1;
    }
    const user_id = `CUST${String(nextNum).padStart(5, '0')}`;

    const { data: user, error } = await supabase.from('users').insert({
        user_id, name, cnic, address, email: normalizedEmail, phone, password_hash,
        role: 'customer', status: 'active', customer_type: 'new',
    }).select().single();

    if (error) throw error;
    res.status(201).json({ success: true, user });
  } catch (err) {
    next(err);
  }
});

// ══════════════════════════════════════════════════
// PUT /api/admin/customers/:id/status
// ══════════════════════════════════════════════════
router.put('/customers/:id/status', async (req, res, next) => {
  try {
    const { status } = req.body; // active, suspended, pending_approval
    const { id } = req.params;

    if (!['active', 'suspended', 'pending_approval'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status' });
    }

    const { data, error } = await supabase
      .from('users')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    
    // Notify user if activated
    if (status === 'active') {
        await supabase.from('notifications').insert({
            user_id: id,
            title: 'Account Activated',
            message: 'Your account has been approved and activated.',
            type: 'system'
        });
    }

    res.json({ success: true, message: `Customer status updated to ${status}`, customer: data });
  } catch (err) {
    next(err);
  }
});

// ══════════════════════════════════════════════════
// PUT /api/admin/customers/:id
// ══════════════════════════════════════════════════
router.put('/customers/:id', async (req, res, next) => {
  try {
    const { name, phone, address, email, cnic, password } = req.body;
    const { id } = req.params;

    const updates = { name, phone, address, cnic };
    if (email) updates.email = email.toLowerCase().trim();
    
    if (password && password.trim().length > 0) {
        const bcrypt = require('bcryptjs');
        updates.password_hash = await bcrypt.hash(password, 10);
    }

    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, message: 'Customer updated full details', customer: data });
  } catch (err) {
    next(err);
  }
});

// ══════════════════════════════════════════════════
// DELETE /api/admin/customers/:id
// ══════════════════════════════════════════════════
router.delete('/customers/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    // Foreign keys will CASCADE by default based on schema
    const { data, error } = await supabase
      .from('users')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, message: 'Customer deleted successfully' });
  } catch (err) {
    next(err);
  }
});

// ══════════════════════════════════════════════════
// GET /api/admin/complaints
// ══════════════════════════════════════════════════
router.get('/complaints', async (req, res, next) => {
  try {
    const { status, priority, search } = req.query;
    
    let query = supabase
        .from('complaints')
        .select(`
            *,
            user:user_id (name, user_id, phone),
            assigned:assigned_to (name)
        `)
        .order('created_at', { ascending: false });
        
    if (status) query = query.eq('status', status);
    if (priority) query = query.eq('priority', priority);

    if (search) {
       query = query.or(`ticket_number.ilike.%${search}%,title.ilike.%${search}%,message.ilike.%${search}%`);
    }

    const { data, error } = await query;
    if (error) throw error;

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

// ══════════════════════════════════════════════════
// PUT /api/admin/complaints/:id
// ══════════════════════════════════════════════════
router.put('/complaints/:id', async (req, res, next) => {
  try {
    const { status, priority, resolution_notes, assigned_to } = req.body;
    const { id } = req.params;

    const updates = {};
    if (status) updates.status = status;
    if (priority) updates.priority = priority;
    if (resolution_notes) updates.resolution_notes = resolution_notes;
    if (assigned_to !== undefined) updates.assigned_to = assigned_to; // can be null
    
    if (status === 'resolved' || status === 'closed') {
        updates.resolved_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('complaints')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    
    // Notify user
    if (status) {
        await supabase.from('notifications').insert({
            user_id: data.user_id,
            title: 'Complaint Update',
            message: `Your complaint (${data.ticket_number}) status is now: ${status}.`,
            type: 'system'
        });
    }

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});


// ══════════════════════════════════════════════════
// POST /api/admin/bills/generate
// ══════════════════════════════════════════════════
// Generates bills for specified users
router.post('/bills/generate', validate(billGenerateSchema), async (req, res, next) => {
    try {
        const { user_ids, amount, due_date, package_id } = req.body;
        
        const billsToInsert = user_ids.map(userId => ({
            user_id: userId,
            bill_number: `INV-${Date.now().toString().substring(5)}-${Math.floor(Math.random()*1000)}`,
            amount_pkr: amount,
            due_date: due_date,
            status: 'unpaid',
            package_id: package_id || null
        }));

        const { data, error } = await supabase
            .from('bills')
            .insert(billsToInsert)
            .select();

        if (error) throw error;
        
        // Generate notifications
        const notificationsToInsert = user_ids.map(userId => ({
            user_id: userId,
            title: 'New Bill Generated',
            message: `A new bill of Rs. ${amount} has been generated. Due date: ${new Date(due_date).toLocaleDateString()}`,
            type: 'billing'
        }));
        
        await supabase.from('notifications').insert(notificationsToInsert);

        res.status(201).json({ 
            success: true, 
            message: `Generated ${data.length} bills successfully`,
        });

    } catch (err) {
        next(err);
    }
});


// ══════════════════════════════════════════════════
// GET /api/admin/packages
// ══════════════════════════════════════════════════
router.get('/packages', async (req, res, next) => {
  try {
    const { status, search } = req.query;
    let query = supabase.from('packages').select('*').order('created_at', { ascending: false });

    if (status === 'active') query = query.eq('is_active', true);
    if (status === 'inactive') query = query.eq('is_active', false);
    
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

// ══════════════════════════════════════════════════
// POST /api/admin/packages
// ══════════════════════════════════════════════════
router.post('/packages', validate(packageSchema), async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('packages')
      .insert(req.body)
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ success: true, package: data });
  } catch (err) {
    next(err);
  }
});

// ══════════════════════════════════════════════════
// DELETE /api/admin/packages/:id
// ══════════════════════════════════════════════════
router.delete('/packages/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('packages').delete().eq('id', id);

    if (error) {
        if (error.code === '23503') return res.status(409).json({ success: false, error: 'Package linked to users' });
        throw error;
    }
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

// ══════════════════════════════════════════════════
// PUT /api/admin/packages/:id
// ══════════════════════════════════════════════════
router.put('/packages/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    // Allow updating standard fields or active status
    const updates = { ...req.body, updated_at: new Date().toISOString() };
    
    const { data, error } = await supabase
      .from('packages')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, package: data });
  } catch (err) {
    next(err);
  }
});

// ══════════════════════════════════════════════════
// GET /api/admin/reports
// ══════════════════════════════════════════════════
router.get('/reports', async (req, res, next) => {
  try {
    const { days = '30' } = req.query;
    const dateLimit = new Date();
    dateLimit.setDate(dateLimit.getDate() - parseInt(days));
    const dateStr = dateLimit.toISOString();

    // 1. Revenue report 
    const { data: bills, error: billError } = await supabase
      .from('bills')
      .select('amount_pkr, created_at, status')
      .gte('created_at', dateStr);
    
    if (billError) throw billError;

    const monthlyRevenue = {};
    bills.forEach(b => {
       const dateKey = new Date(b.created_at).toLocaleDateString('default', { month: 'short', day: 'numeric' });
       monthlyRevenue[dateKey] = (monthlyRevenue[dateKey] || 0) + Number(b.amount_pkr);
    });

    // 2. Customer growth (new users in this period)
    const { data: newUsers, error: userError } = await supabase
      .from('users')
      .select('status, created_at')
      .gte('created_at', dateStr);
      
    if (userError) throw userError;

    // Also get total counts for the cards
    const { count: totalActive } = await supabase.from('users').select('*', { count: 'exact', head: true }).eq('status', 'active');
    const { count: totalSuspended } = await supabase.from('users').select('*', { count: 'exact', head: true }).eq('status', 'suspended');

    // 3. Complaint report in this period
    const { data: complaints, error: compError } = await supabase
       .from('complaints')
       .select('category, status')
       .gte('created_at', dateStr);
    
    if (compError) throw compError;
    const complaintCategories = {};
    complaints.forEach(c => {
       complaintCategories[c.category] = (complaintCategories[c.category] || 0) + 1;
    });

    res.json({
       success: true,
       data: {
          revenue: monthlyRevenue,
          customers: {
              active: totalActive || 0,
              suspended: totalSuspended || 0,
              new_this_period: newUsers.length
          },
          complaints: complaintCategories
       }
    });
  } catch (err) {
    next(err);
  }
});

// ══════════════════════════════════════════════════
// ADMIN NOTIFICATIONS
// ══════════════════════════════════════════════════
const { createAdminNotification } = require('../utils/adminNotifier');

router.get('/notifications', async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .is('user_id', null) // Admin notifications don't have user_id
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

router.put('/notifications/:id/read', async (req, res, next) => {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', req.params.id);
    
    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

// ══════════════════════════════════════════════════
// ADMIN PROFILE UPDATE
// ══════════════════════════════════════════════════
router.put('/profile', async (req, res, next) => {
  try {
    const { name, phone, avatar_url } = req.body;
    const { data, error } = await supabase
      .from('users')
      .update({ name, phone, avatar_url })
      .eq('id', req.user.sub)
      .select('id, name, email, avatar_url, role')
      .single();
      
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

// ══════════════════════════════════════════════════
// ADMIN SECURITY / SETTINGS
// ══════════════════════════════════════════════════
router.put('/settings/password', async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const bcrypt = require('bcryptjs');

    // In a real app, you'd get the admin user by session ID. 
    // For this single-admin demo, we check the 'admin@ispflick.com' user in public.users (if it exists) 
    // or just assume the admin is a special entry.
    // Let's assume we store admin creds in the 'users' table with role 'admin'
    const { data: admin, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'admin')
        .single();
    
    if (fetchError || !admin) return res.status(404).json({ success: false, error: 'Admin account not linked in users table' });

    const isValid = await bcrypt.compare(currentPassword, admin.password_hash);
    if (!isValid) return res.status(401).json({ success: false, error: 'Current password incorrect' });

    const newHash = await bcrypt.hash(newPassword, 10);
    const { error: updateError } = await supabase
        .from('users')
        .update({ password_hash: newHash })
        .eq('id', admin.id);

    if (updateError) throw updateError;
    res.json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    next(err);
  }
});

// ══════════════════════════════════════════════════
// ADMIN CHAT ROUTES
// ══════════════════════════════════════════════════

// GET /api/admin/chat/users
// Get list of users who have chat history
router.get('/chat/users', async (req, res, next) => {
  try {
    // Get unique user_ids from chat_messages
    const { data: usersWithMessages, error: chatError } = await supabase
      .from('chat_messages')
      .select('user_id')
      .order('created_at', { ascending: false });

    if (chatError) throw chatError;

    // Get unique user IDs
    const uniqueUserIds = [...new Set(usersWithMessages.map(m => m.user_id))];

    if (uniqueUserIds.length === 0) {
      return res.json({ success: true, data: [] });
    }

    // Fetch user details for these IDs
    const { data: users, error: userError } = await supabase
      .from('users')
      .select('id, name, email, avatar_url, user_id')
      .in('id', uniqueUserIds);

    if (userError) throw userError;

    // Add last message preview for each user
    const usersWithPreview = await Promise.all(users.map(async (user) => {
      const { data: lastMsg } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      return { ...user, lastMessage: lastMsg };
    }));

    res.json({ success: true, data: usersWithPreview });
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/chat/messages/:userId
router.get('/chat/messages/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { data: messages, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    res.json({ success: true, messages });
  } catch (err) {
    next(err);
  }
});

// POST /api/admin/chat/send
router.post('/chat/send', async (req, res, next) => {
  try {
    const { userId, message } = req.body;
    if (!message || !userId) return res.status(400).json({ success: false, error: 'User ID and message are required' });

    const { data: chatMessage, error } = await supabase
      .from('chat_messages')
      .insert({
        user_id: userId,
        sender_id: req.user.sub, // Admin's ID from token
        message,
      })
      .select()
      .single();

    if (error) throw error;

    // Notify user of reply
    await supabase.from('notifications').insert({
      user_id: userId,
      title: 'New Message from Support',
      message: 'Support team has replied to your chat.',
      type: 'system',
    });

    res.status(201).json({ success: true, message: chatMessage });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
