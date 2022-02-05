// LOCAL IMPORTS

// THIRD PARTY IMPORTS
const pgtools = require('pgtools');
const Pool = require('pg').Pool;
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'shopify',
  password: 'admin',
  port: 5432,
});

const initializeDBAndCreateTables = async () => {
  await createDB();
};
initializeDBAndCreateTables();

function createDB() {
  return new Promise((resolve, reject) => {
    pgtools.createdb(
      {
        user: 'postgres',
        password: 'admin',
        port: 5432,
        host: 'localhost',
      },
      'shopify',
      (err, res) => {
        if (err) {
          // console.error(err);
        }
        // console.log(`createDB function resolved result: ${res}`);
        resolve();
      }
    );
  });
}
