require('./src/config/createDB');
const express = require('express');
const app = express();
app.use(express.json());
const db = require('./src/config/db');

app.get(`/api`, (req, res) => res.send('API works....'));

app.get(`/api/users`, db.getUsers);
app.get('/api/users/:id', db.getUserById);
app.post('/api/users', db.createUser);
app.put('/api/users/:id', db.updateUser);
app.delete('/api/users/:id', db.deleteUser);

app.listen(3000, () => {
  console.log(`API running on port 3000.`);
});
