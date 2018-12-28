const fs = require('fs');
const path = require('path');

var tableCreated = false;
var funcCreated = false;

var pool = require('./get_db_pool');

var cr_tb_path = path.join(__dirname, 'create_table.sql');
fs.readFile(cr_tb_path, (err, data) => {
  if (err) {
	console.error('Error while creating table!')
	console.error(err);
	process.exit(1);
  }
  pool.query(data.toString(), (err, res) => {
	if (err) {
	  console.error('Error while creating table!')
	  console.error(err);
	  process.exit(1);
	}
	tableCreated = true;
	console.log('Create Table Response:\n' + JSON.stringify(res));
  });
});

var cr_sp_path = path.join(__dirname, 'create_function.sql');
fs.readFile(cr_sp_path, (err, data) => {
  if (err) {
	console.error('Error while creating function!')
	console.error(err);
	process.exit(1);
  }
  pool.query(data.toString(), (err, res) => {
	if (err) {
	  console.error('Error while creating function!')
	  console.error(err);
	  process.exit(1);
	}
	funcCreated = true;
	console.log('Create Procedure Response:\n' + JSON.stringify(res));
  });
});