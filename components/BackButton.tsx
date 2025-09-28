import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';

const ArrowLeftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
);

export const BackButton: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useSettings();

    return (
        <button
            onClick={() => navigate(-1)}
            className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200 mb-6"
        >
            <ArrowLeftIcon />
            {t('goBack')}
        </button>
    );
};
