import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    items:[{
        product:{
            type:mongoose.Schema.Types.ObjectId,
            required:true,
            ref:'Product'
        },
        quantity:{
            type:Number,
            required:true,
        }

    }],
    amount:{
        type:Number,
        required:true,
    },
    address:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"Address"
    },
    status:{
        type:String,
        default:'Order placed',
    },
    paymentType:{
        type:String,
        required:true,
    },
    isPaid:{
        type:Boolean,
        required:true,
        default:false,
    }
},{timestamps:true});


export const Order = mongoose.models.order || mongoose.model('Order',orderSchema);