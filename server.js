const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Cors Config
app.use(cors());

// DotEnv Config
dotenv.config();

// Body Parser Config
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Models
require('./models/Category');
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
const recipeRoute = require('./routes/recipeRoute');
const categoryRoute = require('./routes/categoryRoute');

app.use('/', recipeRoute);
app.use('/', categoryRoute);

// Set App port
app.set('port', process.env.PORT || 3000);

// Start App
app.listen(app.get('port'), () => {
  console.log(`Listening on port: ${app.get('port')}`);
});
