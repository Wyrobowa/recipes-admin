const mongoose = require('mongoose');
const slug = require('slug');

const CategorySchema = new mongoose.Schema({
  slug: {
    type: String,
    lowercase: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
});

CategorySchema.pre('save', async function (next) {
  this.slug = slug(this.name);

  const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');
  const categoriesWithSlug = await this.constructor.find({ slug: slugRegEx });

  if (categoriesWithSlug.length) {
    this.slug = `${this.slug}-${categoriesWithSlug.length + 1}`;
  }

  next();
});

module.exports = mongoose.model('Category', CategorySchema);
