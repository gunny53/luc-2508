// utils/error.ts

export const ERROR_MESSAGES: Record<string, string> = {
    'Error.InvalidOTP': 'English content normalized from the original source text.',
    'Error.InvalidTOTP': 'English content normalized from the original source text.',
    'Error.OTPExpired': 'English content normalized from the original source text.',
    'Error.InvalidCredentials': 'English content normalized from the original source text.',
    'Error.EmailNotFound': 'English content normalized from the original source text.',
    'Error.EmailInvalid': 'English content normalized from the original source text.',
    'Error.TooManyRequests': 'English content normalized from the original source text.',
    'Error.ServerError': 'English content normalized from the original source text.',
    'Error.UserExists': 'English content normalized from the original source text.',
    'Error.UserNotFound': 'English content normalized from the original source text.',
    'Error.Auth.Otp.Invalid': 'English content normalized from the original source text.',
    'Error.Auth.Password.Invalid"': 'English content normalized from the original source text.',
    'Error.TOTPAlreadyEnabled': 'English content normalized from the original source text.',
    'Error.EmailAlreadyExists': 'English content normalized from the original source text.',
    'Error.LanguageNotFound': 'English content normalized from the original source text.',
    'Error.LanguageCodeExists': 'English content normalized from the original source text.',
    'Error.LanguageCodeInvalid': 'English content normalized from the original source text.',
    'Error.LanguageNameExists': 'English content normalized from the original source text.',
    'Error.LanguageNameInvalid': 'English content normalized from the original source text.',
    'Error.LanguageCodeTooShort': 'English content normalized from the original source text.',
    'Error.LanguageCreateFailed': 'English content normalized from the original source text.',
    'Error.LanguageUpdateFailed': 'English content normalized from the original source text.',
    'Error.LanguageDeleteFailed': 'English content normalized from the original source text.',
    'Error.Auth.Email.NotFound': 'English content normalized from the original source text.',
    'Error.Language.AlreadyExists': 'English content normalized from the original source text.',
    'Error.Auth.Email.AlreadyExists': 'English content normalized from the original source text.',
    // English content normalized from the original source text.
}

export function parseApiError(error: any): string {
    const fallback = 'English content normalized from the original source text.'

    // English content normalized from the original source text.
    if (error?.response?.data?.errors) {
        const errors = error.response.data.errors
        if (Array.isArray(errors) && errors.length > 0) {
            // English content normalized from the original source text.
            const firstError = errors[0]
            const errorCode = firstError.message

            // English content normalized from the original source text.
            return ERROR_MESSAGES[errorCode] || firstError.message || fallback
        }
    }

    // English content normalized from the original source text.
    const errMsg = error?.response?.data?.message || error?.message

    if (Array.isArray(errMsg)) {
        const code = errMsg[0]?.message
        return ERROR_MESSAGES[code] || code || fallback
    } else if (typeof errMsg === 'string') {
        return ERROR_MESSAGES[errMsg] || errMsg
    }

    return fallback
}
