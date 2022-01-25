const express = require('express');
const app = express();
app.use(express.json());

const db = require('./src/db/queries');

const port = process.env.PORT || 5000;

app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' });
});

app.get('/users', db.getUsers);
app.get('/users/:id', db.getUserById);
app.post('/users', db.createUser);
app.put('/users/:id', db.updateUser);
app.put('/users/:id', db.deleteUser);

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
