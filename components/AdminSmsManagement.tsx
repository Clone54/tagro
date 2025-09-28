
import React, { useState, useEffect } from 'react';
import { useSmsTemplates } from '../context/SmsTemplateContext';
import { SmsTemplates } from '../types';
import { Spinner } from './Spinner';

const SectionWrapper: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-6 border dark:border-gray-700 rounded-lg">
        <h3 className="p-4 text-lg font-semibold bg-gray-50 dark:bg-gray-700/50 rounded-t-lg border-b dark:border-gray-700">{title}</h3>
        <div className="p-4 space-y-4">
            {children}
        </div>
    </div>
);

export const AdminSmsManagement: React.FC = () => {
    const { smsTemplates, loading, updateSmsTemplates } = useSmsTemplates();
    const [localTemplates, setLocalTemplates] = useState<SmsTemplates | null>(null);

    useEffect(() => {
        setLocalTemplates(smsTemplates);
    }, [smsTemplates]);

    if (loading || !localTemplates) {
        return <div className="flex justify-center"><Spinner /></div>;
    }

    const handleChange = (type: 'otp' | 'orderConfirmation', lang: 'en' | 'bn', value: string) => {
        setLocalTemplates(prev => {
            if (!prev) return null;
            return {
                ...prev,
                [type]: {
                    ...prev[type],
                    [lang]: value,
                },
            };
        });
    };
    
    const handleSave = () => {
        if (localTemplates) {
            updateSmsTemplates(localTemplates);
        }
    };
    
    const formTextareaClasses = "w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 font-mono text-sm";

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">SMS Template Management</h2>
                <button onClick={handleSave} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Save Changes</button>
            </div>
            
            <SectionWrapper title="OTP Verification SMS">
                <div>
                    <label className="font-medium">English Template</label>
                    <textarea 
                        rows={2}
                        value={localTemplates.otp.en}
                        onChange={e => handleChange('otp', 'en', e.target.value)}
                        className={formTextareaClasses}
                    />
                    <p className="text-xs text-gray-500 mt-1">Available placeholders: <code className="bg-gray-200 dark:bg-gray-600 p-0.5 rounded">{'{otp}'}</code></p>
                </div>
                 <div>
                    <label className="font-medium">Bengali Template</label>
                    <textarea 
                        rows={2}
                        value={localTemplates.otp.bn}
                        onChange={e => handleChange('otp', 'bn', e.target.value)}
                        className={formTextareaClasses}
                    />
                     <p className="text-xs text-gray-500 mt-1">Available placeholders: <code className="bg-gray-200 dark:bg-gray-600 p-0.5 rounded">{'{otp}'}</code></p>
                </div>
            </SectionWrapper>
            
             <SectionWrapper title="Order Confirmation SMS">
                <div>
                    <label className="font-medium">English Template</label>
                    <textarea 
                        rows={3}
                        value={localTemplates.orderConfirmation.en}
                        onChange={e => handleChange('orderConfirmation', 'en', e.target.value)}
                        className={formTextareaClasses}
                    />
                    <p className="text-xs text-gray-500 mt-1">Available placeholders: <code className="bg-gray-200 dark:bg-gray-600 p-0.5 rounded">{'{userName}'}</code>, <code className="bg-gray-200 dark:bg-gray-600 p-0.5 rounded">{'{orderId}'}</code>, <code className="bg-gray-200 dark:bg-gray-600 p-0.5 rounded">{'{totalAmount}'}</code></p>
                </div>
                 <div>
                    <label className="font-medium">Bengali Template</label>
                    <textarea 
                        rows={3}
                        value={localTemplates.orderConfirmation.bn}
                        onChange={e => handleChange('orderConfirmation', 'bn', e.target.value)}
                        className={formTextareaClasses}
                    />
                    <p className="text-xs text-gray-500 mt-1">Available placeholders: <code className="bg-gray-200 dark:bg-gray-600 p-0.5 rounded">{'{userName}'}</code>, <code className="bg-gray-200 dark:bg-gray-600 p-0.5 rounded">{'{orderId}'}</code>, <code className="bg-gray-200 dark:bg-gray-600 p-0.5 rounded">{'{totalAmount}'}</code></p>
                </div>
            </SectionWrapper>
        </div>
    );
};
