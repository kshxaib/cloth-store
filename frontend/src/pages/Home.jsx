import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getProducts } from '../api/productApi';
import { getCategories } from '../api/categoryApi';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, categoriesData] = await Promise.all([
          getProducts({ featured: 'true', limit: 6 }),
          getCategories(),
        ]);
        setFeaturedProducts(productsData.products || []);
        setCategories(categoriesData.categories || []);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-black text-white overflow-hidden min-h-screen flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1490367532201-b9bc1dc483f6?w=1920&q=80"
            alt="Hero Background"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-black/50"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="max-w-2xl">
            {/* Eyebrow */}
            <div className="mb-6">
              <span className="inline-block border-2 border-white px-4 py-2 text-sm font-semibold tracking-widest">
                SPRING 2026 COLLECTION
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="font-display text-7xl md:text-8xl lg:text-9xl font-bold mb-8 tracking-tighter leading-none">
              DIVINE
            </h1>

            {/* Subtitle */}
            <p className="text-2xl md:text-3xl text-gray-300 mb-12 font-light">
              Where timeless elegance meets contemporary sophistication
            </p>

            {/* CTA Buttons */}
            <div className="mb-16">
              <Link 
                to="/products" 
                className="inline-block px-10 py-5 bg-white text-black font-bold text-lg hover:bg-gray-200 transition-all group"
              >
                <span className="flex items-center gap-2">
                  EXPLORE COLLECTION
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8">
              <div className="border-l-2 border-white pl-4">
                <div className="text-4xl font-bold">100%</div>
                <div className="text-sm text-gray-400 uppercase tracking-wide">Premium Quality</div>
              </div>
              <div className="border-l-2 border-white pl-4">
                <div className="text-4xl font-bold">24/7</div>
                <div className="text-sm text-gray-400 uppercase tracking-wide">Support</div>
              </div>
              <div className="border-l-2 border-white pl-4">
                <div className="text-4xl font-bold">Free</div>
                <div className="text-sm text-gray-400 uppercase tracking-wide">Shipping</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <span className="text-sm font-semibold tracking-widest text-gray-500 uppercase mb-4 block">
            New Arrivals
          </span>
          <h2 className="font-display text-5xl md:text-6xl font-bold mb-6">
            LATEST COLLECTION
          </h2>
          <p className="text-gray-600 text-xl max-w-2xl mx-auto">
            Discover our newest pieces designed for the modern gentleman
          </p>
        </div>

        {featuredProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8 md:gap-12 mb-16">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
            
            <div className="text-center">
              <Link 
                to="/products" 
                className="inline-block px-10 py-4 border-2 border-black text-black font-bold hover:bg-black hover:text-white transition-all"
              >
                VIEW ALL PRODUCTS
              </Link>
            </div>
          </>
        ) : (
          <p className="text-gray-500 text-center py-12">No products available</p>
        )}
      </section>

      {/* Lifestyle Section - Replacing Categories */}
      <section className="bg-black text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div>
              <span className="text-sm font-semibold tracking-widest text-gray-400 uppercase mb-4 block">
                Our Philosophy
              </span>
              <h2 className="font-display text-5xl md:text-6xl font-bold mb-6">
                CRAFTED FOR THE MODERN MAN
              </h2>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                At Divine, we believe that style is more than just clothing—it's a statement of who you are. Each piece in our collection is carefully curated to embody sophistication, quality, and timeless appeal.
              </p>
              <p className="text-lg text-gray-400 mb-8">
                From premium fabrics to impeccable craftsmanship, we ensure every detail meets our exacting standards. Welcome to a new era of menswear.
              </p>
              <Link 
                to="/products" 
                className="inline-block px-8 py-4 border-2 border-white text-white font-bold hover:bg-white hover:text-black transition-all"
              >
                DISCOVER MORE
              </Link>
            </div>

            {/* Image Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-square bg-gray-800">
                <img 
                  src="https://images.unsplash.com/photo-1617127365898-63f316484e86?w=600&q=80" 
                  alt="Menswear" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-square bg-gray-800 mt-8">
                <img 
                  src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80" 
                  alt="Style" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Promise */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-8 border-2 border-black flex items-center justify-center">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="font-display text-2xl font-bold mb-4">PREMIUM QUALITY</h3>
            <p className="text-gray-600 leading-relaxed">
              Every piece is crafted from the finest materials, ensuring lasting durability and timeless style
            </p>
          </div>

          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-8 border-2 border-black flex items-center justify-center">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-display text-2xl font-bold mb-4">FAST DELIVERY</h3>
            <p className="text-gray-600 leading-relaxed">
              Free shipping on orders over ₹1000 with express delivery options available nationwide
            </p>
          </div>

          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-8 border-2 border-black flex items-center justify-center">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="font-display text-2xl font-bold mb-4">100% AUTHENTIC</h3>
            <p className="text-gray-600 leading-relaxed">
              Guaranteed authentic products with verified quality assurance and satisfaction guarantee
            </p>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="bg-gray-50 py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl mx-auto">
          <blockquote className="font-display text-4xl md:text-5xl font-bold mb-8 leading-tight">
            "Style is a way to say who you are without having to speak"
          </blockquote>
          <p className="text-xl text-gray-600">— Rachel Zoe</p>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
            JOIN THE DIVINE FAMILY
          </h2>
          <p className="text-xl text-gray-600 mb-10">
            Subscribe to get exclusive offers, style tips, and first access to new collections
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 border-2 border-black focus:outline-none focus:border-gray-600"
            />
            <button className="px-10 py-4 bg-black text-white font-bold hover:bg-gray-800 transition-colors whitespace-nowrap">
              SUBSCRIBE NOW
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-6">
            By subscribing, you agree to our Privacy Policy and consent to receive updates
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;
