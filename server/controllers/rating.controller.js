import * as ratingService from '../services/rating.services.js';

export const submitRating = async (req, res) => {
  try {
    const { storeId, rating, comment } = req.body;
    const newRating = await ratingService.submitRating(
      req.userId,
      storeId,
      rating,
      comment
    );
    res.status(201).send(newRating);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

export const updateRating = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const updatedRating = await ratingService.updateRating(
      req.params.id,
      req.userId,
      rating,
      comment
    );
    res.status(200).send(updatedRating);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

export const getUserRating = async (req, res) => {
  try {
    const rating = await ratingService.getUserRatingForStore(
      req.userId,
      req.params.storeId
    );
    res.status(200).send(rating || {});
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

export const getStoreRatings = async (req, res) => {
  try {
    const ratings = await ratingService.getStoreRatings(req.params.storeId);
    res.status(200).send(ratings);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};