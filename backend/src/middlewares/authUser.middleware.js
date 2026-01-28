import jwt from 'jsonwebtoken'

export const authUser = async(req,res,next)=>{
    try{
        const {token}= req.cookies;
        if(!token){
            return res.status(400)
                .json({
                    success:false,
                    message:"Not authorised",
                })
        }
        const decodedToken = jwt.verify(token,process.env.SECRETKEY);
        if(decodedToken?.id){
            req.userId= decodedToken.id;
        }
        else {
            return res.status(400)
            .json({
                success:false,
                message:"Not authorised",
            })
        }
        next();

    }catch(error){
        console.log('token verification failed');
        return  res.status(400)
            .json({
                success:false,
                message:'Not authorised user',
            })
    }
}