import express from 'express';
import path from 'path';
import cors from 'cors';
import recipeRoute from './routes/recipeRoute';
import categoryRoute from './routes/categoryRoute';
import { errorHandler } from './middlewares/errorHandler';

const createApp = () => {
  const app = express();

  app.use(cors());
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/', recipeRoute);
  app.use('/', categoryRoute);

  app.use('/img', express.static(path.join(__dirname, '../public/img')));
  app.use(errorHandler);

  return app;
};

export { createApp };
