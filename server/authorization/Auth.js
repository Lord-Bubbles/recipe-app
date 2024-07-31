import { OAuth2Client } from 'google-auth-library';
import dotenv from 'dotenv';
import User from '#models/UserModel';
import asyncHandler from 'express-async-handler';

// Load .env contents into process.env
dotenv.config();

// Used to verify id token, refresh access token, get all tokens
export const client = new OAuth2Client(
  process.env.VITE_GOOGLE_CLIENT_ID,
  process.env.CLIENT_SECRET,
  'postmessage'
);

const validateToken = async (token) => {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.VITE_GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  return payload?.email;
};

// Middleware to be used to validate token and add currently authenticated user to req.user
export const validateMiddleware = asyncHandler(async (req, _, next) => {
  // Authorization header is of the form: Bearer token
  const token = req.headers.authorization.split(' ')[1];
  const email = await validateToken(token);
  if (email) {
    req.user = await User.findOne({ email }).exec();
  }
  next();
});
