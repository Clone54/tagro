import React from 'react';
// FIX: Corrected import path for types.
import { DealerInfo } from '../types';
import { Spinner } from './Spinner';
import { useSettings } from '../context/SettingsContext';
import { useDealers } from '../context/DealerContext';


const DealerCard: React.FC<{ dealer: DealerInfo }> = ({ dealer }) => {
    const { language } = useSettings();
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden text-center transform hover:-translate-y-2 transition-transform duration-300">
            <img src={dealer.image} alt={dealer.name.en} className="w-full h-56 object-cover"/>
            <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{dealer.name[language]}</h3>
                <p className="text-green-600 dark:text-green-400 font-semibold">{dealer.zone[language]}</p>
                <div className="mt-4 text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <p><strong>Phone:</strong> {dealer.phone}</p>
                    <p><strong>Dealer Code:</strong> {dealer.code}</p>
                </div>
            </div>
        </div>
    );
};


export const Dealer: React.FC = () => {
    const { dealers, loading } = useDealers();
    const { t } = useSettings();

    return (
        <div className="animate-fade-in">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">{t('authorizedDealers')}</h1>
                <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
                   {t('dealerIntro')}
                </p>
            </div>
             {loading ? <div className="flex justify-center"><Spinner/></div> : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {dealers.map(dealer => (
                        <DealerCard key={dealer.id} dealer={dealer} />
                    ))}
                </div>
             )}
        </div>
    );
};