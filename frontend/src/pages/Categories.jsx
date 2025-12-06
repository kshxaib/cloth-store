import { Link } from 'react-router-dom';

const Categories = () => {
  return (
    <div className="container-custom py-8">
      <h1 className="text-4xl font-display font-bold mb-4">Browse Categories</h1>
      <p className="text-gray-600 mb-8">
        Explore our collection by category. <Link to="/products" className="text-primary-600 hover:underline">View all products</Link>
      </p>
      <div className="text-center py-12">
        <p className="text-gray-500">Category browsing page - navigate via products page with category filter</p>
      </div>
    </div>
  );
};

export default Categories;
