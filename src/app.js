const express = require("express");

const app = express();

app.use(express.json());

const artistControllers = require("./controllers/artists");

const albumControllers = require("./controllers/albums");

app.post("artists", artistControllers.create);

app.get("/artists", artistControllers.list);

app.get("/artists/:artistID", artistControllers.getArtistByID);

app.patch("/artists/:id", artistControllers.update);

app.delete("/artists/:artistId", artistControllers.deleteArtist);

app.post("/artists/:artistId/albums", albumControllers.create);

app.get("/albums", albumControllers.list);

app.get("/artists/:artistId/albums", albumControllers.getAlbumsByArtistId);

app.patch("/albums/:albumId", albumControllers.update);

app.delete("/albums/:albumId", albumControllers.deleteAlbum)

module.exports = app;
