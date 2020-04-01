const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
  slug: {
   type: String,
   lowercase: true,
   unique: true,
  },
  title: {
    type: String,
  }
});

module.exports = mongoose.model('Recipe', RecipeSchema);
