import { Sequelize } from "sequelize";
import dbConfig from "../config/db.config.js";


const sequelize = new Sequelize(
  dbConfig.DB,
  dbConfig.USER,
  dbConfig.PASSWORD,
  {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    
    pool: {
      max: dbConfig.pool.max,
      min: dbConfig.pool.min,
      acquire: dbConfig.pool.acquire,
      idle: dbConfig.pool.idle
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

import User from "./user.model.js";
import Store from "./store.model.js";
import Rating from "./rating.model.js";


// initialize models
db.user = User(sequelize, Sequelize);
db.store = Store(sequelize, Sequelize);
db.rating = Rating(sequelize, Sequelize);


// define relationships
db.user.hasMany(db.rating, { foreignKey: "userId" });
db.store.hasMany(db.rating, { foreignKey: "storeId" });
db.rating.belongsTo(db.user, { foreignKey: "userId" });
db.rating.belongsTo(db.store, { foreignKey: "storeId" });

// for store owners
db.user.hasMany(db.store, { foreignKey: "ownerId" });
db.store.belongsTo(db.user, { foreignKey: "ownerId" });

export default db;