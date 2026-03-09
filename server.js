const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Cors Config
app.use(cors());

// DotEnv Config
dotenv.config();

// Body Parser Config
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Models
require('./models/Category');
require('./models/Recipe');

// DB Connection
mongoose
  .connect(process.env.DATABASE)
  .then(() => console.log('DB connected!'))
  .catch((error) => console.log(error));

mongoose.connection.on('error', (error) => console.log(error));

// Routes
const recipeRoute = require('./routes/recipeRoute');
const categoryRoute = require('./routes/categoryRoute');

app.use('/', recipeRoute);
app.use('/', categoryRoute);

// Set images folder public
app.use('/img', express.static(path.join(__dirname, 'public/img')));

// Set App port
app.set('port', process.env.PORT || 3000);

// Start App
app.listen(app.get('port'), () => {
  console.log(`Listening on port: ${app.get('port')}`);
});
