import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { assets, dummyOrders } from '../../assets/assets';
import toast from 'react-hot-toast';

const Orders = () => {
    const { currency, axios } = useContext(AppContext);
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get('/api/order/seller', { withCredentials: true });
            if (data.success) setOrders(data.orders);
            else toast.error(data.message);
        } catch (error) {
            toast.error(error.message);
        }
        finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchOrders();
    }, [])

    return (
        <>
            {
                loading ?
                    (
                         <div className="flex-1 h-[95vh] overflow-hidden p-4 md:p-10">
                            <div className="w-full max-w-4xl rounded-2xl border border-gray-200 bg-white shadow-sm p-6 md:p-8">
                                <div className="flex items-center gap-4">
                                    <div className="relative w-14 h-14 flex items-center justify-center">
                                        <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
                                        <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                                        <div className="w-5 h-5 rounded-full bg-primary/20"></div>
                                    </div>

                                    <div>
                                        <p className="text-2xl font-semibold text-gray-800">Loading Orders...</p>
                                        <p className="text-sm text-gray-500 mt-1">Please wait while your orders are being fetched.</p>
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
                        <div>
                            {
                                orders.length > 0 ?
                                    (<div className='no-scrollbar flex-1 h-[95vh] overflow-scroll '>
                                        <div className="md:p-10 p-4 space-y-4">
                                            <h2 className="text-lg font-medium">Orders List</h2>
                                            {orders.map((order, index) => (
                                                <div key={index} className="flex flex-col md:flex-row justify-between md:items-center gap-5 p-5 max-w-4xl rounded-md border border-gray-300 ">
                                                    <div className="flex gap-5 w-80">
                                                        <img className="w-12 h-12 object-cover  " src={assets.box_icon} alt="boxIcon" />
                                                        <div>
                                                            {order.items.map((item, index) => (
                                                                <div key={index} className="flex flex-col    ">
                                                                    <p className="font-medium">
                                                                        {item.product.name} {" "} <span className='text-primary'>x {item.quantity}</span>
                                                                    </p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div className="text-sm md:text-base text-black/60">
                                                        <p className='text-black/80'>{order.address.firstName}, {order.address.lastName}</p>
                                                        <p>{order.address.street}, {order.address.city}</p> <p> {order.address.state}, {order.address.zipcode}, {order.address.country}</p>
                                                        <p></p>
                                                        <p>{order.address.phone}</p>
                                                    </div>

                                                    <p className="font-medium text-lg my-auto ">{currency}{order.amount}</p>

                                                    <div className="flex flex-col text-sm md:text-black text-black/60 ">
                                                        <p>Method: {order.paymentType}</p>
                                                        <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                                                        <p>Payment: {order.isPaid ? "Paid" : "Pending"}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>)
                                    :
                                    (
                                        <div className='border-2 border-gray-300 rounded-lg p-8 py-10 text-center bg-white text-gray-500/70'>
                                            <p className='text-xl font-bold text-gray-700 mb-2'>No Orders Found</p>
                                            <p className='text-sm'>You haven’t any orders yet.</p>
                                        </div>
                                    )
                            }


                        </div>
                    )
            }
        </>

    );
};

export default Orders;