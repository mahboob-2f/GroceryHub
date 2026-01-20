import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { dummyProducts } from "../assets/assets";
import toast from 'react-hot-toast'

export const AppContext = createContext();

export const AppContextProvider =({children}) =>{

    const currency = import.meta.env.VITE_CURRENCY;

    const navigate = useNavigate();
    const [user,setUser]= useState(null);
    const [isSeller,setIsSeller] = useState(false);
    const [showUserLogin,setShowUserLogin]= useState(false)   //   will use while showing user is logged in or not
    const [product,setProduct]= useState([]);
    const [loading,setLoading]= useState(true);

    const [cartItems,setCartItems]= useState({})
    const [searchQuery,setSearchQuery]= useState({})
    const [totalProducts,setTotalProducts]= useState(0);

    //  fetch all Products
    const fetchProducts = async()=>{
        setProduct(dummyProducts);
        setLoading(false);
    }
    useEffect(()=>{
        fetchProducts();
    },[])
    //  add products to cart
    const addToCart = (itemId)=>{
        let cartData = structuredClone(cartItems);

        if(cartData[itemId]){
            cartData[itemId] += 1;
        }else{
            cartData[itemId] = 1;
        }
        setCartItems(cartData);
        toast.success("Added to Cart");
        setTotalProducts(pre => pre +1)
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
            cartData[itemId] -=1;
            if(cartData[itemId]==0){
                delete cartData[itemId];
            }
        }
        toast.success("Removed from cart");
        setCartItems(cartData);
        setTotalProducts(pre => pre > 0 ? pre -1:0);
    }

    //   get total cart amounts

    const getCartAmount =()=>{
        let totalAmount=0;
        for(const items in cartItems){
            let itemInfo = product.find((product)=> product._id===items);
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
        product,
        totalProducts,
        loading,
        currency,
        cartItems,
        addToCart,
        updateCartItem,
        removeFromCart,
        searchQuery,
        setSearchQuery,
        getCartAmount
    }

    return(
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}