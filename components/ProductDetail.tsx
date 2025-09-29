import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
// FIX: Corrected import path for types.
import { Product } from '../types';
import * as productService from '../services/productService';
import { Spinner } from './Spinner';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';
import { useNotification } from '../context/NotificationContext';
import { useProducts } from '../context/ProductContext';
import { BackButton } from './BackButton';

const StarIcon: React.FC<{ filled: boolean; className?: string }> = ({ filled, className }) => (
    <svg className={`w-5 h-5 ${filled ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-500'} ${className}`} fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);

export const ProductDetail: React.FC = () => {
    const { productId } = useParams<{ productId: string }>();
    const navigate = useNavigate();
    const { products, addRating: contextAddRating } = useProducts();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState<'description' | 'ingredients' | 'storage' | 'features'>('description');
    
    const [userRating, setUserRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');

    const { addToCart } = useCart();
    const { language, t } = useSettings();
    const { showNotification } = useNotification();
    
    useEffect(() => {
        const fetchProduct = async () => {
            if (productId) {
                setLoading(true);
                const fetchedProduct = products.find(p => p.id === productId) || await productService.getProductById(productId);
                setProduct(fetchedProduct || null);
                setLoading(false);
            }
        };
        fetchProduct();
    }, [productId, products]);

    const handleAddToCart = () => {
        if (product) {
            addToCart(product, quantity);
            showNotification(`${quantity} x ${product.name[language]} ${t('addedToCart')}`);
        }
    };
    
    const handleOrderNow = () => {
        if (product) {
            addToCart(product, quantity);
            navigate('/cart');
        }
    };

    const handleRatingSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (product && userRating > 0) {
            await contextAddRating(product.id, { rating: userRating, comment });
            setUserRating(0);
            setComment('');
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-96"><Spinner /></div>;
    }

    if (!product) {
        return <div className="text-center py-12"><h1 className="text-2xl font-bold">Product not found</h1></div>;
    }

    const avgRating = product.ratings.length > 0 ? product.ratings.reduce((acc, r) => acc + r.rating, 0) / product.ratings.length : 0;

    const tabButtonClasses = (tabName: typeof activeTab) => `py-2 px-4 font-semibold rounded-t-lg transition-colors duration-200 focus:outline-none ${activeTab === tabName ? 'bg-white dark:bg-gray-800 border-b-2 border-green-500 text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400'}`;
    const tabContentClasses = "p-6 bg-white dark:bg-gray-800 rounded-b-lg rounded-r-lg text-gray-700 dark:text-gray-300 leading-relaxed";

    return (
        <div className="space-y-12">
            <BackButton />
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
                <div className="grid md:grid-cols-2 gap-8">
                    <div>
                        <img src={product.imageUrl} alt={product.name.en} className="w-full h-auto object-cover rounded-lg shadow-md" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2">{product.name[language]}</h1>
                        <p className="text-lg text-gray-500 dark:text-gray-400 mb-4">{product.category}</p>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="flex">
                                {[...Array(5)].map((_, i) => <StarIcon key={i} filled={i < avgRating} />)}
                            </div>
                            <span className="text-gray-600 dark:text-gray-400">({product.ratings.length} {t('ratings')})</span>
                        </div>
                        <p className="text-3xl font-bold text-green-600 dark:text-green-400 mb-6">BDT {product.price.toFixed(2)}</p>
                        
                        <div className="flex items-center gap-4 mb-6">
                            <label htmlFor="quantity" className="font-medium text-gray-700 dark:text-gray-300">Quantity:</label>
                            <input
                                type="number"
                                id="quantity"
                                min="1"
                                value={quantity}
                                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10)))}
                                className="w-20 p-2 border border-gray-300 dark:border-gray-600 rounded-md text-center bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                            />
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-4">
                             <button 
                                onClick={handleAddToCart}
                                className="flex-1 py-3 px-6 bg-green-600 text-white font-bold text-lg rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-colors shadow-lg"
                            >
                                {t('addToCart')}
                            </button>
                             <button 
                                onClick={handleOrderNow}
                                className="flex-1 py-3 px-6 bg-yellow-500 text-white font-bold text-lg rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 transition-colors shadow-lg"
                            >
                                {t('orderNow')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-gray-100 dark:bg-gray-800/50 p-1 rounded-lg">
                <div className="border-b border-gray-200 dark:border-gray-700">
                    <nav className="-mb-px flex space-x-4" aria-label="Tabs">
                        <button onClick={() => setActiveTab('description')} className={tabButtonClasses('description')}>{t('description')}</button>
                        <button onClick={() => setActiveTab('ingredients')} className={tabButtonClasses('ingredients')}>{t('ingredients')}</button>
                        <button onClick={() => setActiveTab('storage')} className={tabButtonClasses('storage')}>{t('storage')}</button>
                        <button onClick={() => setActiveTab('features')} className={tabButtonClasses('features')}>{t('featuresAndAdvantages')}</button>
                    </nav>
                </div>
                <div>
                    {activeTab === 'description' && <div className={tabContentClasses}>{product.description[language]}</div>}
                    {activeTab === 'ingredients' && <div className={tabContentClasses}>{product.ingredients[language]}</div>}
                    {activeTab === 'storage' && <div className={tabContentClasses}>{product.storage[language]}</div>}
                    {activeTab === 'features' && <div className={tabContentClasses}>{product.featuresAndAdvantages[language]}</div>}
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-6">{t('ratings')}</h2>
                <div className="grid md:grid-cols-2 gap-8">
                    <div>
                        <h3 className="text-xl font-semibold mb-4">{t('addARating')}</h3>
                        <form onSubmit={handleRatingSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('yourRating')}</label>
                                <div className="flex" onMouseLeave={() => setHoverRating(0)}>
                                    {[...Array(5)].map((_, index) => {
                                        const ratingValue = index + 1;
                                        return (
                                            <button type="button" key={ratingValue} onClick={() => setUserRating(ratingValue)} onMouseEnter={() => setHoverRating(ratingValue)}>
                                                <StarIcon filled={ratingValue <= (hoverRating || userRating)} className="cursor-pointer" />
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                            <div>
                                <label htmlFor="comment" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('comment')}</label>
                                <textarea id="comment" value={comment} onChange={(e) => setComment(e.target.value)} rows={3} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-green-500 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"></textarea>
                            </div>
                            <button type="submit" disabled={userRating === 0} className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg text-sm hover:bg-green-700 transition-colors duration-200 shadow disabled:bg-gray-400 disabled:cursor-not-allowed">
                                {t('submit')}
                            </button>
                        </form>
                    </div>
                    <div className="space-y-6 max-h-96 overflow-y-auto pr-4">
                        {product.ratings.length > 0 ? product.ratings.slice().reverse().map(rating => (
                            <div key={rating.date} className="border-b border-gray-200 dark:border-gray-700 pb-4">
                                <div className="flex items-center justify-between">
                                    <span className="font-semibold">{rating.userName}</span>
                                    <span className="text-xs text-gray-500">{new Date(rating.date).toLocaleString()}</span>
                                </div>
                                <div className="flex my-1">
                                    {[...Array(5)].map((_, i) => <StarIcon key={i} filled={i < rating.rating} />)}
                                </div>
                                {rating.comment && <p className="text-gray-600 dark:text-gray-400 text-sm">{rating.comment}</p>}
                            </div>
                        )) : <p className="text-gray-500 dark:text-gray-400">No ratings yet. Be the first to review!</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};