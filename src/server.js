const express = require('express');
const { getInfo } = require('./index.js');
const app = express();

app.disable('x-powered-by');

// ==============================================
// SERVE REQUESTS FOR /
app.get('/', getInfo);

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Revenues API server started on port ${PORT}`)
});
