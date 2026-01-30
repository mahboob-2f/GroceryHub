import express from 'express'
import { addProduct } from '../controllers/products.controller.js';
import { upload } from '../middlewares/multer.middlewares.js';

const productRouter = express.Router();


productRouter.post('/add',upload.single('images'),addProduct);

export {productRouter};