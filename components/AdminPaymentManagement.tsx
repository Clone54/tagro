import React, { useState, useEffect } from 'react';
import { usePayments } from '../context/PaymentContext';
import { useSettings } from '../context/SettingsContext';
import { PaymentMethod } from '../types';
import { Spinner } from './Spinner';

const SectionWrapper: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-6 border dark:border-gray-700 rounded-lg">
        <h3 className="p-4 text-lg font-semibold bg-gray-50 dark:bg-gray-700/50 rounded-t-lg border-b dark:border-gray-700">{title}</h3>
        <div className="p-4 space-y-4">
            {children}
        </div>
    </div>
);

const ToggleSwitch: React.FC<{ checked: boolean; onChange: (checked: boolean) => void }> = ({ checked, onChange }) => (
    <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only peer" />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
    </label>
);

export const AdminPaymentManagement: React.FC = () => {
    const { paymentMethods, loading, updatePaymentMethods } = usePayments();
    const { t } = useSettings();
    const [localMethods, setLocalMethods] = useState<PaymentMethod[]>([]);

    useEffect(() => {
        setLocalMethods(paymentMethods);
    }, [paymentMethods]);
    
    const handleChange = (type: string, field: string, value: any) => {
        setLocalMethods(prev =>
            prev.map(method =>
                method.type === type
                    ? { ...method, details: { ...method.details, [field]: value } }
                    : method
            )
        );
    };

    const handleToggle = (type: string, isEnabled: boolean) => {
        setLocalMethods(prev =>
            prev.map(method => (method.type === type ? { ...method, isEnabled } : method))
        );
    };
    
    const handleSave = () => {
        updatePaymentMethods(localMethods);
    };

    if (loading) {
        return <div className="flex justify-center"><Spinner /></div>;
    }
    
    const formInputClasses = "w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500";


    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
                 <h2 className="text-xl font-semibold">{t('paymentInfo')}</h2>
                 <button onClick={handleSave} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">{t('saveChanges')}</button>
            </div>
            
            <SectionWrapper title={t('mobileBanking')}>
                {localMethods.filter(m => m.type !== 'bank').map(method => (
                    <div key={method.type} className="p-4 border dark:border-gray-600 rounded">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="font-bold capitalize">{method.name}</h4>
                            <ToggleSwitch checked={method.isEnabled} onChange={(checked) => handleToggle(method.type, checked)} />
                        </div>
                        {method.isEnabled && (
                            <div className="space-y-3">
                                <input type="text" value={method.details.accountNumber} onChange={(e) => handleChange(method.type, 'accountNumber', e.target.value)} placeholder={t('accountNumber')} className={formInputClasses}/>
                                <div>
                                    <label className="text-sm font-medium">{t('paymentType')}</label>
                                    <div className="flex gap-4 mt-1">
                                        <label className="flex items-center"><input type="radio" name={`${method.type}-paymentType`} value="sendMoney" checked={method.details.paymentType === 'sendMoney'} onChange={() => handleChange(method.type, 'paymentType', 'sendMoney')} className="mr-2"/>{t('sendMoney')}</label>
                                        <label className="flex items-center"><input type="radio" name={`${method.type}-paymentType`} value="payment" checked={method.details.paymentType === 'payment'} onChange={() => handleChange(method.type, 'paymentType', 'payment')} className="mr-2"/>{t('payment')}</label>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </SectionWrapper>
            
            <SectionWrapper title={t('bankTransfer')}>
                {localMethods.filter(m => m.type === 'bank').map(method => (
                     <div key={method.type} className="p-4 border dark:border-gray-600 rounded">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="font-bold capitalize">{method.name}</h4>
                            <ToggleSwitch checked={method.isEnabled} onChange={(checked) => handleToggle(method.type, checked)} />
                        </div>
                        {method.isEnabled && (
                            <div className="space-y-3">
                                <input type="text" value={method.details.bankName} onChange={(e) => handleChange(method.type, 'bankName', e.target.value)} placeholder={t('bankName')} className={formInputClasses}/>
                                <input type="text" value={method.details.branchName} onChange={(e) => handleChange(method.type, 'branchName', e.target.value)} placeholder={t('branchName')} className={formInputClasses}/>
                                <input type="text" value={method.details.accountName} onChange={(e) => handleChange(method.type, 'accountName', e.target.value)} placeholder={t('accountName')} className={formInputClasses}/>
                                <input type="text" value={method.details.accountNumber} onChange={(e) => handleChange(method.type, 'accountNumber', e.target.value)} placeholder={t('accountNumber')} className={formInputClasses}/>
                                <input type="text" value={method.details.routingNumber} onChange={(e) => handleChange(method.type, 'routingNumber', e.target.value)} placeholder={t('routingNumber')} className={formInputClasses}/>
                            </div>
                        )}
                    </div>
                ))}
            </SectionWrapper>
        </div>
    );
};