var db = require('../models')

exports.index = function (req, res) {
    db.Note.findAndCountAll({
        offset: 0,
        limit: 50
    })
    .success(function (notes) {
    	res.render('index', {
    		initial_data: JSON.stringify(notes.rows)
    	})
    })
}
