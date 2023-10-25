import axios from 'axios';
import { Platform } from '../../bootstrap/index.js';

const { API_Key, URL } = process.env;
const createPlatforms  = async () => {
  try {
    const response = await axios.get(`${URL}/platforms?key=${API_Key}`);
    const data = response.data.results;
    const sortedData = data.sort((a, b) => a.id - b.id); // Ordena los datos por id

    const promises = sortedData.map((plat) => {
      return Platform.findOrCreate({
        where: { id: plat.id , name: plat.name},
      });
    });

    await Promise.all(promises);
    const platforms = sortedData.map (plat => ({id: plat.id, name: plat.name}));
    return platforms
  
  } catch (error) {
    throw new Error(error.message);

  }
};

export default createPlatforms ;