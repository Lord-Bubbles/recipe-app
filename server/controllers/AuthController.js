import asyncHandler from 'express-async-handler';
import User from '#models/UserModel';
import { client } from '#authorization/Auth';
import { jwtDecode } from 'jwt-decode';
import { UserRefreshClient } from 'google-auth-library';

// @desc   Adds new user if it doesnt exist and returns newly created user,
//         otherwise return existing user from database. A unique user is
//         defined by its email since every Google Account must have a unique
//         email address.
const addOrUpdateUser = async (
  email,
  name,
  profile,
  refreshToken,
  refreshTokenExpiry
) => {
  // Finds a user using google email field
  let user = await User.findOne({ email }).exec();
  if (user) {
    user.refreshToken = refreshToken;
    user.refreshTokenExpiry = refreshTokenExpiry;
    await user.save();
    return user;
  } else {
    return await User.create({
      email,
      name,
      profile,
      refreshToken,
      refreshTokenExpiry,
    });
  }
};

const setCookieOptions = () => {
  return {
    httpOnly: true,
    sameSite: true,
    secure: process.env.NODE_ENV === 'production' ? true : false,
    expires: new Date(Date.now() + 48 * 60 * 60 * 1000),
  };
};

// @desc   Returns id_token, refresh_token, access_tokens, authenticated user
// @route  POST /api/auth/google/authenticate
// @access public
export const userLogin = asyncHandler(async (req, res) => {
  const { code } = req.body;

  const { tokens } = await client.getToken(code);
  const { access_token, refresh_token, id_token } = tokens;

  const userInfo = jwtDecode(id_token);

  const cookieOptions = setCookieOptions();

  res.cookie('refreshToken', refresh_token, cookieOptions);

  const user = await addOrUpdateUser(
    userInfo.email,
    userInfo.name,
    userInfo.picture,
    refresh_token,
    cookieOptions.expires
  );
  res.status(200).json({ accessToken: access_token, idToken: id_token, user });
});

// @desc   Returns new refresh, id, access tokens using valid refresh token
//         and updated user; otherwise return 401 response
// @route  POST /api/auth/google/logout
// @access public
export const refresh = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies['refreshToken'];
  const user = await User.findOne({ refreshToken }).exec();

  if (!user || user.refreshTokenExpiry.getTime() < new Date().getTime()) {
    // If invalid client, delete user's refresh token and remove cookie
    if (user) {
      user.refreshToken = null;
      await user.save();
    }
    res.clearCookie('refreshToken');
    res.status(401).json();
    return;
  }

  const refreshClient = new UserRefreshClient(
    client._clientId,
    client._clientSecret,
    refreshToken
  );
  const { credentials } = await refreshClient.refreshAccessToken();

  const cookieOptions = setCookieOptions();

  res.cookie('refreshToken', credentials.refresh_token, cookieOptions);

  // Update authenticated user in database
  user.refreshToken = credentials.refresh_token;
  user.refreshTokenExpiry = cookieOptions.expires;
  await user.save();

  res.status(200).json({
    accessToken: credentials.access_token,
    idToken: credentials.id_token,
    user,
  });
});

// @desc   Clears refresh_token from authenticated user and cookie
// @route  POST /api/auth/google/logout
// @access private: Can only logout if logged in
export const userLogout = asyncHandler(async (req, res) => {
  const user = req.user;
  // If user exists, clears associated refresh token in database and clear cookie
  if (user) {
    user.refreshToken = null;
    await user.save();
  }
  res.clearCookie('refreshToken');
  res.status(200).json();
});
