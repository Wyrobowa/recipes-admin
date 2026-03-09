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
    'TRUNCATE recipes, categories RESTART IDENTITY CASCADE',
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

    const createRecipeResponse = await request(app)
      .post('/recipe/add')
      .send({ title: 'Apple pie', recipe: 'Bake it', category: categoryId });

    assert.equal(createRecipeResponse.status, 200);
    assert.equal(createRecipeResponse.body.data.title, 'Apple pie');
    assert.equal(createRecipeResponse.body.data.category, categoryId);

    const recipesResponse = await request(app).get('/recipes');

    assert.equal(recipesResponse.status, 200);
    assert.equal(recipesResponse.body.data.length, 1);
    assert.equal(recipesResponse.body.data[0].category.name, 'Desserts');
    assert.equal(recipesResponse.body.data[0].category._id, categoryId);
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

    await request(app).post('/recipe/add').send({
      title: 'Tomato soup',
      recipe: 'Cook tomatoes',
      category: categoryId,
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
