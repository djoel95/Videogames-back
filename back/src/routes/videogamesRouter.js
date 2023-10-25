import { Router } from 'express';
const videogamesRouter = Router();

// Importar handlers
import {
  getVideogamesHandler,
  getVideogameByIdHandler,
  getVideogameByNameHandler,
  postVideogamesHandler,

} from '../handlers/videogame/index.js';


// Routes de GET
videogamesRouter.get('/', getVideogamesHandler);
videogamesRouter.get('/:id', getVideogameByIdHandler);
videogamesRouter.get('/:name', getVideogameByNameHandler);


// Routes de POST
videogamesRouter.post('/', postVideogamesHandler);

export default videogamesRouter;