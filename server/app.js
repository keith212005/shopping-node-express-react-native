/* eslint-disable no-undef */
require('./src/config/createDB');
var cors = require('cors');
const express = require('express');
const app = express();
app.use(express.json());
app.use(cors());
const db = require('./src/services/database');

// Set up Global configuration access
const dotenv = require('dotenv');
dotenv.config();
let PORT = process.env.PORT || 3001;

console.log(process.env.API_URL);

app.get(`/api`, (req, res) => res.send('API works....'));
app.post(`/api/register`, db.register);
app.post(`/api/login`, db.login);
app.delete(`/api/logout`, db.logout);
app.get(`/api/getTodos`, db.authenticateToken, db.getTodos);
app.delete(`/api/deleteTodo`, db.authenticateToken, db.deleteTodo);
app.post(`/api/updateTodo`, db.authenticateToken, db.updateTodo);

app.listen(PORT, () => console.log(`Server is up and running on ${PORT} ...`));
