var db = require('../models')

// CREATE note
// todo: validate input
exports.create = function (req, res) {
    var note = req.body
    db.Note.create({body: note.body})
    .success(function (note) {
        res.json({id: note.id})
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
    db.Note.find(req.params.id)
    .success(function (note) {
        note.updateAttributes({
            body: req.body.body
        })
        .success(function () {
            res.json({id: note.id})
        })
    })
}

// DELETE note
exports.delete = function (req, res) {
    db.Note.find(req.params.id)
    .success(function (note) {
        var id = note.id
        note.destroy().success(function () {
            res.json({id: id})
        })
    })
}
