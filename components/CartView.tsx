import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);


export const CartView: React.FC = () => {
    const { cartItems, removeFromCart, updateQuantity, clearCart, itemCount, totalPrice } = useCart();
    const { language, t } = useSettings();
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();
    const { showNotification } = useNotification();

    const handleCheckout = () => {
        if (!isAuthenticated) {
            showNotification('Please log in to proceed.', 'info');
            navigate('/login');
            return;
        }
        if (user && user.addresses.length === 0) {
            showNotification('Please add a shipping address before checking out.', 'info');
            navigate('/profile/address/new');
            return;
        }
        navigate('/payment-confirmation', { state: { items: cartItems } });
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8">Your Shopping Cart</h1>
            {itemCount > 0 ? (
                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-4">
                        {cartItems.map(item => (
                            <div key={item.product.id} className="flex items-center bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                                <img src={item.product.imageUrl} alt={item.product.name.en} className="w-24 h-24 object-cover rounded-md" />
                                <div className="flex-grow ml-4">
                                    <Link to={`/product/${item.product.id}`} className="text-lg font-semibold hover:text-green-600">{item.product.name[language]}</Link>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm">{item.product.category}</p>
                                    <p className="text-lg font-bold text-green-600 dark:text-green-400 mt-1">BDT {item.product.price.toFixed(2)}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="number"
                                        min="1"
                                        value={item.quantity}
                                        onChange={(e) => updateQuantity(item.product.id, parseInt(e.target.value, 10))}
                                        className="w-16 p-2 border border-gray-300 dark:border-gray-600 rounded-md text-center bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                                    />
                                    <button onClick={() => removeFromCart(item.product.id)} className="text-gray-500 hover:text-red-500 p-2 rounded-full">
                                        <TrashIcon />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md sticky top-28">
                            <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
                            <div className="flex justify-between mb-2 text-gray-700 dark:text-gray-300">
                                <span>Subtotal ({itemCount} {itemCount > 1 ? 'items' : 'item'})</span>
                                <span>BDT {totalPrice.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between mb-4 text-gray-700 dark:text-gray-300">
                                <span>Shipping</span>
                                <span className="text-green-600">FREE</span>
                            </div>
                            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                <div className="flex justify-between font-bold text-xl text-gray-900 dark:text-white">
                                    <span>Total</span>
                                    <span>BDT {totalPrice.toFixed(2)}</span>
                                </div>
                            </div>
                            <button onClick={handleCheckout} className="mt-6 w-full py-3 px-6 bg-green-600 text-white font-bold text-lg rounded-lg hover:bg-green-700 transition-colors shadow-lg">
                                Proceed to Checkout
                            </button>
                             <button onClick={clearCart} className="mt-4 w-full text-sm text-gray-500 hover:text-red-500">
                                Clear Cart
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">Your cart is empty</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">Looks like you haven't added anything to your cart yet.</p>
                    <Link to="/products" className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors duration-200 shadow">
                        Continue Shopping
                    </Link>
                </div>
            )}
        </div>
    );
};