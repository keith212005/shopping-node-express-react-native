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
  const { f_name, l_name, email, password, role } = request.body;
  pool.query(
    'INSERT INTO users (f_name,l_name,email,password,role) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [f_name, l_name, email, password, role],
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

const updateUser = (req, res) => {
  const id = parseInt(req.params.id);
  const { f_name, l_name, email, password, role } = req.body;
  pool.query(
    'UPDATE users SET f_name=$1, l_name=$2, email=$3, password=$4, role=$5 WHERE id=$6',
    [f_name, l_name, email, password, role, id],
    (error, result) => {
      if (error) {
        const err = { code: error.code, detail: error.detail };
        res.status(200).send(err);
      }
      res.status(200).send(`User modified with ID: ${id}`);
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
