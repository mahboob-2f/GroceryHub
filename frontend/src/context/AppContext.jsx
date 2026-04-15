import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import toast from 'react-hot-toast'
import axios from 'axios';

// axios.defaults.baseURL="http://localhost:3000/"; // for local development
axios.defaults.baseURL ='/'; // for production
axios.defaults.withCredentials=true;

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
    const [cartActionLoading,setCartActionLoading]= useState({});

    //  fetching is seller authenticated
    const fetchSeller = async()=>{
        try {
            const {data}= await axios.get("/api/seller/is-auth",{ withCredentials: true });
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
            const {data}= await axios.get('/api/user/is-auth',{ withCredentials: true });
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
            const {data}= await axios.get('/api/product/list',{ withCredentials: true });
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

    useEffect(()=>{
        let count = Object.values(cartItems).reduce((sum,count)=>sum+Number(count),0);
        setTotalProducts(count);
    },[cartItems]);

    const syncCartItems = async(nextCartItems, fallbackCartItems)=>{
        if(!user){
            return { success: true };
        }

        try {
            const {data}= await axios.post('/api/cart/update',{cartItems:nextCartItems},{ withCredentials: true });
            if(!data.success){
                setCartItems(fallbackCartItems);
                toast.error(data.message);
            }
            return data;
        } catch (error) {
            setCartItems(fallbackCartItems);
            toast.error(error.message);
            return { success: false };
        }
    }

    const withCartItemLoader = async(itemId, action)=>{
        setCartActionLoading((prev)=> ({...prev,[itemId]:true}));
        try {
            return await action();
        } finally {
            setCartActionLoading((prev)=>{
                const updatedState = {...prev};
                delete updatedState[itemId];
                return updatedState;
            });
        }
    }

    //  add products to cart
    const addToCart = async(itemId)=>{
        return withCartItemLoader(itemId, async()=>{
            let currentCart = structuredClone(cartItems);
            let nextCart = structuredClone(currentCart);

            if(nextCart[itemId]){
                nextCart[itemId] =Number(nextCart[itemId])+ (1);
            }else{
                nextCart[itemId] = 1;
            }

            setCartItems(nextCart);
            const response = await syncCartItems(nextCart, currentCart);
            if(response?.success){
                toast.success("Added to Cart");
                return true;
            }
            return false;
        });
    }
    //  updata cart quantity 
    const updateCartItem = async(itemId,quantity)=>{
        return withCartItemLoader(itemId, async()=>{
            let currentCart = structuredClone(cartItems);
            let nextCart = structuredClone(currentCart);
            nextCart[itemId] = Number(quantity);
            setCartItems(nextCart);
            const response = await syncCartItems(nextCart, currentCart);
            if(response?.success){
                toast.success("Cart updated");
                return true;
            }
            return false;
        });
    }
    // remove item from cart
    const removeFromCart = async(itemId)=>{
        return withCartItemLoader(itemId, async()=>{
            let currentCart = structuredClone(cartItems);
            let nextCart = structuredClone(currentCart);
            if(nextCart[itemId]){
                nextCart[itemId] =Number(nextCart[itemId])-(1);
                if(nextCart[itemId]==0){
                    delete nextCart[itemId];
                }
            }
            setCartItems(nextCart);
            const response = await syncCartItems(nextCart, currentCart);
            if(response?.success){
                toast.success("Removed from cart");
                return true;
            }
            return false;
        });
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
        cartActionLoading,
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
