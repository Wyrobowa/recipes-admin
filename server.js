const express = require('express');

// Configs
const app = express();

app.set('port', 3000);
app.listen(app.get('port'), () => {
  console.log('Listening on port 3000');
});
