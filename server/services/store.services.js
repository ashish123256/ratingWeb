import db from '../models/index.js';

export const getAllStores = async (filters = {}) => {
  const { name, email, address } = filters;
  const where = {};
  
  if (name) where.name = { [db.Sequelize.Op.like]: `%${name}%` };
  if (email) where.email = { [db.Sequelize.Op.like]: `%${email}%` };
  if (address) where.address = { [db.Sequelize.Op.like]: `%${address}%` };

  const stores = await db.store.findAll({
    where,
    attributes: ['id', 'name', 'email', 'address'],
    include: [{
      model: db.rating,
      attributes: ['rating']
    }]
  });

  return stores.map(store => {
    const ratings = store.ratings.map(r => r.rating);
    const avgRating = ratings.length > 0 ? 
      (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : 
      null;
    
    return {
      ...store.get({ plain: true }),
      avgRating,
      ratingCount: ratings.length
    };
  });
};

export const getStoreById = async (storeId) => {
  const store = await db.store.findByPk(storeId, {
    include: [{
      model: db.rating,
      include: [db.user]
    }, {
      model: db.user,
      as: 'owner',
      attributes: ['id', 'name', 'email']
    }]
  });

  if (!store) {
    throw new Error('Store not found');
  }

  const ratings = store.ratings.map(r => r.rating);
  const avgRating = ratings.length > 0 ? 
    (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : 
    null;

  return {
    ...store.get({ plain: true }),
    avgRating,
    ratingCount: ratings.length
  };
};

export const createStore = async (storeData) => {
  return await db.store.create(storeData);
};

export const updateStore = async (storeId, storeData) => {
  const store = await db.store.findByPk(storeId);
  if (!store) {
    throw new Error('Store not found');
  }

  return await store.update(storeData);
};

export const deleteStore = async (storeId) => {
  const store = await db.store.findByPk(storeId);
  if (!store) {
    throw new Error('Store not found');
  }

  await store.destroy();
};