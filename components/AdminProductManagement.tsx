
import React, { useState, useMemo } from 'react';
import { useProducts } from '../context/ProductContext';
import { Product, Category, LocalizedString } from '../types';
import { Spinner } from './Spinner';
import { ImageUpload } from './ImageUpload';

const initialProductState: Omit<Product, 'id' | 'ratings'> = {
    name: { en: '', bn: '' },
    category: Category.FishFeed,
    description: { en: '', bn: '' },
    ingredients: { en: '', bn: '' },
    storage: { en: '', bn: '' },
    featuresAndAdvantages: { en: '', bn: '' },
    imageUrl: '',
    price: 0,
    stock: 0,
    weightOptions: [],
};

const ProductFormModal: React.FC<{
    product: Omit<Product, 'id' | 'ratings'> | Product | null;
    onClose: () => void;
    onSave: (productData: any) => void;
}> = ({ product, onClose, onSave }) => {
    const [formData, setFormData] = useState(product ? { ...product } : { ...initialProductState });
    const [weightOptionsStr, setWeightOptionsStr] = useState(product?.weightOptions.join(', ') || '');

    const handleLocalizedStringChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: keyof Product, lang: 'en' | 'bn') => {
        const value = (formData[field] as LocalizedString);
        setFormData({ ...formData, [field]: { ...value, [lang]: e.target.value } });
    };
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: name === 'price' || name === 'stock' ? parseFloat(value) : value });
    };

    const handleImageUpload = (base64: string) => {
        setFormData({ ...formData, imageUrl: base64 });
    };

    const handleWeightOptionsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setWeightOptionsStr(e.target.value);
        const weights = e.target.value.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
        setFormData({ ...formData, weightOptions: weights });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };
    
    const formInputClasses = "w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500";


    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <form onSubmit={handleSubmit}>
                    <div className="p-5 border-b dark:border-gray-700">
                        <h3 className="text-xl font-bold">{product && 'id' in product ? 'Edit Product' : 'Add New Product'}</h3>
                    </div>
                    <div className="p-6 space-y-4">
                        {/* Name */}
                        <div><label>Name (English)</label><input type="text" value={formData.name.en} onChange={e => handleLocalizedStringChange(e, 'name', 'en')} required className={formInputClasses}/></div>
                        <div><label>Name (Bengali)</label><input type="text" value={formData.name.bn} onChange={e => handleLocalizedStringChange(e, 'name', 'bn')} required className={formInputClasses}/></div>
                        
                        <ImageUpload onImageUpload={handleImageUpload} initialImage={formData.imageUrl} label="Product Image" sizeSuggestion="Recommended: 800x800px"/>

                        {/* Category, Price, Stock */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div><label>Category</label><select name="category" value={formData.category} onChange={handleChange} className={formInputClasses}>{Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                            <div><label>Price (BDT)</label><input type="number" name="price" value={formData.price} onChange={handleChange} required min="0" className={formInputClasses}/></div>
                            <div><label>Stock</label><input type="number" name="stock" value={formData.stock} onChange={handleChange} required min="0" className={formInputClasses}/></div>
                        </div>
                        
                        {/* Weight Options */}
                        <div><label>Weight Options (kg, comma-separated)</label><input type="text" value={weightOptionsStr} onChange={handleWeightOptionsChange} placeholder="e.g. 1, 5, 20" className={formInputClasses}/></div>

                        {/* Descriptions */}
                        <div><label>Description (English)</label><textarea rows={3} value={formData.description.en} onChange={e => handleLocalizedStringChange(e, 'description', 'en')} className={formInputClasses}/></div>
                        <div><label>Description (Bengali)</label><textarea rows={3} value={formData.description.bn} onChange={e => handleLocalizedStringChange(e, 'description', 'bn')} className={formInputClasses}/></div>
                        <div><label>Ingredients (English)</label><textarea rows={2} value={formData.ingredients.en} onChange={e => handleLocalizedStringChange(e, 'ingredients', 'en')} className={formInputClasses}/></div>
                        <div><label>Ingredients (Bengali)</label><textarea rows={2} value={formData.ingredients.bn} onChange={e => handleLocalizedStringChange(e, 'ingredients', 'bn')} className={formInputClasses}/></div>
                        <div><label>Storage (English)</label><textarea rows={2} value={formData.storage.en} onChange={e => handleLocalizedStringChange(e, 'storage', 'en')} className={formInputClasses}/></div>
                        <div><label>Storage (Bengali)</label><textarea rows={2} value={formData.storage.bn} onChange={e => handleLocalizedStringChange(e, 'storage', 'bn')} className={formInputClasses}/></div>
                        <div><label>Features & Advantages (English)</label><textarea rows={3} value={formData.featuresAndAdvantages.en} onChange={e => handleLocalizedStringChange(e, 'featuresAndAdvantages', 'en')} className={formInputClasses}/></div>
                        <div><label>Features & Advantages (Bengali)</label><textarea rows={3} value={formData.featuresAndAdvantages.bn} onChange={e => handleLocalizedStringChange(e, 'featuresAndAdvantages', 'bn')} className={formInputClasses}/></div>

                    </div>
                    <div className="p-5 border-t dark:border-gray-700 flex justify-end gap-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export const AdminProductManagement: React.FC = () => {
    const { products, loading, addProduct, updateProduct, deleteProduct } = useProducts();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const handleAddNew = () => {
        setEditingProduct(null);
        setIsModalOpen(true);
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleDelete = (productId: string) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            deleteProduct(productId);
        }
    };
    
    const handleSave = async (productData: Omit<Product, 'id' | 'ratings'> | Product) => {
        if ('id' in productData) {
            await updateProduct(productData as Product);
        } else {
            await addProduct(productData);
        }
        setIsModalOpen(false);
        setEditingProduct(null);
    };

    const filteredProducts = useMemo(() => {
        return products.filter(p =>
            p.name.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.id.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [products, searchTerm]);

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Manage Products</h2>
                <button onClick={handleAddNew} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Add New Product</button>
            </div>
             <input
                type="text"
                placeholder="Search by name or ID..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full p-2 mb-4 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {loading ? <Spinner /> : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th className="px-4 py-2">Image</th>
                                <th className="px-4 py-2">Name</th>
                                <th className="px-4 py-2">Category</th>
                                <th className="px-4 py-2">Price</th>
                                <th className="px-4 py-2">Stock</th>
                                <th className="px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map(product => (
                                <tr key={product.id} className="border-b dark:border-gray-700">
                                    <td className="p-2"><img src={product.imageUrl} alt={product.name.en} className="w-12 h-12 object-cover rounded"/></td>
                                    <td className="px-4 py-2 font-medium text-gray-900 dark:text-white">{product.name.en}</td>
                                    <td className="px-4 py-2">{product.category}</td>
                                    <td className="px-4 py-2">BDT {product.price.toFixed(2)}</td>
                                    <td className="px-4 py-2">{product.stock}</td>
                                    <td className="px-4 py-2 space-x-2">
                                        <button onClick={() => handleEdit(product)} className="text-blue-600 hover:underline">Edit</button>
                                        <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:underline">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {isModalOpen && <ProductFormModal product={editingProduct} onClose={() => setIsModalOpen(false)} onSave={handleSave} />}
        </div>
    );
};