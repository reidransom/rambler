#!/usr/bin/env node
var models = require('../models')
models.initTables(function () {
    console.log('created stuff')
    process.exit(0)
})
