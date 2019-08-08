const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwtService = require('../services/jwt');


userTest = (req, res) => {
  res.status(200).send({ msg: 'Probando controller de usuario' });
};

saveUser = async (req, res) => {
  const user = new User();
  const { name, surname, email, password, role, image } = req.body;

  user.name = name;
  user.surname = surname;
  user.email = email;
  user.role = 'ROLE_USER';
  user.image = 'null';

  if (password) {
    // encriptar pass
    const saltRounds = 10;

    bcrypt.genSalt(saltRounds, (err, salt) => {
      bcrypt.hash(password, salt, (err, hash) => {
        user.password = hash;

        // guardar usuario
        user.save((err, userStored) => {
          if (err) {
            res.status(500).send({ msg: err });
          } else {
            res.status(200).send({ user: userStored });
          };
        });

      });
    });
  } else {
    res.status(400).send({ msg: 'Password is required' });
  }
};

loginUser = (req, res) => {
  const { email, password, getHash } = req.body;

  User.findOne({ email: email.toLowerCase() }, (err, userFind) => {
    if (err) {
      res.status(400).send({ error: err });
    } else {
      if (!userFind) {
        res.status(400).send({ error: 'User does not exist' });
      } else {
        // compare passwords
        bcrypt.compare(password, userFind.password, (err, check) => {
          if (check) {
            // regresar datods de usuario
            if (getHash) {
              res.status(200).send({ token: jwtService.createToken(userFind) });
            } else {
              res.status(200).send({ user: userFind, token: jwtService.createToken(userFind) });
            }
          } else {
            res.status(404).send({ error: 'User could not log in' });
          }
        });
      }
    }
  });
};

updateUser = (req, res) => {
  const query = { _id: req.params.id };
  const update = req.body;
  const options = { new: true };

  if ( req.params.id !== req.user.sub) { // last change
    return res.status(500).send({ error: "You don't have permission to update this user" });
  }

  User.findOneAndUpdate(query, update, options, (err, userUpdated) => {
    if (err) {
      res.status(500).send({ error: err });
    }
    if (!userUpdated) {
      res.status(404).send({ error: "User couldn't be updated" });
    } else {
      res.status(200).send({ message: 'User updated', user: userUpdated });
    }
  });
};

getUsers = (req, res) => {
  User.find({}, (err, users) => {
    if (err) {
      res.status(400).send({ error: err });
    }
    res.status(200).send({ users });
  });
};

uploadImage = (req, res) => {

  console.log(req);
  if (req.files && req.files.image) {
    
    const file_path = req.files.image.path;
    const file_split = file_path.split('/');
    const file_name = file_split[2];

    const ext = file_name.split('.');
    const file_ext = ext[1];

    if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {
      const query = { _id: req.params.id };
      const update = { image: file_name };
      const options = { new: true };
      User.findOneAndUpdate(query, update, options, (err, userUpdated) => {
        if (!userUpdated) {
          res.status(404).send({ error: "User couldn't be updated" });
        } else {
          res.status(200).send({ userUpdated });
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
  const pathFile = './uploads/users/' + imageFile;

  fs.exists(pathFile, (exits) => {
    if (exits) {
      res.sendFile(path.resolve(pathFile));
    } else {
      res.status(200).send({ message: 'Image does not exist' });
    }
  });
};

module.exports = {
  userTest,
  saveUser,
  loginUser,
  updateUser,
  getUsers,
  uploadImage,
  getImageFile
};