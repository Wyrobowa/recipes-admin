import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectPostgres } from './db/postgres';

const app = express();

app.use(cors());

dotenv.config();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

import recipeRoute from './routes/recipeRoute';
import categoryRoute from './routes/categoryRoute';

app.use('/', recipeRoute);
app.use('/', categoryRoute);

app.use('/img', express.static(path.join(__dirname, '../public/img')));

app.set('port', process.env.PORT || 3000);

connectPostgres()
  .then(() => {
    app.listen(app.get('port'), () => {
      console.log(`Listening on port: ${app.get('port')}`);
    });
  })
  .catch((error: unknown) => {
    console.log(error);
    process.exit(1);
  });
