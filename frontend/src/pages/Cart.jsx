import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCart, updateCart, clearCart } from '../api/cartApi';
import LoadingSpinner from '../components/LoadingSpinner';

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const data = await getCart();
      setCart(data.cart);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (productId, quantity, size) => {
    try {
      const data = await updateCart({ productId, quantity, size });
      setCart(data.cart);
    } catch (error) {
      console.error('Failed to update cart:', error);
    }
  };

  const handleRemoveItem = async (productId, size) => {
    try {
      setRemoving(`${productId}-${size}`);
      await updateCart({ productId, quantity: 0, size });
      // Refresh cart
      await fetchCart();
    } catch (error) {
      console.error('Failed to remove item:', error);
    } finally {
      setRemoving(null);
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your entire cart?')) {
      try {
        await clearCart();
        setCart({ ...cart, items: [] });
      } catch (error) {
        console.error('Failed to clear cart:', error);
      }
    }
  };

  if (loading) return <LoadingSpinner />;

  const cartTotal = cart?.items?.reduce(
    (sum, item) => sum + item.priceAtPurchase * item.quantity,
    0
  ) || 0;

  // Convert to INR - Free shipping over ₹1000
  const cartTotalINR = cartTotal;
  const shippingCostINR = cartTotalINR >= 1000 ? 0 : 100;
  const totalINR = cartTotalINR + shippingCostINR;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-black text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-5xl md:text-6xl font-bold mb-4">
            YOUR CART
          </h1>
          <p className="text-xl text-gray-300">
            {cart?.items?.length || 0} {cart?.items?.length === 1 ? 'item' : 'items'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!cart || cart.items.length === 0 ? (
          <div className="text-center py-20">
            <svg className="w-24 h-24 mx-auto mb-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <h2 className="text-3xl font-bold mb-4">Your cart is empty</h2>
            <p className="text-gray-500 text-lg mb-8">Start adding some amazing products!</p>
            <Link 
              to="/products" 
              className="inline-block px-10 py-4 bg-black text-white font-bold hover:bg-gray-800 transition-colors"
            >
              START SHOPPING
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-0 divide-y-2 divide-gray-200">
              {cart.items.map((item, idx) => (
                <div 
                  key={idx} 
                  className={`py-8 transition-opacity ${
                    removing === `${item.product._id}-${item.size}` ? 'opacity-50' : ''
                  }`}
                >
                  <div className="flex gap-6">
                    {/* Product Image - Clickable */}
                    <Link 
                      to={`/products/${item.product._id}`}
                      className="flex-shrink-0"
                    >
                      <img
                        src={item.product?.images?.[0]?.url || 'https://via.placeholder.com/150'}
                        alt={item.product?.title}
                        className="w-32 h-32 object-cover hover:opacity-75 transition-opacity"
                      />
                    </Link>
                    
                    <div className="flex-1">
                      {/* Product Title - Clickable */}
                      <Link 
                        to={`/products/${item.product._id}`}
                        className="block"
                      >
                        <h3 className="font-bold text-xl mb-2 hover:underline">
                          {item.product?.title}
                        </h3>
                      </Link>

                      {/* Size */}
                      {item.size && (
                        <p className="text-sm text-gray-600 mb-3">
                          Size: <span className="font-semibold">{item.size}</span>
                        </p>
                      )}

                      {/* Price */}
                      <p className="text-2xl font-bold mb-6">
                        ₹{item.priceAtPurchase.toFixed(2)}
                      </p>

                      <div className="flex items-center gap-6">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleUpdateQuantity(item.product._id, item.quantity - 1, item.size)}
                            disabled={item.quantity <= 1}
                            className="w-10 h-10 border border-black font-bold hover:bg-gray-100 transition disabled:opacity-30"
                          >
                            -
                          </button>
                          <span className="text-lg font-semibold w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleUpdateQuantity(item.product._id, item.quantity + 1, item.size)}
                            className="w-10 h-10 border border-black font-bold hover:bg-gray-100 transition"
                          >
                            +
                          </button>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => handleRemoveItem(item.product._id, item.size)}
                          disabled={removing === `${item.product._id}-${item.size}`}
                          className="text-gray-600 hover:text-black font-medium transition disabled:opacity-50 underline"
                        >
                          {removing === `${item.product._id}-${item.size}` ? 'Removing...' : 'Remove'}
                        </button>
                      </div>
                    </div>

                    {/* Item Subtotal */}
                    <div className="text-right">
                      <p className="text-xl font-bold">
                        ₹{(item.priceAtPurchase * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Clear Cart Button */}
              <div className="pt-6">
                <button
                  onClick={handleClearCart}
                  className="text-red-600 hover:text-red-800 font-medium underline"
                >
                  Clear entire cart
                </button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-4 bg-gray-50 p-8">
                <h2 className="text-2xl font-bold mb-8 uppercase tracking-wide">
                  Summary
                </h2>
                
                <div className="space-y-4 mb-6">
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
                  {cartTotalINR < 1000 && (
                    <div className="pt-2 text-sm text-gray-600">
                      Spend <span className="font-bold text-black">₹{(1000 - cartTotalINR).toFixed(2)}</span> more for free shipping
                    </div>
                  )}
                </div>

                <div className="border-t-2 border-gray-300 pt-6 mb-8">
                  <div className="flex justify-between text-2xl font-bold">
                    <span>Total</span>
                    <span>₹{totalINR.toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Including all taxes
                  </p>
                </div>

                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full py-5 bg-black text-white font-bold text-lg hover:bg-gray-800 transition-colors"
                >
                  CHECKOUT
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
