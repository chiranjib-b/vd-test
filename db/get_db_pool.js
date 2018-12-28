const pg = require('pg');

const pool = new pg.Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'P@$$W0rd',
  max: 10,
  port: '5432'
});

module.exports = pool;

const exit_hook = require('exit-hook');

exit_hook(()=> {
  console.log('Process Terminating. Closing connection pool.');
  pool.end();
});