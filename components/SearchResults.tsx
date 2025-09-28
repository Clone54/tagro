import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useSettings } from '../context/SettingsContext';
import { ProductCard } from './ProductCard';
import { Spinner } from './Spinner';

export const SearchResults: React.FC = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const { products, loading } = useProducts();
    const { t } = useSettings();

    const filteredProducts = useMemo(() => {
        if (!query) {
            return [];
        }
        const lowercasedQuery = query.toLowerCase();
        return products.filter(product =>
            product.name.en.toLowerCase().includes(lowercasedQuery) ||
            product.name.bn.includes(query) // Bengali search might not need lowercasing depending on context
        );
    }, [products, query]);

    if (loading) {
        return <div className="flex justify-center items-center h-64"><Spinner /></div>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                {t('searchResultsFor')} <span className="text-green-600">"{query}"</span>
            </h1>

            {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filteredProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">{t('noProductsFound')}</h2>
                    <p className="text-gray-600 dark:text-gray-400">Please try a different search term.</p>
                </div>
            )}
        </div>
    );
};