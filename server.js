const express = require('express');
const dotenv = require('dotenv');

// Configs
const app = express();

// DotEnv Config
dotenv.config();

// Set App port
app.set('port', process.env.PORT || 3000);

// Start App
app.listen(app.get('port'), () => {
  console.log(`Listening on port: ${app.get('port')}`);
});
