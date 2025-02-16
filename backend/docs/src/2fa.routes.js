/**
 * GET /2fa
 * @tags Two Factor Controller - everything about 2FA
 * @summary Generate a 2fa qr
 * @return {Generate2faQrRes} 200 - success response
 * @return {AppError[]} 400 - Failed to generate qr
 */

/**
 * POST /2fa
 * @tags Two Factor Controller - everything about 2FA
 * @summary Enable 2fa
 * @param {TwoFaBody} request.body.required
 * @return {SessionRes} 200 - success response
 * @return {AppError[]} 404 - User not found
 * @return {AppError[]} 401 - Otp token is not valid
 */

/**
 * DELETE /2fa
 * @tags Two Factor Controller - everything about 2FA
 * @summary Disable 2fa
 * @param {TwoFaBody} request.body.required
 * @return {SessionRes} 200 - success response
 * @return {AppError[]} 401 - Otp token is not valid
 * @return {AppError[]} 400 - Failed to disable 2fa
 */

/**
 * POST /2fa/verify
 * @tags Two Factor Controller - everything about 2FA
 * @summary Verify 2fa
 * @param {TwoFaBody} request.body.required
 * @return {SessionRes} 200 - success response
 * @return {AppError[]} 404 - User not found
 * @return {AppError[]} 400 - 2fa is not enabled yet
 * @return {AppError[]} 401 - Otp token is not valid
 */
