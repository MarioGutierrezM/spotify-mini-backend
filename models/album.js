'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AlbumSchema = Schema({
    title : {
        type: String,
        required: [true, 'Title is required'] 
    },
    description: String,
    year: Number,
    image: String,
    artist: {
        type: Schema.ObjectId,
        ref: 'Artist',
        required: [true, 'Artist ID is required']
    }
});

module.exports = mongoose.model('Album', AlbumSchema);