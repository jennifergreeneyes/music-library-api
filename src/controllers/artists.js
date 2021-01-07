const { Artist } = require("../models");

const create = (req, res) => {
  Artist.create(req.body).then((artist) => res.status(201).json(artist));
};

const list = (req, res) => {
  Artist.findAll().then((artists) => res.status(200).json(artists));
};

const getArtistByID = (req, res) => {
  const { artistID } = req.params;
  Artist.findByPK(artistID).then((artist) => {
    if (!artist) {
      res.status(404).json({ error: "The artist could not be found." });
    } else {
      res.status(200).json(artist);
    }
  });
};

const updateGenre = (req, res) => {
    const { id } = req.params;
    Artist.update(req.body, { where: { id } }).then(([numofRowsUpdated]) => {
       if(numofRowsUpdated === 0){
         res.status(404).json({ error: "The artist does not exist."});
       } else {
         res.status(200).json([numofRowsUpdated]);
       }
    });
};


module.exports = { create, list, getArtistByID, updateGenre };
