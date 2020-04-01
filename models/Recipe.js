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
  },
  description: {
    type: String,
  },
});

RecipeSchema.pre('save', async function (next) {
  this.slug = slug(this.title);

  const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');
  const issuesWithSulg = await this.constructor.find({ slug: slugRegEx });

  if (issuesWithSulg.length) {
    this.slug = `${this.slug}-${issuesWithSulg.length + 1}`;
  }

  next();
});

module.exports = mongoose.model('Recipe', RecipeSchema);
