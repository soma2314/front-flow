import express from 'express'; 
import authMiddleware from '../middlewares/authMiddleware.js';
import {upload} from '../middlewares/multerMiddleware.js';
import {createProductController, getAdminProducts} from '../controllers/ProductControllers/createProductController.js';
import { deleteProductController } from '../controllers/ProductControllers/deleteProductController.js';
import { editProductController } from '../controllers/ProductControllers/createProductController.js';

const router = express.Router();

router.post('/createProduct', authMiddleware, upload.single('image'), createProductController);
router.get('/admin-products-list', authMiddleware, getAdminProducts);
router.delete('/delete-product/:id', authMiddleware, deleteProductController);
router.put('/update-product/:id', authMiddleware, editProductController);
export default router;