import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { showToast } from '@/components/ui/toastify';
import { ROUTES } from '@/constants/route';
import { authService } from '@/services/auth/authService';
import { clearClientState } from '@/utils/stateManager';

export function useLogout() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setLoading(true);
    try {
      // English content normalized from the original source text.
      await authService.logout({});
    } catch (error) {
      // English content normalized from the original source text.
      console.error('API logout failed, proceeding with client-side cleanup:', error);
    } finally {
      // English content normalized from the original source text.
      await clearClientState();

      // English content normalized from the original source text.
      try {
        await authService.getCsrfToken();
      } catch (error) {
        console.error('Failed to fetch new CSRF token after logout:', error);
      }

      // English content normalized from the original source text.
      showToast('English content normalized from the original source text.', 'success');

      // English content normalized from the original source text.
      // English content normalized from the original source text.
      window.location.href = ROUTES.AUTH.SIGNIN;
    }
  };

  return { handleLogout, loading };
}
