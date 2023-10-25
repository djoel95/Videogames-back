import { config } from 'dotenv';
import { server } from './src/bootstrap/index.js';
import { database } from './src/bootstrap/index.js';




config();

const { PORT } = process.env;
server.listen(PORT, async () => {
  await database.sync({force:false})
  console.log(`Server running on port ${PORT}`);

      
});
