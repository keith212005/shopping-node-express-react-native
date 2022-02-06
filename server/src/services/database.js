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
    return res.status(200).send({ message: 'Account does not exists' });
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
    res.sendStatus(500);
  }
};

// get refreshToken from the user in request body
const logout = (req, res) => {
  const refreshToken = req.body.token;
  deleteRefreshTokenFromDB(refreshToken).then(() => {
    res.status(200).send({ success: true, message: 'User logout success' });
  });
};

// Attach middleware for JWT authorization
const getTodos = async (req, res) => {
  const email = req.body.username;
  const todos = await getTodosFromDB(email);
  console.log('todos>>>>>', todos);

  if (isEmpty(todos))
    return res.status(200).send({ success: false, message: 'No record found' });

  res.status(200).send({ success: true, data: todos });
};

const register = async (request, response) => {
  // console.log('got user data in response>>>>>>', request.body);
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
        response.status(500).send(err);
        return;
      }
      // if record is inserted successfully return data with status 200
      const data = {
        success: true,
        message: 'User registered successfully.',
      };
      response.status(200).send(data);
    }
  );
};

async function getUserByEmail(username) {
  return new Promise((resolve, reject) => {
    pool.query(
      `Select * from users where email='${username}'`,
      (error, result) => {
        if (error) reject(error);
        resolve(result.rows[0]);
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
  getUserByEmail,
  register,
  getTodos,
  authenticateToken,
};
