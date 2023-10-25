import { Router } from 'express';
import  { getPlatformsHandler }  from '../handlers/platform/index.js';

const platformsRouter = Router();


// Getting routes
platformsRouter.get('/',getPlatformsHandler);


export default platformsRouter;