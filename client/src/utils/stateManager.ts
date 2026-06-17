import Cookies from 'js-cookie';
import { logOut } from '@/store/features/auth/authSlide';
import { clearProfile } from '@/store/features/auth/profileSlide';
import { getStore } from '@/store/store';

/* English content normalized from the original source text. */
export async function clearClientState() {
  console.log('English content normalized from the original source text.');
  // English content normalized from the original source text.
  const { store, persistor } = getStore();

  // English content normalized from the original source text.
  store.dispatch(logOut());
  store.dispatch(clearProfile());
  console.log('English content normalized from the original source text.');

  // English content normalized from the original source text.
  try {
    await persistor.purge();
    console.log('English content normalized from the original source text.');
  } catch (error) {
    console.error('English content normalized from the original source text.', error);
  }

  // English content normalized from the original source text.
  const allCookies = Cookies.get();
  for (const cookieName in allCookies) {
    if (cookieName !== 'csrf_token') {
      Cookies.remove(cookieName, { path: '/' });
    }
  }
  console.log('English content normalized from the original source text.');

  // English content normalized from the original source text.
  if (typeof window !== 'undefined') {
    localStorage.clear();
    console.log('English content normalized from the original source text.');
  }

  // English content normalized from the original source text.
  if (typeof window !== 'undefined') {
    sessionStorage.clear();
    console.log('English content normalized from the original source text.');
  }

  console.log('English content normalized from the original source text.');
}