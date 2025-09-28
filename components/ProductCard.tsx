

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
// FIX: Corrected import path for types.
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';
import { useNotification } from '../context/NotificationContext';

interface ProductCardProps {
    product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const { addToCart, isInCart } = useCart();
    const { language, t } = useSettings();
    const { showNotification } = useNotification();
    const navigate = useNavigate();

    const isItemInCart = isInCart(product.id);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent the card's navigation event
        e.preventDefault(); // Prevent default link behavior if wrapped
        addToCart(product, 1);
        showNotification(`${product.name[language]} ${t('addedToCart')}`);
    };
    
    const handleOrderNowClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigate(`/product/${product.id}`);
    }

    return (
        <div 
            onClick={() => navigate(`/product/${product.id}`)}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 flex flex-col cursor-pointer"
        >
            <div className="block">
                <img src={product.imageUrl} alt={product.name.en} className="w-full h-48 object-cover"/>
            </div>
            <div className="p-4 flex flex-col flex-grow">
                <p className="text-sm text-gray-500 dark:text-gray-400">{product.category}</p>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-1 mb-2 flex-grow">
                    <span className="hover:text-green-600">
                        {product.name[language]}
                    </span>
                </h3>
                <div className="mt-auto flex justify-between items-center">
                    <p className="text-xl font-semibold text-green-600 dark:text-green-400">BDT {product.price.toFixed(2)}</p>
                    {isItemInCart ? (
                        <button 
                            onClick={handleOrderNowClick}
                            className="px-4 py-2 bg-yellow-500 text-white font-semibold rounded-lg text-sm hover:bg-yellow-600 transition-colors duration-200 shadow"
                        >
                            {t('orderNow')}
                        </button>
                    ) : (
                        <button 
                            onClick={handleAddToCart}
                            className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg text-sm hover:bg-green-700 transition-colors duration-200 shadow"
                        >
                            {t('addToCart')}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};