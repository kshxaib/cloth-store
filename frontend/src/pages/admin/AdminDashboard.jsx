import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAdminStats } from '../../api/adminApi';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await getAdminStats();
      setStats(data.stats);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  const getStatusColor = (status) => {
    const colors = {
      confirmed: 'bg-blue-100 text-blue-800 border-blue-300',
      shipped: 'bg-purple-100 text-purple-800 border-purple-300',
      delivered: 'bg-green-100 text-green-800 border-green-300',
      cancelled: 'bg-red-100 text-red-800 border-red-300',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  // Convert to INR
  const totalRevenueINR = Number(stats?.totalRevenue || 0);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-black text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-5xl md:text-6xl font-bold mb-4">
            ADMIN DASHBOARD
          </h1>
          <p className="text-xl text-gray-300">
            Manage your store and monitor performance
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Quick Actions */}
        <div className="flex flex-wrap gap-4 mb-12">
          <Link 
            to="/admin/products/create" 
            className="px-6 py-3 bg-black text-white font-bold hover:bg-gray-800 transition"
          >
            ADD PRODUCT
          </Link>
          <Link 
            to="/admin/categories" 
            className="px-6 py-3 border-2 border-black font-bold hover:bg-gray-100 transition"
          >
            MANAGE CATEGORIES
          </Link>
          <Link 
            to="/admin/products" 
            className="px-6 py-3 border-2 border-black font-bold hover:bg-gray-100 transition"
          >
            ALL PRODUCTS
          </Link>
          <Link 
            to="/admin/orders" 
            className="px-6 py-3 border-2 border-black font-bold hover:bg-gray-100 transition"
          >
            ALL ORDERS
          </Link>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gray-50 p-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                Total Users
              </h3>
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <p className="text-5xl font-bold">{stats?.totalUsers || 0}</p>
          </div>

          <div className="bg-gray-50 p-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                Total Orders
              </h3>
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <p className="text-5xl font-bold">{stats?.totalOrders || 0}</p>
          </div>

          <div className="bg-gray-50 p-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                Total Revenue
              </h3>
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-5xl font-bold">₹{totalRevenueINR.toFixed(0)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <div>
            <h2 className="text-2xl font-bold mb-6 uppercase tracking-wide flex items-center justify-between">
              Recent Orders
              <Link to="/admin/orders" className="text-sm font-semibold underline hover:no-underline">
                View All
              </Link>
            </h2>
            <div className="space-y-4">
              {stats?.recentOrders?.map((order) => (
                <div key={order._id} className="bg-gray-50 p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-bold text-lg">#{order._id.slice(-8).toUpperCase()}</p>
                      <p className="text-sm text-gray-600">{order.user?.name || 'Guest'}</p>
                    </div>
                    <span className={`px-3 py-1 text-xs font-bold uppercase border-2 ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                    <span className="text-xl font-bold">₹{order.totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              ))}
              {(!stats?.recentOrders || stats.recentOrders.length === 0) && (
                <div className="text-center py-12 bg-gray-50">
                  <p className="text-gray-500">No recent orders</p>
                </div>
              )}
            </div>
          </div>

          {/* Top Products */}
          <div>
            <h2 className="text-2xl font-bold mb-6 uppercase tracking-wide">
              Top Selling Products
            </h2>
            <div className="space-y-4">
              {stats?.topProducts?.map((item, index) => {
                 const product = item._id;
                 if (!product) return null; // Skip if product is deleted
                 
                 return (
                <div key={product._id || index} className="bg-gray-50 p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-black text-white flex items-center justify-center font-bold text-xl flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold mb-1">{product.title || 'Unknown Product'}</p>
                      <p className="text-sm text-gray-600">{item.totalQuantity} units sold</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold">₹{item.totalRevenue.toFixed(0)}</p>
                    </div>
                  </div>
                </div>
              )})}
              {(!stats?.topProducts || stats.topProducts.length === 0) && (
                <div className="text-center py-12 bg-gray-50">
                  <p className="text-gray-500">No sales data yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
