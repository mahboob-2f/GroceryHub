import React from 'react';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { useParams } from 'react-router';
import { categories } from '../assets/assets';
import ProductCard from '../components/ProductCard';

const ProductCategory = () => {

    const {products}= useContext(AppContext);
    const {category}= useParams();

    const searchCategory= categories.find((item)=>item.path.toLowerCase()===category);
    const fileteredProducts = products.filter((item)=>item.category.toLowerCase()===category);

  return (
    <div className='mt-16'>
      {
        searchCategory && 
        <div className='flex flex-col items-end w-max'>
            <p className='text-2xl font-medium'>{searchCategory.text.toUpperCase()}</p>
            <div className='w-16 h-0.5 bg-primary rounded-full'></div>
        </div>
      }
      {
        fileteredProducts.length > 0 ?
        (
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md: gap-6 lg:grid-cols-5 mt-6'>
                {
                    fileteredProducts.map((_,index)=>(
                        <ProductCard key={index} product={_} />
                    ))
                }
            </div>
        )
        :
        (
            <div className='flex items-center justify-center h-[60vh]'>
                <p className='text-2xl font-medium text-primary'>No Products found in this category</p>
            </div>
        )
      }
    </div>
  );
};

export default ProductCategory;