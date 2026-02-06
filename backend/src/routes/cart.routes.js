import express from 'express'
import { authUser } from '../middlewares/authUser.middleware.js';
import { updateCart } from '../controllers/cart.controllers.js';

const cartRouter = express.Router();

cartRouter.post('/update',authUser,updateCart);


export {cartRouter};