import asyncHandler from 'express-async-handler';
import Recipe from '../database/RecipeModel.js';
import { OAuth2Client } from 'google-auth-library';
import { jwtDecode } from 'jwt-decode';
import { uploadImage } from '../database/Storage.js';

const client = new OAuth2Client(process.env.REACT_APP_GOOGLE_CLIENT_ID);

// Used for verification
const verify = async (token) => {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.REACT_APP_GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  const obj = jwtDecode(token);
  return JSON.stringify(payload) === JSON.stringify(obj);
};

// @desc   Gets recipes from the database based on user query parameters
// @route  GET /api/recipes
// @access public
export const fetchRecipes = asyncHandler(async (req, res) => {
  const { minTime, maxTime, page, limit, ingredients, user, name } = req.query;
  if (!page && !limit) {
    res.status(400);
    throw new Error(`page and limit query parameters weren't set!`);
  }

  const query = {};

  if (name) {
    query['name'] = { $regex: name, $options: 'i' };
  }
  if (minTime && maxTime) {
    query['time'] = { $gte: minTime, $lte: maxTime };
  } else if (!minTime && maxTime) {
    query['time'] = { $lte: maxTime };
  } else if (minTime && !maxTime) {
    query['time'] = { $gte: minTime };
  }
  if (ingredients) {
    query['ingredients'] = { $elemMatch: { $in: ingredients } };
  }
  if (user) {
    query['createdBy'] = { $regex: user, $options: 'i' };
  }
  const recipes = await Recipe.find(query)
    .select('_id name ingredients method imageID createdBy time imageUrl')
    .skip((page - 1) * limit)
    .limit(limit)
    .exec();
  const count = await Recipe.find(query).countDocuments().exec();
  res.status(200).json({ data: recipes, totalCount: count });
});

// @desc   Adds a recipe under the currently logged in user
// @route  POST /api/recipes
// @access private: Logged in user can only add recipes under their name
export const addRecipe = asyncHandler(async (req, res) => {
  if (!req.body) {
    res.status(400);
    throw new Error('Body missing from request!');
  }
  if (!verify(req.headers.authorization)) {
    res.status(400);
    throw new Error(
      'Unauthorized access detected! Please login before adding a recipe!'
    );
  }
  if (!req.file) {
    res.status(400);
    throw new Error(`An image file wasn't uploaded!`);
  }
  const { name, ingredients, method, time, createdBy } = req.body;
  const url = await uploadImage(req.file);
  console.log(url);
  const recipe = await Recipe.create({
    name,
    imageUrl: url,
    ingredients,
    method,
    time,
    createdBy,
  });
  recipe
    ? res.status(200).send('New recipe succesfully created!')
    : res.status(400).send('Error occurred in creating new recipe!');
});

// @desc   Deletes a recipe under the currently logged in user
// @route  DELETE /api/recipes
// @access private: Logged in user can only delete recipes under their name
export const deleteRecipe = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    res.status(400);
    throw new Error('Recipe id missing from query parameters!');
  }
  if (!verify(req.headers.authorization)) {
    res.status(400);
    throw new Error(
      'Unauthorized access detected! Only the recipe owner can delete this!'
    );
  }
  const recipe = await Recipe.findOneAndRemove({ _id: id });
  recipe
    ? res.status(200).send('Recipe successfully removed from database!')
    : res.status(400).send('Error occurred in removing recipe!');
});

// @desc   Modifies a recipe under the currently logged in user
// @route  PUT /api/recipes
// @access private: Logged in user can only edit recipes under their name
export const modifyRecipe = asyncHandler(async (req, res) => {
  if (!req.body) {
    res.status(400);
    throw new Error('Body missing from request!');
  }
  const { id } = req.params;
  if (!id) {
    res.status(400);
    throw new Error('Recipe id missing from request parameters!');
  }
  if (!verify(req.headers.authorization)) {
    res.status(400);
    throw new Error(
      'Unauthorized access detected! Only the recipe owner can edit this!'
    );
  }
  const recipe = await Recipe.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
  });
  recipe
    ? res.status(200).send('Recipe succesfully updated!')
    : res.status(400).send('Error occurred in updating recipe!');
});
