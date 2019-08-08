'use strict'

const mongoose = require('mongoose');
const app = require('./app');
const port = process.env.port || 3977;

const mongoUrl = 'mongodb://localhost:27017/spotify_mini';
const options = { useNewUrlParser: true };

mongoose.connect(mongoUrl, options, (err, res) => {
    if (err) {
        throw err;
    } else {
        console.log('Coneected to DB');
        app.listen(port, () => console.log('Server is running at port ', port));
    }
});