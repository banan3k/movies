const express = require('express');

const app = express();
const port = process.env.PORT || 5000;

app.get('/api/allMovies', (req, res) => {
  res.send({ express: 'Movies following' });
});

app.listen(port, () => console.log(`Listening on port ${port}`));
