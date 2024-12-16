require('dotenv').config();
const express = require('express');
const routes = require('./controllers/routes');
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json()); // Middleware to parse JSON request bodies
app.use('/api/blogs', routes); // Define route for blog endpoints

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
