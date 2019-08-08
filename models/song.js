'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SongSchema = Schema({
    number: {
        type: String,
        required: [true, 'Number is required']
    },
    name : {
        type: String,
        required: [true, 'name is required']
    },
    duration: {
        type: String,
        required: [true, 'duration is required']
    },
    file: String,
    album: { 
        type: Schema.ObjectId,
        ref: 'Album',
        required: [true, 'Album ID is required']
    },
});

module.exports = mongoose.model('Song', SongSchema);