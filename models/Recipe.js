const mongoose = require('mongoose');
const slug = require('slug');

const RecipeSchema = new mongoose.Schema({
  slug: {
    type: String,
    lowercase: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  recipe: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
    default: 'http://localhost:3000/img/default.jpg',
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: '5e849f2cd339b789aa881e2d',
  },
});

RecipeSchema.pre('save', async function (next) {
  this.slug = slug(this.title);

  const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');
  const recipesWithSlug = await this.constructor.find({ slug: slugRegEx });

  if (recipesWithSlug.length) {
    this.slug = `${this.slug}-${recipesWithSlug.length + 1}`;
  }

  next();
});

module.exports = mongoose.model('Recipe', RecipeSchema);
