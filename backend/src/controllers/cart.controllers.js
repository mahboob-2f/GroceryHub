import { User } from "../models/users.models.js";


//   cart updata --  api/cart/update
export const updateCart = async(req,res)=>{
    try {
        const userId = req.user._id;
        const {cartItems}= req.body;

        const user =await User.findByIdAndUpdate(userId,{cartItems});
        return res.status(200)
            .json({
                success:true,
                user:user,
                message:'cart updated',
            })

    } catch (error) {
        return res.status(400)
            .json({
                success:false,
                message:`cart not updated : ${error.message}`,
            })
    }
}