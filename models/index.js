'use strict';

//Database
const Sequelize = require('sequelize')
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'gameArtDB.sqlite',
    retry: {
    max: 15
  }
});

const Artist = sequelize.import("./artist.js"); 
const Artwork  = sequelize.import("./artwork.js");
const Users = sequelize.import("./users.js");
const Game  = sequelize.import("./games.js");

// Associations
Game.hasMany(Artist, {foreignKey: "game_id", as: "Gamez"});
Game.hasMany(Artwork, {foreignKey: "game_id", as: "Games"});

Artist.hasMany(Artwork, {foreignKey: "artist_id", as: "Artists"});

Artwork.belongsTo(Artist, {foreignKey: "artist_id"});
Artwork.belongsTo(Game, {foreignKey: "game_id"});
Artist.belongsTo(Game, {foreignKey: "game_id"});

module.exports = {
    Artist, Artwork, Users, Game
};