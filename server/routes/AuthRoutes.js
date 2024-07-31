import express from 'express';
import { refresh, userLogin, userLogout } from '#controllers/AuthController';
import { validateMiddleware } from '#authorization/Auth';

const router = express.Router();

// @desc   Returns id_token, refresh_token, access_tokens, authenticated user
// @route  POST /api/auth/google/authenticate
// @access public
router.post('/google/authenticate', userLogin);

// @desc   Clears refresh_token from authenticated user and cookie
// @route  POST /api/auth/google/logout
// @access private: Can only logout if logged in
router.post('/google/logout', validateMiddleware, userLogout);

// @desc   Returns new refresh, id, access tokens using valid refresh token
//         and updated user; otherwise return 401 response
// @route  POST /api/auth/google/logout
// @access public
router.post('/google/refresh', refresh);

export default router;
