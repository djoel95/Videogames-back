import { DataTypes } from "sequelize";
// Exportamos una función que define el modelo
// Luego le inyectamos la conexión a Sequelize.
const Platform = (sequelize) => {
  // Definimos el modelo
  sequelize.define('Platform', {
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


export default Platform;