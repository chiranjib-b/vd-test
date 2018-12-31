const pg = require('pg');

if (typeof process.env.PGPASSWORD === 'undefined'){
  console.error('Environment variable PGPASSWORD is not set.');
  process.exit(1);
}

const pool = new pg.Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: `${process.env.PGPASSWORD}`,
  max: 10,
  port: '5432'
});

module.exports = pool;

const exit_hook = require('exit-hook');

exit_hook(()=> {
  console.log('Process Terminating. Closing connection pool.');
  pool.end();
});