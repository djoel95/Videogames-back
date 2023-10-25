
import { config } from 'dotenv';
import { Sequelize } from 'sequelize';
import { Videogame as VideogameModel, Genre as GenreModel, Platform as PlatformModel } from '../models/index.js';


config();
const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME } = process.env;
export const database = new Sequelize(
  `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`,
  { logging: false, native: false }
);

VideogameModel(database);
GenreModel(database);
PlatformModel(database);

export const { Videogame, Genre, Platform } = database.models;

Videogame.belongsToMany(Genre, {
  through: "videogames_genres",
  as: "genres",
  foreignKey: "genre_id",
  timestamps: false,
});
Genre.belongsToMany(Videogame, {
  through: "videogames_genres",
  as: "videogames",
  foreignKey: "videogame_id",
  timestamps: false,
});

Videogame.belongsToMany(Platform, {
  through: "videogames_platforms",
  as: "platforms",
  foreignKey: "platform_id",
  timestamps: false,
});
Platform.belongsToMany(Videogame, {
  through: "videogames_platforms",
  as: "videogames",
  foreignKey: "videogame_id",
  timestamps: false,
});
