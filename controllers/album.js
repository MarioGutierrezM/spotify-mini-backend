const fs = require('fs');
const path = require('path');
// const mongoosePagination = require('mongoose-pagination');

// Models
// const artistModel = require('../models/artist');
const albumModel = require('../models/album');
const songtModel = require('../models/song');

saveAlbum = (req, res) => {
  const album = new albumModel();
  const { title, description, year, image, artist } = req.body;

  album.title = title;
  album.description = description;
  album.year = year;
  album.image = 'null';
  album.artist = artist;

  album.save((err, newAlbum) => {
    if (err) {
      res.status(500).send({ error: err });
    }
    if (!newAlbum) {
      res.status(404).send({ error: "Album couldn't be saved" });
    }
    res.status(200).send({ album: newAlbum });
  });
};

getAlbum = (req, res) => {
  const query = { _id: req.params.id };
  const populate = { path: 'artist' };

  albumModel.findOne(query).populate(populate).exec((err, album) => {
    if (err) {
      res.status(500).send({ error: err });
    }
    if (!album) {
      res.status(404).send({ message: 'Album not found' });
    }
    res.status(200).send({ album });
  });
};

getAlbumList = (req, res) => {

  const { page, artist } = req.params;
  const pageNum = (page) ? page : 1;
  const itemsPerPage = 10;
  const query = (artist) ? { artist: artist } : {};

  albumModel.find(query).sort('year').paginate(pageNum, itemsPerPage, (err, albumList, totalItems) => {
    if (err) {
      res.status(500).send({ error: 'Request error' });
    }
    if (!albumList) {
      res.status(404).send({ error: 'There are not albums' });
    }
    res.status(200).send({ totalItems, albumList });

  });
};

updateAlbum = (req, res) => {
  const query = { _id: req.params.id };
  const options = { new: true };
  const update = req.body;

  albumModel.findOneAndUpdate(query, update, options, (err, albumUpdated) => {
    if (err) {
      res.status(500).send({ error: err });
    }
    if (!albumUpdated) {
      res.status(404).send({ message: "Album couldn't be updated" });
    }
    res.status(200).send({ message: 'Album updated', album: albumUpdated });
  });
};

deleteAlbum = (req, res) => {

  // DELETE ALBUM

  const albumQuery = { _id: req.params.id };
  albumModel.findOneAndRemove(albumQuery, (err, albumDeleted) => {
    if (err) {
      return res.status(500).send({ error: 'Error deleting album' });
    }
    if (!albumDeleted) {
      return res.status(404).send({ message: "Album couldn't be deleted" });
    }

    // DELETE SONGS

    const songQuery = { album: albumDeleted._id };
    songtModel.find(songQuery).remove((err, songDeleted) => {
      if (err) {
        return res.status(500).send({ error: 'Error deleting song' });
      }
      if (!songDeleted) {
        return res.status(404).send({ message: "Song couldn't be deleted" });
      }
      res.status(200).send({ message: "Album deleted", album: albumDeleted });
    });
  });
};


uploadImage = (req, res) => {

  if (req.files.image) {
    const file_path = req.files.image.path;
    const file_split = file_path.split('/');
    const file_name = file_split[2];

    const ext = file_name.split('.');
    const file_ext = ext[1];

    if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {
      const query = { _id: req.params.id };
      const update = { image: file_name };
      const options = { new: true };
      albumModel.findOneAndUpdate(query, update, options, (err, albumUpdated) => {
        if (!albumUpdated) {
          res.status(404).send({ error: "Album couldn't be updated" });
        } else {
          res.status(200).send({ message: 'Album updated', album: albumUpdated });
        }
      });

    } else {
      res.status(200).send({ message: 'The file is not an image' });
    }

  } else {
    res.status(200).send({ message: 'You have not uploaded any image' });
  }
};

getImageFile = (req, res) => {
  const imageFile = req.params.imageFile;
  const pathFile = './uploads/albums/' + imageFile;

  fs.exists(pathFile, (exits) => {
    if (exits) {
      res.sendFile(path.resolve(pathFile));
    } else {
      res.status(200).send({ message: 'Image does not exist' });
    }
  });
};

module.exports = {
  saveAlbum,
  getAlbum,
  getAlbumList,
  updateAlbum,
  deleteAlbum,
  uploadImage,
  getImageFile
};