import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { getCategories } from '../../api/categoryApi';
import { createProduct } from '../../api/productApi';

const AddProduct = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);

    // Size management
    const [sizes, setSizes] = useState([{ size: '', stock: 0 }]);
    const [colors, setColors] = useState(['']);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const data = await getCategories();
            setCategories(data.categories || []);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    };

    const handleAddSize = () => {
        setSizes([...sizes, { size: '', stock: 0 }]);
    };

    const handleRemoveSize = (index) => {
        setSizes(sizes.filter((_, i) => i !== index));
    };

    const handleSizeChange = (index, field, value) => {
        const newSizes = [...sizes];
        newSizes[index][field] = field === 'stock' ? parseInt(value) || 0 : value;
        setSizes(newSizes);
    };

    const handleAddColor = () => {
        setColors([...colors, '']);
    };

    const handleRemoveColor = (index) => {
        setColors(colors.filter((_, i) => i !== index));
    };

    const handleColorChange = (index, value) => {
        const newColors = [...colors];
        newColors[index] = value;
        setColors(newColors);
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(files);

        // Generate previews
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setImagePreviews(prev => {
            // Revoke old URLs to avoid memory leaks
            prev.forEach(url => URL.revokeObjectURL(url));
            return newPreviews;
        });
    };

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            setError('');

            // Validate sizes
            const validSizes = sizes.filter(s => s.size.trim() !== '');
            if (validSizes.length === 0) {
                setError('Please add at least one size with stock');
                setLoading(false);
                return;
            }

            // Create FormData
            const formData = new FormData();
            formData.append('title', data.title);
            formData.append('description', data.description);
            formData.append('price', data.price);
            formData.append('category', data.category);
            formData.append('featured', data.featured || false);

            // Add sizes
            formData.append('sizes', JSON.stringify(validSizes));

            // Add colors
            const validColors = colors.filter(c => c.trim() !== '');
            formData.append('colors', JSON.stringify(validColors));

            // Add images
            images.forEach((image) => {
                formData.append('images', image);
            });

            await createProduct(formData);
            navigate('/admin/products');
        } catch (err) {
            setError(err.message || 'Failed to create product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div className="bg-black text-white py-12 mb-8">
                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                     <Link to="/admin/products" className="text-gray-400 hover:text-white mb-4 inline-block transition">
                        ← Back to Products
                    </Link>
                    <h1 className="font-display text-4xl md:text-5xl font-bold">
                        ADD NEW PRODUCT
                    </h1>
                 </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <form onSubmit={handleSubmit(onSubmit)}>
                     {error && (
                        <div className="bg-red-50 border-l-4 border-red-600 p-4 mb-8">
                            <p className="text-red-700 font-bold">{error}</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column: Product Details */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Basic Info */}
                            <div className="bg-white p-6 shadow-sm border border-gray-200">
                                <h2 className="text-xl font-bold mb-6 font-display">BASIC DETAILS</h2>
                                
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                                            Product Title *
                                        </label>
                                        <input
                                            {...register('title', { required: 'Title is required' })}
                                            className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
                                            placeholder="e.g. Premium Cotton Shirt"
                                        />
                                        {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                                            Description *
                                        </label>
                                        <textarea
                                            {...register('description', { required: 'Description is required' })}
                                            rows="6"
                                            className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition resize-none"
                                            placeholder="Detailed product description..."
                                        />
                                        {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                                                Price (₹) *
                                            </label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    {...register('price', { required: 'Price is required', min: 0 })}
                                                    className="w-full pl-8 pr-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
                                                    placeholder="0.00"
                                                />
                                            </div>
                                            {errors.price && <p className="text-red-600 text-sm mt-1">{errors.price.message}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                                                Category *
                                            </label>
                                            <select
                                                {...register('category', { required: 'Category is required' })}
                                                className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition bg-white"
                                            >
                                                <option value="">Select Category</option>
                                                {categories.map(cat => (
                                                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                                                ))}
                                            </select>
                                            {errors.category && <p className="text-red-600 text-sm mt-1">{errors.category.message}</p>}
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-3 pt-2">
                                        <input
                                            type="checkbox"
                                            id="featured"
                                            {...register('featured')}
                                            className="w-5 h-5 border-gray-300 text-black focus:ring-black"
                                        />
                                        <label htmlFor="featured" className="text-sm font-semibold cursor-pointer select-none">
                                            Mark this product as Featured
                                        </label>
                                    </div>
                                </div>
                            </div>
                        
                             {/* Inventory Section */}
                            <div className="bg-white p-6 shadow-sm border border-gray-200">
                                <h2 className="text-xl font-bold mb-6 font-display flex justify-between items-center">
                                    <span>INVENTORY</span>
                                </h2>
                                
                                <div className="space-y-8">
                                    {/* Sizes */}
                                    <div>
                                         <div className="flex justify-between items-end mb-4">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                                                Sizes & Stock Levels
                                            </label>
                                            <button
                                                type="button"
                                                onClick={handleAddSize}
                                                className="text-xs font-bold bg-black text-white px-3 py-1 hover:bg-gray-800 transition"
                                            >
                                                + ADD SIZE
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-1 gap-4">
                                            {sizes.map((size, index) => (
                                                <div key={index} className="flex gap-4 items-start bg-gray-50 p-4 border border-gray-100">
                                                    <div className="flex-1">
                                                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Size Label</label>
                                                        <input
                                                            type="text"
                                                            value={size.size}
                                                            onChange={(e) => handleSizeChange(index, 'size', e.target.value)}
                                                            placeholder="e.g. M, L, 42"
                                                            className="w-full px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:border-black"
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                         <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Stock Qty</label>
                                                        <input
                                                            type="number"
                                                            value={size.stock}
                                                            onChange={(e) => handleSizeChange(index, 'stock', e.target.value)}
                                                            placeholder="0"
                                                            min="0"
                                                            className="w-full px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:border-black"
                                                        />
                                                    </div>
                                                    {sizes.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveSize(index)}
                                                            className="mt-6 text-red-500 hover:text-red-700 p-1"
                                                            title="Remove Size"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Colors */}
                                    <div className="pt-4 border-t border-gray-100">
                                        <div className="flex justify-between items-end mb-4">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                                                Available Colors
                                            </label>
                                             <button
                                                type="button"
                                                onClick={handleAddColor}
                                                className="text-xs font-bold bg-black text-white px-3 py-1 hover:bg-gray-800 transition"
                                            >
                                                + ADD COLOR
                                            </button>
                                        </div>
                                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {colors.map((color, index) => (
                                                <div key={index} className="flex gap-2 relative">
                                                    <input
                                                        type="text"
                                                        value={color}
                                                        onChange={(e) => handleColorChange(index, e.target.value)}
                                                        placeholder="Color name (e.g. Navy Blue)"
                                                        className="w-full px-4 py-2 border border-gray-300 text-sm focus:outline-none focus:border-black"
                                                    />
                                                    {colors.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveColor(index)}
                                                            className="text-red-500 hover:text-red-700 p-2"
                                                            title="Remove Color"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Media & Actions */}
                        <div className="space-y-8">
                             {/* Media Upload */}
                            <div className="bg-white p-6 shadow-sm border border-gray-200">
                                <h2 className="text-xl font-bold mb-6 font-display">MEDIA</h2>
                                
                                <div className="space-y-4">
                                    <div className="border-2 border-dashed border-gray-300 p-8 text-center hover:bg-gray-50 transition cursor-pointer relative">
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                        <div className="space-y-2">
                                            <svg className="w-10 h-10 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <p className="text-sm font-semibold text-gray-600">Click to upload images</p>
                                            <p className="text-xs text-gray-400">JPG, PNG up to 5MB</p>
                                        </div>
                                    </div>

                                    {/* Image Previews */}
                                    {imagePreviews.length > 0 && (
                                        <div className="grid grid-cols-2 gap-2 mt-4">
                                            {imagePreviews.map((src, idx) => (
                                                <div key={idx} className="relative aspect-square group">
                                                    <img 
                                                        src={src} 
                                                        alt={`Preview ${idx}`} 
                                                        className="w-full h-full object-cover border border-gray-200" 
                                                    />
                                                    {/* Note: Real remove logic for specific files needs managing 'images' state as array carefully. 
                                                        For simplicity in this step, we just show previews of the current selection. 
                                                    */}
                                                    {idx === 0 && (
                                                        <span className="absolute top-2 left-2 bg-black text-white text-[10px] font-bold px-2 py-1">
                                                            MAIN
                                                        </span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Publish Action */}
                            <div className="bg-white p-6 shadow-sm border border-gray-200 sticky top-4">
                                <h2 className="text-xl font-bold mb-6 font-display">PUBLISH</h2>
                                <div className="space-y-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-4 bg-black text-white font-bold hover:bg-gray-800 disabled:opacity-50 transition"
                                    >
                                        {loading ? 'PUBLISHING...' : 'PUBLISH PRODUCT'}
                                    </button>
                                     <Link
                                        to="/admin/products"
                                        className="block w-full py-4 bg-white border border-gray-300 text-center font-bold hover:bg-gray-50 transition"
                                    >
                                        CANCEL
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProduct;
