import { Order } from "../models/order.models.js";
import { Product } from "../models/products.models.js";
import stripe from 'stripe'
import { User } from "../models/users.models.js";


//   place order with cod  ---  /api/order/stripe


export const placeOrderStripe = async(req,res)=>{
    try {
        const userId = req.user._id;
        const {items,address}= req.body;
        const {origin}= req.headers;
        // console.log(origin);
        
        
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
            });
            return (await acc) +product.offerPrice  *item.quantity;
        },0);
        
        // tax  charge (2%)
        amount +=Math.floor(amount *0.02);
        
        const order =await Order.create({
            userId,
            items,
            amount,
            address,
            // isPaid:true,
            paymentType:'Online',
        })
        // inititing stripe gateway
        const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
        // console.log("first");
        
        // create the line items
        const line_items= productData.map(item=>{
            return {
                price_data:{
                    currency:'aed',
                    product_data:{
                        name:item.name,
                    },
                    unit_amount: Math.floor(item.price + item.price * 0.02)*100,
                },
                quantity:item.quantity,
            }
        })
        // console.log("second")
        
        // creating session for stripe
        const session= await stripeInstance.checkout.sessions.create({
            line_items,
            mode:"payment",
            success_url:`${origin}/loader?next=my-orders`,
            cancel_url:`${origin}/cart`,
            metadata:{
                orderId:order._id.toString(),
                userId:userId.toString(),
            }
        })
        // console.log("third")
        
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
// stripe webhook for the verifying payment action  - /stripe
export const stripeWebHook = async (request, response) => {
    let event;
    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
    const signature = request.headers['stripe-signature'];

    try {
        event = stripe.webhooks.constructEvent(
            request.body,
            signature,
            process.env.WEBHOOK_SECRET
        );
    } catch (error) {
        console.log(`⚠️ Webhook signature verification failed.`, error.message);
        return response.sendStatus(400);
    }

    switch (event.type) {

        // 🔧 FIX: correct event for Stripe Checkout
        case 'checkout.session.completed': {
            const session = event.data.object; // 🔧 FIX: no API call needed

            const { userId, orderId } = session.metadata;

            // make order as paid
            await Order.findByIdAndUpdate(
                orderId,
                { isPaid: true },
                { new: true } // 🔧 FIX: ensures update runs properly
            );

            // clear cart items
            const user = await User.findById(userId);
            if (user) { // 🔧 FIX: safety check
                user.cartItems = {};
                await user.save({ validateBeforeSave: false });
            }
            break;
        }

        // 🔧 FIX: correct failed event for Checkout
        case 'checkout.session.expired': {
            const session = event.data.object; // 🔧 FIX

            const { orderId } = session.metadata;
            await Order.findByIdAndDelete(orderId);
            break;
        }

        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    return response.json({ received: true });
};


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
        amount +=Math.floor(amount*0.02);

        await Order.create({
            userId,
            items,
            amount,
            address,
            isPaid:true,
            paymentType:'COD',
        })

        return res.status(200)
            .json({
                success:true,
                message:"order placed",
            })


    } catch (error) {
        return res.status(500)
            .json({
                success:false,
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