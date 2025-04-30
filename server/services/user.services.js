import db from '../models/index.js';

export const getAllUsers = async (filters = {}) => {
  const { name, email, address, role } = filters;
  const where = {};
  
  if (name) where.name = { [db.Sequelize.Op.like]: `%${name}%` };
  if (email) where.email = { [db.Sequelize.Op.like]: `%${email}%` };
  if (address) where.address = { [db.Sequelize.Op.like]: `%${address}%` };
  if (role) where.role = role;

  return await db.user.findAll({
    where,
    attributes: ['id', 'name', 'email', 'address', 'role']
  });
};

export const getUserById = async (userId) => {
  const user = await db.user.findByPk(userId, {
    attributes: ['id', 'name', 'email', 'address', 'role'],
    include: [{
      model: db.store,
      as: 'stores',
      attributes: ['id', 'name', 'email', 'address']
    }]
  });

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};

export const createUser = async (userData) => {
  return await db.user.create(userData);
};

export const updateUser = async (userId, userData) => {
  const user = await db.user.findByPk(userId);
  if (!user) {
    throw new Error('User not found');
  }

  return await user.update(userData);
};

export const deleteUser = async (userId) => {
  const user = await db.user.findByPk(userId);
  if (!user) {
    throw new Error('User not found');
  }

  await user.destroy();
};