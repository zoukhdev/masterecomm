'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  session: Session | null;
  loading: boolean;
  login: (user: UserProfile) => void;
  logout: () => void;
  signInWithGoogle: () => Promise<{ data: { provider: string; url: string | null } | null; error: Error | null }>;
  resetPassword: (email: string) => Promise<{ data: object | null; error: Error | unknown | null }>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ data: object | null; error: Error | unknown | null }>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const getSession = useCallback(async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error getting session:', error);
        setLoading(false);
        return;
      }

      if (session?.user) {
        setSession(session);
        await handleSignIn(session.user);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Error getting session:', error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Get initial session
    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔐 Auth state changed:', event, session?.user?.email);
        
        if (event === 'SIGNED_IN' && session?.user) {
          setSession(session);
          await handleSignIn(session.user);
        } else if (event === 'SIGNED_OUT') {
          setSession(null);
          handleSignOut();
        } else if (event === 'TOKEN_REFRESHED' && session?.user) {
          setSession(session);
          await handleSignIn(session.user);
        }
        
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [getSession]);

  const handleSignIn = async (authUser: User) => {
    try {
      console.log('🔐 Handling sign in for user:', authUser.email);
      
      // Create user profile from Supabase auth user
      const userProfile: UserProfile = {
        id: authUser.id,
        email: authUser.email || '',
        first_name: authUser.user_metadata?.first_name || 'User',
        last_name: authUser.user_metadata?.last_name || '',
        role: 'customer',
        is_active: true,
        created_at: authUser.created_at,
        updated_at: new Date().toISOString()
      };

      // Try to get or create user in our users table
      try {
        const { data: existingUser, error: fetchError } = await supabase
          .from('users')
          .select('*')
          .eq('id', authUser.id)
          .single();

        if (fetchError && fetchError.code === 'PGRST116') {
          // User doesn't exist, create one
          console.log('👤 Creating user profile in database...');
          const { error: createError } = await supabase
            .from('users')
            .insert([{
              id: authUser.id,
              email: authUser.email,
              first_name: userProfile.first_name,
              last_name: userProfile.last_name,
              role: 'customer',
              is_active: true,
              password_hash: '', // No password hash needed for Supabase auth users
            }]);

          if (createError) {
            console.error('Error creating user profile:', createError);
          } else {
            console.log('✅ User profile created successfully');
          }
        } else if (existingUser) {
          // Update user profile with latest metadata
          userProfile.first_name = existingUser.first_name || userProfile.first_name;
          userProfile.last_name = existingUser.last_name || userProfile.last_name;
          userProfile.role = existingUser.role || userProfile.role;
          userProfile.is_active = existingUser.is_active;
          userProfile.created_at = existingUser.created_at;
        }
      } catch (dbError) {
        console.error('Database error during user handling:', dbError);
        // Continue with auth user data even if DB operation fails
      }

      setUser(userProfile);
      console.log('✅ User set in context:', userProfile.email);
    } catch (error) {
      console.error('Error handling sign in:', error);
    }
  };

  const handleSignOut = () => {
    console.log('🔐 Handling sign out');
    setUser(null);
  };

  const login = (userData: UserProfile) => {
    console.log('🔐 Manual login called:', userData.email);
    setUser(userData);
  };

  const logout = async () => {
    try {
      console.log('🔐 Logging out user...');
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Error signing out:', error);
      }
      
      setUser(null);
      console.log('✅ User logged out successfully');
    } catch (error) {
      console.error('Error during logout:', error);
      // Still clear user state even if logout fails
      setUser(null);
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/account`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });
      return { data, error };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      // Update Supabase Auth profile
      const { data: authData, error: authError } = await supabase.auth.updateUser({
        data: {
          first_name: updates.first_name,
          last_name: updates.last_name,
        }
      });

      if (authError) {
        console.error('Error updating auth profile:', authError);
        return { data: null, error: authError };
      }

      // Update users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .update({
          first_name: updates.first_name,
          last_name: updates.last_name,
        })
        .eq('id', user?.id)
        .select()
        .single();

      if (userError) {
        console.error('Error updating user profile:', userError);
        return { data: null, error: userError };
      }

      // Update local user state
      if (user) {
        setUser({
          ...user,
          ...updates
        });
      }

      return { data: { authData, userData }, error: null };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { data: null, error };
    }
  };

  const value = {
    user,
    session,
    loading,
    login,
    logout,
    signInWithGoogle,
    resetPassword,
    updateProfile,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}