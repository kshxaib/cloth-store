import { useEffect, useState } from 'react';
import { getAllOrders, updateOrderStatus } from '../../api/orderApi';
import LoadingSpinner from '../../components/LoadingSpinner';

const ManageOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrder, setExpandedOrder] = useState(null);
    const [updatingStatus, setUpdatingStatus] = useState(null);
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const data = await getAllOrders();
            // Sort by createdAt desc
            const sorted = (data.orders || []).sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );
            setOrders(sorted);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
            showNotification('error', 'Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            setUpdatingStatus(orderId);
            const response = await updateOrderStatus(orderId, { status: newStatus });
            
            setOrders(prev =>
                prev.map(order => (order._id === orderId ? response.order : order))
            );
            
            showNotification('success', `Order status updated to ${newStatus}`);
        } catch (error) {
            console.error('Failed to update status:', error);
            showNotification('error', 'Failed to update order status');
        } finally {
            setUpdatingStatus(null);
        }
    };

    const showNotification = (type, message) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 3000);
    };

    const toggleOrderDetails = (orderId) => {
        setExpandedOrder(expandedOrder === orderId ? null : orderId);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'delivered':
                return 'bg-green-100 text-green-800';
            case 'shipped':
                return 'bg-blue-100 text-blue-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-yellow-100 text-yellow-800';
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div className="bg-black text-white py-8 mb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="font-display text-4xl md:text-5xl font-bold mb-2">
                        MANAGE ORDERS
                    </h1>
                    <p className="text-gray-400">Track and update customer orders</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Notification */}
                {notification && (
                    <div
                        className={`fixed top-4 right-4 z-50 px-6 py-4 rounded shadow-lg text-white font-bold transition-all transform ${
                            notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'
                        }`}
                    >
                        {notification.message}
                    </div>
                )}

                {orders.length > 0 ? (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div
                                key={order._id}
                                className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                            >
                                {/* Order Summary Row */}
                                <div className="p-6 flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between cursor-pointer" onClick={() => toggleOrderDetails(order._id)}>
                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                                        <div>
                                            <p className="text-xs font-bold text-gray-500 uppercase mb-1">Order ID</p>
                                            <p className="font-mono font-medium text-sm">#{order._id.slice(-6).toUpperCase()}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-500 uppercase mb-1">Customer</p>
                                            <p className="font-medium">{order.shippingAddress?.name || 'Guest'}</p>
                                            <p className="text-sm text-gray-500">{order.user?.email}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-500 uppercase mb-1">Date</p>
                                            <p className="text-sm">{formatDate(order.createdAt)}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-500 uppercase mb-1">Total</p>
                                            <p className="font-bold">₹{order.totalPrice}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 w-full lg:w-auto mt-4 lg:mt-0 justify-between lg:justify-end" onClick={(e) => e.stopPropagation()}>
                                        <div className="relative">
                                            <select
                                                value={order.status}
                                                onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                                                disabled={updatingStatus === order._id}
                                                className={`appearance-none pl-3 pr-8 py-2 rounded-full text-xs font-bold uppercase tracking-wider cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors ${getStatusColor(
                                                    order.status
                                                )}`}
                                            >
                                                <option value="confirmed">Confirmed</option>
                                                <option value="shipped">Shipped</option>
                                                <option value="delivered">Delivered</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                        </div>
                                        
                                        <button 
                                            onClick={() => toggleOrderDetails(order._id)}
                                            className="ml-4 p-2 hover:bg-gray-100 rounded-full transition"
                                        >
                                            <svg 
                                                className={`w-5 h-5 transition-transform duration-300 ${expandedOrder === order._id ? 'rotate-180' : ''}`} 
                                                fill="none" 
                                                stroke="currentColor" 
                                                viewBox="0 0 24 24"
                                            >
                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                {/* Expanded Details */}
                                {expandedOrder === order._id && (
                                    <div className="border-t border-gray-100 bg-gray-50 p-6 animate-fadeIn">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            {/* Order Items */}
                                            <div>
                                                <h4 className="font-bold text-sm uppercase tracking-wide mb-4 text-gray-500">
                                                    Order Items ({order.items?.length || 0})
                                                </h4>
                                                <div className="space-y-4">
                                                    {order.items?.map((item, index) => (
                                                        <div key={index} className="flex gap-4 bg-white p-3 border border-gray-200">
                                                            <div className="w-16 h-16 bg-gray-100 flex-shrink-0">
                                                                {/* Assuming product might populate images, fallback otherwise */}
                                                                <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400 text-xs">
                                                                    IMG
                                                                </div>
                                                            </div>
                                                            <div className="flex-1">
                                                                <p className="font-bold text-sm mb-1">{item.title}</p>
                                                                <p className="text-xs text-gray-500 mb-1">Size: {item.size}</p>
                                                                <div className="flex justify-between items-center text-sm">
                                                                    <span>Qty: {item.quantity}</span>
                                                                    <span className="font-semibold">₹{item.price * item.quantity}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Shipping & Payment */}
                                            <div className="space-y-6">
                                                <div className="bg-white p-4 border border-gray-200">
                                                    <h4 className="font-bold text-sm uppercase tracking-wide mb-3 text-gray-500">
                                                        Shipping Details
                                                    </h4>
                                                    <p className="font-bold mb-1">{order.shippingAddress?.name}</p>
                                                    <p className="text-sm text-gray-600">
                                                        {order.shippingAddress?.address}<br />
                                                        {order.shippingAddress?.city}, {order.shippingAddress?.postalCode}<br />
                                                        {order.shippingAddress?.country}<br />
                                                        Phone: {order.shippingAddress?.phone}
                                                    </p>
                                                </div>

                                                  <div className="bg-white p-4 border border-gray-200">
                                                    <h4 className="font-bold text-sm uppercase tracking-wide mb-3 text-gray-500">
                                                        Payment Info
                                                    </h4>
                                                    <div className="flex justify-between text-sm mb-2">
                                                        <span className="text-gray-600">Method</span>
                                                        <span className="font-semibold">PayPal / Card</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm mb-2">
                                                        <span className="text-gray-600">Payment Status</span>
                                                        <span className="font-semibold text-green-600">Paid</span>
                                                    </div>
                                                     <div className="border-t border-gray-100 my-2 pt-2">
                                                        <div className="flex justify-between font-bold">
                                                            <span>Total Paid</span>
                                                            <span>₹{order.totalPrice}</span>
                                                        </div>
                                                     </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white border-2 border-dashed border-gray-300">
                         <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <p className="text-gray-500 text-lg mb-4">No orders found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageOrders;
