import express from 'express'
import { isSellerAuth, sellerLogin, sellerLogout } from '../controllers/seller.controllers.js';
import { sellerAuth } from '../middlewares/sellerAuth.middleware.js';

const sellerRouter = express.Router();


sellerRouter.post('/login',sellerLogin);
sellerRouter.get('/is-auth',sellerAuth,isSellerAuth)
sellerRouter.post('/logout',sellerLogout)


export {sellerRouter}