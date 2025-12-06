import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, deleteProduct, updateProductStock } from '../../api/productApi';
import LoadingSpinner from '../../components/LoadingSpinner';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedProduct, setExpandedProduct] = useState(null);
  const [stockUpdates, setStockUpdates] = useState({});
  const [savingStock, setSavingStock] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      // Fetch more to ensure we get a good list for grouping
      const data = await getProducts({ limit: 1000 });
      setProducts(data.products || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      showNotification('error', 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        setProducts(products.filter(p => p._id !== id));
        showNotification('success', 'Product deleted successfully');
      } catch (error) {
        console.error('Failed to delete product:', error);
        showNotification('error', 'Failed to delete product');
      }
    }
  };

  const handleStockChange = (size, newStock) => {
    setStockUpdates(prev => ({
      ...prev,
      [size]: parseInt(newStock) || 0
    }));
  };

  const openStockManagement = (product) => {
    setExpandedProduct(product._id === expandedProduct ? null : product._id);
    // Initialize stock updates with current values
    const initialStock = {};
    product.sizes.forEach(s => {
      initialStock[s.size] = s.stock;
    });
    setStockUpdates(initialStock);
  };

  const saveStock = async (product) => {
    try {
      setSavingStock(true);
      const updatedSizes = product.sizes.map(s => ({
        size: s.size,
        stock: stockUpdates[s.size] !== undefined ? stockUpdates[s.size] : s.stock
      }));

      // If there are new sizes in stockUpdates not in product.sizes (shouldn't happen with current UI but good safety)
      // Actually strictly only updating existing sizes per requirement "edit the stocks for each sizes"
      
      const res = await updateProductStock(product._id, { sizes: updatedSizes });
      
      // Update local state
      setProducts(products.map(p => p._id === product._id ? res.product : p));
      setExpandedProduct(null);
      showNotification('success', 'Stock updated successfully');
    } catch (error) {
      console.error('Failed to update stock:', error);
      showNotification('error', 'Failed to update stock');
    } finally {
      setSavingStock(false);
    }
  };

  // Group products by category
  const productsByCategory = products.reduce((acc, product) => {
    const categoryName = product.category?.name || 'Uncategorized';
    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }
    acc[categoryName].push(product);
    return acc;
  }, {});

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
       {/* Header */}
       <div className="bg-black text-white py-8 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-end">
          <div>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-2">
              MANAGE PRODUCTS
            </h1>
            <p className="text-gray-400">Inventory and catalog management</p>
          </div>
          <Link 
            to="/admin/products/create" 
            className="px-6 py-3 bg-white text-black font-bold hover:bg-gray-200 transition"
          >
            + ADD PRODUCT
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Notification */}
        {notification && (
          <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded shadow-lg text-white font-bold transition-all transform ${
            notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'
          }`}>
            {notification.message}
          </div>
        )}

        {Object.keys(productsByCategory).length > 0 ? (
          Object.entries(productsByCategory).map(([category, items]) => (
            <div key={category} className="mb-12">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="w-2 h-8 bg-black"></span>
                {category.toUpperCase()}
                <span className="text-sm font-normal text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
                  {items.length} items
                </span>
              </h2>
              
              <div className="space-y-4">
                {items.map((product) => {
                  // Calculate total stock from sizes
                  const totalStock = product.sizes?.reduce((acc, item) => acc + (item.stock || 0), 0) || 0;

                  return (
                    <div key={product._id} className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                      <div className="p-6 flex flex-col md:flex-row gap-6 items-start md:items-center">
                        <div className="w-24 h-24 bg-gray-100 flex-shrink-0">
                           <img
                            src={product.images?.[0]?.url || 'https://via.placeholder.com/80'}
                            alt={product.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-bold text-xl mb-1 truncate pr-4">{product.title}</h3>
                              <p className="text-sm text-gray-500 mb-2 truncate">{product.description}</p>
                              <div className="flex gap-4 text-sm">
                                <span className="font-semibold">₹{product.price}</span>
                                <span className={`${totalStock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  {totalStock > 0 ? `${totalStock} in stock` : 'Out of Stock'}
                                </span>
                              </div>
                            </div>
                            
                            <div className="flex gap-2 flex-shrink-0">
                               <button
                                onClick={() => openStockManagement(product)}
                                className={`px-4 py-2 text-sm font-bold border transition ${
                                  expandedProduct === product._id 
                                    ? 'bg-black text-white border-black' 
                                    : 'bg-white text-black border-gray-300 hover:border-black'
                                }`}
                              >
                                {expandedProduct === product._id ? 'CLOSE STOCK' : 'MANAGE STOCK'}
                              </button>                            
                              <button
                                onClick={() => handleDelete(product._id)}
                                className="w-10 h-10 flex items-center justify-center border border-gray-300 hover:border-red-500 hover:text-red-500 transition"
                                title="Delete"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Stock Management Expanded Area */}
                      {expandedProduct === product._id && (
                        <div className="border-t border-gray-100 bg-gray-50 p-6 animate-fadeIn">
                          <div className="max-w-2xl">
                            <h4 className="font-bold text-sm uppercase tracking-wide mb-4 text-gray-500">
                              Update Stock Levels
                            </h4>
                            
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                              {product.sizes.map((sizeObj) => (
                                <div key={sizeObj.size} className="bg-white p-3 border border-gray-200">
                                  <label className="block text-xs font-bold text-gray-500 mb-1">
                                    SIZE {sizeObj.size}
                                  </label>
                                  <input
                                    type="number"
                                    min="0"
                                    value={stockUpdates[sizeObj.size]}
                                    onChange={(e) => handleStockChange(sizeObj.size, e.target.value)}
                                    className="w-full font-bold text-lg border-b-2 border-gray-200 focus:border-black focus:outline-none py-1"
                                  />
                                </div>
                              ))}
                            </div>

                            <div className="flex items-center gap-4">
                              <button
                                onClick={() => saveStock(product)}
                                disabled={savingStock}
                                className="px-6 py-2 bg-black text-white font-bold hover:bg-gray-800 transition disabled:opacity-50"
                              >
                                {savingStock ? 'SAVING...' : 'SAVE CHANGES'}
                              </button>
                              <button
                                onClick={() => setExpandedProduct(null)}
                                className="px-6 py-2 text-gray-600 font-semibold hover:text-black"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-white border-2 border-dashed border-gray-300">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <p className="text-gray-500 text-lg mb-4">No products found</p>
            <Link to="/admin/products/create" className="px-6 py-3 bg-black text-white font-bold hover:bg-gray-800 transition inline-block">
              ADD YOUR FIRST PRODUCT
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageProducts;