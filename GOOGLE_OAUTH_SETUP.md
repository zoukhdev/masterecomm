# Google OAuth Authentication Setup Guide

This guide will walk you through setting up Google OAuth authentication for your e-commerce application using Supabase.

## 🔧 **Step 1: Google Cloud Console Setup**

### 1.1 Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **"Select a project"** → **"New Project"**
3. Enter project name: `Your E-commerce App` (or any name you prefer)
4. Click **"Create"**

### 1.2 Enable Google+ API
1. In the Google Cloud Console, go to **"APIs & Services"** → **"Library"**
2. Search for **"Google+ API"** or **"Google Identity API"**
3. Click on it and press **"Enable"**

### 1.3 Create OAuth 2.0 Credentials
1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"+ Create Credentials"** → **"OAuth 2.0 Client IDs"**
3. If prompted, configure the OAuth consent screen first:
   - **User Type**: External (unless you have a Google Workspace)
   - **App Name**: Your E-commerce App
   - **User Support Email**: Your email
   - **Developer Contact**: Your email
   - Click **"Save and Continue"**
   - **Scopes**: Add `userinfo.email` and `userinfo.profile`
   - **Test Users**: Add your email for testing
   - Click **"Save and Continue"**

### 1.4 Configure OAuth Client
1. **Application Type**: Web application
2. **Name**: E-commerce App OAuth Client
3. **Authorized JavaScript origins**:
   - `http://localhost:3000` (for development)
   - `https://yourdomain.com` (for production)
4. **Authorized redirect URIs**:
   - `https://your-project-ref.supabase.co/auth/v1/callback`
   - Replace `your-project-ref` with your actual Supabase project reference

### 1.5 Get Your Credentials
1. After creating, you'll get:
   - **Client ID**: `your-google-client-id.googleusercontent.com`
   - **Client Secret**: `your-google-client-secret`

## 🔧 **Step 2: Supabase Configuration**

### 2.1 Configure Google Provider in Supabase
1. Go to your [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Go to **"Authentication"** → **"Providers"**
4. Find **"Google"** and click **"Configure"**
5. Enter your credentials:
   - **Client ID**: Your Google Client ID
   - **Client Secret**: Your Google Client Secret
6. Click **"Save"**

### 2.2 Configure Site URL and Redirect URLs
1. In Supabase Dashboard, go to **"Authentication"** → **"Settings"**
2. **Site URL**: `http://localhost:3000` (for development)
3. **Redirect URLs**: Add these URLs:
   - `http://localhost:3000/account`
   - `http://localhost:3000/login`
   - `http://localhost:3000/signup`
   - `https://yourdomain.com/account` (for production)

## 🔧 **Step 3: Environment Variables**

Update your `.env.local` file with the Google OAuth credentials:

```env
# Supabase Configuration (already have these)
NEXT_PUBLIC_SUPABASE_URL="https://your-project-ref.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"

# Google OAuth Configuration (optional - mainly for reference)
GOOGLE_CLIENT_ID="your-google-client-id.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

## 🔧 **Step 4: Test Google Authentication**

### 4.1 Start Your Development Server
```bash
npm run dev
```

### 4.2 Test the Flow
1. Go to `http://localhost:3000/login`
2. Click **"Continue with Google"**
3. You should be redirected to Google's OAuth consent screen
4. After granting permission, you'll be redirected back to your app
5. Check the browser console for authentication logs

### 4.3 Verify User Creation
1. Go to your Supabase Dashboard → **"Authentication"** → **"Users"**
2. You should see the Google-authenticated user
3. Check the **"users"** table in your database for the user profile

## 🔧 **Step 5: Production Setup**

### 5.1 Update Google OAuth Settings
1. In Google Cloud Console, update **Authorized JavaScript origins**:
   - Add your production domain: `https://yourdomain.com`
2. Update **Authorized redirect URIs** if needed

### 5.2 Update Supabase Settings
1. In Supabase Dashboard → **"Authentication"** → **"Settings"**
2. Update **Site URL** to your production domain
3. Add production redirect URLs

### 5.3 Deploy Your Application
```bash
# Example for Vercel
vercel --prod

# Or for other platforms
npm run build
npm start
```

## 🐛 **Troubleshooting**

### Common Issues:

1. **"redirect_uri_mismatch" error**:
   - Ensure the redirect URI in Google Console exactly matches: `https://your-project-ref.supabase.co/auth/v1/callback`

2. **"invalid_client" error**:
   - Check that your Google Client ID and Secret are correctly entered in Supabase

3. **User not created in database**:
   - Check RLS policies on the `users` table
   - Ensure the AuthContext is properly handling user creation

4. **"access_denied" error**:
   - Check OAuth consent screen configuration
   - Ensure test users are added if in testing mode

### Debug Steps:
1. Check browser console for errors
2. Check Supabase logs in the dashboard
3. Verify all URLs match exactly (no trailing slashes)
4. Test with a fresh browser session

## 📝 **Additional Features**

### Custom User Metadata
Google OAuth provides additional user data:
- `avatar_url`: User's profile picture
- `full_name`: User's full name
- `first_name`: User's first name
- `last_name`: User's last name

### Handling User Updates
The AuthContext automatically handles:
- User profile updates
- Session management
- Real-time authentication state changes

## ✅ **Verification Checklist**

- [ ] Google Cloud Project created
- [ ] Google+ API enabled
- [ ] OAuth 2.0 credentials created
- [ ] Redirect URIs configured correctly
- [ ] Supabase Google provider configured
- [ ] Site URL and redirect URLs set in Supabase
- [ ] Test authentication flow works
- [ ] User appears in Supabase Auth
- [ ] User profile created in database
- [ ] Production URLs configured (if deploying)

## 🎉 **Success!**

Once configured, users can:
- Sign up with Google (one-click registration)
- Sign in with Google (seamless authentication)
- Access their profile with Google data
- Enjoy real-time authentication state management

Your e-commerce app now supports both email/password and Google OAuth authentication! 🚀
