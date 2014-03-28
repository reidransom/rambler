/* jshint node: true */

var bcrypt = require('bcrypt'),
    iuser  = {
        username: 'admin',
        password: 'password'
    }

module.exports = function (sequelize, DataTypes) {
	
    var User = sequelize.define('User', {
            username: {
                type: DataTypes.STRING,
                unique: true
            },
            password: DataTypes.STRING
        })

    User.findById = function (id, fn) {
        User.find(id).success(function (user) {
            if (user) {
                fn(null, user)
            }
            else {
                fn(new Error('User ' + id + ' does not exist'))
            }
        })
    }
    User.findByUsername = function (username, fn) {
        User.find({where: {username: username}}).success(function (user) {
            if (user) {
                return fn(null, user)
            }
            else {
                return fn(null, null)
            }
        })
    }

    function createAdmin () {
        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(iuser.password, salt, function (err, hash) {
                User.create({
                    username: iuser.username,
                    password: hash
                }).success(function (user) {
                    console.log('Created initial user "admin".')
                    console.log(user.values)
                })
            })
        })
    }

    sequelize.sync().success(function () {
        
        User.findByUsername(iuser.username, function (err, user) {
            if (user) {
                console.log('established database')
            }
            else {
                console.log('virgin database - need to create admin user')
                createAdmin()
            }
        })

    })
	return User
}
