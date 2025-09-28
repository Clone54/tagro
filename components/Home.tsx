
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// FIX: Corrected import path for types.
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { Spinner } from './Spinner';
import { useSettings } from '../context/SettingsContext';
import { useProducts } from '../context/ProductContext';
import { useContent } from '../context/ContentContext';

export const Home: React.FC = () => {
    const { isAuthenticated, loading: authLoading } = useAuth();
    const { products } = useProducts();
    const { homeContent, loading: contentLoading } = useContent();
    const { language, t } = useSettings();

    const featuredProducts = useMemo((): Product[] => {
        if (!homeContent || !products) return [];
        return products.filter(p => homeContent.featuredProductIds.includes(p.id));
    }, [products, homeContent]);


    if (authLoading || contentLoading || !homeContent) {
        return <div className="flex justify-center items-center h-[80vh]"><Spinner /></div>;
    }

    return (
        <div className="dark:bg-gray-900">
            {/* Hero Section */}
            <div className="relative bg-cover bg-center h-[60vh] text-white" style={{ backgroundImage: `url('${homeContent.heroImage}')` }}>
                <div className="absolute inset-0 bg-black opacity-50"></div>
                <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight mb-4 animate-fade-in-down">
                        {homeContent.mainSlogan[language]}
                    </h1>
                    <p className="text-lg md:text-xl max-w-2xl mb-8 animate-fade-in-up">
                        {homeContent.secondarySlogan[language]}
                    </p>
                </div>
            </div>

            {/* Featured Products Section */}
            <div className="bg-gray-50 dark:bg-gray-900 py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-extrabold text-center text-gray-900 dark:text-white mb-2">{t('featuredProducts')}</h2>
                    <p className="text-center text-gray-600 dark:text-gray-400 mb-12">{t('featuredProductsIntro')}</p>
                    {featuredProducts.length === 0 ? (
                        <p className="text-center text-gray-500">{t('noFeaturedProducts')}</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {featuredProducts.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};