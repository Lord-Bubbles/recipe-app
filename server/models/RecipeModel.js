import mongoose from 'mongoose';

// Defines how a recipe is stored in the database
const recipeSchema = mongoose.Schema(
  {
    name: String,
    ingredients: [String],
    method: [String],
    imageUrl: String,
    createdBy: String,
    time: Number,
  },
  {
    timestamps: true,
  }
);

const Recipe = mongoose.model('Recipes', recipeSchema);

export default Recipe;
