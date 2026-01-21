import React, { useContext } from 'react';
import ProductCard from './ProductCard';
import { AppContext } from '../context/AppContext';

const BestSeller = () => {
  const {products} = useContext(AppContext);
  // console.log(product);
  
  return (
    <div className='mt-16'>
      <p className='text-2xl md:text-3xl font-medium'>Best Sellers</p>
      <div className='grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6 '>
        {
          products.filter((product)=>product.inStock).slice(0,5).map((product,index)=>(
            <ProductCard key={index} product={product }/>
          ))
        }
      </div>
    </div>
  );
};

export default BestSeller;