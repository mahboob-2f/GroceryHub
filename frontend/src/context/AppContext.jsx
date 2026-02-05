import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { dummyProducts } from "../assets/assets";
import toast from 'react-hot-toast'
import axios from 'axios';

axios.defaults.withCredentials=true;
axios.defaults.baseURL= import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();

export const AppContextProvider =({children}) =>{

    const currency = import.meta.env.VITE_CURRENCY;

    const navigate = useNavigate();
    const [user,setUser]= useState(null);
    const [isSeller,setIsSeller] = useState(false);
    const [showUserLogin,setShowUserLogin]= useState(false)   //   will use while showing user is logged in or not
    const [products,setProducts]= useState([]);
    const [loading,setLoading]= useState(true);

    const [cartItems,setCartItems]= useState({})
    const [searchQuery,setSearchQuery]= useState({})
    const [totalProducts,setTotalProducts]= useState(0);

    //  fetching is seller authenticated
    const fetchSeller = async()=>{
        try {
            const {data}= await axios.get("/api/seller/is-auth");
            if(data.success){
                setIsSeller(true);
            }else setIsSeller(false);
        } catch (error) {
            setIsSeller(false);  
        }
    }
    // fetching the user and user cart items
    const fetchUser= async()=>{
        try {
            const {data}= await axios.get('/api/user/is-auth');
            if(data.success){
                setUser(data.user);
                setCartItems(data.user.cartItems);
            }
        } catch (error) {
            setUser(null);
        }
    }

    //  fetch all Products
    const fetchProducts = async()=>{
        try {
            const {data}= await axios.get('/api/product/list');
            if(data.success){
                setProducts(data.products);
                setLoading(false);
            }else{
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);

        }
    }
    useEffect(()=>{
        fetchProducts();
        fetchSeller();
        fetchUser();
    },[])

    // update cartitems 

    useEffect(()=>{
        let count = Object.values(cartItems).reduce((sum,count)=>sum+Number(count),0);
        setTotalProducts(count);
        const updateCart= async()=>{
            try {
                const {data}= await axios.post('/api/cart/update',{cartItems});
                if(!data.success){
                    toast.error(data.message);
                }else{
                    // setTotalProducts(data.user.cartItems);
                }
            } catch (error) {
                toast.error(error.message);
                
            }
        }
        
        if(user) updateCart();
    },[cartItems]);

    //  add products to cart
    const addToCart = (itemId)=>{
        let cartData = structuredClone(cartItems);

        if(cartData[itemId]){
            cartData[itemId] =Number(cartData[itemId])+ (1);
        }else{
            cartData[itemId] = (1);
        }
        setCartItems(cartData);
        toast.success("Added to Cart");
        // setTotalProducts(pre => Number(pre) +Number(1))
    }
    //  updata cart quantity 
    const updateCartItem =(itemId,quantity)=>{
        let cartData = structuredClone(cartItems);
        cartData[itemId] = quantity;
        setCartItems(cartData);
        toast.success("Cart updated");
    }
    // remove item from cart
    const removeFromCart = (itemId)=>{
        let cartData = structuredClone(cartItems);
        if(cartData[itemId]){
            cartData[itemId] =Number(cartData[itemId])-(1);
            if(cartData[itemId]==0){
                delete cartData[itemId];
            }
        }
        toast.success("Removed from cart");
        setCartItems(cartData);
        // setTotalProducts(pre => pre > 0 ? pre -1:0);
    }

    //   get total cart amounts

    const getCartAmount =()=>{
        let totalAmount=0;
        for(const items in cartItems){
            let itemInfo = products.find((product)=> product._id===items);
            if(cartItems[items] > 0){
                totalAmount += itemInfo.offerPrice * cartItems[items];
            }
        }
        return Math.floor(totalAmount* 100)/100;
    }



    const value={
        navigate,
        user,
        setUser,
        isSeller,
        setIsSeller,
        showUserLogin,
        setShowUserLogin,
        products,
        totalProducts,
        loading,
        currency,
        cartItems,
        setCartItems,
        addToCart,
        updateCartItem,
        removeFromCart,
        searchQuery,
        setSearchQuery,
        getCartAmount,
        axios,
        fetchProducts,
    }

    return(
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}