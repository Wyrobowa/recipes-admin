# API Contract (Pre-PostgreSQL Migration Baseline)

This document captures the current HTTP contract that must remain stable while replacing MongoDB with PostgreSQL.

## Base behavior

- Base URL: `http://localhost:3000`
- Content type: JSON
- Successful responses use shape: `{ "data": ... }`
- Current controllers return HTTP `200` for successful operations
- There is no explicit input validation layer yet

## Categories

### `GET /categories`

Returns all categories.

Response body:

```json
{
  "data": [
    {
      "_id": "mongo-object-id",
      "slug": "desserts",
      "name": "Desserts",
      "__v": 0
    }
  ]
}
```

### `POST /category`

Creates a category from JSON payload.

Request body:

```json
{
  "name": "Desserts"
}
```

Current model behavior:

- `name` is required
- `slug` is generated from `name`
- `slug` uniqueness rule appends suffix: `slug`, `slug-2`, `slug-3`, ...

Response body:

```json
{
  "data": {
    "_id": "mongo-object-id",
    "slug": "desserts",
    "name": "Desserts",
    "__v": 0
  }
}
```

## Recipes

### `GET /recipes`

Returns all recipes with populated category object.

Response body:

```json
{
  "data": [
    {
      "_id": "mongo-object-id",
      "slug": "apple-pie",
      "title": "Apple pie",
      "description": "Optional text",
      "recipe": "Preparation steps",
      "photo": "http://localhost:3000/img/default.jpg",
      "category": {
        "_id": "mongo-object-id",
        "slug": "desserts",
        "name": "Desserts",
        "__v": 0
      },
      "__v": 0
    }
  ]
}
```

### `GET /recipe/:slug`

Returns one recipe for the provided slug with populated category.

Response body:

```json
{
  "data": {
    "_id": "mongo-object-id",
    "slug": "apple-pie",
    "title": "Apple pie",
    "description": "Optional text",
    "recipe": "Preparation steps",
    "photo": "http://localhost:3000/img/default.jpg",
    "category": {
      "_id": "mongo-object-id",
      "slug": "desserts",
      "name": "Desserts",
      "__v": 0
    },
    "__v": 0
  }
}
```

Notes:

- If recipe does not exist, current behavior is `{ "data": null }` with HTTP `200`.

### `POST /recipe/add`

Creates a recipe from JSON payload.

Request body:

```json
{
  "title": "Apple pie",
  "description": "Optional text",
  "recipe": "Preparation steps",
  "photo": "Optional image URL",
  "category": "mongo-category-object-id"
}
```

Current model behavior:

- Required fields: `title`, `recipe`
- `slug` is generated from `title`
- `slug` uniqueness rule appends suffix: `slug`, `slug-2`, `slug-3`, ...
- `photo` default: `http://localhost:3000/img/default.jpg`
- `category` default: `5e849f2cd339b789aa881e2d` (legacy hardcoded ObjectId)

Response body:

```json
{
  "data": {
    "_id": "mongo-object-id",
    "slug": "apple-pie",
    "title": "Apple pie",
    "description": "Optional text",
    "recipe": "Preparation steps",
    "photo": "http://localhost:3000/img/default.jpg",
    "category": "mongo-category-object-id",
    "__v": 0
  }
}
```

### `PUT /recipe/edit/:slug`

Updates recipe by slug using request JSON body.

Current implementation detail:

- Uses `findOneAndUpdate({ slug }, req.body)` without `{ new: true }`
- Response returns the pre-update document in `data` (not the updated one)

Response body:

```json
{
  "data": {
    "_id": "mongo-object-id",
    "slug": "apple-pie",
    "title": "Apple pie",
    "description": "Optional text",
    "recipe": "Preparation steps",
    "photo": "http://localhost:3000/img/default.jpg",
    "category": "mongo-category-object-id",
    "__v": 0
  }
}
```

## Migration parity checklist

- Keep endpoint paths and methods unchanged.
- Keep `{ "data": ... }` wrapper unchanged.
- Keep slug generation and collision behavior unchanged.
- Keep `GET /recipe/:slug` not-found behavior (`200` with `data: null`) unless intentionally changed later.
- Keep `PUT /recipe/edit/:slug` response semantics (pre-update document) unless intentionally changed later.
