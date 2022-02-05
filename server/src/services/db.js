const Pool = require('pg').Pool;
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'shopify',
  password: 'admin',
  port: 5432,
});
const { getHashForPassword, isPasswordMatch } = require('../utils/index');

const authenticate = async (req, res) => {
  const { username, password } = req.body;
  const user = await getUserByEmail(username);
  let isUserAuthenticated;
  try {
    isUserAuthenticated = await isPasswordMatch(password, user.password);
    const data = {
      success: true,
      message: 'Login Successful.',
      token: 'Send some token here',
    };
    if (isUserAuthenticated) {
      res.status(200).send(data);
      return;
    }
  } catch (error) {
    const data = {
      success: false,
      message: 'Login failed.',
    };
    res.status(200).send(data);
  }
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
    (error, result) => {
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

module.exports = {
  pool,
  authenticate,
  getUserByEmail,
  register,
};
