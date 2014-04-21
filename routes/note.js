var db = require('../models')

// CREATE note
// todo: validate input
exports.create = function (req, res) {
    var note = req.body
    new db.Note({
        body: note.body
    })
    .save()
    .then(function (note) {
        res.json({
            id: note.get('id')
        })
    })
}

// READ notes
exports.readPage = function (req, res) {
    var page = 0
    if (req.query.page) {
        page = req.query.page*1
    }
    dataPage(page, function (notes) {
        res.json(notes.rows)
    })
}

// READ note
exports.readId = function (req, res) {
    var id = req.params.id
    db.Note.find(id)
    .success(function (note) {
        res.json(note)
    })
}

// UPDATE note
// todo: validate input
exports.update = function (req, res) {
    new db.Note({id: req.params.id})
    .save({body: req.body.body}, {patch: true})
    .then(function (note) {
        res.json({id: note.id})
    })
}

// DELETE note
exports.delete = function (req, res) {
    new db.Note({id: req.params.id})
    .destroy()
    .then(function () {
        res.json({id: req.params.id})
    })
}
