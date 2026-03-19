import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import ProductCard from '../components/ProductCard';

const AllProducts = () => {

  const { products,loading, searchQuery } = useContext(AppContext);
  const [fileteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    if (searchQuery.length > 0) {
      setFilteredProducts(products.filter(product => {
        return product.name.toLowerCase().includes(searchQuery.toLowerCase());
      }))
    } else setFilteredProducts(products);
  }, [products, searchQuery])
  if (loading) {
  return (
    <div className="flex items-center justify-center min-h-[60vh] sm:min-h-[65vh] md:min-h-[70vh] lg:min-h-[33vh]">
      <div className="spinner w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14"></div>
    </div>
  );
}

  return (
    <div className='mt-16 flex flex-col'>
      <div className='flex flex-col items-end   w-max'>
        <p className='text-2xl font-medium uppercase'>All Products</p>
        <div className='w-16 h-0.5 bg-primary rounded-full'></div>
      </div>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 lg:grid-cols-5 mt-6'>
        {
          fileteredProducts.filter(product => product.inStock).map((product, index) => (
            <ProductCard key={index} product={product} />
          ))
        }
      </div>
    </div>
  );
};

export default AllProducts;