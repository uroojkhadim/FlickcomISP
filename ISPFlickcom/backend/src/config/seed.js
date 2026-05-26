require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function seedDatabase() {
  console.log('🌱 Starting database seeding...');

  try {
    // 1. Seed Admin User
    const adminPassword = await bcrypt.hash('Admin@123!', 10);
    const { data: admin, error: adminErr } = await supabase
      .from('users')
      .upsert({
        user_id: 'ADMIN001',
        name: 'Super Admin',
        email: 'admin@sourceplain.com',
        phone: '+923000000000',
        password_hash: adminPassword,
        role: 'superadmin',
        status: 'active',
      }, { onConflict: 'email' })
      .select().single();

    if (adminErr) throw adminErr;
    console.log('✅ Admin user confirmed.');

    // 2. Seed Packages
    const packages = [
      {
        name: 'Basic',
        description: 'Perfect for light browsing and social media.',
        mb_limit: 50 * 1024, // 50GB in MB
        validity_days: 30,
        price_pkr: 1500,
        display_order: 1,
      },
      {
        name: 'Standard',
        description: 'Great for streaming and work from home.',
        mb_limit: 100 * 1024, // 100GB in MB
        validity_days: 30,
        price_pkr: 2500,
        display_order: 2,
      },
      {
        name: 'Pro',
        description: 'Unlimited high-speed internet for heavy users.',
        mb_limit: 200 * 1024, // 200GB in MB
        validity_days: 30,
        price_pkr: 4000,
        display_order: 3,
      }
    ];

    for (const pkg of packages) {
      const { data: existingPkg } = await supabase
        .from('packages')
        .select('id')
        .eq('name', pkg.name)
        .maybeSingle();
      
      if (!existingPkg) {
        const { error: pkgErr } = await supabase
          .from('packages')
          .insert(pkg);
        if (pkgErr) throw pkgErr;
      }
    }
    console.log('✅ Packages seeded.');

    // 3. Seed a dummy Customer User
    const custPassword = await bcrypt.hash('User@123!', 10);
    const { data: customer, error: custErr } = await supabase
      .from('users')
      .upsert({
        user_id: 'CUST00001',
        name: 'John Doe',
        cnic: '12345-1234567-1',
        address: '123 Main St, Lahore',
        email: 'john@example.com',
        phone: '+923001234567',
        password_hash: custPassword,
        role: 'customer',
        status: 'active',
      }, { onConflict: 'email' })
      .select().single();

    if (custErr) throw custErr;
    console.log('✅ Dummy customer seeded.');

    // Get the Basic package for the dummy user
    const { data: basicPkg } = await supabase.from('packages').select('id').eq('name', 'Basic').single();

    if (basicPkg && customer) {
      // 4. Seed Dummy Bill
      await supabase.from('bills').insert({
        user_id: customer.id,
        package_id: basicPkg.id,
        bill_number: 'INV-DEMO-001',
        amount_pkr: 1500,
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Due in 7 days
        status: 'unpaid',
      });
      console.log('✅ Dummy bill seeded.');
    }

    console.log('🎉 Seeding completed successfully!');
  } catch (err) {
    console.error('❌ Seeding failed:', err);
  }
}

// Run if called directly
if (require.main === module) {
  seedDatabase();
}
