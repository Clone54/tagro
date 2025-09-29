import React, { useState } from 'react';
import { useSettings } from '../context/SettingsContext';
// FIX: Corrected import for a newly created component.
import { AdminProductManagement } from './AdminProductManagement';
// FIX: Corrected import for a newly created component.
import { AdminDealerManagement } from './AdminDealerManagement';
// FIX: Corrected import for a newly created component.
import { AdminContentManagement } from './AdminContentManagement';
import { AdminOrderManagement } from './AdminOrderManagement';
import { AdminPaymentManagement } from './AdminPaymentManagement';
import { AdminSmsManagement } from './AdminSmsManagement';
import { AdminUserManagement } from './AdminUserManagement';

const ProductIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>;
const DealerIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a3.002 3.002 0 013.39-2.142 3.002 3.002 0 013.39 2.142m-6.78 0a3.002 3.002 0 00-3.39-2.142 3.002 3.002 0 00-3.39 2.142m0 0L7 14m0 0V7a3 3 0 016 0v7m0 0L7 14" /></svg>;
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197m0 0A5.975 5.975 0 0112 13a5.975 5.975 0 013 1.803M15 21a9 9 0 00-3-6.572M12 4.354a4 4 0 110 5.292" /></svg>;
const OrderIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>;
const ContentIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>;
const PaymentIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>;
const SmsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>;

type AdminTab = 'products' | 'dealers' | 'users' | 'orders' | 'content' | 'payments' | 'sms';

export const AdminPanel: React.FC = () => {
    const [activeTab, setActiveTab] = useState<AdminTab>('products');
    const { t } = useSettings();

    const renderContent = () => {
        switch (activeTab) {
            case 'products': return <AdminProductManagement />;
            case 'dealers': return <AdminDealerManagement />;
            case 'users': return <AdminUserManagement />;
            case 'orders': return <AdminOrderManagement />;
            case 'content': return <AdminContentManagement />;
            case 'payments': return <AdminPaymentManagement />;
            case 'sms': return <AdminSmsManagement />;
            default: return <AdminProductManagement />;
        }
    };

    const NavButton: React.FC<{ tabName: AdminTab; label: string; icon: React.ReactNode }> = ({ tabName, label, icon }) => (
        <button
            onClick={() => setActiveTab(tabName)}
            className={`flex items-center w-full px-4 py-3 text-left transition-colors duration-200 ${
                activeTab === tabName
                    ? 'bg-green-600 text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
        >
            {icon}
            <span className="ml-4 font-medium">{label}</span>
        </button>
    );

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
             <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Admin Panel</h1>
            <div className="flex flex-col md:flex-row gap-8">
                <aside className="md:w-1/4 lg:w-1/5">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                       <nav className="flex flex-col">
                           <NavButton tabName="products" label={t('manageProducts')} icon={<ProductIcon />} />
                           <NavButton tabName="dealers" label={t('manageDealers')} icon={<DealerIcon />} />
                           <NavButton tabName="users" label={t('manageUsers')} icon={<UsersIcon />} />
                           <NavButton tabName="orders" label={t('manageOrders')} icon={<OrderIcon />} />
                           <NavButton tabName="content" label={t('siteContent')} icon={<ContentIcon />} />
                           <NavButton tabName="payments" label={t('paymentInfo')} icon={<PaymentIcon />} />
                           <NavButton tabName="sms" label="SMS Templates" icon={<SmsIcon />} />
                       </nav>
                    </div>
                </aside>
                <main className="flex-grow md:w-3/4 lg:w-4/5">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};
