import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProduct } from '../api/productApi';
import { updateCart } from '../api/cartApi';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { useNavigate } from 'react-router-dom';

const ProductDetail = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const data = await getProduct(id);
      setProduct(data.product);
      if (data.product.images && data.product.images.length > 0) {
        setSelectedImage(0);
      }
    } catch (error) {
      console.error('Failed to fetch product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      setMessage('Please select a size');
      return;
    }

    // Check if selected size has stock
    if (selectedSize) {
      const sizeInfo = product.sizes.find(s => s.size === selectedSize);
      if (sizeInfo && sizeInfo.stock === 0) {
        setMessage('Selected size is out of stock');
        return;
      }
      if (sizeInfo && quantity > sizeInfo.stock) {
        setMessage(`Only ${sizeInfo.stock} items available for this size`);
        return;
      }
    }

    try {
      setAdding(true);
      setMessage('');
      await updateCart({
        productId: product._id,
        quantity,
        size: selectedSize,
      });
      setMessage('✓ Added to cart successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.message || 'Failed to add to cart');
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!product) return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
      <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
      <Link to="/products" className="text-black underline">Back to Products</Link>
    </div>
  );

  const mainImage = product.images && product.images[selectedImage]
    ? product.images[selectedImage].url
    : 'https://via.placeholder.com/600x800?text=No+Image';

  // Get stock for selected size
  const selectedSizeStock = selectedSize 
    ? product.sizes.find(s => s.size === selectedSize)?.stock || 0
    : null;

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-gray-600 hover:text-black">Home</Link>
            <span className="text-gray-400">/</span>
            <Link to="/products" className="text-gray-600 hover:text-black">Products</Link>
            <span className="text-gray-400">/</span>
            {product.category && (
              <>
                <span className="text-gray-600">{product.category.name}</span>
                <span className="text-gray-400">/</span>
              </>
            )}
            <span className="text-black font-semibold">{product.title}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Images */}
          <div>
            <div className="mb-4 bg-gray-50 border-2 border-black">
              <img
                src={mainImage}
                alt={product.title}
                className="w-full aspect-[3/4] object-cover"
              />
            </div>
            
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`border-2 overflow-hidden transition ${
                      selectedImage === idx ? 'border-black' : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={`${product.title} ${idx + 1}`}
                      className="w-full aspect-square object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            {/* Category */}
            {product.category && (
              <p className="text-xs text-gray-500 mb-3 uppercase tracking-widest">
                {product.category.name}
              </p>
            )}
            
            {/* Title */}
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">
              {product.title}
            </h1>
            
            {/* Price */}
            <div className="text-4xl font-bold mb-8">
              ₹{product.price.toFixed(2)}
            </div>

            {/* Description */}
            <p className="text-gray-700 mb-8 leading-relaxed text-lg">
              {product.description}
            </p>

            {/* Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-8">
                <label className="block text-sm font-semibold mb-4 uppercase tracking-wide">
                  Select Size
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {product.sizes.map((s) => (
                    <button
                      key={s.size}
                      onClick={() => s.stock > 0 && setSelectedSize(s.size)}
                      disabled={s.stock === 0}
                      className={`relative px-4 py-4 border-2 font-semibold transition ${
                        selectedSize === s.size
                          ? 'border-black bg-black text-white'
                          : s.stock === 0
                          ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                          : 'border-black hover:bg-gray-50'
                      }`}
                    >
                      <span className={s.stock === 0 ? 'line-through' : ''}>{s.size}</span>
                      {s.stock === 0 && (
                        <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 text-xs text-red-600 whitespace-nowrap">
                          Out of Stock
                        </span>
                      )}
                    </button>
                  ))}
                </div>
                {selectedSize && selectedSizeStock !== null && (
                  <p className="mt-3 text-sm text-gray-600">
                    {selectedSizeStock > 0 ? (
                      <span className="text-green-600 font-semibold">
                        {selectedSizeStock} {selectedSizeStock === 1 ? 'item' : 'items'} available
                      </span>
                    ) : (
                      <span className="text-red-600 font-semibold">Out of Stock</span>
                    )}
                  </p>
                )}
              </div>
            )}

            {/* Quantity */}
            <div className="mb-8">
              <label className="block text-sm font-semibold mb-4 uppercase tracking-wide">
                Quantity
              </label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 border-2 border-black font-bold hover:bg-gray-100 transition"
                >
                  -
                </button>
                <span className="text-2xl font-semibold w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min((selectedSizeStock || 10), quantity + 1))}
                  className="w-12 h-12 border-2 border-black font-bold hover:bg-gray-100 transition"
                  disabled={selectedSizeStock && quantity >= selectedSizeStock}
                >
                  +
                </button>
              </div>
            </div>

            {/* Message */}
            {message && (
              <div className={`mb-6 p-4 border-2 ${
                message.includes('✓') ? 'bg-green-50 border-green-600 text-green-800' : 'bg-red-50 border-red-600 text-red-800'
              }`}>
                {message}
              </div>
            )}

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={adding || (selectedSize && selectedSizeStock === 0)}
              className="w-full py-5 bg-black text-white font-bold text-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-4"
            >
              {adding ? 'ADDING TO CART...' : 'ADD TO CART'}
            </button>

            <Link
              to="/products"
              className="block w-full py-5 border-2 border-black text-black font-bold text-lg hover:bg-gray-100 transition-colors text-center"
            >
              CONTINUE SHOPPING
            </Link>

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div className="mt-8 pt-8 border-t-2 border-gray-200">
                <h3 className="font-semibold mb-4 uppercase tracking-wide text-sm">
                  Available Colors
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 border-2 border-black text-sm font-semibold"
                    >
                      {color}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
