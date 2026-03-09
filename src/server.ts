import dotenv from 'dotenv';
import { connectPostgres } from './db/postgres';
import { createApp } from './app';

dotenv.config();

const app = createApp();

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
