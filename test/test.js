var request = require('supertest')
  , express = require('express');

var app = express();

app.get('/user', function(req, res){
  res.send(200, { name: 'tobi' });
});

describe('GET /users', function(){
  it('respond with json', function(done){
    request(app)
      .get('/user')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      //.expect('Content-Length', '20')
      .expect(200)
      .end(function(err, res) {
        //console.log(res.body)
        done()
      });
  })
})