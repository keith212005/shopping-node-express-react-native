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
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, hash).then(function (result) {
      if (result) resolve(result);
      reject(result);
    });
  });
};

module.exports = {
  getHashForPassword,
  isPasswordMatch,
};
