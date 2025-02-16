/**
 * POST /auth/users
 * @tags Auth Controller - everything about user authentication
 * @summary Sign up and creating a new user
 * @param {SignBody} request.body.required
 * @return {SessionRes} 200 - success response
 * @return {AppError[]} 400 - Email is already in use
 */

/**
 * POST /auth/sessions
 * @tags Auth Controller - everything about user authentication
 * @summary Sign in a user
 * @param {SignBody} request.body.required
 * @return {SessionRes} 200 - success response
 * @return {AppError[]} 400 - Invalid credentials
 */

/**
 * GET /auth/sessions
 * @tags Auth Controller - everything about user authentication
 * @summary Refresh's an expired access token
 * @return {SessionRes} 200 - success response
 * @return {AppError[]} 401 - Refresh token is not valid
 */

/**
 * DELETE /auth/sessions
 * @tags Auth Controller - everything about user authentication
 * @summary Sign out a user
 * @return 205 - success response
 */
