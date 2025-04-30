export default (sequelize, DataTypes) => {
    const Rating = sequelize.define('rating', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 5
        }
      },
      comment: {
        type: DataTypes.STRING(500)
      }
    });
  
    return Rating;
  };