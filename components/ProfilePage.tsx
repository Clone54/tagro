
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Order, Address } from '../types';
import { useSettings } from '../context/SettingsContext';
import { Link, useNavigate } from 'react-router-dom';
import { useNotification } from '../context/NotificationContext';
import { ImageUpload } from './ImageUpload';

type ProfileTab = 'details' | 'orders' | 'addresses';

// --- ICONS ---
const ProfileIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>;
const OrderIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v2a2 2 0 01-2 2H7a2 2 0 01-2-2V4zm0 6a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H7a2 2 0 01-2-2v-6z" /></svg>;
const AddressIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>;
const LogoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" /></svg>;


// --- SUB-COMPONENTS ---
const ProfileDetails: React.FC<{ user: User, onSave: (userData: User) => void }> = ({ user, onSave }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(user);
    const { t } = useSettings();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageUpload = (url: string) => {
        setFormData({ ...formData, profilePictureUrl: url });
    };

    const handleSave = () => {
        onSave(formData);
        setIsEditing(false);
    };
    
    const inputClasses = "w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500";


    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">{t('profileDetails')}</h3>
                {!isEditing && <button onClick={() => setIsEditing(true)} className="px-4 py-2 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700">{t('editProfile')}</button>}
            </div>
            {isEditing ? (
                <div className="space-y-4">
                    <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder={t('fullName')} className={inputClasses} />
                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder={t('emailAddress')} className={inputClasses} />
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder={t('phoneNumber')} className={inputClasses} />
                    <ImageUpload
                        label={t('profilePictureURL')}
                        initialImage={formData.profilePictureUrl}
                        onImageUpload={handleImageUpload}
                        sizeSuggestion="Recommended: 200x200px"
                    />
                    <div className="flex justify-end gap-4">
                        <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600">{t('cancel')}</button>
                        <button onClick={handleSave} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">{t('saveChanges')}</button>
                    </div>
                </div>
            ) : (
                <div className="space-y-3 text-gray-700 dark:text-gray-300">
                    <p><strong>{t('fullName')}:</strong> {user.name}</p>
                    <p><strong>{t('emailAddress')}:</strong> {user.email}</p>
                    <p><strong>{t('phoneNumber')}:</strong> {user.phone}</p>
                </div>
            )}
        </div>
    );
};

