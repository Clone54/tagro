import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
// FIX: Corrected import path for types.
import { Product } from '../types';
import * as productService from '../services/productService';
import { useNotification } from './NotificationContext';
import { useAuth } from './AuthContext';

interface ProductContextType {
  products: Product[];
  loading: boolean;
  addProduct: (productData: Omit<Product, 'id' | 'ratings'>) => Promise<void>;
  updateProduct: (updatedProductData: Product) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  addRating: (productId: string, ratingData: { rating: number; comment?: string }) => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const { showNotification } = useNotification();
    const { user } = useAuth();

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const productData = await productService.getProducts();
            setProducts(productData);
        } catch (error) {
            console.error("Failed to fetch products:", error);
            showNotification('Failed to load products.', 'error');
        } finally {
            setLoading(false);
        }
    }, [showNotification]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const addProduct = async (productData: Omit<Product, 'id' | 'ratings'>) => {
        const newProduct = await productService.addProduct(productData);
        setProducts(prev => [...prev, newProduct]);
        showNotification('Product added successfully!', 'success');
    };

    const updateProduct = async (updatedProductData: Product) => {
        const updatedProduct = await productService.updateProduct(updatedProductData);
        setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
        showNotification('Product updated successfully!', 'success');
    };
    
    const deleteProduct = async (productId: string) => {
        await productService.deleteProduct(productId);
        setProducts(prev => prev.filter(p => p.id !== productId));
        showNotification('Product deleted successfully!', 'success');
    };

    const addRating = async (productId: string, ratingData: { rating: number; comment?: string }) => {
        const ratingPayload = {
            ...ratingData,
            userId: user?.id || 'guest',
            userName: user?.name || 'Valued Customer'
        };
        const updatedProduct = await productService.addRating(productId, ratingPayload);
        setProducts(prev => prev.map(p => p.id === productId ? updatedProduct : p));
        showNotification('Thank you for your rating!', 'success');
    };
    
    const value = { products, loading, addProduct, updateProduct, deleteProduct, addRating };

    return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
}

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};