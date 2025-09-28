
import React, { useState, useMemo } from 'react';
import { useDealers } from '../context/DealerContext';
import { DealerInfo, LocalizedString } from '../types';
import { Spinner } from './Spinner';
import { ImageUpload } from './ImageUpload';

const initialDealerState: Omit<DealerInfo, 'id'> = {
    name: { en: '', bn: '' },
    zone: { en: '', bn: '' },
    phone: '',
    code: '',
    image: '',
};

const DealerFormModal: React.FC<{
    dealer: Omit<DealerInfo, 'id'> | DealerInfo | null;
    onClose: () => void;
    onSave: (dealerData: any) => void;
}> = ({ dealer, onClose, onSave }) => {
    const [formData, setFormData] = useState(dealer ? { ...dealer } : { ...initialDealerState });

    const handleLocalizedStringChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof DealerInfo, lang: 'en' | 'bn') => {
        const value = (formData[field] as LocalizedString);
        setFormData({ ...formData, [field]: { ...value, [lang]: e.target.value } });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    
    const handleImageUpload = (base64: string) => {
        setFormData({ ...formData, image: base64 });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    const formInputClasses = "w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500";

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-lg">
                <form onSubmit={handleSubmit}>
                    <div className="p-5 border-b dark:border-gray-700">
                        <h3 className="text-xl font-bold">{dealer && 'id' in dealer ? 'Edit Dealer' : 'Add New Dealer'}</h3>
                    </div>
                    <div className="p-6 space-y-4">
                        <div><label>Name (English)</label><input type="text" value={formData.name.en} onChange={e => handleLocalizedStringChange(e, 'name', 'en')} required className={formInputClasses}/></div>
                        <div><label>Name (Bengali)</label><input type="text" value={formData.name.bn} onChange={e => handleLocalizedStringChange(e, 'name', 'bn')} required className={formInputClasses}/></div>
                        
                        <ImageUpload onImageUpload={handleImageUpload} initialImage={formData.image} label="Dealer Image" sizeSuggestion="Recommended: 800x800px"/>
                        
                        <div><label>Zone (English)</label><input type="text" value={formData.zone.en} onChange={e => handleLocalizedStringChange(e, 'zone', 'en')} required className={formInputClasses}/></div>
                        <div><label>Zone (Bengali)</label><input type="text" value={formData.zone.bn} onChange={e => handleLocalizedStringChange(e, 'zone', 'bn')} required className={formInputClasses}/></div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><label>Phone</label><input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className={formInputClasses}/></div>
                            <div><label>Dealer Code</label><input type="text" name="code" value={formData.code} onChange={handleChange} required className={formInputClasses}/></div>
                        </div>
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

export const AdminDealerManagement: React.FC = () => {
    const { dealers, loading, addDealer, updateDealer, deleteDealer } = useDealers();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDealer, setEditingDealer] = useState<DealerInfo | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const handleAddNew = () => {
        setEditingDealer(null);
        setIsModalOpen(true);
    };

    const handleEdit = (dealer: DealerInfo) => {
        setEditingDealer(dealer);
        setIsModalOpen(true);
    };

    const handleDelete = (dealerId: string) => {
        if (window.confirm('Are you sure you want to delete this dealer?')) {
            deleteDealer(dealerId);
        }
    };
    
    const handleSave = async (dealerData: Omit<DealerInfo, 'id'> | DealerInfo) => {
        if ('id' in dealerData) {
            await updateDealer(dealerData as DealerInfo);
        } else {
            await addDealer(dealerData);
        }
        setIsModalOpen(false);
        setEditingDealer(null);
    };

    const filteredDealers = useMemo(() => {
        return dealers.filter(d =>
            d.name.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
            d.code.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [dealers, searchTerm]);

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Manage Dealers</h2>
                <button onClick={handleAddNew} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Add New Dealer</button>
            </div>
             <input
                type="text"
                placeholder="Search by name or code..."
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
                                <th className="px-4 py-2">Zone</th>
                                <th className="px-4 py-2">Phone</th>
                                <th className="px-4 py-2">Code</th>
                                <th className="px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDealers.map(dealer => (
                                <tr key={dealer.id} className="border-b dark:border-gray-700">
                                    <td className="p-2"><img src={dealer.image} alt={dealer.name.en} className="w-12 h-12 object-cover rounded"/></td>
                                    <td className="px-4 py-2 font-medium text-gray-900 dark:text-white">{dealer.name.en}</td>
                                    <td className="px-4 py-2">{dealer.zone.en}</td>
                                    <td className="px-4 py-2">{dealer.phone}</td>
                                    <td className="px-4 py-2">{dealer.code}</td>
                                    <td className="px-4 py-2 space-x-2">
                                        <button onClick={() => handleEdit(dealer)} className="text-blue-600 hover:underline">Edit</button>
                                        <button onClick={() => handleDelete(dealer.id)} className="text-red-600 hover:underline">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {isModalOpen && <DealerFormModal dealer={editingDealer} onClose={() => setIsModalOpen(false)} onSave={handleSave} />}
        </div>
    );
};