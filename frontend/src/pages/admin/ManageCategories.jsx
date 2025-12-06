import { useEffect, useState } from 'react';
import { getCategories, createCategory } from '../../api/categoryApi';
import LoadingSpinner from '../../components/LoadingSpinner';

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [isAdding, setIsAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await getCategories();
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setMessage('');
      
      await createCategory(formData);
      setMessage('✓ Category created successfully!');
      
      setFormData({ name: '', description: '' });
      setIsAdding(false);
      await fetchCategories();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.message || 'Failed to save category');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({ name: '', description: '' });
    setIsAdding(false);
    setMessage('');
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-black text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-5xl md:text-6xl font-bold mb-4">
            MANAGE CATEGORIES
          </h1>
          <p className="text-xl text-gray-300">
            Create and organize product categories
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 border-2 ${
            message.includes('✓') ? 'bg-green-50 border-green-600 text-green-800' : 'bg-red-50 border-red-600 text-red-800'
          }`}>
            {message}
          </div>
        )}

        {/* Add Form */}
        {isAdding ? (
          <div className="mb-12 bg-gray-50 p-8">
            <h2 className="text-2xl font-bold mb-6 uppercase tracking-wide">
              Add New Category
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2 uppercase tracking-wide">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:border-gray-600"
                  placeholder="e.g., Shirts, Jeans, Jackets"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 uppercase tracking-wide">
                  Description (Optional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:border-gray-600"
                  placeholder="Brief description of this category"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-8 py-4 bg-black text-white font-bold hover:bg-gray-800 transition disabled:opacity-50"
                >
                  {saving ? 'SAVING...' : 'ADD CATEGORY'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-8 py-4 border-2 border-black font-bold hover:bg-gray-100 transition"
                >
                  CANCEL
                </button>
              </div>
            </form>
          </div>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="mb-8 px-8 py-4 bg-black text-white font-bold hover:bg-gray-800 transition"
          >
            + ADD NEW CATEGORY
          </button>
        )}

        {/* Categories List */}
        <div>
          <h2 className="text-2xl font-bold mb-6 uppercase tracking-wide">
            All Categories ({categories.length})
          </h2>
          
          {categories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((category) => (
                <div key={category._id} className="bg-gray-50 p-6">
                  <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{category.description || 'No description'}</p>
                  <p className="text-xs text-gray-500 mb-2">
                    Slug: {category.slug}
                  </p>
                  <p className="text-sm font-semibold text-gray-800">
                    {category.productCount} {category.productCount === 1 ? 'Product' : 'Products'}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-gray-50">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <p className="text-gray-500 text-lg mb-4">No categories yet</p>
              <button
                onClick={() => setIsAdding(true)}
                className="px-6 py-3 bg-black text-white font-bold hover:bg-gray-800 transition"
              >
                CREATE FIRST CATEGORY
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageCategories;
