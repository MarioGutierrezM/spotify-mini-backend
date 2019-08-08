'use strict';

const express = require('express');
const UserController = require('../controllers/user');
const  auth = require('../middleware/auth');

const multipart = require('connect-multiparty');
const upload = multipart({ uploadDir: './uploads/users' });

const api = express.Router();

api.get('/test', auth.ensureAuth, UserController.userTest);
api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);
api.put('/update-user/:id', auth.ensureAuth, UserController.updateUser);
api.get('/user-list', UserController.getUsers);
api.post('/upload-image-user/:id', [auth.ensureAuth, upload], UserController.uploadImage);
api.get('/get-image-user/:imageFile', UserController.getImageFile);

module.exports = api;