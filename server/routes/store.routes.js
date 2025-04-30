import express from 'express';
import * as storeController from '../controllers/store.controller.js';
import { verifyToken ,isAdmin} from '../middleware/awtJwt.js';

const router = express.Router();

router.get('/', verifyToken, storeController.getAllStores);
router.get('/:id', verifyToken, storeController.getStore);
router.post('/', [verifyToken, isAdmin], storeController.createStore);
router.put('/:id', [verifyToken, isAdmin], storeController.updateStore);
router.delete('/:id', [verifyToken, isAdmin], storeController.deleteStore);

export default router;