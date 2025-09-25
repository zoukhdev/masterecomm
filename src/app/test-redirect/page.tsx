'use client';

import { useAuth } from '../../contexts/AuthContext';
import { getLoginUrl } from '../../lib/auth-utils';
import Link from 'next/link';

export default function TestRedirectPage() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            🔄 Redirect Test Page
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            This page tests the &quot;return to previous page&quot; functionality
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          {isAuthenticated ? (
            <div className="text-center">
              <div className="text-green-600 dark:text-green-400 mb-4">
                ✅ You are logged in!
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Welcome back, <strong>{user?.first_name} {user?.last_name}</strong>!
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                You were redirected back to this page after logging in.
              </p>
              <Link
                href="/"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Go to Home
              </Link>
            </div>
          ) : (
            <div className="text-center">
              <div className="text-red-600 dark:text-red-400 mb-4">
                ❌ You are not logged in
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Click the login button below to test the redirect functionality.
                After logging in, you should be redirected back to this page.
              </p>
              <Link
                href={getLoginUrl('/test-redirect')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Login (will return here)
              </Link>
            </div>
          )}
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            This page demonstrates the returnTo functionality. 
            Try logging in from other pages too!
          </p>
          <div className="mt-4 space-x-4">
            <Link href="/" className="text-blue-600 hover:text-blue-500 text-sm">
              Home
            </Link>
            <Link href="/products" className="text-blue-600 hover:text-blue-500 text-sm">
              Products
            </Link>
            <Link href="/cart" className="text-blue-600 hover:text-blue-500 text-sm">
              Cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
