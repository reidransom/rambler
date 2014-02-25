var db = require('../models')

exports.index = function (req, res) {
    db.Note.findAndCountAll({
        offset: 0,
        limit: 5
    })
    .success(function (notes) {
    	console.log(app.app.get('buildroot'))
    	res.render('index', {
    		initdata: JSON.stringify(notes.rows),
    		url: '/'
    	})
    })
}
