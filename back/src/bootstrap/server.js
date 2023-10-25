import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import router from '../routes/index.js';

const server = express();

server.use(morgan('dev'));

server.use(cors());

server.use(express.json());

server.use('/', router);

// server.get('/', (req, res) => {
//     res.json({
//         message: 'Welcome to Videogames'
//     })
// })





export default server;