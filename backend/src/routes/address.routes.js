import exprees from 'express'
import { authUser } from '../middlewares/authUser.middleware.js';
import { addAddress, getAddress } from '../controllers/address.controllers.js';

const addressRouter = exprees.Router();

addressRouter.post('/add',authUser,addAddress);
addressRouter.get('/get',authUser,getAddress);



export {addressRouter};