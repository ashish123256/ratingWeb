export default (sequelize, DataTypes) => {
    const Store = sequelize.define('store', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: true
        }
      },
      address: {
        type: DataTypes.STRING(400),
        validate: {
          len: {
            args: [0, 400],
            msg: 'Address must be less than 400 characters'
          }
        }
      }
    });
  
    return Store;
  };