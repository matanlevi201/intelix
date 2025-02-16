/**
 * PUT /password
 * @tags Password Controller - everything about password managment
 * @summary Change current user password
 * @param {ChangePasswordBody} request.body.required
 * @return 200 - success response
 * @return {AppError[]} 404 - User not found
 * @return {AppError[]} 400 - Invalid credentials
 */

/**
 * PUT /password/reset
 * @tags Password Controller - everything about password managment
 * @summary Reset a user's password
 * @param {ResetPasswordBody} request.body.required
 * @return 200 - success response
 * @return {AppError[]} 400 - Invalid reset token
 * @return {AppError[]} 401 - Forbidden
 * @return {AppError[]} 404 - User not found
 */

/**
 * POST /password/reset
 * @tags Password Controller - everything about password managment
 * @summary Request to reset a user's password
 * @param {ForgotPasswordBody} request.body.required
 * @return {ForgotPasswordRes} 200 - success response
 * @return {AppError[]} 404 - User not found
 * @return {AppError[]} 502 - Email failed to send
 */
