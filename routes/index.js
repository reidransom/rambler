var db = require('../models')

exports.index = function (req, res) {
    db.Note.findAndCountAll({
        offset: 0,
        limit: 5
    })
    .success(function (notes) {
    	res.render('index', {
    		initdata: JSON.stringify(notes.rows)
    	})
    })
}