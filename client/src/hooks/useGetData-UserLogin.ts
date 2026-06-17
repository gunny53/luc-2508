'use client';

import { useSelector } from 'react-redux';
import { useMemo } from 'react';
import { selectUserProfile } from '@/store/features/auth/profileSlide';
import { RootState } from '@/store/store';

/* English content normalized from the original source text. */
export const useUserData = () => {
  const user = useSelector((state: RootState) => selectUserProfile(state));

  const userInfo = useMemo(() => {
    // English content normalized from the original source text.
    if (!user) {
      return null;
    }

    // English content normalized from the original source text.
    // const name = [user.firstName, user.lastName].filter(Boolean).join(' ');

    // English content normalized from the original source text.
    return {
      ...user,
    };
  }, [user]);

  return userInfo;
};
