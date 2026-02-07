import jwt from 'jsonwebtoken'
import { User } from '../models/users.models.js';

export const authUser = async(req,res,next)=>{
    try{
        // console.log("Cookies received:", req.cookies)
        const {token}= req.cookies;
        if(!token){
            return res.status(200)
                .json({
                    success:false,
                    message:"Not authorised ,token not found",
                })
        }
        const decodedToken = jwt.verify(token,process.env.SECRETKEY);
        const user= await User.findById(decodedToken?.id).select("-password");
        
        if(!user){
            return res.status(200)
            .json({
                success:false,
                message:"Not authorised, user not found",
            })
        }
        req.user = user;
        // console.log(user);
        next();

    }catch(error){
        console.log('token verification failed');
        return  res.status(401)
            .json({
                success:false,
                message:'Not authorised user',
            })
    }
}