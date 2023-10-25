import { Router } from 'express';
import videogamesRouter from './videogamesRouter.js';
import genresRouter from './genresRouter.js';
import platformsRouter from './platformsRouter.js';

const router = Router();

// Configurar los routers
router.use('/videogames', videogamesRouter);
router.use('/genres', genresRouter);
router.use('/platforms', platformsRouter);

export default router;