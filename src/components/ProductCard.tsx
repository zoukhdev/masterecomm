'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../lib/cartSlice';
import toast from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description?: string;
  images?: string[];
  rating?: number;
  reviews?: number;
  originalPrice?: number;
  inStock?: boolean;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const dispatch = useDispatch();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    dispatch(addToCart({ ...product, quantity: 1 }));
    toast.success(`${product.name} added to cart!`);
    setIsAddingToCart(false);
  };

  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/20 overflow-hidden hover:shadow-xl dark:hover:shadow-gray-900/30 transition-all duration-300 hover-lift group">
      <div className="relative">
        <Link href={`/products/${product.id}`}>
          <div className="relative h-40 sm:h-48 w-full overflow-hidden">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {discountPercentage > 0 && (
              <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                -{discountPercentage}%
              </div>
            )}
            {product.inStock === false && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <span className="text-white font-semibold">Out of Stock</span>
              </div>
            )}
          </div>
        </Link>
        
        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className="absolute top-2 right-2 p-2 bg-white dark:bg-gray-700 rounded-full shadow-md hover:shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
        >
          <Heart 
            size={16} 
            className={isWishlisted ? 'text-red-500 fill-current' : 'text-gray-600 dark:text-gray-400'} 
          />
        </button>
      </div>
      
      <div className="p-3 sm:p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2">{product.category}</p>
        
        {/* Rating */}
        {product.rating && (
          <div className="flex items-center mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={14} 
                  className={i < Math.floor(product.rating!) ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-gray-600'} 
                />
              ))}
            </div>
            <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">
              ({product.rating}) {product.reviews && `(${product.reviews} reviews)`}
            </span>
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <div className="flex items-center space-x-1 sm:space-x-2">
              <span className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
          </div>
          
          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart || product.inStock === false}
            className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center min-w-[36px] sm:min-w-[40px]"
          >
            {isAddingToCart ? (
              <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <ShoppingCart size={14} className="sm:w-4 sm:h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
