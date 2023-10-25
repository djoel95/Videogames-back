import { Router } from 'express';
import  {getGenresHandler}  from '../handlers/genrer/index.js';
const genresRouter = Router();


// Getting routes
genresRouter.get('/',getGenresHandler);


export default genresRouter;