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
                success:true,
                message:"order placed",
            })


    } catch (error) {
        return res.status(401)
            .json({
                succes:false,
                message:`Order not  placed : ${error.message}`,
            })
    }
}

//  get order by userId   --- /api/order/user

export const getUserOrders= async(req,res)=>{
    try {
        const userId = req.user._id;
        const orders = await Order.find({
            userId,
            $or:[{paymentType:'COD'},{isPaid:true}]
        }).populate("items.product address").sort({createdAt:-1});
        if(orders.length===0){
            return res.status(404)
                .json({
                    success:false,
                    message:'orders not found',
                })
        }
        return res.status(200)
            .json({
                success:true,
                orders,
                message:"Orders found.",
            })

    } catch (error) {
        return res.status(500)
            .json({
                success:false,
                message:`Orders are not fetched ${error.message}`,
            })
    }
}


//   get all orders for seller --   api/order/seller

export const getAllOrders = async(req,res)=>{
    try{
        const orders = await Order.find({
            $or:[{paymentType:'COD'},{isPaid:true}]
        }).populate("items.product address").sort({createdAt:-1}); 

        if(orders.length ===0){
            return res.status(404)
            .json({
                success:false,
                message:"Orders not found",
            })
        }
        return res.status(201)
            .json({
                success:true,
                orders,
                message:'Orders found',
            })
    }catch(error){
        return res.status(500)
            .json({
                success:false,
                message:error.message,
            })
    }
}