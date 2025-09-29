import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Address, CartItem } from '../types';
import { useSettings } from '../context/SettingsContext';
import { useNotification } from '../context/NotificationContext';
import { locationData, divisions } from '../utils/locations';
import { BackButton } from './BackButton';

interface FormData {
    division: string;
    district: string;
    upazila: string;
    details: string;
    isDefault: boolean;
}

export const AddAddressPage: React.FC = () => {
    const { addressId } = useParams<{ addressId: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const { user, updateUserProfile } = useAuth();
    const { t } = useSettings();
    const { showNotification } = useNotification();

    const fromState = location.state as { from?: string; items?: CartItem[] } | undefined;
    const isEditing = !!addressId;

    const [formData, setFormData] = useState<FormData>({
        division: '', district: '', upazila: '', details: '', isDefault: false
    });
    const [districtOptions, setDistrictOptions] = useState<string[]>([]);
    const [upazilaOptions, setUpazilaOptions] = useState<string[]>([]);

    useEffect(() => {
        if (isEditing && user) {
            const addressToEdit = user.addresses.find(addr => addr.id === addressId);
            if (addressToEdit) {
                setFormData({
                    division: addressToEdit.division,
                    district: addressToEdit.district,
                    upazila: addressToEdit.upazila,
                    details: addressToEdit.details,
                    isDefault: addressToEdit.isDefault,
                });
                setDistrictOptions(Object.keys(locationData[addressToEdit.division] || {}));
                setUpazilaOptions(locationData[addressToEdit.division]?.[addressToEdit.district] || []);
            }
        }
    }, [isEditing, addressId, user]);

    const handleDivisionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newDivision = e.target.value;
        setFormData({ ...formData, division: newDivision, district: '', upazila: '' });
        setDistrictOptions(newDivision ? Object.keys(locationData[newDivision as keyof typeof locationData]) : []);
        setUpazilaOptions([]);
    };

    const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newDistrict = e.target.value;
        setFormData({ ...formData, district: newDistrict, upazila: '' });
        setUpazilaOptions(formData.division && newDistrict ? locationData[formData.division as keyof typeof locationData][newDistrict] : []);
    };
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        
        let updatedAddresses: Address[];
        const newAddressData: Omit<Address, 'id'> = {
            division: formData.division,
            district: formData.district,
            upazila: formData.upazila,
            details: formData.details,
            isDefault: formData.isDefault,
        };

        let newAddressId = `addr_${Date.now()}`;
        if (isEditing) {
            updatedAddresses = user.addresses.map(addr => addr.id === addressId ? { ...newAddressData, id: addressId } : addr);
            newAddressId = addressId;
        } else {
            updatedAddresses = [...user.addresses, { ...newAddressData, id: newAddressId }];
        }

        if (formData.isDefault) {
            updatedAddresses = updatedAddresses.map(addr => ({ ...addr, isDefault: addr.id === newAddressId }));
        }

        try {
            await updateUserProfile({ ...user, addresses: updatedAddresses });
            showNotification(`Address ${isEditing ? 'updated' : 'added'} successfully!`, 'success');
            
            if (fromState?.from === '/payment-confirmation') {
                navigate(fromState.from, { state: { items: fromState.items }, replace: true });
            } else {
                navigate('/profile');
            }
        } catch (error) {
            showNotification('Failed to save address.', 'error');
        }
    };
    
    const formInputClasses = "w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-200 dark:disabled:bg-gray-600";


    return (
        <div className="max-w-2xl mx-auto">
            <BackButton />
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-6">{isEditing ? t('editAddress') : t('addNewAddress')}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="division">{t('division')}</label>
                            <select id="division" name="division" value={formData.division} onChange={handleDivisionChange} required className={`${formInputClasses} mt-1`}>
                            <option value="">Select Division</option>
                            {divisions.map(div => <option key={div} value={div}>{div}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="district">{t('district')}</label>
                            <select id="district" name="district" value={formData.district} onChange={handleDistrictChange} required disabled={!formData.division} className={`${formInputClasses} mt-1`}>
                                <option value="">Select District</option>
                                {districtOptions.map(dist => <option key={dist} value={dist}>{dist}</option>)}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="upazila">{t('upazila')}</label>
                        <select id="upazila" name="upazila" value={formData.upazila} onChange={handleChange} required disabled={!formData.district} className={`${formInputClasses} mt-1`}>
                            <option value="">Select Upazila</option>
                            {upazilaOptions.map(upa => <option key={upa} value={upa}>{upa}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="details">{t('addressDetails')}</label>
                        <textarea id="details" name="details" value={formData.details} onChange={handleChange} required placeholder="e.g. House 123, Road 45, Block B" className={`${formInputClasses} mt-1`} />
                    </div>
                    <div className="flex items-center">
                        <input type="checkbox" id="isDefault" name="isDefault" checked={formData.isDefault} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"/>
                        <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">{t('defaultAddress')}</label>
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">{t('cancel')}</button>
                        <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">{t('saveChanges')}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};