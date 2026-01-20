import React from 'react';
import { Routes ,Route } from 'react-router';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import AllProducts from './pages/AllProducts';
import ProductCategory from './pages/ProductCategory';


const Routees = () => {
  return (
    <Routes>
        <Route path ='/' element={<Home/>}></Route>
        <Route path='/products' element={<AllProducts />}/>
        <Route path='/products/:category' element={<ProductCategory /> } />

        <Route path='*' element={<NotFound/>}></Route>
    </Routes>
    
  );
};

export default Routees;