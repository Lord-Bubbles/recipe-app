import express from 'express';
import { addOrUpdateUser } from '#controllers/UserController';

const router = express.Router();

// @desc   Adds new user if it doesnt exist and returns newly created user,
//         otherwise return existing user from database
// @route  PUT /users
// @access Public
router.put('/', addOrUpdateUser);

export default router;
