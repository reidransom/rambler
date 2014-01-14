/* globals $, Backbone, _ */

$(function () {

    function timestamp_now () {
        return (new Date()).getTime()
    }

    var Note = Backbone.Model.extend({
        defaults: function () {
            var created = timestamp_now()
            return {
                body: "",
                created: created,
                updated: created,
                viewed:  created
            }
        }
    }),

    NoteList = Backbone.Collection.extend({
        model: Note,
        url: '/note',
        comparator: 'created'
    }),

    Notes = new NoteList(),

    NoteView = Backbone.View.extend({
        tagName: 'li',
        template: _.template($('#note-template').html()),
        events: {
            'click .destroy'  : 'destroy',
            'dblclick .view'  : 'edit',
            'keypress .input' : 'updateOnEsc'
        },
        initialize: function () {
            this.listenTo(this.model, 'change', this.render)
            this.listenTo(this.model, 'destroy', this.remove)
        },
        render: function () {
            this.$el.html(this.template(this.model.toJSON()))
            this.$input = this.$('.input')
            return this
        },
        destroy: function () {
            this.model.destroy()
        },
        edit: function () {
            this.$el.addClass('editing')
            this.input.focus()
        },
        close: function () {
            var value = this.$input.val()
            if (!value) {
                this.destroy()
            }
            else {
                this.model.save({body: value})
                this.$el.removeClass('editing')
            }
        },
        updateOnEsc: function (e) {
            console.log(e.keyCode)
            if (e.keyCode === 27) {
                this.close()
            }
        }
    }),

    AppView = Backbone.View.extend({
        el: $('#notes-app'),
        events: {
            'click #save-note': 'saveNote'
        },
        initialize: function () {
            this.$newNote = this.$('#new-note')
            this.listenTo(Notes, 'add',   this.addOne)
            this.listenTo(Notes, 'reset', this.addAll)
            this.listenTo(Notes, 'all',   this.render)
            Notes.fetch()
        },
        addOne: function (note) {
            var view = new NoteView({model: note})
            this.$('#note-list').append(view.render().el)
        },
        addAll: function () {
            Notes.each(this.addOne, this)
        },
        saveNote: function () {
            var body = this.$newNote.val()
            if (!body) {
                return
            }
            Notes.create({body: body})
            this.$newNote.val('')
        }
    }),

    App = new AppView()

})