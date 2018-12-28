var express = require('express');
var router = express.Router();

var pool = require('../db/get_db_pool');

router.get('/object/:the_key', (req, res)=> {
  var key = req.params.the_key;
  var query_string = '';
  var functionName = '';
  
  if (typeof req.query.timestamp !== 'undefined'){
	console.log(`Timestamp was passed in request for key '${key}'.`);
	
	var ts = parseInt(req.query.timestamp);
	ts = ts * 1000;
	var dt = new Date(ts);
	dt = getUTCDateString(dt);
	
	query_string = `select vd_fetch_record_by_timestamp('${key}','${dt}');`;
	functionName = 'vd_fetch_record_by_timestamp';
  } else {
	console.log(`Timestamp was not passed in request for key '${key}'.`);
	
	query_string = `select vd_fetch_record('${key}');`;
	functionName = 'vd_fetch_record';
  }
  
  console.log('Firing query: ' + query_string);
  pool.query(query_string, (err, db_res) => {
	if (err){
	  var message = `Failed to fetch details for key '${key}'`;
	  console.error(message);
	  console.error(err);
	  res.status(500).send({'Status' : 'Failure', 'Message' : message});
	  return;
	}
	var ret = db_res.rows[0];
	if (ret[functionName]) {
	  console.log(ret[functionName]);
	  res.send({'value':ret[functionName].vd_value});
	}
	else {
	  res.status(404).send({'Status' : 'Failure', 'Message' : `Key '${key}' not found in store!`});
	}
  });
});

function getUTCDateString(dateObj){
  
  var datestring = dateObj.getUTCFullYear() + "-" +
		  ("0"+(dateObj.getUTCMonth()+1)).slice(-2) + "-" +
		  ("0" + dateObj.getUTCDate()).slice(-2) + " " +
		  ("0" + dateObj.getUTCHours()).slice(-2) + ":" +
		  ("0" + dateObj.getUTCMinutes()).slice(-2) + ":" +
		  ("0" + dateObj.getUTCSeconds()).slice(-2);
  
  return datestring;
}

router.post('/object', (req, res) => {
  var key_val = null;
  try{
	key_val = JSON.parse(JSON.stringify(req.body));
  } catch(exc) {
	console.error('Could not parse body as JSON! => ' + req.body);
	res.status(400).send({'Status' : 'Failure', 'Message' : 'Application expects request body in JSON format!'});
	return;
  }
  
  var keys = Object.keys(key_val);
  
  /* At this point, accepting only one key-pair per request */
  if (keys.length !== 1){
	console.log('Bad request => ' + JSON.stringify(key_val));
	res.status(400).send({'Status' : 'Failure', 'Message' : 'Please pass only one key-value pair in request!'});
	return;
  }
  
  keys.forEach( key => {
	var query = `select vd_insert_record('${key}','${key_val[key]}')`;
	console.log(`Firing query: ${query}`);
	pool.query(query, (err, db_res) => {
	  if (err){
		var message = `Failed to insert details for key '${key}'`;
		console.error(message);
		console.error(err);
		res.status(500).send({'Status' : 'Failure', 'Message' : message});
		return;
	  }

	  var ret = db_res.rows[0].vd_insert_record;
	  if (ret) {
		console.log(ret);
		var dt = new Date(ret.key_timestamp + '+0000');
		dt = dt.getTime() / 1000;
		res.send({
		  "key": ret.vd_key,
		  "value": ret.vd_value,
		  "timestamp": Math.round(dt)
		});
	  }
	  else {
		res.status(500).send({'Status' : 'Failure', 'Message' : `Unable to store Key '${key}'`});
	  }
	});
  });
});

module.exports = router;