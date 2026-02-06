import jwt from 'jsonwebtoken'
import { User } from '../models/users.models.js';

export const sellerAuth = async (req,res,next) =>{
    try {
        const {sellerToken}= req.cookies;
        if(!sellerToken){
            return res.status(200)
                .json({
                    success:false,
                    message:'unauthorised seller',
                })
        }

        const decodedSellerToken = jwt.verify(sellerToken,process.env.SECRETKEY)
        // const user = await 
        if(decodedSellerToken.email=== process.env.SELLER_EMAIL){
            let seller = await User.findOne({
                email:process.env.SELLER_EMAIL
            }).select("-password");
            if(!seller){
                seller = await User.create({
                        name:process.env.SELLER_NAME,
                        email:process.env.SELLER_EMAIL,
                        password:process.env.SELLER_PASSWORD
                    })
            }
            req.seller = seller;
            next();
        }else{
            return res.status(200)
                .json({
                    success:false,
                    message:'unauthorised seller',
                }) 
        }
    } catch (error) {
        return res.status(401)
                .json({
                    success:false,
                    message:error.message,
                })
    }
}