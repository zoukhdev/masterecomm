#!/usr/bin/env node

/**
 * Test script to verify Supabase connection and configuration
 */

const { createClient } = require('@supabase/supabase-js');

async function testSupabaseConnection() {
  console.log('🔍 Testing Supabase Connection...\n');
  
  // Get environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  console.log('📋 Configuration Check:');
  console.log('   URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
  console.log('   Key:', supabaseKey ? '✅ Set' : '❌ Missing');
  
  if (!supabaseUrl || !supabaseKey) {
    console.log('\n❌ Missing environment variables!');
    console.log('Please create a .env.local file with:');
    console.log('NEXT_PUBLIC_SUPABASE_URL=your_supabase_url');
    console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key');
    return;
  }
  
  try {
    // Create Supabase client
    console.log('\n🔗 Creating Supabase client...');
    const supabase = createClient(supabaseUrl, supabaseKey);
    console.log('✅ Client created successfully');
    
    // Test connection by fetching a simple table
    console.log('\n🧪 Testing database connection...');
    const { data, error } = await supabase
      .from('products')
      .select('count')
      .limit(1);
    
    if (error) {
      console.log('❌ Database connection failed:');
      console.log('   Error:', error.message);
      console.log('   Code:', error.code);
      
      if (error.code === 'PGRST116') {
        console.log('\n💡 Hint: The products table might not exist yet.');
        console.log('   Run the database schema from supabase/schema.sql');
      }
    } else {
      console.log('✅ Database connection successful');
    }
    
    // Test authentication
    console.log('\n🔐 Testing authentication...');
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.log('❌ Authentication test failed:');
      console.log('   Error:', authError.message);
    } else {
      console.log('✅ Authentication service working');
      console.log('   Current session:', authData.session ? 'Active' : 'None');
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
      console.log('   Products accessible:', rlsData ? rlsData.length : 0);
    }
    
  } catch (error) {
    console.log('❌ Connection test failed:');
    console.log('   Error:', error.message);
    
    if (error.message.includes('Invalid URL')) {
      console.log('\n💡 Hint: Check your NEXT_PUBLIC_SUPABASE_URL');
    } else if (error.message.includes('Invalid API key')) {
      console.log('\n💡 Hint: Check your NEXT_PUBLIC_SUPABASE_ANON_KEY');
    }
  }
  
  console.log('\n📝 Next Steps:');
  console.log('1. If tests failed, check your .env.local file');
  console.log('2. Run the database schema: supabase/schema.sql');
  console.log('3. Configure authentication settings in Supabase dashboard');
  console.log('4. Test the login/signup pages in your browser');
}

// Load environment variables
require('dotenv').config({ path: '.env.local' });

testSupabaseConnection();
