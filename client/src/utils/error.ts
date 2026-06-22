interface ApiValidationError {
  message?: string
}

interface ApiErrorLike {
  message?: string
  response?: {
    data?: {
      errors?: ApiValidationError[]
      message?: string | ApiValidationError[]
    }
  }
}

function isApiErrorLike(error: unknown): error is ApiErrorLike {
  return typeof error === 'object' && error !== null
}

export const ERROR_MESSAGES: Record<string, string> = {
  'Error.InvalidOTP': 'Invalid OTP code.',
  'Error.InvalidTOTP': 'Invalid two-factor authentication code.',
  'Error.OTPExpired': 'OTP code has expired.',
  'Error.InvalidCredentials': 'Invalid email or password.',
  'Error.EmailNotFound': 'Email address was not found.',
  'Error.EmailInvalid': 'Email address is invalid.',
  'Error.TooManyRequests': 'Too many requests. Please try again later.',
  'Error.ServerError': 'Server error. Please try again later.',
  'Error.UserExists': 'User already exists.',
  'Error.UserNotFound': 'User was not found.',
  'Error.Auth.Otp.Invalid': 'Invalid OTP code.',
  'Error.Auth.Password.Invalid"': 'Invalid password.',
  'Error.TOTPAlreadyEnabled': 'Two-factor authentication is already enabled.',
  'Error.EmailAlreadyExists': 'Email address already exists.',
  'Error.LanguageNotFound': 'Language was not found.',
  'Error.LanguageCodeExists': 'Language code already exists.',
  'Error.LanguageCodeInvalid': 'Language code is invalid.',
  'Error.LanguageNameExists': 'Language name already exists.',
  'Error.LanguageNameInvalid': 'Language name is invalid.',
  'Error.LanguageCodeTooShort': 'Language code is too short.',
  'Error.LanguageCreateFailed': 'Failed to create language.',
  'Error.LanguageUpdateFailed': 'Failed to update language.',
  'Error.LanguageDeleteFailed': 'Failed to delete language.',
  'Error.Auth.Email.NotFound': 'Email address was not found.',
  'Error.Language.AlreadyExists': 'Language already exists.',
  'Error.Auth.Email.AlreadyExists': 'Email address already exists.'
}

export function parseApiError(error: unknown): string {
  const fallback = 'An unexpected error occurred.'
  if (!isApiErrorLike(error)) {
    return fallback
  }

  if (error.response?.data?.errors) {
    const errors = error.response.data.errors
    if (Array.isArray(errors) && errors.length > 0) {
      const firstError = errors[0]
      const errorCode = firstError.message
      return errorCode ? ERROR_MESSAGES[errorCode] || errorCode : fallback
    }
  }
  const errMsg = error?.response?.data?.message || error?.message

  if (Array.isArray(errMsg)) {
    const code = errMsg[0]?.message
    return code ? ERROR_MESSAGES[code] || code : fallback
  } else if (typeof errMsg === 'string') {
    return ERROR_MESSAGES[errMsg] || errMsg
  }

  return fallback
}
