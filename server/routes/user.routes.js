import express from 'express';
import * as userController from '../controllers/user.controller.js';
import { verifyToken, isAdmin } from '../middleware/awtJwt.js';

const router = express.Router();

router.get('/', [verifyToken, isAdmin], userController.getAllUsers);
router.get('/:id', [verifyToken, isAdmin], userController.getUser);
router.post('/', [verifyToken, isAdmin], userController.createUser);
router.put('/:id', [verifyToken, isAdmin], userController.updateUser);
router.delete('/:id', [verifyToken, isAdmin], userController.deleteUser);

export default router;