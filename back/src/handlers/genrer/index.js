import createGenre from '../../controllers/genrer/index.js';

export const getGenresHandler = async (req, res) => {
  try {
    const newGenre = await createGenre();

    res.status(201).json({
      success: true,
      message: 'Géneros cargados exitosamente en la base de datos',
      data: newGenre
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

