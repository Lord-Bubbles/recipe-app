import asyncHandler from 'express-async-handler';
import User from '#models/UserModel';

// @desc   Adds new user if it doesnt exist and returns newly created user,
//         otherwise return existing user from database. A unique user is
//         defined by its email since every Google Account must have a unique
//         email address.
// @route  PUT /api/users
// @access Public
export const addOrUpdateUser = asyncHandler(async (req, res) => {
  const { email, name } = req.body;
  // Finds a user based off email and name and returns an object with only the
  // id, email, name fields
  let user = await User.findOne({ email: email }, '_id email name').exec();
  if (user) {
    res.status(200).json({
      data: user,
      message: 'User already exists. Returning user information',
    });
  } else {
    user = await User.create({ email: email, name: name, recipes: [] });
    if (user) {
      res.status(200).json({
        data: {
          _id: user._id,
          email: user.email,
          name: user.name,
        },
        message: 'New user created successfully!',
      });
    } else {
      res.status(400);
      throw new Error('Error in user creation!');
    }
  }
});
