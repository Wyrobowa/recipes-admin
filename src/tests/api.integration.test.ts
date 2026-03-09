import assert from 'node:assert/strict';
import { after, beforeEach, test } from 'node:test';
import dotenv from 'dotenv';
import request from 'supertest';
import { createApp } from '../app';
import { getPool } from '../db/postgres';

dotenv.config();

const hasDatabase = Boolean(process.env.DATABASE_URL);
const app = createApp();

beforeEach(async () => {
  if (!hasDatabase) {
    return;
  }

  await getPool().query(
    'TRUNCATE recipe_products, recipes, products, categories RESTART IDENTITY CASCADE',
  );
});

after(async () => {
  if (!hasDatabase) {
    return;
  }

  await getPool().end();
});

test('POST /category validates payload', { skip: !hasDatabase }, async () => {
  const response = await request(app).post('/category').send({});

  assert.equal(response.status, 400);
  assert.equal(response.body.error.message, 'Validation failed');
});

test(
  'GET /recipe/:slug returns null for missing recipe',
  { skip: !hasDatabase },
  async () => {
    const response = await request(app).get('/recipe/missing-recipe');

    assert.equal(response.status, 200);
    assert.equal(response.body.data, null);
  },
);

test(
  'create category + create recipe + list recipes with category',
  { skip: !hasDatabase },
  async () => {
    const categoryResponse = await request(app)
      .post('/category')
      .send({ name: 'Desserts' });

    assert.equal(categoryResponse.status, 200);
    assert.equal(categoryResponse.body.data.name, 'Desserts');

    const categoryId = categoryResponse.body.data._id;
    const productResponse = await request(app).post('/product').send({
      name: 'Apple',
      unit: '100g',
      kcal: 52,
      protein_g: 0.3,
      carbs_g: 14,
      fat_g: 0.2,
    });
    const productId = productResponse.body.data._id;

    const createRecipeResponse = await request(app)
      .post('/recipe/add')
      .send({
        title: 'Apple pie',
        recipe: 'Bake it',
        category: categoryId,
        products: [{ productId, quantity: 2 }],
      });

    assert.equal(createRecipeResponse.status, 200);
    assert.equal(createRecipeResponse.body.data.title, 'Apple pie');
    assert.equal(createRecipeResponse.body.data.category, categoryId);

    const recipesResponse = await request(app).get('/recipes');

    assert.equal(recipesResponse.status, 200);
    assert.equal(recipesResponse.body.data.length, 1);
    assert.equal(recipesResponse.body.data[0].category.name, 'Desserts');
    assert.equal(recipesResponse.body.data[0].category._id, categoryId);
    assert.equal(recipesResponse.body.data[0].products.length, 1);
    assert.equal(recipesResponse.body.data[0].products[0].product._id, productId);
  },
);

test(
  'PUT /recipe/edit/:slug returns pre-update record',
  { skip: !hasDatabase },
  async () => {
    const categoryResponse = await request(app)
      .post('/category')
      .send({ name: 'Lunch' });
    const categoryId = categoryResponse.body.data._id;
    const productResponse = await request(app).post('/product').send({
      name: 'Tomato',
      unit: '100g',
      kcal: 18,
      protein_g: 0.9,
      carbs_g: 3.9,
      fat_g: 0.2,
    });
    const productId = productResponse.body.data._id;

    await request(app).post('/recipe/add').send({
      title: 'Tomato soup',
      recipe: 'Cook tomatoes',
      category: categoryId,
      products: [{ productId, quantity: 4 }],
    });

    const updateResponse = await request(app)
      .put('/recipe/edit/tomato-soup')
      .send({ title: 'Tomato soup updated' });

    assert.equal(updateResponse.status, 200);
    assert.equal(updateResponse.body.data.title, 'Tomato soup');

    const getResponse = await request(app).get('/recipe/tomato-soup');

    assert.equal(getResponse.status, 200);
    assert.equal(getResponse.body.data.title, 'Tomato soup updated');
  },
);

test(
  'PUT /category/:id updates category name and slug',
  { skip: !hasDatabase },
  async () => {
    const createResponse = await request(app)
      .post('/category')
      .send({ name: 'Desserts' });

    const categoryId = createResponse.body.data._id;

    const updateResponse = await request(app)
      .put(`/category/${categoryId}`)
      .send({ name: 'Sweet dishes' });

    assert.equal(updateResponse.status, 200);
    assert.equal(updateResponse.body.data.name, 'Sweet dishes');
    assert.equal(updateResponse.body.data.slug, 'sweet-dishes');

    const listResponse = await request(app).get('/categories');

    assert.equal(listResponse.status, 200);
    assert.equal(listResponse.body.data[0].name, 'Sweet dishes');
  },
);

test(
  'DELETE /category/:id removes category',
  { skip: !hasDatabase },
  async () => {
    const createResponse = await request(app)
      .post('/category')
      .send({ name: 'Breakfast' });

    const categoryId = createResponse.body.data._id;

    const deleteResponse = await request(app).delete(`/category/${categoryId}`);

    assert.equal(deleteResponse.status, 200);
    assert.equal(deleteResponse.body.data.name, 'Breakfast');

    const listResponse = await request(app).get('/categories');

    assert.equal(listResponse.status, 200);
    assert.equal(listResponse.body.data.length, 0);
  },
);
