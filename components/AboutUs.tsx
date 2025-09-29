import React from 'react';
import { Spinner } from './Spinner';
import { useSettings } from '../context/SettingsContext';
import { useContent } from '../context/ContentContext';

const CheckIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
);

export const AboutUs: React.FC = () => {
    const { aboutContent, loading } = useContent();
    const { language, t } = useSettings();

    if (loading || !aboutContent) {
        return <div className="flex justify-center items-center h-96"><Spinner /></div>;
    }

    return (
        <div className="dark:bg-gray-900">
            {/* Hero Section */}
            <div className="relative bg-cover bg-center h-[40vh]" style={{ backgroundImage: `url('${aboutContent.heroImage}')` }}>
                <div className="absolute inset-0 bg-black opacity-60"></div>
                <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                        {t('aboutTitle')}
                    </h1>
                </div>
            </div>

            {/* Content Section */}
            <div className="bg-white dark:bg-gray-900 py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        {/* Our Story */}
                        <div className="mb-12 text-center">
                            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4">{t('ourStory')}</h2>
                            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                                {aboutContent.story[language]}
                            </p>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-12">
                            {/* Our Mission */}
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 flex items-center">
                                    <CheckIcon className="text-green-500 mr-2" />
                                    {t('ourMission')}
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                   {aboutContent.mission[language]}
                                </p>
                            </div>

                            {/* Our Vision */}
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 flex items-center">
                                     <CheckIcon className="text-green-500 mr-2" />
                                     {t('ourVision')}
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    {aboutContent.vision[language]}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
