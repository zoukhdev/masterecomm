import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from '../../components/ThemeProvider';
import { LanguageProvider } from '../../contexts/LanguageContext';
import AdminSidebar from './components/AdminSidebar';
import AdminHeader from './components/AdminHeader';
import { Toaster } from 'react-hot-toast';
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Admin Dashboard - E-Shop",
  description: "E-Shop Admin Dashboard",
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <LanguageProvider>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex transition-colors duration-200">
              <AdminSidebar />
              <div className="flex-1 flex flex-col lg:ml-0">
                <AdminHeader />
                <main className="flex-1 overflow-auto p-1 sm:p-4 lg:p-6 pt-16 lg:pt-4">
                  <div className="max-w-full overflow-hidden">
                    {children}
                  </div>
                </main>
              </div>
            </div>
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: 'var(--toast-bg)',
                  color: 'var(--toast-color)',
                },
                success: {
                  duration: 2000,
                  iconTheme: {
                    primary: '#10B981',
                    secondary: '#fff',
                  },
                },
                error: {
                  duration: 4000,
                  iconTheme: {
                    primary: '#EF4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
