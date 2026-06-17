import { showToast } from '@/components/ui/toastify';
import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';// English content normalized from the original source text.
import Cookies from 'js-cookie'
import jwt from 'jsonwebtoken';
import { addHours, differenceInMinutes } from 'date-fns';
import { API_ENDPOINTS } from '@/constants/api';
import { useLogout } from '@/hooks/useLogout';
import { ROUTES } from '@/constants/route';
import { getStore } from '@/store/store';
import { clearProfile } from '@/store/features/auth/profileSlide';
// import { useClearGlobalState } from '@/hooks/useClearGlobalState';
import { clearClientState } from '@/utils/stateManager';



// const { clearState } = useClearGlobalState();
// Constants
const TOKEN_CHECK_INTERVAL = 300000; // 5 minutes
const TOKEN_REFRESH_THRESHOLD = 10; // minutes
const MAX_REFRESH_RETRIES = 3;

// Types
interface DecodedToken {
  exp?: number;
  iat?: number;
  sub?: string;
}

// English content normalized from the original source text.

export const publicAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true, // English content normalized from the original source text.
})

// English content normalized from the original source text.
publicAxios.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const csrfToken = Cookies.get('csrf-token');
      if (csrfToken && config.headers) {
        config.headers['x-csrf-token'] = csrfToken;
      }
      // Inject Accept-Language from Redux
      const store = getStore();
      const lang = store.store.getState().langECSite?.language || 'vi';
      if (config.headers) {
        config.headers['Accept-Language'] = lang;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
)

// Response Interceptor (optional)
publicAxios.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  (error) => {
    console.error('❌ publicAxios error:', error)
    return Promise.reject(error)
  }
)
// English content normalized from the original source text.
export const refreshAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
   },
});

refreshAxios.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const csrfToken = Cookies.get('csrf-token');
      if (csrfToken && config.headers) {
        config.headers['x-csrf-token'] = csrfToken;
      }
      // Inject Accept-Language from Redux
      const store = getStore();
      const lang = store.store.getState().langECSite?.language || 'vi';
      if (config.headers) {
        config.headers['Accept-Language'] = lang;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
)
// English content normalized from the original source text.


// English content normalized from the original source text.
const getTokenTimeLeft = (expTimestamp: number): number => {
  try {
    // English content normalized from the original source text.
    const expirationDate = new Date(expTimestamp * 1000);
    const utcPlus7 = addHours(expirationDate, 7); // English content normalized from the original source text.

    // English content normalized from the original source text.
    const now = new Date();
    const nowUtcPlus7 = addHours(now, 7);

    // English content normalized from the original source text.
    const timeDiffInMinutes = differenceInMinutes(utcPlus7, nowUtcPlus7);

    console.log(`English content normalized from the original source text.${utcPlus7.toISOString()}`);
    console.log(`English content normalized from the original source text.${nowUtcPlus7.toISOString()}`);
    console.log(`English content normalized from the original source text.${timeDiffInMinutes}English content normalized from the original source text.`);

    return timeDiffInMinutes;
  } catch (error) {
    console.error('English content normalized from the original source text.', error);
    return -1; // English content normalized from the original source text.
  }
};
// English content normalized from the original source text.
export const privateAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

