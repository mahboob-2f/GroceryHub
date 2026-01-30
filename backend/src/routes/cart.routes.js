import express from 'express'
import { authUser } from '../middlewares/authuser.middleware';
import { updateCart } from '../controllers/cart.controllers';

const cartRouter = express.Router();

cartRouter.post('/update',authUser,updateCart);


export {cartRouter};