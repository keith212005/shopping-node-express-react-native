const Pool = require('pg').Pool;
const jwt = require('jsonwebtoken');
const isEmpty = require('lodash').isEmpty;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'shopify',
  password: 'admin',
  port: 5432,
});
const { getHashForPassword, isPasswordMatch } = require('../utils/index');

const login = async (req, res) => {
  const { username, password } = req.body;
  const user = await getUserByEmail(username);
  if (isEmpty(user)) {
    return res
      .status(200)
      .send({ success: false, message: 'Account does not exists' });
  }

  try {
    const isAuthenticated = await isPasswordMatch(password, user.password);
    if (!isAuthenticated) {
      return res.status(200).send({ message: 'Incorrect password.' });
    }
    const users = { name: username };
    const accessToken = generateAccessToken(users);
    const refreshToken = generateRefreshToken(users);
    storeRefreshTokenInDB(refreshToken, username); // storing refreshToken in DB
    res.status(200).send({
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
    return;
  } catch (error) {
    console.log('err in .login', error);
    res.sendStatus(500);
  }

  res.end();
};

// get refreshToken from the user in request body
const logout = (req, res) => {
  const refreshToken = req.body.token;
  deleteRefreshTokenFromDB(refreshToken).then(() => {
    res.status(200).send({ success: true, message: 'User logout successful.' });
  });
};

// Attach middleware for JWT authorization
const getTodos = async (req, res) => {
  const email = req.body.username;
  const todos = await getTodosFromDB(email);

  if (isEmpty(todos))
    return res
      .status(200)
      .send({ success: false, message: 'No record found.' });

  res.status(200).send({ success: true, data: todos });
};

// delete Todod
const deleteTodo = async (req, res) => {
  const todoId = req.body.id;
  deleteTodoFromDB(todoId).then(() =>
    res.status(200).send({ success: true, message: 'Record deleted.' })
  );
};

// update todo
const updateTodo = (req, res) => {
  updateTodoInDB(req.body).then(() => res.status(200).send('Record updated.'));
};

// Get user info
const getUserInfo = (req, res) => {
  const { username } = req.body;
  console.log('username from client>>>>', username);
  getUserByEmail(username).then((user) => {
    console.log('userInfo>>>>>', user);
    if (isEmpty(user))
      return res.status(200).send({ message: 'No Record found' });
    res.status(200).send({ success: true, data: user });
  });
};

const register = async (request, response) => {
  const { firstName, lastName, email, password } = request.body;

  // password comming in the request needs to be hashed before storing in DB
  const hashedPassword = await getHashForPassword(password);
  // fire insert query
  pool.query(
    'INSERT INTO users (f_name,l_name,email,password,role) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [firstName, lastName, email, hashedPassword, 'U'],
    (error) => {
      // returning general error but have separation concern about same email used error send response
      if (error) {
        const err = { code: error.code, detail: error.detail };
        return response.status(500).send(err);
      }

      const data = {
        success: true,
        message: 'User registered successfully.',
      };
      response.status(200).send(data);
    }
  );
};

async function getUserByEmail(email) {
  return new Promise((resolve, reject) => {
    pool.query(
      `Select * from users where email=$1`,
      [email],
      (error, result) => {
        if (error) reject(error);
        const userInfo = result && result.rows[0];
        resolve(userInfo);
      }
    );
  });
}

function storeRefreshTokenInDB(token, email) {
  pool.query(
    `update users set refresh_token=$1 where email=$2`,
    [token, email],
    (err) => {
      if (err) console.log('error storing refreshToken ', err);
    }
  );
}

function deleteRefreshTokenFromDB(token) {
  return new Promise((resolve) => {
    pool.query(
      `update users set refresh_token=null where refresh_token=$1`,
      [token],
      (err) => {
        if (isEmpty(err)) resolve();
      }
    );
  });
}

function getTodosFromDB(email) {
  return new Promise((resolve) => {
    getUserByEmail(email).then((result) => {
      pool.query(
        `select * from todo where user_id=$1;`,
        [result.id],
        (err, result2) => resolve(result2.rows)
      );
    });
  });
}

function deleteTodoFromDB(id) {
  return new Promise((resolve) => {
    pool.query(`delete from todo where id=$1;`, [id], (err, result2) =>
      resolve(result2.rows)
    );
  });
}

function updateTodoInDB(todo) {
  return new Promise((resolve) => {
    const { id, task, due_date, done } = todo;
    pool.query(
      `update todo set task=$1, due_date=$2, done=$3 where id=$4;`,
      [task, due_date, done, id],
      (err, result2) => resolve(result2.rows)
    );
  });
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
}

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_SECRET_EXPIRY,
  });
}

function generateRefreshToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_REFRESH);
}
module.exports = {
  pool,
  login,
  logout,
  register,
  getTodos,
  deleteTodo,
  updateTodo,
  authenticateToken,
  getUserInfo,
};
