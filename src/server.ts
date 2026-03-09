import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();

app.use(cors());

dotenv.config();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

import './models/Category';
import './models/Recipe';

mongoose
  .connect(process.env.DATABASE as string)
  .then(() => console.log('DB connected!'))
  .catch((error: unknown) => console.log(error));

mongoose.connection.on('error', (error: unknown) => console.log(error));

import recipeRoute from './routes/recipeRoute';
import categoryRoute from './routes/categoryRoute';

app.use('/', recipeRoute);
app.use('/', categoryRoute);

app.use('/img', express.static(path.join(__dirname, '../public/img')));

app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), () => {
  console.log(`Listening on port: ${app.get('port')}`);
});
