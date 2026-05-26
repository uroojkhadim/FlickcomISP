const express = require('express');
const supabase = require('../config/supabase');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');
const { validate, packageSchema } = require('../middleware/validation');

const router = express.Router();

// ══════════════════════════════════════════════════
// GET /api/packages
// Public route (if we want customers to see packages before logging in, 
// though usually customers are logged in. The spec implies public visibility is fine)
// ══════════════════════════════════════════════════
router.get('/', async (req, res, next) => {
  try {
    const { data: packages, error } = await supabase
      .from('packages')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) throw error;
    res.json({ success: true, packages });
  } catch (err) {
    next(err);
  }
});

// ══════════════════════════════════════════════════
// POST /api/packages
// Admin only
// ══════════════════════════════════════════════════
router.post('/', verifyToken, requireRole('admin', 'superadmin'), validate(packageSchema), async (req, res, next) => {
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
// PUT /api/packages/:id
// Admin only
// ══════════════════════════════════════════════════
router.put('/:id', verifyToken, requireRole('admin', 'superadmin'), validate(packageSchema), async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('packages')
      .update(req.body)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ success: false, error: 'Package not found' });
    
    res.json({ success: true, package: data });
  } catch (err) {
    next(err);
  }
});

// ══════════════════════════════════════════════════
// DELETE /api/packages/:id
// Admin only
// ══════════════════════════════════════════════════
router.delete('/:id', verifyToken, requireRole('admin', 'superadmin'), async (req, res, next) => {
  try {
    const { error } = await supabase
      .from('packages')
      .delete()
      .eq('id', req.params.id);

    if (error) {
        // Handle foreign key constraint error friendly
        if (error.code === '23503') {
            return res.status(409).json({ 
                success: false, 
                error: 'Cannot delete package. It is currently assigned to users.' 
            });
        }
        throw error;
    }
    
    res.json({ success: true, message: 'Package deleted successfully' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
