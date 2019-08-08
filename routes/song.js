'use strict';

const express = require('express');
const songController = require('../controllers/song');
const auth = require('../middleware/auth');

const multipart = require('connect-multiparty');
const upload = multipart({ uploadDir: './uploads/songs' });

const api = express.Router();

const { ensureAuth } = auth;
const { getSongList, saveSong, getSong, updateSong, deleteSong, uploadFile, getSongFile } = songController;

// GET
api.get('/song-list/:album?', ensureAuth, getSongList);
api.get('/song/:id', ensureAuth, getSong);
api.get('/get-file-song/:songFile', ensureAuth, getSongFile);

// POST 
api.post('/song', ensureAuth, saveSong);
api.post('/upload-file-song/:id', [ensureAuth, upload], uploadFile);

// PUT 
api.put('/song/:id', ensureAuth, updateSong);

// DELETE 
api.delete('/song/:id', ensureAuth, deleteSong);


module.exports = api;