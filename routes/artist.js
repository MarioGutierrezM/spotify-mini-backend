'use strict';

const express = require('express');
const artistController = require('../controllers/artist');
const auth = require('../middleware/auth');

const multipart = require('connect-multiparty');
const upload = multipart({ uploadDir: './uploads/artist' });

const api = express.Router();

const { ensureAuth } = auth;
const { getArtistList, saveArtist, getArtist, updateArtist, deleteArtist, uploadImage, getImageFile } = artistController;

// GET
api.get('/artist-list/:page?', ensureAuth, getArtistList);
api.get('/artist/:id', ensureAuth, getArtist);
api.get('/get-image-artist/:imageFile', getImageFile);

// POST 
api.post('/artist', ensureAuth, saveArtist);
api.post('/upload-image-artist/:id', [ensureAuth, upload], uploadImage);

// PUT 
api.put('/artist/:id', ensureAuth, updateArtist);

// DELETE 
api.delete('/artist/:id', ensureAuth, deleteArtist);



module.exports = api;