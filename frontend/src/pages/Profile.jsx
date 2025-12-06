import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getMyOrders } from '../api/orderApi';
import { updateProfile } from '../api/authApi';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const Profile = () => {
  const { user, checkAuth } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'info';
  
  // Profile form state
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        street: user.address?.street || '',
        city: user.address?.city || '',
        state: user.address?.state || '',
        pincode: user.address?.pincode || '',
      });
    }
  }, [user]);

  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [activeTab]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getMyOrders();
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setMessage('');
      
      await updateProfile({
        name: formData.name,
        phone: formData.phone,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
        }
      });
      
      await checkAuth(); // Refresh user data
      setEditing(false);
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user.name || '',
      phone: user.phone || '',
      street: user.address?.street || '',
      city: user.address?.city || '',
      state: user.address?.state || '',
      pincode: user.address?.pincode || '',
    });
    setEditing(false);
    setMessage('');
  };

  const getStatusColor = (status) => {
    const colors = {
      confirmed: 'bg-blue-100 text-blue-800 border-blue-300',
      shipped: 'bg-purple-100 text-purple-800 border-purple-300',
      delivered: 'bg-green-100 text-green-800 border-green-300',
      cancelled: 'bg-red-100 text-red-800 border-red-300',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-black text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-5xl md:text-6xl font-bold mb-4">
            MY ACCOUNT
          </h1>
          <p className="text-xl text-gray-300">
            {user?.name}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Tabs */}
        <div className="flex gap-6 mb-12 border-b-2 border-gray-200">
          <a
            href="?tab=info"
            className={`pb-4 px-2 font-semibold uppercase tracking-wide transition border-b-2 ${
              activeTab === 'info'
                ? 'border-black text-black'
                : 'border-transparent text-gray-500 hover:text-black'
            }`}
          >
            Profile Information
          </a>
          <a
            href="?tab=orders"
            className={`pb-4 px-2 font-semibold uppercase tracking-wide transition border-b-2 ${
              activeTab === 'orders'
                ? 'border-black text-black'
                : 'border-transparent text-gray-500 hover:text-black'
            }`}
          >
            My Orders
          </a>
        </div>

        {/* Content */}
        {activeTab === 'info' ? (
          <div className="max-w-3xl">
            {message && (
              <div className={`mb-6 p-4 border-2 ${
                message.includes('success') ? 'bg-green-50 border-green-600 text-green-800' : 'bg-red-50 border-red-600 text-red-800'
              }`}>
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Personal Information */}
              <div className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold uppercase tracking-wide">
                    Personal Information
                  </h2>
                  {!editing && (
                    <button
                      type="button"
                      onClick={() => setEditing(true)}
                      className="px-6 py-2 border-2 border-black font-semibold hover:bg-gray-100 transition"
                    >
                      EDIT
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2 uppercase tracking-wide">
                      Full Name
                    </label>
                    {editing ? (
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:border-gray-600"
                      />
                    ) : (
                      <p className="text-lg py-3">{user?.name || '-'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 uppercase tracking-wide">
                      Email Address
                    </label>
                    <p className="text-lg py-3 text-gray-600">{user?.email}</p>
                    <p className="text-xs text-gray-500">Email cannot be changed</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 uppercase tracking-wide">
                      Phone Number
                    </label>
                    {editing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter phone number"
                        className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:border-gray-600"
                      />
                    ) : (
                      <p className="text-lg py-3">{user?.phone || '-'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 uppercase tracking-wide">
                      Account Type
                    </label>
                    <span className={`inline-block px-4 py-2 border-2 font-semibold ${
                      user?.role === 'admin' ? 'border-black bg-black text-white' : 'border-gray-300'
                    }`}>
                      {user?.role?.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div>
                <h2 className="text-2xl font-bold mb-6 uppercase tracking-wide">
                  Saved Address
                </h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2 uppercase tracking-wide">
                      Street Address
                    </label>
                    {editing ? (
                      <input
                        type="text"
                        name="street"
                        value={formData.street}
                        onChange={handleChange}
                        placeholder="Enter street address"
                        className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:border-gray-600"
                      />
                    ) : (
                      <p className="text-lg py-3">{user?.address?.street || '-'}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-semibold mb-2 uppercase tracking-wide">
                        City
                      </label>
                      {editing ? (
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          placeholder="City"
                          className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:border-gray-600"
                        />
                      ) : (
                        <p className="text-lg py-3">{user?.address?.city || '-'}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2 uppercase tracking-wide">
                        State
                      </label>
                      {editing ? (
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          placeholder="State"
                          className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:border-gray-600"
                        />
                      ) : (
                        <p className="text-lg py-3">{user?.address?.state || '-'}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2 uppercase tracking-wide">
                        Pincode
                      </label>
                      {editing ? (
                        <input
                          type="text"
                          name="pincode"
                          value={formData.pincode}
                          onChange={handleChange}
                          placeholder="Pincode"
                          className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:border-gray-600"
                        />
                      ) : (
                        <p className="text-lg py-3">{user?.address?.pincode || '-'}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {editing && (
                <div className="flex gap-4 mt-8">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-8 py-4 bg-black text-white font-bold hover:bg-gray-800 transition disabled:opacity-50"
                  >
                    {saving ? 'SAVING...' : 'SAVE CHANGES'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-8 py-4 border-2 border-black font-bold hover:bg-gray-100 transition"
                  >
                    CANCEL
                  </button>
                </div>
              )}
            </form>
          </div>
        ) : (
          <div>
            {orders.length > 0 ? (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order._id} className="border-2 border-gray-200 p-6">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">
                          Order #{order._id.slice(-8).toUpperCase()}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <span className={`px-4 py-2 text-sm font-bold uppercase border-2 ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>

                    <div className="space-y-3 mb-6">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between">
                          <span className="text-gray-700">
                            {item.title} × {item.quantity}
                            {item.size && ` (${item.size})`}
                          </span>
                          <span className="font-semibold">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="border-t-2 border-gray-200 pt-4">
                      <div className="flex justify-between text-xl font-bold">
                        <span>Total</span>
                        <span>₹{order.totalPrice.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <svg className="w-24 h-24 mx-auto mb-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <p className="text-gray-500 text-xl">No orders yet</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
