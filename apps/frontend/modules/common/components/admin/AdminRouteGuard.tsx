"use client";

import { useAuth } from '@/modules/auth/hooks/useAuth';
import { hasRouteAccess } from '@/lib/utils/admin-navigation';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { AlertTriangle, Shield } from 'lucide-react';

interface AdminRouteGuardProps {
  children: React.ReactNode;
}

export const AdminRouteGuard = ({ children }: AdminRouteGuardProps) => {
  const { user, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Don't check access while loading
    if (isLoading) return;

    // If no user, redirect to sign-in
    if (!user) {
      router.push('/sign-in');
      return;
    }

    // Check if user is authorized for admin access at all
    const isAdminUser = ['owner', 'sales_rep', 'supplier'].includes(user.roleName);
    
    if (!isAdminUser) {
      // Customer or other roles should be redirected to main site
      router.push('/');
      return;
    }

    // For admin users, check if they have access to the specific current route
    const hasAccess = hasRouteAccess(pathname, user.roleName);
    
    if (!hasAccess && pathname !== '/admin') {
      // If they can't access this specific route but are an admin user,
      // redirect to the main admin dashboard
      router.push('/admin');
      return;
    }
  }, [user, isLoading, pathname, router]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">Verifying access...</span>
        </div>
      </div>
    );
  }

  // Show access denied if no user
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-8 bg-red-50 border border-red-200 rounded-lg max-w-md">
          <AlertTriangle className="mx-auto mb-4 text-red-500" size={48} />
          <h2 className="text-xl font-semibold text-red-900 mb-2">Authentication Required</h2>
          <p className="text-red-700 mb-4">
            Please sign in to access the admin panel.
          </p>
          <button 
            onClick={() => router.push('/sign-in')}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Go to Sign In
          </button>
        </div>
      </div>
    );
  }

  // Check route access for rendering
  const isAdminUser = ['owner', 'sales_rep', 'supplier'].includes(user.roleName);
  const hasAccess = hasRouteAccess(pathname, user.roleName);
  
  // Only show access denied if user is not an admin user at all
  // For admin users, individual route access is handled by redirects in useEffect
  if (!isAdminUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-8 bg-red-50 border border-red-200 rounded-lg max-w-md">
          <Shield className="mx-auto mb-4 text-red-500" size={48} />
          <h2 className="text-xl font-semibold text-red-900 mb-2">Access Denied</h2>
          <p className="text-red-800 mb-4">
            Your role ({user.roleName}) doesn't have admin access.
          </p>
          <button 
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};