const bcrypt = require('bcrypt');
const saltRounds = 10;

const getHashForPassword = (myPlaintextPassword) => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(myPlaintextPassword, saltRounds, function (err, hash) {
      if (err) reject(err);
      resolve(hash);
    });
  });
};

const isPasswordMatch = (password, hash) => {
  return new Promise((resolve) => {
    bcrypt.compare(password, hash).then((result) => resolve(result));
  });
};

module.exports = {
  getHashForPassword,
  isPasswordMatch,
};
