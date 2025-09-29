import React, { useState, useMemo } from 'react';
// FIX: Corrected import path for types.
import { Category, Product } from '../types';
import { ProductCard } from './ProductCard';
import { Spinner } from './Spinner';
import { useProducts } from '../context/ProductContext';

export const ProductList: React.FC = () => {
  const { products, loading } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');

  const categories = useMemo(() => ['All', ...Object.values(Category)], []);

  const filteredProducts = useMemo(() => {
      if (selectedCategory === 'All') {
          return products;
      }
      return products.filter(p => p.category === selectedCategory);
  }, [products, selectedCategory]);

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Spinner /></div>;
  }

  return (
    <div>
        <div className="mb-8">
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">Our Products</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">High-quality feeds and medicines for your livestock and aquaculture needs.</p>
        </div>
        
        <div className="mb-6 flex flex-wrap gap-2 items-center">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">Filter by category:</span>
            {categories.map(category => (
                <button
                    key={category}
                    onClick={() => setSelectedCategory(category as Category | 'All')}
                    className={`px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200 ${selectedCategory === category ? 'bg-green-600 text-white shadow' : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-50 hover:bg-gray-100 dark:hover:bg-gray-600 border'}`}
                >
                    {category}
                </button>
            ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    </div>
  );
};