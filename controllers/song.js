const fs = require('fs');
const path = require('path');

// Models
const songModel = require('../models/song');

saveSong = (req, res) => {
  const song = new songModel();
  const { number, name, duration, album } = req.body;

  song.number = number;
  song.name = name;
  song.duration = duration;
  song.file = 'null';
  song.album = album;

  song.save((err, newSong) => {
    if (err) {
      res.status(500).send({ error: err });
    }
    if (!newSong) {
      res.status(404).send({ error: "Song couldn't be saved" });
    }
    res.status(200).send({ song: newSong });
  });
};

getSong = (req, res) => {
  const query = { _id: req.params.id };
  const populate = { path: 'album' };

  songModel.findOne(query).populate(populate).exec((err, song) => {
    if (err) {
      res.status(500).send({ error: err });
    }
    if (!song) {
      res.status(404).send({ message: 'Song not found' });
    }
    res.status(200).send({ song });
  });
};

getSongList = (req, res) => {

  const { album } = req.params;
  const query = { album: album };

  songModel.find(query).sort('number').exec((err, songsList) => {
    if (err) {
      res.status(500).send({ error: 'Request error' });
    }
    if (!songsList) {
      res.status(404).send({ error: 'There are not songs' });
    }
    res.status(200).send({ songsList });

  });
};

updateSong = (req, res) => {
  const query = { _id: req.params.id };
  const options = { new: true };
  const update = req.body;

  songModel.findOneAndUpdate(query, update, options, (err, songUpdated) => {
    if (err) {
      res.status(500).send({ error: err });
    }
    if (!songUpdated) {
      res.status(404).send({ message: "Song couldn't be updated" });
    }
    res.status(200).send({ message: 'Song updated', song: songUpdated });
  });
};

deleteSong = (req, res) => {

  const songQuery = { _id: req.params.id };
  songModel.findOneAndRemove(songQuery, (err, songDeleted) => {
    if (err) {
      return res.status(500).send({ error: 'Error deleting song' });
    }
    if (!songDeleted) {
      return res.status(404).send({ message: "Song couldn't be deleted" });
    }
    res.status(200).send({ message: "Song deleted", song: songDeleted });
  });
};


uploadFile = (req, res) => {

  if (req.files.file) {
    const file_path = req.files.file.path;
    const file_split = file_path.split('/');
    const file_name = file_split[2];

    const ext = file_name.split('.');
    const file_ext = ext[1];

    if (file_ext == 'mp3' || file_ext == 'ogg') {
      const query = { _id: req.params.id };
      const update = { file: file_name };
      const options = { new: true };
      songModel.findOneAndUpdate(query, update, options, (err, songUpdated) => {
        if (!songUpdated) {
          res.status(404).send({ error: "Song couldn't be updated" });
        } else {
          res.status(200).send({ message: 'Song updated', song: songUpdated });
        }
      });

    } else {
      res.status(200).send({ message: 'The file is not a song' });
    }

  } else {
    res.status(200).send({ message: 'You have not uploaded any song' });
  }
};

getSongFile = (req, res) => {
  const imageFile = req.params.songFile;
  const pathFile = './uploads/songs/' + imageFile;

  fs.exists(pathFile, (exits) => {
    if (exits) {
      res.sendFile(path.resolve(pathFile));
    } else {
      res.status(200).send({ message: 'Song does not exist' });
    }
  });
};

module.exports = {
  saveSong,
  getSong,
  getSongList,
  updateSong,
  deleteSong,
  uploadFile,
  getSongFile
};