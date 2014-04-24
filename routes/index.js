/* jshint node: true */

var models = require('../models')

exports.index = function (req, res) {
    if (req.isAuthenticated()) {
	    models.Note.collection().fetch().then(function (collection) {
	        res.render('index', {
	            initial_data: JSON.stringify(collection.toJSON()),
	            user: req.user.toJSON()
	        })
	    })
    }
    else {
    	res.render('marketing')
    }
}

exports.note = require('./note')
exports.user = require('./user')