const OrderHistory: React.FC<{ orders: Order[] }> = ({ orders }) => {
    const { t } = useSettings();
    const { user, updateUserProfile } = useAuth();
    const { showNotification } = useNotification();

    const handleRequestCancellation = async (orderId: string) => {
        if (!user) return;
        try {
            const updatedOrders: Order[] = user.orders.map(o =>
                o.id === orderId ? { ...o, status: 'Cancellation Requested' } : o
            );
            await updateUserProfile({ ...user, orders: updatedOrders });
            showNotification(t('cancellationRequestSent'), 'success');
        } catch (error) {
            showNotification('Failed to send cancellation request.', 'error');
            console.error("Cancellation request failed:", error);
        }
    };
    
    const statusKey = (status: string) => status.charAt(0).toLowerCase() + status.slice(1).replace(/\s/g, '');

    const getStatusColor = (status: Order['status']) => {
        switch (status) {
            case 'Delivered': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'Shipped': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            case 'Processing': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
            case 'Pending': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
            case 'Cancellation Requested': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
            case 'Cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        }
    };


    return (
        <div>
            <h3 className="text-xl font-bold mb-6">{t('orderHistory')}</h3>
            {orders.length > 0 ? (
                <div className="space-y-4">
                    {orders.slice().reverse().map(order => (
                        <div key={order.id} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg shadow-sm border dark:border-gray-700">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-semibold text-gray-800 dark:text-gray-200">{t('orderId')}: <span className="font-mono text-gray-600 dark:text-gray-400">{order.id}</span></p>
                                    <p className="text-sm text-gray-500">{t('date')}: {new Date(order.orderDate).toLocaleDateString()}</p>
                                </div>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>{t(statusKey(order.status)) || order.status}</span>
                            </div>
                            <p className="mt-2 font-bold text-lg text-green-600 dark:text-green-400">{t('total')}: BDT {order.totalAmount.toFixed(2)}</p>
                             {order.status === 'Processing' && (
                                <div className="mt-4 text-right">
                                    <button
                                        onClick={() => handleRequestCancellation(order.id)}
                                        className="px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-lg hover:bg-red-600 transition-colors"
                                    >
                                        {t('requestCancellation')}
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : <p>{t('noOrders')}</p>}
        </div>
    );
};

const MyAddresses: React.FC<{ user: User, onUpdate: (user: User) => void }> = ({ user, onUpdate }) => {
    const { t } = useSettings();
    const navigate = useNavigate();
    
    const handleDelete = (addressId: string) => {
        const updatedUser = { ...user, addresses: user.addresses.filter(a => a.id !== addressId) };
        onUpdate(updatedUser);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">{t('myAddresses')}</h3>
                <button onClick={() => navigate('/profile/address/new')} className="px-4 py-2 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700">{t('addNewAddress')}</button>
            </div>
            {user.addresses.length > 0 ? (
                <div className="space-y-4">
                    {user.addresses.map(addr => (
                        <div key={addr.id} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg shadow-sm border dark:border-gray-700">
                            <p className="font-semibold text-gray-800 dark:text-gray-200">{addr.details}</p>
                            <p className="text-gray-600 dark:text-gray-400">{addr.upazila}, {addr.district}, {addr.division}</p>
                            {addr.isDefault && <span className="inline-block mt-1 text-xs font-bold text-white bg-green-500 px-2 py-0.5 rounded-full">Default</span>}
                            <div className="flex gap-4 mt-2 text-sm">
                                <button onClick={() => navigate(`/profile/address/edit/${addr.id}`)} className="font-medium text-blue-600 hover:underline">{t('editAddress')}</button>
                                <button onClick={() => handleDelete(addr.id)} className="font-medium text-red-600 hover:underline">Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : <p>{t('noAddresses')}</p>}
        </div>
    );
};


// --- MAIN PAGE COMPONENT ---
export const ProfilePage: React.FC = () => {
    const { user, updateUserProfile, logout } = useAuth();
    const { t } = useSettings();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<ProfileTab>('details');
    const { showNotification } = useNotification();

    if (!user) return null;
    
    const handleUpdateUser = async (updatedUserData: User) => {
        try {
            await updateUserProfile(updatedUserData);
        } catch (error) {
            showNotification('Failed to update profile.', 'error');
        }
    };
    
    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const tabButtonClasses = (tabName: ProfileTab, icon: React.ReactNode, label: string) => (
         <button
            onClick={() => setActiveTab(tabName)}
            className={`flex items-center w-full px-4 py-3 text-left transition-colors duration-200 rounded-lg ${
                activeTab === tabName
                    ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 font-semibold'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
        >
            {icon}
            <span className="ml-3">{label}</span>
        </button>
    );

    return (
        <div className="grid md:grid-cols-12 gap-8">
            <aside className="md:col-span-3">
                <nav className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex flex-col space-y-1 h-fit sticky top-28">
                   {tabButtonClasses('details', <ProfileIcon />, t('profileDetails'))}
                   {tabButtonClasses('orders', <OrderIcon />, t('orderHistory'))}
                   {tabButtonClasses('addresses', <AddressIcon />, t('myAddresses'))}
                   <div className="border-t dark:border-gray-700 my-2 !mt-3 !mb-2"></div>
                   <button onClick={handleLogout} className="flex items-center w-full px-4 py-3 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50 rounded-lg transition-colors duration-200">
                        <LogoutIcon />
                        <span className="ml-3 font-semibold">{t('logout')}</span>
                    </button>
                </nav>
            </aside>
            <main className="md:col-span-9">
                 <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex items-center space-x-6">
                    <img src={user.profilePictureUrl} alt="profile" className="w-24 h-24 rounded-full ring-4 ring-green-500/50 p-1" />
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{user.name}</h1>
                        <p className="text-md text-gray-500 dark:text-gray-400">{user.email}</p>
                    </div>
                </div>

                <div className="mt-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
                    {activeTab === 'details' && <ProfileDetails user={user} onSave={handleUpdateUser} />}
                    {activeTab === 'orders' && <OrderHistory orders={user.orders} />}
                    {activeTab === 'addresses' && <MyAddresses user={user} onUpdate={handleUpdateUser}/>}
                </div>
            </main>
        </div>
    );
};