export const metadataConfig = {
  '/sign-in': {
    title: 'Sign In',
    description: 'Sign in to your EC Site account'
  },
  '/sign-up': {
    title: 'Sign Up',
    description: 'Create a new EC Site account'
  },
  '/forgot-password': {
    title: 'Forgot Password',
    description: 'Recover access to your EC Site account'
  },
  '/reset-password': {
    title: 'Reset Password',
    description: 'Set a new account password'
  },
  '/verify-code': {
    title: 'Verify Code',
    description: 'Verify your account security code'
  },
  '/verify-2fa': {
    title: 'Two-Factor Verification',
    description: 'Complete two-factor authentication'
  },
  '/user/dashboard': {
    title: 'User Dashboard',
    description: 'View your account dashboard'
  },
  '/user/orders': {
    title: 'My Orders',
    description: 'Track and manage your orders'
  },
  '/user/profile': {
    title: 'Profile',
    description: 'Manage your account profile'
  },
  '/cart': {
    title: 'Shopping Cart',
    description: 'Review products in your cart'
  },
  '/seller/sign-up': {
    title: 'Seller Sign Up',
    description: 'Register as an EC Site seller'
  },
  '/seller/forgot-password': {
    title: 'Seller Forgot Password',
    description: 'Recover seller account access'
  },
  '/seller/reset-password': {
    title: 'Seller Reset Password',
    description: 'Set a new seller account password'
  },
  '/seller/verify-code': {
    title: 'Seller Verify Code',
    description: 'Verify your seller account security code'
  },
  '/admin': {
    title: 'Admin Dashboard',
    description: 'Manage EC Site operations'
  },
  '/admin/products': {
    title: 'Products',
    description: 'Manage product catalog'
  },
  '/admin/products/new': {
    title: 'New Product',
    description: 'Create a new product'
  },
  '/admin/products/[id]': {
    title: 'Edit Product',
    description: 'Update product details'
  },
  '/admin/category': {
    title: 'Categories',
    description: 'Manage product categories'
  },
  '/admin/order': {
    title: 'Orders',
    description: 'Manage customer orders'
  },
  '/admin/voucher': {
    title: 'Vouchers',
    description: 'Manage promotional vouchers'
  },
  '/admin/voucher/new': {
    title: 'New Voucher',
    description: 'Create a promotional voucher'
  },
  '/admin/voucher/edit/[id]': {
    title: 'Edit Voucher',
    description: 'Update voucher details'
  },
  '/admin/permissions': {
    title: 'Permissions',
    description: 'Manage access permissions'
  },
  '/admin/roles': {
    title: 'Roles',
    description: 'Manage user roles'
  },
  '/admin/users': {
    title: 'Users',
    description: 'Manage platform users'
  },
  '/admin/audit-log': {
    title: 'Audit Logs',
    description: 'Review system audit activity'
  },
  '/admin/languages': {
    title: 'Languages',
    description: 'Manage storefront languages'
  },
  '/admin/brand': {
    title: 'Brands',
    description: 'Manage product brands'
  }
} satisfies Record<string, { title: string; description: string }>
