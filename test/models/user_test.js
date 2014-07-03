var assert = require("assert")

var should = require('chai').should()

describe('Array', function(){
  describe('#indexOf()', function(){
    it('should return -1 when the value is not present', function(){
      [1,2,3].indexOf(5).should.equal(-1)
    })
  })
})

var Bookshelf = require('bookshelf'),
    config = require('../../config')

Bookshelf.conn = Bookshelf.initialize(config.database)

var User = require('../../models/user')

describe('User', function() {
    describe('#createUser()', function() {
        it('should create a user in the database without error', function(done) {
            User.createUser({
                username: 'username',
                password: 'password',
                email: 'username@example.com'
            }, done)
        })
    })
    describe('#findById()', function() {
        it('should retrieve a user by id', function(done) {
            User.findById(1, function(err, user) {
                user.attributes.id.should.equal(1)
                done()
            })
        })
    })
    describe('#findByUsername()', function() {
        it('should retrieve a user by username', function(done) {
            User.findByUsername('username', function(err, user) {
                user.attributes.username.should.equal('username')
                done()
            })
        })
    })
})
