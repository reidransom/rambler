/* jshint node: true */

var models = require('../models')

exports.index = function (req, res) {
    models.Note.collection().fetch().then(function (collection) {
        res.render('index', {
            initial_data: JSON.stringify(collection.toJSON()),
            user: req.user
        })
    })
}
