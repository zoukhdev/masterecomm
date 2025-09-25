# 🚀 Supabase Setup Guide

## Step 1: Create Your Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up/Login to your account
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - **Name**: Your project name (e.g., "ecommerce-store")
   - **Database Password**: Choose a strong password
   - **Region**: Choose closest to your users
6. Click "Create new project"

## Step 2: Get Your Project Credentials

1. Go to your project dashboard
2. Click on **Settings** → **API**
3. Copy the following values:

### Project URL
```
https://your-project-id.supabase.co
```

### Anon Key (Public)
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Service Role Key (Secret)
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Step 3: Configure Environment Variables

Create a `.env.local` file in your project root with:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Step 4: Database Setup

1. Go to **SQL Editor** in your Supabase dashboard
2. Run the database schema from `supabase/schema.sql`
3. This will create all necessary tables and RLS policies

## Step 5: Authentication Setup

1. Go to **Authentication** → **Settings**
2. Configure the following:

### Site URL
```
http://localhost:3000
```

### Redirect URLs
```
http://localhost:3000/account
http://localhost:3000/auth/callback
```

### Email Settings
- **Enable email confirmations**: Toggle OFF (for development)
- **Enable email change confirmations**: Toggle OFF (for development)

## Step 6: Test Your Setup

Run the test script to verify everything is working:

```bash
node scripts/test-supabase-connection.js
```

## 🔧 Troubleshooting

### Common Issues:

1. **Invalid URL/Key**: Double-check your credentials
2. **RLS Policy Errors**: Make sure you've run the schema.sql
3. **CORS Issues**: Check your redirect URLs in Supabase settings
4. **Email Issues**: Disable email confirmations for development

### Getting Help:

- Check the [Supabase Documentation](https://supabase.com/docs)
- Join the [Supabase Discord](https://discord.supabase.com)
- Check your project logs in the Supabase dashboard
