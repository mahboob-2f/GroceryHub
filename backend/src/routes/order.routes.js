import express from 'express';
import { getAllOrders, getUserOrders, placeOrderCOD } from '../controllers/order.controllers.js';
import { sellerAuth } from '../middlewares/sellerAuth.middleware.js';
import { authUser } from '../middlewares/authUser.middleware.js';

const orderRouter = express.Router();

orderRouter.post('/cod',authUser,placeOrderCOD);
orderRouter.get('/user',authUser,getUserOrders);
orderRouter.get('/seller',sellerAuth,getAllOrders);


export {orderRouter};