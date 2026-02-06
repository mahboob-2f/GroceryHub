import { Order } from "../models/order.models.js";
import { Product } from "../models/products.models.js";
import stripe from 'stripe'


//   place order with cod  ---  /api/order/stripe


export const placeOrderStripe = async(req,res)=>{
    try {
        const userId = req.user._id;
        const {items,address}= req.body;
        const {origin}= req.headers;

        if(!address || items.length ===0 ){
            return res.status(200)
                .json({
                    success:false,
                    message:'invalid data',
                })
        }
        let productData =[];

        // calculate the amount
        let amount = await items.reduce(async(acc,item)=>{
            const product = await Product.findById(item.product);
            productData.push({
                name:product.name,
                price:product.offerPrice,
                quantity:item.quantity,
            })
            return (await acc) +product.offerPrice  *item.quantity;
        },0);

        // tax  charge (2%)
        amount +=Math.floor(amount+0.2);

        const order =await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType:'Online',
        })
        // inititing stripe gateway
        const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

        // create the line items
        const lineItems= productData.map(item=>{
            return {
                price_data:{
                    currency:'dh',
                    product_data:{
                        name:item.name,
                    },
                    unit_amount: Math.floor(item.price + item.price * 0.02)*100,
                },
                quantity:item.quantity,
            }
        })

        // creating session for stripe
        const session= await stripeInstance.checkout.sessions({
            line_items:lineItems,
            mode:"payment",
            success_url:`${origin}/loader?next=my-orders`,
            cancel_url:`${origin}/cart`,
            metadata:{
                userId,
                orderId:order._id.toString(),
            }
        })

        return res.status(200)
            .json({
                success:true,
                url:session.url,
                message:"order placed",
            })


    } catch (error) {
        return res.status(404)
            .json({
                succes:false,
                message:`Order not  placed : ${error.message}`,
            })
    }
}

//   place order with cod  ---  /api/order/cod


export const placeOrderCOD = async(req,res)=>{
    try {
        const userId = req.user._id;
        const {items,address}= req.body;

        if(!address || items.length ===0 ){
            return res.status(200)
                .json({
                    success:false,
                    message:'Missing Inputs',
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
        return res.status(400)
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