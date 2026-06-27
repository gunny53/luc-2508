import { BaseResponse } from '../base.interface'

export interface Address {
  id: string
  name: string
  recipient?: string
  phoneNumber?: string
  province: string
  district: string
  ward: string
  street: string
  addressType: 'HOME' | 'OFFICE'
  isDefault: boolean
  provinceId: number
  districtId: number
  wardCode: string
  createdById: string
  updatedById: string | null
  deletedById: string | null
  deletedAt: string | null
  createdAt: string
  updatedAt: string
}


export interface AddAddressRequest {
  name: string
  province: string
  district: string
  ward: string
  street: string
  addressType: 'HOME' | 'OFFICE'
  phoneNumber?: string
  recipient?: string
  isDefault: boolean
  provinceId: number
  districtId: number
  wardCode: string
}

export interface AddAddressResponse {
  message: string
  data: Address
}


export interface UpdateAddressRequest {
  name: string
  province?: string
  district?: string
  ward?: string
  street?: string
  addressType?: 'HOME' | 'OFFICE'
  phoneNumber?: string
  recipient?: string
  isDefault?: boolean
  provinceId?: number
  districtId?: number
  wardCode?: string
}

export interface UpdateAddressResponse {
  message: string
  data: Address
}


export interface AddressGetByIdResponse {
  message: string
  data: Address
}

export interface AddressGetAllResponse {
  message: string
  data: Address[]
}


export interface DeleteAddressResponse {
  message: string
}

export interface UserProfile {
  id: string
  email: string
  name: string
  role: {
    id: number
    name: string
    permissions: any[]
  }
  status: string
  twoFactorEnabled: boolean
  googleId: string | null
  firstName: string
  lastName: string
  username: string
  phoneNumber: string | null
  avatar: string | null
  createdAt: string
  updatedAt: string
  addresses: Address[]
  statistics: {
    totalOrders: number
    totalSpent: number
    memberSince: string
  }
}

export interface UserProfileResponse extends BaseResponse {
  data: {
    id: string
    email: string
    name: string
    role: {
      id: number
      name: string
      permissions: any[]
    }
    avatar: string | null
    status: string
    twoFactorEnabled: boolean
    googleId: string | null
    createdAt: string
    updatedAt: string
    phoneNumber: string | null
    userProfile?: {
      firstName: string
      lastName: string
      username: string
      avatar: string | null
    }
    addresses: Address[]
    statistics: {
      totalOrders: number
      totalSpent: number
      memberSince: string
    }
  }
  createdAt: string
  updatedAt: string
}

export interface UpdateProfileRequest {
  firstName?: string
  lastName?: string
  name?: string
  phoneNumber?: string | null
  avatar?: string | null
}

export interface UpdateProfileResponse extends BaseResponse {
  data: {
    id: number
    email: string
    name: string
    role: string
    status: string
    avatar: string | null
    twoFactorEnabled: boolean
    googleId: string | null
    createdAt: string
    updatedAt: string
    userProfile: {
      firstName: string
      lastName: string
      username: string
      phoneNumber: string | null
      avatar: string | null
    }
  }
}
export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
  confirmPassword: string
  revokeOtherSessions?: boolean
}
export interface ChangePasswordResponse extends BaseResponse {
  message: string
  verificationType?: string
}
export interface ChangePasswordProfileRequest {
  password: string
  newPassword: string
  confirmNewPassword: string
  revokeOtherSessions?: boolean
}
export interface ChangePasswordProfileResponse extends BaseResponse {
  message: string
  verificationType?: string
}
