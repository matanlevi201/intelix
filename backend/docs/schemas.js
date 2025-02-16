/**
 * @typedef {object} SignBody
 * @property {string} email - The user's current password
 * @property {string} password - The user's new password
 */

/**
 * @typedef {object} ChangePasswordBody
 * @property {string} currentPassword - The user's current password
 * @property {string} newPassword - The user's new password
 */

/**
 * @typedef {object} ResetPasswordBody
 * @property {string} password - The user's new password
 */

/**
 * @typedef {object} ForgotPasswordBody
 * @property {string} email - The user's new password
 */

/**
 * @typedef {object} TwoFaBody
 * @property {string} token - The otp token
 */

/**
 * @typedef {object} SessionRes
 * @property {string} accessToken - The updated access token
 */

/**
 * @typedef {object} Generate2faQrRes
 * @property {string} secert - The secert for manual settings
 * @property {string} qr - The qr for scanning
 */

/**
 * @typedef {object} ForgotPasswordRes
 * @property {string} mailId - The reset mail id
 */

/**
 * @typedef {object} AppError
 * @property {string} message - The error message
 */
