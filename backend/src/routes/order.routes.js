import express from 'express';
import { getUserOrders, placeOrderCOD } from '../controllers/order.controllers';
import { sellerAuth } from '../middlewares/sellerAuth.middleware';
import { authUser } from '../middlewares/authUser.middleware';

const orderRouter = express.Router();

orderRouter.post('/cod',sellerAuth,placeOrderCOD);
orderRouter.get('/user',authUser,getUserOrders);


export {orderRouter};