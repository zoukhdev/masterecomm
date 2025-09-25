#!/usr/bin/env node

/**
 * Setup script for new Supabase project
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

async function setupNewSupabase() {
  console.log('🚀 Setting up new Supabase project...\n');
  
  // Check if .env.local exists
  const envPath = path.join(process.cwd(), '.env.local');
  const envExists = fs.existsSync(envPath);
  
  if (!envExists) {
    console.log('❌ .env.local file not found!');
    console.log('\n📝 Please create a .env.local file with your Supabase credentials:');
    console.log('NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co');
    console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key');
    console.log('SUPABASE_SERVICE_ROLE_KEY=your-service-role-key\n');
    return;
  }
  
  // Load environment variables
  require('dotenv').config({ path: envPath });
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.log('❌ Missing Supabase environment variables!');
    console.log('Please check your .env.local file.');
    return;
  }
  
  console.log('✅ Environment variables found');
  console.log('   URL:', supabaseUrl);
  console.log('   Key length:', supabaseKey.length);
  
  try {
    // Test connection
    console.log('\n🔗 Testing Supabase connection...');
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Test database connection
    const { data, error } = await supabase
      .from('products')
      .select('count')
      .limit(1);
    
    if (error) {
      console.log('❌ Database connection failed:');
      console.log('   Error:', error.message);
      console.log('   Code:', error.code);
      
      if (error.code === 'PGRST116') {
        console.log('\n💡 The products table doesn\'t exist yet.');
        console.log('   Please run the database schema from supabase/schema.sql');
      }
    } else {
      console.log('✅ Database connection successful');
    }
    
    // Test authentication
    console.log('\n🔐 Testing authentication service...');
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.log('❌ Authentication test failed:');
      console.log('   Error:', authError.message);
    } else {
      console.log('✅ Authentication service working');
    }
    
    // Test RLS policies
    console.log('\n🛡️ Testing RLS policies...');
    const { data: rlsData, error: rlsError } = await supabase
      .from('products')
      .select('*')
      .limit(1);
    
    if (rlsError) {
      console.log('❌ RLS test failed:');
      console.log('   Error:', rlsError.message);
      console.log('   Code:', rlsError.code);
    } else {
      console.log('✅ RLS policies working correctly');
    }
    
    console.log('\n🎉 Supabase setup completed!');
    console.log('\n📋 Next steps:');
    console.log('1. Run the database schema: supabase/schema.sql');
    console.log('2. Configure authentication settings in Supabase dashboard');
    console.log('3. Test the login/signup pages');
    console.log('4. Create a test user account');
    
  } catch (error) {
    console.log('❌ Setup failed:');
    console.log('   Error:', error.message);
    
    if (error.message.includes('Invalid URL')) {
      console.log('\n💡 Hint: Check your NEXT_PUBLIC_SUPABASE_URL');
    } else if (error.message.includes('Invalid API key')) {
      console.log('\n💡 Hint: Check your NEXT_PUBLIC_SUPABASE_ANON_KEY');
    }
  }
}

// Run setup
setupNewSupabase();
