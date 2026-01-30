import exprees from 'express'
import { authUser } from '../middlewares/authuser.middleware';
import { addAddress, getAddress } from '../controllers/address.controllers';

const addressRouter = exprees.Router();

addressRouter.post('/add',authUser,addAddress);
addressRouter.post('/get',authUser,getAddress);



export {addressRouter};