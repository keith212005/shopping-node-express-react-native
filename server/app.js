/* eslint-disable no-undef */
require('./src/config/createDB');
var cors = require('cors');
const express = require('express');
const app = express();
app.use(express.json());
app.use(cors());
const db = require('./src/services/db');

// Set up Global configuration access
const dotenv = require('dotenv');
dotenv.config();
let PORT = process.env.PORT || 5000;

console.log(process.env.API_URL);

app.get(`/api`, (req, res) => res.send('API works....'));
app.post(`/api/register`, db.register);
app.post(`/api/authenticate`, db.authenticate);

app.listen(PORT, () => {
  console.log(`Server is up and running on ${PORT} ...`);
});
