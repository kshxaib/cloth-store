import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const mainImage = product.images && product.images.length > 0 
    ? product.images[0].url 
    : 'https://via.placeholder.com/400x500?text=No+Image';

  return (
    <Link to={`/products/${product._id}`} className="group block">
      <div className="overflow-hidden bg-white">
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">
          <img
            src={mainImage}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          
          {/* Overlay on Hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
        </div>

        {/* Product Info */}
        <div className="py-4">
          {/* Category */}
          {product.category && (
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
              {product.category.name}
            </p>
          )}

          {/* Title */}
          <h3 className="font-medium text-base mb-3 line-clamp-2 group-hover:underline min-h-[3rem]">
            {product.title}
          </h3>

          {/* Price and Sizes */}
          <div className="flex items-center justify-between">
              ₹{product.price.toFixed(2)}

            {product.sizes && product.sizes.length > 0 && (
              <div className="flex gap-1">
                {product.sizes.slice(0, 4).map((s, idx) => (
                  <span
                    key={idx}
                    className="text-xs text-gray-500 border border-gray-300 px-1.5 py-0.5"
                  >
                    {s.size}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
