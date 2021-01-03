const express = require('express');

const app = express();

app.use(express.json());

const artistControllers = require('./controllers/artists');

app.post('artists', artistControllers.create);

app.get('/artists', artistControllers.list);

app.get('/artists/:artistID', artistControllers.getArtistByID);

module.exports = app;