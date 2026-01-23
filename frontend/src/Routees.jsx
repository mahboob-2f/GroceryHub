import React, { useContext } from 'react';
import { Routes ,Route } from 'react-router';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import AllProducts from './pages/AllProducts';
import ProductCategory from './pages/ProductCategory';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import AddAddress from './pages/AddAddress';
import MyOrders from './pages/MyOrders';
import { AppContext } from './context/AppContext';
import SellerLogin from './components/seller/SellerLogin';
import SellerLayout from './pages/seller/SellerLayout';
import ProductList from './pages/seller/ProductList';
import Orders from './pages/seller/Orders';
import AddProduct from './pages/seller/AddProduct';


const Routees = () => {
  const {isSeller} = useContext(AppContext);

  return (
    <Routes>
        <Route path ='/' element={<Home/>}></Route>
        <Route path='/products' element={<AllProducts />}/>
        <Route path='/products/:category' element={<ProductCategory /> } />
        <Route path='/products/:category/:id' element={<ProductDetails />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/add-address' element={<AddAddress />} />
        <Route path='/my-orders' element={<MyOrders />} />
        <Route path='/seller' element={!isSeller ? <SellerLogin /> : <SellerLayout />} >
          <Route index element={isSeller ? <AddProduct />:null} />
          <Route path='product-list' element={<ProductList/>} />
          <Route path='orders' element={<Orders/>} />
        </Route>

        <Route path='*' element={<NotFound/>}></Route>
    </Routes>
    
  );
};

export default Routees;