// English content normalized from the original source text.
privateAxios.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const csrfToken = Cookies.get('csrf_token');
      const sltToken = Cookies.get('slt_token');
      // console.log("sessionToken: ", sltToken)
      if (csrfToken && config.headers) {
        config.headers['x-csrf-token'] = csrfToken;
      }
      // Inject Accept-Language from Redux
      const store = getStore();
      const lang = store.store.getState().langECSite?.language || 'vi';
      if (config.headers) {
        config.headers['Accept-Language'] = lang;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Helper function to clear all cookies for the current domain
const clearAllCookies = () => {
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    // To delete a cookie, we must set its expiration date to the past and specify the same path and domain attributes if they were used when the cookie was set.
    // Setting path=/ should cover most cases for site-wide cookies.
    document.cookie = `${name.trim()}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
  }
};

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

const handleLogout = async () => {
  const { store, persistor } = getStore();

  // 1. Clear cookies
  clearAllCookies();

  // 2. Purge persisted state
  await persistor.purge();

  // 3. Clear profile
  store.dispatch(clearProfile());

  // 4. Redirect
  showToast('English content normalized from the original source text.', 'info');
  setTimeout(() => {
    window.location.href = ROUTES.AUTH.SIGNIN;
  }, 100);
};

privateAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      axios.isAxiosError(error) &&
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        // English content normalized from the original source text.
        try {
          await new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          });
          return privateAxios(originalRequest);
        } catch (err) {
          return Promise.reject(err);
        }
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // English content normalized from the original source text.
        const response = await refreshAxios.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN);

        if (response.status === 200) {
          processQueue();
          return privateAxios(originalRequest);
        }
      } catch (refreshError) {
        processQueue(refreshError);
        await handleLogout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (error.response?.status === 401) {
      await handleLogout();
    }

    return Promise.reject(error);
  }
);


// English content normalized from the original source text.
// privateAxios.interceptors.response.use(
//   (response: AxiosResponse) => {
//     return response;
//   },
//   async (error: any) => {
//     if (axios.isAxiosError(error) && error.response?.status === 401) {
// English content normalized from the original source text.
//       const { store, persistor } = getStore();

//       // 1. Clear all site cookies
//       clearAllCookies();

//       // 2. Purge persisted state from storage
//       await persistor.purge();

//       // 3. Dispatch action to clear profile from the current redux state
//       store.dispatch(clearProfile());

// English content normalized from the original source text.

//       // 4. Redirect to sign-in page after a short delay to allow state changes to process
//       setTimeout(() => {
//         window.location.href = ROUTES.AUTH.SIGNIN;
//       }, 100);
//     }
//     return Promise.reject(error);
//   }
// );
// // Token check function
// const checkToken = async () => {
//   const accessToken = Cookies.get('access_token');
//   const refreshToken = Cookies.get('refresh_token');


// English content normalized from the original source text.
//   if (!accessToken && refreshToken) {
// English content normalized from the original source text.
//     try {
//       await refreshAxios.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN);
// English content normalized from the original source text.
//     } catch (error) {
// English content normalized from the original source text.
//       await clearClientState();
//       if (window.location.pathname !== ROUTES.AUTH.SIGNIN) {
//         window.location.href = ROUTES.AUTH.SIGNIN;
//       }
//     }
//     return;
//   }

// English content normalized from the original source text.
//   if (!accessToken && !refreshToken) {
// English content normalized from the original source text.
//     await clearClientState();
//     return;
//   }

// English content normalized from the original source text.
//   try {
//     const decodedToken = jwt.decode(accessToken!) as DecodedToken;

//     if (!decodedToken?.exp) {
// English content normalized from the original source text.
//     }

//     const timeLeftInMinutes = getTokenTimeLeft(decodedToken.exp);

//     if (timeLeftInMinutes < 0) {
// English content normalized from the original source text.
//       try {
//         await refreshAxios.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN);
// English content normalized from the original source text.
//       } catch (error) {
// English content normalized from the original source text.
//         await clearClientState();
//         window.location.href = ROUTES.AUTH.SIGNIN;
//       }
//       return;
//     }

//     if (timeLeftInMinutes <= TOKEN_REFRESH_THRESHOLD) {
//       try {
// English content normalized from the original source text.
//         await refreshAxios.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN);
// English content normalized from the original source text.
//       } catch (error) {
// English content normalized from the original source text.
//       }
//     }else {
// English content normalized from the original source text.
//     }

//   } catch (error) {
// English content normalized from the original source text.
//     await clearClientState();
//     window.location.href = ROUTES.AUTH.SIGNIN;
//   }
// }
// // Interval management
// let tokenCheckInterval: NodeJS.Timeout;

// export const startTokenCheck = () => {
// English content normalized from the original source text.
//   if (typeof window !== 'undefined') {
//     if (tokenCheckInterval) {
//       clearInterval(tokenCheckInterval);
//     }

//     // Check immediately on start
//     checkToken();

//     tokenCheckInterval = setInterval(checkToken, TOKEN_CHECK_INTERVAL);
//   }
// };

// export const stopTokenCheck = () => {
//   if (tokenCheckInterval) {
//     clearInterval(tokenCheckInterval);
//   }
// };

// Initialize token check
// if (typeof window !== 'undefined') {
//   startTokenCheck();
//   window.addEventListener('beforeunload', stopTokenCheck);
// }
