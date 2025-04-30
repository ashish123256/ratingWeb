export default (sequelize, DataTypes) => {
    const User = sequelize.define('user', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING(60),
        allowNull: false,
        validate: {
          len: {
            args: [20, 60],
            msg: 'Name must be between 20 and 60 characters'
          }
        }
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: {
            msg: 'Must be a valid email address'
          }
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: {
            args: /^(?=.*[A-Z])(?=.*[!@#$&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,16}$/, // Updated regex pattern
            msg: 'Password must be 8-16 characters with at least one uppercase and one special character'
          }
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
      },
      role: {
        type: DataTypes.ENUM('admin', 'user', 'store_owner'),
        defaultValue: 'user'
      }
    });
  
    return User;
  };