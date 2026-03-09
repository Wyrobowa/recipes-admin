import mongoose from 'mongoose';
import slug from 'slug';

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

CategorySchema.pre('save', async function () {
  this.slug = slug(this.name);

  const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');
  const categoriesWithSlug = await mongoose.model('Category').find({ slug: slugRegEx });

  if (categoriesWithSlug.length) {
    this.slug = `${this.slug}-${categoriesWithSlug.length + 1}`;
  }
});

export default mongoose.model('Category', CategorySchema);
