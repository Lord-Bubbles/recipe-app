import express from 'express';
import {
  fetchRecipes,
  addRecipe,
  modifyRecipe,
  deleteRecipe,
} from '#controllers/RecipeController';
import { validateMiddleware } from '#authorization/Auth';

const router = express.Router();

// @desc   Gets recipes from the database based on user query parameters
// @route  GET /recipes
// @access public
router.get('/', fetchRecipes);

// @desc   Adds a recipe under the currently logged in user
// @route  POST /recipes
// @access private: Logged in user can only add recipes under their name
router.post('/', validateMiddleware, addRecipe);

// @desc   Modifies a recipe under the currently logged in user
// @route  PUT /recipes
// @access private: Logged in user can only edit recipes under their name
router.put('/:id', validateMiddleware, modifyRecipe);

// @desc   Deletes a recipe under the currently logged in user
// @route  DELETE /recipes
// @access private: Logged in user can only delete recipes under their name
router.delete('/:id', validateMiddleware, deleteRecipe);

export default router;
