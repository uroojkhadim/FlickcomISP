require('dotenv').config(); // ✅ FIX: Load .env BEFORE requiring supabase
const supabase = require('./config/supabase');
const bcrypt = require('bcryptjs');

const resetAdmin = async () => {
  // ── Configure the admin account to create/reset ──
  const email = 'admin@sourceplain.com';   // Must match what you type in login
  const newPassword = 'Admin@123!';        // Must be a valid password

  console.log(`\n══════════════════════════════`);
  console.log(`   ADMIN RESET / CREATE TOOL  `);
  console.log(`══════════════════════════════`);
  console.log(`📧 Target Email : ${email}`);
  console.log(`🔑 New Password : ${newPassword}`);
  console.log(`──────────────────────────────`);

  try {
    const password_hash = await bcrypt.hash(newPassword, 12);

    // 1. Check if user already exists
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (!user) {
      // ── CREATE new admin ──
      console.log('ℹ️  Admin not found. Creating a new admin account...');

      const { error: insertError } = await supabase
        .from('users')
        .insert({
          email,
          password_hash,
          role: 'superadmin',
          name: 'Super Admin',
          status: 'active',
          user_id: 'ADMIN001',
          account_locked: false,
          login_attempt_count: 0,
        });

      if (insertError) {
        console.error('❌ Error creating admin:', insertError.message);
        console.error('   Details:', insertError);
      } else {
        console.log('✅ SUCCESS! New Admin account created.');
        console.log(`📧 Email    : ${email}`);
        console.log(`🔑 Password : ${newPassword}`);
      }
    } else {
      // ── UPDATE / UNLOCK existing admin ──
      console.log(`ℹ️  Admin found (DB id: ${user.id}). Resetting credentials & unlocking...`);

      const { error: updateError } = await supabase
        .from('users')
        .update({
          password_hash,
          role: 'superadmin',
          status: 'active',
          account_locked: false,
          locked_until: null,
          login_attempt_count: 0,
        })
        .eq('id', user.id);

      if (updateError) {
        console.error('❌ Error updating admin:', updateError.message);
      } else {
        console.log('✅ SUCCESS! Admin account updated & unlocked.');
        console.log(`📧 Email    : ${email}`);
        console.log(`🔑 Password : ${newPassword}`);
      }
    }
  } catch (err) {
    console.error('❌ Unexpected error:', err.message);
  }

  console.log(`══════════════════════════════\n`);
};

resetAdmin();
