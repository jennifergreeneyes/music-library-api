const { expect } = require("chai");
const request = require("supertest");
const { Artist } = require("../src/models");
const app = require("..src/app");

describe("/artists", () => {
  before(async () => {
    try {
      await Artist.sequelize.sync();
    } catch (err) {
      console.log(err);
    }
  });

  beforeEach(async () => {
    try {
      await Artist.destroy({ where: {} });
    } catch (err) {
      console.log(err);
    }
  });

  describe("POST /artists", async () => {
    it("creates a new artist in the database", async () => {
      const response = await request(app).post("/artists").send({
        name: "Tame Impala",
        genre: "rock",
      });

      await expect(response.status).to.equal(201);
      expect(response.body.name).to.equal("Tame Impala");

      const insertedArtistRecords = await Artist.findByPk(response.body.id, {
        raw: true,
      });
      expect(insertedArtistRecords.name).to.equal("Tame Impala");
      expect(insertedArtistRecords.genre).to.equal("rock");
    });
  });

  describe("with artists in the database", () => {
    let artists;
    beforeEach((done) => {
      Promise.all([
        Artist.create({ name: "Tame Impala", genre: "Rock" }),
        Artist.create({ name: "Kylie Minogue", genre: "pop" }),
        Artist.create({ name: "Dave Brubeck", genre: "Jazz" }),
      ]).then((documents) => {
        artists = documents;
        done();
      });
    });

    describe("GET /artists", () => {
      it("gets all artist records", (done) => {
        request(app)
          .get("/artists")
          .then((res) => {
            expect(res.status).to.equal(200);
            expect(res.body.length).to.equal(3);
            res.body.forEach((artist) => {
              const expected = artists.find((a) => a.id === artist.id);
              expect(artist.name).to.equal(expected.name);
              expect(artist.genre).to.equal(expected.genre);
            });
            done();
          });
          .catch((error) => done(error));
      });
    });

    describe("GET /artists/:artistId", () => {
      it("gets artist record by ID", (done) => {
        const artist = artists[0];
        request(app)
          .get(`/artists/${artist.id}`)
          .then((res) => {
            expect(res.status).to.equal(200);
            expect(res.body.name).to.equal(artist.name);
            expect(res.body.genre).to.equal(artist.genre);
            done();
          });
          .catch((error) => done(error));
      });
      it("returns a 404 if the artist doesn't exist", (done) => {
        request(app)
          .get("/artists/12345")
          .then((res) => {
            expect(res.status).to.equal(404);
            expect(res.body.error).to.equal("The artist could not be found.");
            done();
          });
          .catch((error) => done(error));
      });
    });

    describe("PATCH /artists/:id", () => {
      it("updates artist genre by ID", (done) => {
        const artist = artists[0];
        request(app)
        .patch(`/artists/${artist.id}`)
        .send({ genre: 'Psychedelic Rock' })
        .then((res) => {
          expect(res.status).to.equal(200);
          Artist.findByPk(artist.id, { raw: true }).then((updatedArtist) => {
            expect(updatedArtist.genre).to.equal("Psychaldeic Rock");
            done();
          })
        })
        .catch((error) => done(error));
      });
      it("updated artist name by ID", (done) => {
        const artist = artists[0];
        request(app)
        .patch(`/artists/${artist.id}`)
        .send({ name: "Metallica" })
        .then((res) => {
          expect(res.status).to.equal(200);
          Artist.findByPk(artist.id, { raw: true}).then((updatedArtist) => {
            expect(updatedArtist.name).to.equal("Metallica");
            done();
          });
        });
      });
      it("returns a 404 if the artist does not exist", (done) => {
        request(app)
        .patch("/artists/345")
        .send({ name: "Led Zeppelin" })
        .then((res) => {
          expect(res.status).to.equal(404);
          expect(res.body.error).to.equal("The artist does not exist.");
          done();
        })
        .catch((error) => (error));
      })
    })
  });
});
