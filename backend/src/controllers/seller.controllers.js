import jwt from 'jsonwebtoken'
import validator from 'validator'


//      /api/seller/login
export const sellerLogin =async(req,res)=>{
    try {
        const {email,password}= req.body;
        if([email,password].some(item => item?.trim()=="")){
            return res.status(401)
                .json({
                    success:false,
                    message:'email and password required',
                })
        }
        if(!validator.isEmail(email)){
            return res.status(401)
                .json({
                    success:false,
                    message:'invalid email',
                })
        }
        if(email=== process.env.SELLER_EMAIL && password ==process.env.SELLER_PASSWORD){
            const token = jwt.sign({email},process.env.SECRETKEY,{expiresIn:process.env.EXPIRYIN});
            const options = {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'development' ? 'strict' : 'none',
                maxAge: 7*24*60*60*1000,
            }
            res.cookie('sellerToken',token,options);
            return res.status(200)
                .json({
                    success:true,
                    message:"Loged in",
                })
        }
    } catch (error) {
        console.log(error.message);
        return res.status(200)
                .json({
                    success:true,
                    message:error.message,
                })
    }
}


//  seller auth  =  /api/seller/is-auth

export const isSellerAuth = async(req,res)=>{
    try{
        return res.status(200)
            .json({
                success:true,
                user:user,
                message:"Authorised Seller",
            })

    }catch(error){
        console.log(error.message);
        return res.status(400) 
                .json({
                    success:false,
                    message:`not authorised Seller ${error.message}`,
                })
    }
}

//  seller logout   -  /api/seller/logout

export const sellerLogout = async(req,res)=>{
    try {   
        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'productio  n',
            sameSite: process.env.NODE_ENV === 'development' ? 'strict' : 'none',
            maxAge: 7*24*60*60*1000,
        }
        res.clearCookie('sellerToken',options);

        return res.status(200)
            .json({
                success:true,
                message:"logged out seller",
            })

    } catch (error) {
        return res.status(401)
            .json({
                success:false,
                message:error.message,
            })
    }
}