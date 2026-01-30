import { Order } from "../models/order.models.js";
import { Product } from "../models/products.models.js";


//   place order with cod  ---  /api/order/cod


export const placeOrderCOD = async(req,res)=>{
    try {
        const userId = req.user._id;
        const {items,address}= req.body;

        if(!address || items.length ===0 ){
            return res.status(401)
                .json({
                    success:false,
                    message:'invalid data',
                })
        }

        // calculate the amount
        let amount = await items.reduce(async(acc,item)=>{
            const product = await Product.findById(item.product);
            return (await acc) +product.offerPrice  *item.quantity;
        },0);

        // tax  charge (2%)
        amount +=Math.floor(amount+0.2);

        await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType:'COD',
        })

        return res.status(200)
            .json({
                succes:true,
                message:"order placed",
            })


    } catch (error) {
        return res.status(401)
            .json({
                succes:false,
                message:o`rder not  placed : ${error.message}`,
            })
    }
}

//  get order by userId   --- /api/order/user
 // TODO  here to start 

export const getUserOrders= async(req,res)=>{
    try {
        const userId = req.user._id;
        const orders = await Order.find({
            userId,
            $or:[{paymentType:'COD'},{isPaid:true}]
        }).populate("item.product address")
    } catch (error) {
        
    }
}