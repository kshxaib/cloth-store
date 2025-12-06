import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { getCart } from '../api/cartApi';
import { createOrder } from '../api/orderApi';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const Checkout = () => {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const { user } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  useEffect(() => {
    // Auto-fill form with saved address
    if (user) {
      setValue('name', user.name || '');
      setValue('phone', user.phone || '');
      setValue('street', user.address?.street || '');
      setValue('city', user.address?.city || '');
      setValue('state', user.address?.state || '');
      setValue('pincode', user.address?.pincode || '');
    }
  }, [user, setValue]);

  const fetchCart = async () => {
    try {
      const data = await getCart();
      setCart(data.cart);
      if (!data.cart || data.cart.items.length === 0) {
        navigate('/cart');
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      setError('');

      const orderData = {
        items: cart.items.map(item => ({
          product: item.product._id,
          quantity: item.quantity,
          size: item.size,
        })),
        shippingAddress: {
          name: data.name,
          address: `${data.street}, ${data.city}, ${data.state}`,
          city: data.city,
          postalCode: data.pincode,
          country: 'India',
          phone: data.phone,
        },
      };

      await createOrder(orderData);
      navigate('/profile?tab=orders');
    } catch (err) {
      setError(err.message || 'Failed to create order');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!cart || cart.items.length === 0) return null;

  const cartTotal = cart.items.reduce(
    (sum, item) => sum + item.priceAtPurchase * item.quantity,
    0
  );
  
  // INR conversion
  const cartTotalINR = cartTotal;
  const shippingCostINR = cartTotalINR >= 1000 ? 0 : 100;
  const totalINR = cartTotalINR + shippingCostINR;

  // Check if user has saved address
  const hasAddress = user?.address?.street && user?.address?.city && user?.address?.state && user?.address?.pincode;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-5xl md:text-6xl font-bold mb-4">
            CHECKOUT
          </h1>
          <p className="text-xl text-gray-300">
            Review your order and complete payment
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Address Warning */}
        {!hasAddress && (
          <div className="mb-8 p-6 bg-yellow-50 border-2 border-yellow-400">
            <div className="flex items-start gap-4">
              <svg className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <h3 className="font-bold text-yellow-900 mb-2">No Saved Address Found</h3>
                <p className="text-yellow-800 mb-4">
                  Please add your address in your profile for faster checkout in the future.
                </p>
                <Link to="/profile" className="inline-block px-4 py-2 bg-yellow-600 text-white font-semibold hover:bg-yellow-700 transition">
                  GO TO PROFILE
                </Link>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Shipping Form */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6 uppercase tracking-wide">
              Shipping Information
            </h2>

            {error && (
              <div className="bg-red-50 border-2 border-red-600 text-red-800 px-4 py-3 mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2 uppercase tracking-wide">
                  Full Name *
                </label>
                <input
                  {...register('name', { required: 'Name is required' })}
                  className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:border-gray-600"
                  placeholder="Enter your full name"
                />
                {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 uppercase tracking-wide">
                  Phone Number *
                </label>
                <input
                  {...register('phone', { required: 'Phone is required' })}
                  type="tel"
                  className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:border-gray-600"
                  placeholder="10-digit mobile number"
                />
                {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 uppercase tracking-wide">
                  Street Address *
                </label>
                <input
                  {...register('street', { required: 'Street address is required' })}
                  className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:border-gray-600"
                  placeholder="House no., Building name, Street"
                />
                {errors.street && <p className="text-sm text-red-600 mt-1">{errors.street.message}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-2 uppercase tracking-wide">
                    City *
                  </label>
                  <input
                    {...register('city', { required: 'City is required' })}
                    className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:border-gray-600"
                    placeholder="City"
                  />
                  {errors.city && <p className="text-sm text-red-600 mt-1">{errors.city.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 uppercase tracking-wide">
                    State *
                  </label>
                  <input
                    {...register('state', { required: 'State is required' })}
                    className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:border-gray-600"
                    placeholder="State"
                  />
                  {errors.state && <p className="text-sm text-red-600 mt-1">{errors.state.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 uppercase tracking-wide">
                    Pincode *
                  </label>
                  <input
                    {...register('pincode', { 
                      required: 'Pincode is required',
                      pattern: {
                        value: /^[1-9][0-9]{5}$/,
                        message: 'Invalid pincode'
                      }
                    })}
                    className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:border-gray-600"
                    placeholder="6-digit code"
                    maxLength={6}
                  />
                  {errors.pincode && <p className="text-sm text-red-600 mt-1">{errors.pincode.message}</p>}
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-5 bg-black text-white font-bold text-lg hover:bg-gray-800 transition disabled:opacity-50"
              >
                {submitting ? 'PLACING ORDER...' : 'PLACE ORDER'}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 bg-gray-50 p-8">
              <h2 className="text-2xl font-bold mb-6 uppercase tracking-wide">
                Summary
              </h2>

              <div className="space-y-4 mb-6">
                {cart.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span className="text-gray-700">
                      {item.product?.title} × {item.quantity}
                      {item.size && ` (${item.size})`}
                    </span>
                    <span className="font-semibold">
                      ₹{(item.priceAtPurchase * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t-2 border-gray-300 pt-6 space-y-4 mb-6">
                <div className="flex justify-between text-lg">
                  <span className="text-gray-700">Subtotal</span>
                  <span className="font-semibold">₹{cartTotalINR.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg">
                  <span className="text-gray-700">Shipping</span>
                  <span className="font-semibold">
                    {shippingCostINR === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      `₹${shippingCostINR.toFixed(2)}`
                    )}
                  </span>
                </div>
              </div>

              <div className="border-t-2 border-black pt-6 mb-6">
                <div className="flex justify-between text-2xl font-bold">
                  <span>Total</span>
                  <span>₹{totalINR.toFixed(2)}</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Including all taxes
                </p>
              </div>

              <div className="text-sm text-gray-600 space-y-2">
                <p className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Secure checkout
                </p>
                <p className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Easy returns & exchanges
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
