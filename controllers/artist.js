const fs = require('fs');
const path = require('path');
const mongoosePagination = require('mongoose-pagination');

// Models
const artistModel = require('../models/artist');
const albumModel = require('../models/album');
const songtModel = require('../models/song');

saveArtist = (req, res) => {
  const artist = new artistModel();
  const { name, description, image } = req.body;

  artist.name = name;
  artist.description = description;
  artist.image = 'null';

  artist.save((err, newArtist) => {
    if (err) {
      res.status(500).send({ error: err });
    }
    if (!newArtist) {
      res.status(404).send({ error: "Artist couldn't be saved" });
    }
    res.status(200).send({ artist: newArtist });
  });
};

getArtist = (req, res) => {
  const { id } = req.params;
  const query = { _id: id };

  artistModel.findOne(query, (err, artist) => {
    if (err) {
      res.status(500).send({ error: err });
    }
    if (!artist) {
      res.status(404).send({ message: 'Artist not found' });
    }
    res.status(200).send({ artist });
  });
};

getArtistList = (req, res) => {

  const { page } = req.params;
  const pageNum = (page) ? page : 1;
  const itemsPerPage = 8;

  artistModel.find({}).sort('name').paginate(pageNum, itemsPerPage, (err, artistList, totalItems) => {
    if (err) {
      res.status(500).send({ error: 'Request error' });
    }
    if (!artistList) {
      res.status(404).send({ error: 'There is not artists' });
    }
    res.status(200).send({ totalItems, artistList });

  });
};

updateArtist = (req, res) => {
  const query = { _id: req.params.id };
  const options = { new: true };
  const update = req.body;

  artistModel.findOneAndUpdate(query, update, options, (err, artistUpdated) => {
    if (err) {
      res.status(500).send({ error: err });
    }
    if (!artistUpdated) {
      res.status(404).send({ message: "Artist couldn't be updated" });
    }
    res.status(200).send({ message: 'Artist updated', artist: artistUpdated });
  });
};

deleteArtist = (req, res) => {

  // DELETE ARTIST
  const query = { _id: req.params.id };
  artistModel.findOneAndDelete(query, (err, artistDeleted) => {
    if (err) {
      return res.status(500).send({ error: 'Error deleting artist' });
    }
    if (!artistDeleted) {
      return  res.status(404).send({ message: "Artist couldn't be deleted" });
    }

    // DELETE ALBUMS

    const albumQuery = { artist: artistDeleted._id };
    albumModel.find(albumQuery).remove((err, albumDeleted) => {
      if (err) {
        return res.status(500).send({ error: 'Error deleting album' });
      }
      if(!albumDeleted) {
        return res.status(404).send({ message: "Album couldn't be deleted" });
      }

      // DELETE SONGS

      const songQuery = { album: albumDeleted._id };
      songtModel.find(songQuery).remove((err, songDeleted) => {
        if (err) {
          return res.status(500).send({ error: 'Error deleting song' });
        }
        if(!songDeleted) {
          return res.status(404).send({ message: "Song couldn't be deleted" });
        }
        // res.status(200).send({ message: 'Song Deleted', song: songDeleted });
        res.status(200).send({ message: "Artist deleted", artist: artistDeleted });
      });
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
      artistModel.findOneAndUpdate(query, update, options, (err, artistUpdated) => {
        if (!artistUpdated) {
          res.status(404).send({ error: "Artist couldn't be updated" });
        } else {
          res.status(200).send({ message: 'Artist updated', artist: artistUpdated });
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
  const pathFile = './uploads/artist/' + imageFile;

  fs.exists(pathFile, (exits) => {
    if (exits) {
      res.sendFile(path.resolve(pathFile));
    } else {
      res.status(200).send({ message: 'Image does not exist' });
    }
  });
};

module.exports = {
  saveArtist,
  getArtist,
  getArtistList,
  updateArtist,
  deleteArtist,
  uploadImage,
  getImageFile
};