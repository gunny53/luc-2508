import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../store'
import { UserProfile } from '@/types/auth/profile.interface'
import { Permissions } from '@/types/auth/auth.interface'


interface ProfileState {
  data: UserProfile | null
  permissions: Permissions | null
}


const initialState: ProfileState = {
  data: null,
  permissions: null
}

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
      
      state.data = state.data ? { ...state.data, ...action.payload } : (action.payload as UserProfile)
    },
    setPermissions: (state, action: PayloadAction<Permissions>) => {
      state.permissions = action.payload
    },
    clearProfile: (state) => {
      state.data = null
      state.permissions = null
    }
  }
})


export const { setProfile, setPermissions, clearProfile } = profileSlice.actions


export const selectUserProfile = (state: RootState) => state.profile.data


export const selectUserPermissions = (state: RootState) => state.profile.permissions


export default profileSlice.reducer
