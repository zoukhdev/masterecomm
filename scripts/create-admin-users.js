#!/usr/bin/env node

/**
 * Script to create admin users in Supabase
 * Run with: node scripts/create-admin-users.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables!');
  console.error('Please check your .env.local file.');
  process.exit(1);
}

// Use service role key for admin operations
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const adminUsers = [
  {
    email: 'admin@example.com',
    password_hash: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // admin123
    first_name: 'Admin',
    last_name: 'User',
    role: 'owner',
    is_active: true
  },
  {
    email: 'manager@example.com',
    password_hash: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // manager123
    first_name: 'Manager',
    last_name: 'User',
    role: 'developer',
    is_active: true
  },
  {
    email: 'admin@eshop.com',
    password_hash: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // admin123
    first_name: 'E-Shop',
    last_name: 'Admin',
    role: 'admin',
    is_active: true
  }
];

async function createAdminUsers() {
  console.log('🔧 Creating admin users...\n');

  try {
    // First, check existing users
    console.log('📋 Checking existing users...');
    const { data: existingUsers, error: fetchError } = await supabase
      .from('users')
      .select('*');

    if (fetchError) {
      console.error('❌ Error fetching existing users:', fetchError);
      return;
    }

    console.log(`✅ Found ${existingUsers.length} existing users:`);
    existingUsers.forEach(user => {
      console.log(`   - ${user.email} (${user.role})`);
    });

    // Create/update admin users
    console.log('\n🔨 Creating/updating admin users...');
    
    for (const user of adminUsers) {
      console.log(`\n👤 Processing: ${user.email}`);
      
      // Check if user already exists
      const existingUser = existingUsers.find(u => u.email === user.email);
      
      if (existingUser) {
        console.log(`   ✅ User already exists, updating...`);
        
        const { data: updatedUser, error: updateError } = await supabase
          .from('users')
          .update({
            password_hash: user.password_hash,
            first_name: user.first_name,
            last_name: user.last_name,
            role: user.role,
            is_active: user.is_active,
            updated_at: new Date().toISOString()
          })
          .eq('email', user.email)
          .select();

        if (updateError) {
          console.error(`   ❌ Error updating user:`, updateError);
        } else {
          console.log(`   ✅ User updated successfully`);
        }
      } else {
        console.log(`   ➕ Creating new user...`);
        
        const { data: newUser, error: createError } = await supabase
          .from('users')
          .insert([user])
          .select();

        if (createError) {
          console.error(`   ❌ Error creating user:`, createError);
        } else {
          console.log(`   ✅ User created successfully`);
        }
      }
    }

    // Final verification
    console.log('\n🔍 Final verification...');
    const { data: finalUsers, error: finalError } = await supabase
      .from('users')
      .select('*')
      .order('created_at');

    if (finalError) {
      console.error('❌ Error fetching final users:', finalError);
    } else {
      console.log(`\n✅ Total users in database: ${finalUsers.length}`);
      console.log('\n📋 All users:');
      finalUsers.forEach(user => {
        console.log(`   - ${user.email} (${user.role}) - Active: ${user.is_active}`);
      });
    }

    console.log('\n🎉 Admin user setup completed!');
    console.log('\n📝 Login credentials:');
    console.log('   Admin: admin@example.com / admin123');
    console.log('   Manager: manager@example.com / manager123');
    console.log('   E-Shop Admin: admin@eshop.com / admin123');

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

createAdminUsers();

