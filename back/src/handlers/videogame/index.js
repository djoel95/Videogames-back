import { createVideoGame, getVideogameById, getVideogameByName, getAllGames } from '../../controllers/videogame/index.js';

// Handlers de GET
export const getVideogamesHandler = async (req, res) => {
  const { name } = req.query;
  const results = name ? await getVideogameByName(name) : await getAllGames();

  res.send(results);
};

export const getVideogameByNameHandler = async (req, res) => {
  const { name } = req.query.name;
  const source = isNaN(name) ? "db" : "api";
  try {
    const videoGame = await getVideogameByName(name, source);
    res.status(200).json(videoGame);

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export const getVideogameByIdHandler = async (req, res) => {
  const { id } = req.params;
  const source = isNaN(id) ? "db" : "api";
  try {
    const videoGame = await getVideogameById(id, source);
    res.status(200).json(videoGame);

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Handler de POST
export const postVideogamesHandler = async (req, res) => {
  const { name, description, platforms, image, released, rating, genres } = req.body;
  try {
    if (!name || !description || !platforms || !image || !released || !rating || !genres) throw Error("Missing data");
    const newVideoGame = await createVideoGame(name, description, image, released, rating, genres, platforms);
    res.status(201).json({message: "Videojuego creado exitosamente", data: newVideoGame});
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
