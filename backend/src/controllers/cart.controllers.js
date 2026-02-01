import { User } from "../models/users.models.js";


//   cart updata --  api/cart/update
export const updateCart = async(req,res)=>{
    try {
        const userId = req.user._id;
        const {cartItems}= req.body;

        await User.findByIdAndUpdate(userId,{cartItems});
        return res.status(200)
            .json({
                success:true,
                message:'cart updated',
            })

    } catch (error) {
        return res.status(401)
            .json({
                success:false,
                message:`cart not updated : ${error.message}`,
            })
    }
}