import express from 'express'
import { addProduct } from '../controllers/products.controller.js';
import { upload } from '../middlewares/multer.middlewares.js';
import { productList } from '../controllers/products.controllers.js';
import { sellerAuth } from '../middlewares/sellerAuth.middleware.js';

const productRouter = express.Router();


productRouter.post('/add',upload.array(['images']),sellerAuth,addProduct);
productRouter.get('/list' ,productList);
productRouter.get('/id' ,productById);
productRouter.post('/stock',sellerAuth ,productById);

export {productRouter};