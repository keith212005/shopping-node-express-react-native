const Pool = require('pg').Pool;
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'shopify',
  password: 'admin',
  port: 5432,
});

const getUsers = (request, response) => {
  pool.query('Select * from users order by id asc', (error, result) => {
    if (error) throw error;
    response.status(200).json(result.rows);
  });
};

const getUserById = (request, response) => {
  const id = parseInt(request.params.id);
  pool.query('Select * from users where id=$1', [id], (error, result) => {
    if (error) throw error;
    response.status(200).json(result.rows);
  });
};

const createUser = (request, response) => {
  const { name, email } = request.body;
  pool.query(
    'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
    [name, email],
    (error, result) => {
      if (error) {
        const err = { code: error.code, detail: error.detail };
        response.status(500).send(err);
        return;
      }
      response.status(201).send(`User added with ID: ${result}`);
    }
  );
};

const updateUser = (request, response) => {
  const id = parseInt(request.params.id);
  const { name, email } = request.body;

  pool.query(
    'UPDATE users SET name = $1, email = $2 WHERE id = $3',
    [name, email, id],
    (error, result) => {
      if (error) throw error;
      response.status(200).send(`User modified with ID: ${id}`);
    }
  );
};

const deleteUser = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
    if (error) throw error;
    response.status(200).send(`User deleted with ID: ${id}`);
  });
};

module.exports = { getUsers, getUserById, createUser, updateUser, deleteUser };