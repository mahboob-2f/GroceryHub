import jwt from 'jsonwebtoken'

export const sellerAuth =  (req,res,next) =>{
    try {
        const {sellerToken}= req.cookies;
        if(!sellerToken){
            return res.status(401)
                .json({
                    success:false,
                    message:'unauthorised seller',
                })
        }

        const decodedSellerToken = jwt.verify(sellerToken,process.env.SECRETKEY)
        // const user = await 
        if(decodedSellerToken.email=== process.env.SELLER_EMAIL){
            next();
        }else{
            return res.status(401)
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