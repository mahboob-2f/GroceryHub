import { Product } from "../models/products.models.js";
import { uploadOnCloudinary } from "../utils/uploadOnCloudinary.js";


//  add product  --    /api/product/add
export const addProduct = async(req,res)=>{
    try {
        // console.log("req.body:", req.body); // added: debug request body
        // console.log("req.files:", req.files); // added: debug uploaded files

        if (!req.body.productData) {
            return res.status(400).json({
                success: false,
                message: "productData is missing",
            });
        }

        const productData = JSON.parse(req.body.productData); // kept
        const images = req.files;

        if (!images || images.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No images uploaded", // added: prevent images.map crash
            });
        }

        let imagesUrl = await Promise.all(
            images.map(async(image)=>{
                console.log("image.path:", image.path); // added: check deployed file path
                let result = await uploadOnCloudinary(image.path,{resource_type:'image'}); // this is the most likely failing line
                if (!result) throw new Error("Cloudinary upload failed"); // added: handle null result
                return result.secure_url;
            })
        );

        await Product.create({...productData, image: imagesUrl});

        return res.status(200).json({
            success:true,
            message:'Product Added',
        });

    } catch (error) {
        console.log("addProduct error:", error); // added: print exact deployment error
        return res.status(500).json({ // fixed: 404 was wrong
            success:false,
            message:`product is not added: ${error.message}`,
        });
    }
}


//  get product list  --    /api/product/list
export const productList = async(req,res)=>{
    try {

        const products = await Product.find({});
        if(!products){
            return res.status(200)
                .json({
                    success:false,
                    message:'Products not found',
                })
        }
        return res.status(200)
            .json({
                success:true,
                products,
                message:'products found',
            })

    } catch (error) {
        return res.status(404)
            .json({
                success:false,
                message:`Products not found ${error.message}`,
            })
    }
}


//  get single product   --    /api/product/id
export const productById = async(req,res)=>{
    try {
        const {id}= req.body;
        const product = await Product.findById(id);
        if(!product){
            return res.status(200)
                .json({
                    success:false,
                    message:'product not found',
                })
        }
        return res.status(200)
            .json({
                success:true,
                product,
                message:"product found",
            })
        
    } catch (error) {
        return res.status(404)
                .json({
                    success:false,
                    message:`product not found : ${error.message}`,
                })
    }
}


//  change product stock   --    /api/product/stock
export const changeStock = async(req,res)=>{
    try {
        const {id,inStock}= req.body;
        await Product.findByIdAndUpdate(id,{inStock});
        return res.status(200)
            .json({
                success:true,
                message:"stock updated",
            })
    } catch (error) {
        return res.status(500)
                .json({
                    success:false,
                    message:`stock not found : ${error.message}`,
                })
    }
}