import { Op } from 'sequelize';
import { Videogame, Genre, Platform } from '../../bootstrap/index.js';
import axios from 'axios';
import { config } from 'dotenv';


config();

const { API_Key, URL } = process.env;

// Controller post videogame.
// Debe crear un videojuego en la base de datos, y este debe estar relacionado con sus géneros indicados (al menos uno).
const createVideoGame = async (name, description, image, released, rating, genres, platforms) => {
    const found = await Videogame.findOne({ where: { name } });

    if (found) {
        throw new Error("Ya existe un videojuego con ese nombre");
    }
    if (!name || !description || !platforms || !image || !released || !rating || !genres) {
        throw new Error("Todos los campos son obligatorios");
    }
    if (!Array.isArray(genres) || genres.length === 0) {
        throw new Error("Debe seleccionar al menos un género");
    }
    if (!Array.isArray(platforms) || platforms.length === 0) {
        throw new Error("Debe seleccionar al menos una plataforma");
    }
    const releasedDate = new Date(released);

    const videogame = await Videogame.create({ name, description, image, released: releasedDate, rating });
    const genresLQ = await Genre.findAll({
        where: {
            id: {
                [Op.in]: genres,
            },
        },
    })
    const platformsLQ = await Platform.findAll({
        where: {
            id: {
                [Op.in]: platforms,
            },
        },
    })
    if (!!genresLQ || !!platformsLQ) {
        await videogame.setGenres(genresLQ);

        await videogame.setPlatforms(platformsLQ);

        return videogame;
    }
    return error = "No se pudo crear el videojuego";
};

// controller get videogame by id.
const getVideogameById = async (id, source) => {
    let response;

    if (source === "api") {
        response = await axios.get(`${URL}/games/${id}?key=${API_Key}`);
    } else {
        response = await Videogame.findByPk(id,{include:{all:true}});
    }
    if (source === "api") {
        const { data } = response;
        const { id, name, description, released, platforms, background_image, rating, genres } = data;
        const platformsName = platforms.map(data => data.platform.name).join(", ");
        const genresName = genres.map(data => data.name).join(", ");
        return { id, name, description, platform: platformsName, released, background_image, rating, genre: genresName, };
    }
   
    return response;
};

/* Imagen.
Rating.
Géneros. */
// controller get all games.

const getAllGames = async () => {
    const pageSize = 15; // Number of games to retrieve per page
    const totalPages = Math.ceil(105 / pageSize); // Total number of pages required to retrieve 1000 games

    let allGames = [];

    for (let page = 1; page <= totalPages; page++) {
        const response = await axios.get(`${URL}/games?key=${API_Key}&page_size=${pageSize}&page=${page}`);
        const games = response.data.results;
        allGames = allGames.concat(games);
    }
    const allGameClean = cleanArray(allGames);
    const dbVideogames = await Videogame.findAll({
        include: [
            {
                model: Genre,
                as: 'genres',
                attributes: ['name'],
                through: {
                    attributes: [],
                },
            },
            {
                model: Platform,
                as: 'platforms',
                attributes: ['name'],
                through: {
                    attributes: [],
                },
            },
        ],
    });


    
    const cleanVideogamesDB = dbVideogames.map(({ id, name, platforms, image,  released, rating, genres }) => {
        // const date = new Date(released);
        const formattedDate = released.toISOString().split("T")[0].replace(/-/g, "/");
        const uniquePlatforms = platforms.map(p => p.name);

        const genreIDs = genres.map(g => g.name);
        return {
            id,
            name,
            platform: uniquePlatforms,
            image,
            released: formattedDate,
            rating,
            genre: genreIDs,
            created: true
        };
    });

        const results = [...cleanVideogamesDB, ...allGameClean];


        return results;
    };
    const cleanArray = (arr) => {
        return arr.map(({ id, name, description, platforms, parent_platforms, background_image, background_image_additional, released, rating, genres }) => {
            const uniquePlatforms = [...new Set([...platforms, ...parent_platforms].flatMap(p => p.platform.name))];
            const genreIDs = genres.map(g => g.name);
            return {
                id,
                name,
                description,
                platform: uniquePlatforms,
                image: background_image,
                image2: background_image_additional,
                released,
                rating,
                genre: genreIDs,
                created: false
            };
        });
    };

    // &page_size=40
    // controller get games by name.
    const getVideogameByName = async (name) => {
        // Buscar videojuegos en la base de datos
        const dbVideogames = await Videogame.findAll({
            where: {
                name: {
                    [Op.iLike]: `%${name}%`
                }
            },
            limit: 15
        });

        // Buscar videojuegos en la API
        const response = await axios.get(`${URL}/games?search=${name}&key=${API_Key}&pageSize=15`);
        const apiVideogamesRaw = response.data.results;

        // Limpiar y filtrar los resultados de la API
        const apiVideogames = cleanArray(apiVideogamesRaw);
        const filteredApi = apiVideogames.filter((game) => game.name.toLowerCase().includes(name.toLowerCase()));

        // Combinar los videojuegos de la base de datos y de la API
        const result = [...dbVideogames, ...filteredApi];

        //Si no se encontraron resultados, devuelve un mensaje indicando que no se encontró ningún videojuego que coincida con el nombre ingresado.
        if (result.length === 0) {
            return { message: `No se encontró ningún videojuego que coincida con: '${name}'.` };
        }
        //Si no se encontraron resultados, devuelve un mensaje indicando que no se encontró ningún videojuego que coincida con el nombre ingresado.
        //Devuelve los primeros 15 resultados combinados de la base de datos y la API.
        return result.slice(0, 15);
    };





    export {
        createVideoGame,
        getVideogameById,
        getAllGames,
        getVideogameByName
    };

