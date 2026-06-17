import { useState, useEffect, useCallback } from 'react';
import Cookies from 'js-cookie';
import {
  ROUTES,
  PROTECTED_ROUTES,
  PUBLIC_ROUTES,
  ADMIN_ONLY_ROUTES,
  SELLER_ALLOWED_ROUTES
} from '@/constants/route';
import { showToast } from '@/components/ui/toastify';
import { useUserData } from './useGetData-UserLogin';

interface UseAuthGuardOptions {
  redirectTo?: string;
  showToastMessage?: boolean;
  silentCheck?: boolean;
}

export const useAuthGuard = (options: UseAuthGuardOptions = {}) => {
  const {
    redirectTo = ROUTES.AUTH.SIGNIN,
    showToastMessage = true,
    silentCheck = false
  } = options;

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // English content normalized from the original source text.
  const userData = useUserData();

  // English content normalized from the original source text.
  const checkAuth = useCallback(() => {
    try {
      const accessToken = Cookies.get('access_token');
      const hasToken = !!accessToken;
      const hasReduxData = !!userData;

      // English content normalized from the original source text.
      const isAuthed = hasToken || hasReduxData;

      setIsAuthenticated(isAuthed);
      setIsLoading(false);
      return isAuthed;
    } catch (error) {
      console.error('Error checking authentication:', error);
      setIsAuthenticated(false);
      setIsLoading(false);
      return false;
    }
  }, [userData]);

  // English content normalized from the original source text.
  const checkRouteAccess = useCallback((pathname: string) => {
    // English content normalized from the original source text.
    const isProtectedRoute = PROTECTED_ROUTES.some(route =>
      pathname === route || pathname.startsWith(route)
    );

    const isPublicRoute = PUBLIC_ROUTES.some(route =>
      pathname === route || pathname.startsWith(route.replace(':slug', '').replace(':id', ''))
    );

    const isAdminRoute = pathname.startsWith('/admin');

    // English content normalized from the original source text.
    const canAccessAdminRoute = (userRole: string) => {
      if (!isAdminRoute) return true; // English content normalized from the original source text.

      // Normalize role name
      const normalizedRole = userRole?.toUpperCase?.() || '';

      console.log(`Checking admin route access: User role "${normalizedRole}", Route: "${pathname}"`);

      // English content normalized from the original source text.
      if (normalizedRole === 'ADMIN') {
        console.log('✅ Admin access granted');
        return true;
      }

      // English content normalized from the original source text.
      if (normalizedRole === 'SELLER') {
        const canAccess = SELLER_ALLOWED_ROUTES.some(route =>
          pathname === route || pathname.startsWith(route)
        );
        console.log(`${canAccess ? '✅' : '❌'} Seller access ${canAccess ? 'granted' : 'denied'}`);
        return canAccess;
      }

      // English content normalized from the original source text.
      console.log(`❌ Access denied for role "${normalizedRole}" to admin routes`);
      return false;
    };

    return {
      isProtectedRoute,
      isPublicRoute,
      isAdminRoute,
      canAccessAdminRoute
    };
  }, []);

  // English content normalized from the original source text.
  const getHomeRedirectByRole = useCallback((userRole: string) => {
    const normalizedRole = userRole?.toUpperCase?.() || '';

    console.log(`Getting home redirect for role: "${normalizedRole}"`);

    switch (normalizedRole) {
      case 'ADMIN':
      case 'SELLER':
        console.log('Redirecting to admin dashboard');
        return '/admin';
      case 'CLIENT':
      case 'CUSTOMER':
      default:
        console.log('Redirecting to home page');
        return '/';
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // English content normalized from the original source text.
  const withAuth = <T extends (...args: any[]) => Promise<any>>(
    fn: T,
    options: { showError?: boolean } = {}
  ): ((...args: Parameters<T>) => Promise<ReturnType<T>>) => {
    return async (...args: Parameters<T>) => {
      // English content normalized from the original source text.
      const isAuthed = checkAuth();

      if (!isAuthed) {
        if (options.showError !== false && showToastMessage) {
          showToast('English content normalized from the original source text.', 'error');
        }
        throw new Error('UNAUTHORIZED');
      }

      try {
        return await fn(...args);
      } catch (error: any) {
        // English content normalized from the original source text.
        if (error?.response?.status === 401) {
          if (options.showError !== false && showToastMessage) {
            showToast('English content normalized from the original source text.', 'error');
          }
          // English content normalized from the original source text.
          throw new Error('SESSION_EXPIRED');
        }
        throw error;
      }
    };
  };

  // English content normalized from the original source text.
  const requireAuth = () => {
    const isAuthed = checkAuth();
    if (!isAuthed && showToastMessage) {
      showToast('English content normalized from the original source text.', 'error');
    }
    return isAuthed;
  };

  return {
    isAuthenticated,
    isLoading,
    userData,
    withAuth,
    requireAuth,
    checkAuth,
    checkRouteAccess,
    getHomeRedirectByRole
  };
};