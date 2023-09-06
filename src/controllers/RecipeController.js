const asyncHandler = require('express-async-handler');
const Recipe = require('../database/RecipeModel');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.REACT_APP_GOOGLE_CLIENT_ID);

// Used for verification
const verify = async (token, name) => {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.REACT_APP_GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  return payload.name === name;
};

// @desc   Gets recipes from the database based on user query parameters
// @route  GET /recipes
// @access public
const fetchRecipes = asyncHandler(async (req, res) => {
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
    .select('_id name ingredients method imageID createdBy time')
    .skip((page - 1) * limit)
    .limit(limit)
    .exec();
  const count = await Recipe.find(query).countDocuments().exec();
  res.status(200).json({ data: recipes, totalCount: count });
});

// @desc   Adds a recipe under the currently logged in user
// @route  POST /recipes
// @access private: Logged in user can only add recipes under their name
const addRecipe = asyncHandler(async (req, res) => {
  if (!req.body) {
    res.status(400);
    throw new Error('Body missing from request!');
  }
  const { name, ingredients, method, time, createdBy } = req.body;
  const recipe = await Recipe.create({
    name,
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
// @route  DELETE /recipes
// @access private: Logged in user can only delete recipes under their name
const deleteRecipe = asyncHandler(async (req, res) => {
  // TODO: Backend delete button (Issue 35)
});

// @desc   Modifies a recipe under the currently logged in user
// @route  PUT /recipes
// @access private: Logged in user can only edit recipes under their name
const modifyRecipe = asyncHandler(async (req, res) => {
  if (!req.body) {
    res.status(400);
    throw new Error('Body missing from request!');
  }
  const { id } = req.query;
  if (!id) {
    res.status(400);
    throw new Error('Recipe id missing from query parameters!');
  }
  const { createdBy } = req.body;
  if (!verify(req.headers.authorization, createdBy)) {
    res.status(400);
    throw new Error(
      'Unauthorized access detected! Only the appropriate user can edit this!'
    );
  }
  const recipe = await Recipe.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
  });
  recipe
    ? res.status(200).send('Recipe succesfully updated!')
    : res.status(400).send('Error occurred in updating recipe!');
});

module.exports = {
  fetchRecipes,
  addRecipe,
  deleteRecipe,
  modifyRecipe,
};
