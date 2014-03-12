/* globals $, Backbone, _ */

// This is *very* similar to [todos.js](http://backbonejs.org/docs/todos.html).
(function (window) {

    function timestamp_now () {
        return (new Date()).getTime()
    }

    function scrollTo(el) {
        window.scroll(0, el.offset().top)
    }

    // ## NOTE MODEL
    // The **Note** model with default attributes.
    var Note = Backbone.Model.extend({
        defaults: function () {
            var created = timestamp_now()
            return {
                body: "",
                createdAt: created,
                updatedAt: created
            }
        }
    }),

    // ## NOTE COLLECTION
    NoteList = Backbone.Collection.extend({

        // Reference to this collection's model.
        model: Note,

        // Configuration for [Backbone.sync](http://backbonejs.org/#Sync)
        url: '/note', // grunt-replace

        // The "sort by" attribute.
        comparator: 'createdAt'
    }),

    // Create our global collection of **Notes**.
    Notes = new NoteList(),

    // ## NOTE ITEM VIEW
    NoteView = Backbone.View.extend({

        // The DOM element for a note item.
        tagName: 'li',
        template: _.template($('#note-template').html()),
        events: {
            // Click the delete button to remove a note.
            'click .destroy'  : 'destroy',
            // Click the edit button to edit.
            'click .edit'     : 'edit',
            // Click the done button to close (and save).
            'click .done'     : 'close',
            // Double-click a note to edit.
            'dblclick .view'  : 'edit',
            // Pres ESC to save a note.
            'keypress .input' : 'updateOnEsc'
        },
        // Listen to changes in the model.
        initialize: function () {
            this.listenTo(this.model, 'change', this.render)
            this.listenTo(this.model, 'destroy', this.remove)
        },
        // Render the element when Backbone wants.
        render: function () {
            this.$el.html(this.template(this.model.toJSON()))
            this.$input = this.$('.input')
            this.$('textarea').autosize({append: '\n'})
            return this
        },
        // Remove the model, which will trigger this.remove (set up in initialize (nice and DRY)).
        destroy: function () {
            this.model.destroy()
        },
        // Show the textarea.
        edit: function () {
            // todo: close other notes
            this.$el.addClass('editing')
            this.$input.trigger('autosize.resize')
            this.$input.focus()
        },
        // Done editing the note so save changes.
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
        // This is called for every keypress for the .input textarea.
        updateOnEsc: function (e) {
            // Check if it's the ESC key.
            if (e.keyCode === 27) {
                this.close()
            }
        }
    }),

    // ## THE APPLICATION
    AppView = Backbone.View.extend({
        // This is the top-level DOM element.
        el: $('#notes-app'),
        // Press the "save" button to save a new note.  Todo: make this listen to ESC key instead.
        events: {
            // Pres ESC to save a note.
            'keypress #new-note' : 'createOnEsc',
            'click #test-button' : 'testButtonClick'
        },
        initialize: function (name) {
            // Cache a reference to the new note element.
            this.$newNote = this.$('#new-note')
            this.$newNote.autosize({append: '\n'})
            // Listen to events on the global **Notes** collection.
            this.listenTo(Notes, 'add',   this.addOne)
            this.listenTo(Notes, 'reset', this.addAll)
            this.listenTo(Notes, 'all',   this.render)
            // Load **Notes** from the server.
            // Notes.fetch()
            Notes.reset(data)
            scrollTo(this.$newNote)
        },
        // This is called when a **Note** is added to the **Notes** collection.  It creates the **Note** DOM element and adds it to the list.
        addOne: function (note) {
            var view = new NoteView({model: note})
            this.$('#note-list').append(view.render().el)
        },
        // On app reset, create all the **Note** views.
        addAll: function () {
            Notes.each(this.addOne, this)
        },
        // Create a new **Note** to be saved to the server.
        createOnEsc: function (e) {
            if (e.keyCode !== 27) {
                return
            }
            var body = this.$newNote.val()
            if (!body) {
                return
            }
            Notes.create({body: body})
            this.$newNote.val('')
            scrollTo(this.$newNote)
        },
        testButtonClick: function () {
            Notes.fetch({data: {page: 1}})
        }
    }),

    App, data
    
    window.initNotes = function (initial_data) {
        // Kick things off!
        data = initial_data
        App = new AppView()
    }

})(window);