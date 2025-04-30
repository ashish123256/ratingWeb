import express from 'express';
import * as ratingController from '../controllers/rating.controller.js';
import { verifyToken } from '../middleware/awtJwt.js';

const router = express.Router();

router.post('/', verifyToken, ratingController.submitRating);
router.put('/:id', verifyToken, ratingController.updateRating);
router.get('/store/:storeId', verifyToken, ratingController.getStoreRatings);
router.get('/user/:storeId', verifyToken, ratingController.getUserRating);

export default router;