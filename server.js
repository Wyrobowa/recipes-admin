const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Configs
const app = express();

// DotEnv Config
dotenv.config();

// Models
require('./models/Recipe');

// DB Connection
const mongoConnectOptions = {
  useCreateIndex: true,
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose
  .connect(process.env.DATABASE, mongoConnectOptions)
  .then(() => console.log('DB connected!'))
  .catch((error) => console.log(error));

mongoose.connection.on('error', (error) => console.log(error));

// Routes
const apiRoute = require('./routes/apiRoute');

app.use('/', apiRoute);

// Set App port
app.set('port', process.env.PORT || 3000);

// Start App
app.listen(app.get('port'), () => {
  console.log(`Listening on port: ${app.get('port')}`);
});
