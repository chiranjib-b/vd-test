const request = require('supertest');
const app = require('../app');

var keyname = `VD-TEST${new Date().getTime()}`;
var values = [
  {[keyname]: '1'},
  {[keyname]: '2'},
  {[keyname]: '3'},
  {[keyname]: '4'},
  {[keyname]: '1'},
  {[keyname]: '2'},
  {[keyname]: '3'},
  {[keyname]: '4'},
  {[keyname]: '5'}
];

var num = 0;

values.forEach(keyval => {
  describe('POST /object', function () {
	it('Creates a key-value in store', function (done) {
	  request(app)
		.post('/object')
		.send(keyval)
		.set('Accept', 'application/json')
		.expect('Content-Type', /json/)
		.expect(200)
		.end((err, res) => {
		  if (err)
			return done(err);
		  var ts = JSON.parse(res.text).timestamp;
		  request(app)
			.get(`/object/${keyname}`)
			.query({'timestamp':`${ts}`})
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(200)
			.end((err, res) => {
			  if (err)
				return done(err);
			  // check if stored value matches for key
			  num++;
			  if (res.body.value === keyval[keyname]){
				done();
				if (num === values.length){
				  console.log(`Deleting key ${keyname}`);
				  request(app)
					.post('/deleteobject')
					.send({keyname:`${keyname}`})
					.set('Accept', 'application/json')
					.expect('Content-Type', /json/)
					.expect(200)
					.end((err, res) => {
					  process.exit(0);
					});
				}
			  }
			  else {
				throw 'Failed test.';
			  }
			});
		});
	});
  });
});