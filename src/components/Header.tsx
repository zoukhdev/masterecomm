'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { ShoppingCart, User, Search, Heart, Menu, X, LogOut } from 'lucide-react';
import { RootState } from '../lib/store';
import DarkModeToggle from './DarkModeToggle';
import LanguageDropdown from './LanguageDropdown';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { getLoginUrl, getCurrentUrl } from '../lib/auth-utils';
import { usePathname } from 'next/navigation';

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loginUrl, setLoginUrl] = useState('/login');
  const [signupUrl, setSignupUrl] = useState('/signup');
  
  const pathname = usePathname();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Hide header on admin pages
  if (pathname.startsWith('/admin')) {
    return null;
  }

  // Set URLs after hydration to prevent hydration mismatch
  useEffect(() => {
    const currentUrl = getCurrentUrl();
    setLoginUrl(getLoginUrl(currentUrl));
    setSignupUrl(`/signup?returnTo=${encodeURIComponent(currentUrl)}`);
  }, []);
  const { t } = useLanguage();
  const { user, isAuthenticated, logout } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  const handleLogout = () => {
    logout();
    // Redirect to home page after logout
    window.location.href = '/';
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Hidden on mobile, visible on sm+ */}
          <Link href="/" className="hidden sm:block text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            E-Shop
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">
              {t('nav.home')}
            </Link>
            <Link href="/products" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">
              {t('nav.products')}
            </Link>
            <Link href="/categories" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">
              {t('nav.categories')}
            </Link>
            <Link href="/about" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">
              {t('nav.about')}
            </Link>
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pl-10 pr-4 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
              </div>
            </form>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Desktop: Language Dropdown and Dark Mode Toggle */}
            <div className="hidden md:flex items-center space-x-4">
              <LanguageDropdown />
              <DarkModeToggle />
            </div>

            {/* Desktop: User Account - Only show when authenticated */}
            {isAuthenticated && (
              <div className="hidden md:block relative group">
                <button className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center space-x-2">
                  <User size={20} />
                  <span className="text-sm font-medium">
                    {user?.first_name || 'Account'}
                  </span>
                </button>
                {/* Dropdown Menu for authenticated users */}
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="py-2">
                    <div className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100 font-medium border-b border-gray-200 dark:border-gray-600">
                      {user?.first_name} {user?.last_name}
                    </div>
                    <Link
                      href="/account"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      My Account
                    </Link>
                    <Link
                      href="/orders"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      My Orders
                    </Link>
                    <div className="border-t border-gray-200 dark:border-gray-600 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center space-x-2"
                    >
                      <LogOut size={16} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Desktop: Non-authenticated user dropdown */}
            {!isAuthenticated && (
              <div className="hidden md:block relative group">
                <button className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  <User size={20} />
                </button>
                {/* Dropdown Menu for non-authenticated users */}
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="py-2">
                    <Link
                      href={loginUrl}
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link
                      href={signupUrl}
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Create Account
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Mobile: Search, Wishlist, Cart, and Menu Button */}
            <div className="md:hidden flex items-center space-x-3">
              {/* Mobile Search Button */}
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center justify-center w-8 h-8"
              >
                <Search size={20} />
              </button>

              {/* Wishlist */}
              <Link href="/wishlist" className="text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors relative flex items-center justify-center w-8 h-8">
                <Heart size={20} />
              </Link>

              {/* Cart */}
              <Link href="/cart" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors relative flex items-center justify-center w-8 h-8">
                <ShoppingCart size={20} />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center text-[10px] font-medium">
                    {cartItemCount > 99 ? '99+' : cartItemCount}
                  </span>
                )}
              </Link>

              {/* Mobile Menu Button */}
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center justify-center w-8 h-8"
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isSearchOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pl-10 pr-4 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
              </div>
            </form>
          </div>
        )}

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
            <nav className="flex flex-col space-y-4">
              <Link 
                href="/" 
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('nav.home')}
              </Link>
              <Link 
                href="/products" 
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('nav.products')}
              </Link>
              <Link 
                href="/categories" 
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('nav.categories')}
              </Link>
              <Link 
                href="/about" 
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('nav.about')}
              </Link>
              
              {/* Mobile Settings Section */}
              <div className="border-t border-gray-200 dark:border-gray-600 my-4"></div>
              <div className="px-4 py-2">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                  Settings
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Language</span>
                  <LanguageDropdown />
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Dark Mode</span>
                  <DarkModeToggle />
                </div>
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-600 my-4"></div>
              {isAuthenticated ? (
                <>
                  <div className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100 font-medium">
                    {user?.first_name} {user?.last_name}
                  </div>
                  <Link 
                    href="/account" 
                    className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    My Account
                  </Link>
                  <Link 
                    href="/orders" 
                    className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    My Orders
                  </Link>
                  <button 
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium transition-colors flex items-center space-x-2"
                  >
                    <LogOut size={16} />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    href={loginUrl} 
                    className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link 
                    href={signupUrl} 
                    className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Create Account
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
