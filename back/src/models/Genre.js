import { DataTypes } from "sequelize";
// Exportamos una función que define el modelo
// Luego le inyectamos la conexión a Sequelize.
const Genre = (sequelize) => {
  // Definimos el modelo
  sequelize.define('Genre', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, 
  {timestamps:false}
  );
};


export default Genre;