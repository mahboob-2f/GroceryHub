import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import ButtonLoader from '../../components/ButtonLoader';

const ProductList = () => {
    const { products, currency, axios, fetchProducts } = useContext(AppContext);
    const [loading, setLoading] = useState(false);
    const [updatingId, setUpdatingId] = useState(null);

    const toggleStock = async (id, inStock) => {
        setUpdatingId(id);
        try {
            const { data } = await axios.post('/api/product/stock', { id, inStock }, { withCredentials: true });
            if (data.success) {
                await fetchProducts();
                toast.success(data.message);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
        finally {
            setUpdatingId(null)
        }
    }
    useEffect(() => {
        const loadProducts = async () => {
            setLoading(true); 
            try {
                await fetchProducts();
            } catch (error) {
                toast.error(error.message);
            } finally {
                setLoading(false);  
            }
        };

        loadProducts();
    }, []);


    return (
        <div>
            {
                loading ?
                    (
                        <div className="flex-1 h-[95vh] overflow-hidden p-4 md:p-10 w-[80vw]">
                            <div className="w-full max-w-4xl rounded-2xl border border-gray-200 bg-white shadow-sm p-6 md:p-8">
                                <div className="flex items-center gap-4">
                                    <div className="relative w-14 h-14 flex items-center justify-center">
                                        <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
                                        <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                                        <div className="w-5 h-5 rounded-full bg-primary/20"></div>
                                    </div>

                                    <div>
                                        <div>
                                            <p className="text-2xl font-semibold text-gray-800">Fetching Current Product...</p>
                                            <p className="text-sm text-gray-500 mt-1">Please wait while product stock is being updated.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 space-y-4">
                                    <div className="h-24 rounded-xl bg-gray-100 animate-pulse"></div>
                                    <div className="h-24 rounded-xl bg-gray-100 animate-pulse"></div>
                                    <div className="h-24 rounded-xl bg-gray-100 animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                    )
                    :
                    (
                        <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll flex flex-col justify-between w-[80vw] items-center">
                            <div className="w-full md:p-10 p-4">
                                <h2 className="pb-4 text-lg font-medium">All Products</h2>
                                <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
                                    <table className="md:table-auto table-fixed w-full overflow-hidden">
                                        <thead className="text-gray-900 text-sm text-left">
                                            <tr>
                                                <th className="px-4 py-3 font-semibold truncate">Product</th>
                                                <th className="px-4 py-3 font-semibold truncate">Category</th>
                                                <th className="px-4 py-3 font-semibold truncate hidden md:block">Selling Price</th>
                                                <th className="px-4 py-3 font-semibold truncate">In Stock</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-sm text-gray-500">
                                            {products.map((product) => (
                                                <tr key={product._id} className="border-t border-gray-500/20">
                                                    <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate">
                                                        <div className="border border-gray-300 rounded overflow-hidden">
                                                            <img src={product.image[0]} alt="Product" className="w-16" />
                                                        </div>
                                                        <span className="truncate max-sm:hidden w-full">{product.name}</span>
                                                    </td>
                                                    <td className="px-4 py-3">{product.category}</td>
                                                    <td className="px-4 py-3 max-sm:hidden">{currency}{product.offerPrice}</td>
                                                    <td className="px-4 py-3">
                                                        <label className="relative inline-flex items-center cursor-pointer text-gray-900 gap-3">
                                                            <input disabled={updatingId === product._id} onChange={() => toggleStock(product._id, !product.inStock)} checked={product.inStock} type="checkbox" className="sr-only peer" />
                                                            <div className="w-12 h-7 bg-slate-300 rounded-full peer peer-checked:bg-blue-600 transition-colors duration-200"></div>
                                                            <span className="dot absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5"></span>
                                                        </label>
                                                        {updatingId === product._id && <ButtonLoader className='h-3.5 w-3.5 text-primary' />}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )
            }
        </div>
    );
};

export default ProductList;
