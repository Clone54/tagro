import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { useContent } from '../context/ContentContext';

const LeafIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const ShoppingCartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);

const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

export const Header: React.FC = () => {
    const { itemCount } = useCart();
    const { isAuthenticated, user } = useAuth();
    const { t } = useSettings();
    const { siteSettings } = useContent();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
        }
    };

    const navLinkClasses = ({isActive}: {isActive: boolean}) => 
        `text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition duration-150 ease-in-out px-3 py-2 rounded-md font-medium text-sm ${isActive ? 'text-green-700 dark:text-green-400 font-semibold bg-green-50 dark:bg-gray-700' : ''}`;

    return (
        <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Left: Logo */}
                    <div className="flex-shrink-0">
                        <Link to="/" className="flex items-center space-x-2">
                            {siteSettings && siteSettings.logoUrl ? (
                                <img src={siteSettings.logoUrl} alt="T Agro Feeds Logo" className="h-10 w-auto" />
                            ) : (
                                <LeafIcon />
                            )}
                            <span className="text-xl font-bold text-gray-800 dark:text-white tracking-tight">
                                T Agro Feeds
                            </span>
                        </Link>
                    </div>

                    {/* Middle: Navigation */}
                    <nav className="hidden md:flex items-center space-x-2 lg:space-x-4">
                         <NavLink to="/" className={navLinkClasses} end>
                            {t('home')}
                        </NavLink>
                        <NavLink to="/about" className={navLinkClasses}>
                            {t('aboutUs')}
                        </NavLink>
                        <NavLink to="/products" className={navLinkClasses}>
                            {t('products')}
                        </NavLink>
                        <NavLink to="/contact" className={navLinkClasses}>
                            {t('contactUs')}
                        </NavLink>
                         <NavLink to="/dealer" className={navLinkClasses}>
                            {t('dealerSection')}
                        </NavLink>
                        {user?.role === 'admin' && (
                            <NavLink to="/admin" className={navLinkClasses}>
                                {t('adminPanel')}
                            </NavLink>
                        )}
                    </nav>

                    {/* Right: Actions */}
                    <div className="flex items-center space-x-2 md:space-x-4">
                        <form onSubmit={handleSearchSubmit} className="relative hidden sm:block">
                            <input
                                type="search"
                                placeholder={t('searchPlaceholder')}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-32 md:w-48 pl-4 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 transition-all duration-300"
                                aria-label="Search products"
                            />
                            <button type="submit" className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400" aria-label="Search">
                                <SearchIcon />
                            </button>
                        </form>
                        <Link to="/cart" className="relative text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 p-2 rounded-full transition duration-150 ease-in-out">
                            <ShoppingCartIcon />
                            {itemCount > 0 && (
                                <span className="absolute -top-1 -right-1 flex items-center justify-center h-5 w-5 bg-red-500 text-white text-xs rounded-full">
                                    {itemCount}
                                </span>
                            )}
                        </Link>
                        <div className="hidden sm:flex items-center space-x-4">
                            {isAuthenticated && user ? (
                                 <Link to="/profile" className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 font-medium text-sm px-3 py-2 rounded-md transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                                    <img src={user.profilePictureUrl} alt="profile" className="w-8 h-8 rounded-full" />
                                    <span>{user.name.split(' ')[0]}</span>
                                </Link>
                            ) : (
                                <>
                                    <Link to="/login" className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 font-medium text-sm px-3 py-2">
                                        {t('login')}
                                    </Link>
                                    <Link to="/register" className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg text-sm hover:bg-green-700 transition-colors duration-200 shadow">
                                        {t('register')}
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};