import React from 'react';
import { Routes ,Route } from 'react-router';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import AllProducts from './pages/AllProducts';
import ProductCategory from './pages/ProductCategory';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import AddAddress from './pages/AddAddress';
import MyOrders from './pages/MyOrders';


const Routees = () => {
  return (
    <Routes>
        <Route path ='/' element={<Home/>}></Route>
        <Route path='/products' element={<AllProducts />}/>
        <Route path='/products/:category' element={<ProductCategory /> } />
        <Route path='/products/:category/:id' element={<ProductDetails />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/add-address' element={<AddAddress />} />
        <Route path='/my-orders' element={<MyOrders />} />

        <Route path='*' element={<NotFound/>}></Route>
    </Routes>
    
  );
};

export default Routees;