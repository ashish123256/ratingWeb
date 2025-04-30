import db from '../models/index.js';

export const submitRating = async (userId, storeId, ratingValue, comment) => {
 
  const existingRating = await db.rating.findOne({
    where: { userId, storeId }
  });

  if (existingRating) {
    throw new Error('You have already rated this store');
  }

  return await db.rating.create({
    userId,
    storeId,
    rating: ratingValue,
    comment
  });
};

export const updateRating = async (ratingId, userId, ratingValue, comment) => {
  const rating = await db.rating.findByPk(ratingId);
  if (!rating) {
    throw new Error('Rating not found');
  }

  if (rating.userId !== userId) {
    throw new Error('You can only update your own ratings');
  }

  return await rating.update({
    rating: ratingValue,
    comment
  });
};

export const getUserRatingForStore = async (userId, storeId) => {
  return await db.rating.findOne({
    where: { userId, storeId }
  });
};

export const getStoreRatings = async (storeId) => {
  return await db.rating.findAll({
    where: { storeId },
    include: [{
      model: db.user,
      attributes: ['id', 'name', 'email']
    }]
  });
};