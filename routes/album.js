'use strict';

const express = require('express');
const albumController = require('../controllers/album');
const auth = require('../middleware/auth');

const multipart = require('connect-multiparty');
const upload = multipart({ uploadDir: './uploads/albums' });

const api = express.Router();

const { ensureAuth } = auth;
const { getAlbumList, saveAlbum, getAlbum, updateAlbum, deleteAlbum, uploadImage, getImageFile } = albumController;

// GET
api.get('/album-list/:page?/:artist?', ensureAuth, getAlbumList);
api.get('/album/:id', ensureAuth, getAlbum);
api.get('/get-image-album/:imageFile', ensureAuth, getImageFile);

// POST 
api.post('/album', ensureAuth, saveAlbum);
api.post('/upload-image-album/:id', [ensureAuth, upload], uploadImage);

// PUT 
api.put('/album/:id', ensureAuth, updateAlbum);

// DELETE 
api.delete('/album/:id', ensureAuth, deleteAlbum);



module.exports = api;