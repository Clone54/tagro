import React from 'react';
import { Spinner } from './Spinner';
import { useSettings } from '../context/SettingsContext';
import { useContent } from '../context/ContentContext';

export const ContactUs: React.FC = () => {
    const { contactInfo, loading } = useContent();
    const { language, t } = useSettings();

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">{t('getInTouch')}</h1>
                <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
                    {t('contactIntro')}
                </p>
            </div>
            <div className="grid md:grid-cols-2 gap-12 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
                {/* Contact Form */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">{t('sendMessage')}</h2>
                    <form>
                        <div className="mb-4">
                            <label htmlFor="name" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">{t('fullName')}</label>
                            <input type="text" id="name" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200" placeholder={t('fullNamePlaceholder')} required />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">{t('emailAddress')}</label>
                            <input type="email" id="email" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200" placeholder={t('emailPlaceholder')} required />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="subject" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">{t('subject')}</label>
                            <input type="text" id="subject" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200" placeholder={t('subjectPlaceholder')} required />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="message" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">{t('message')}</label>
                            <textarea id="message" rows={5} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200" placeholder={t('messagePlaceholder')} required></textarea>
                        </div>
                        <button type="submit" className="w-full py-3 px-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-colors shadow-md">
                            {t('sendMessageButton')}
                        </button>
                    </form>
                </div>

                {/* Company Address */}
                <div className="bg-green-50 dark:bg-gray-700 p-8 rounded-lg">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">{t('contactInformation')}</h2>
                    {loading ? <Spinner/> : contactInfo && (
                         <div className="space-y-4 text-gray-700 dark:text-gray-300">
                            <div className="flex items-start">
                                <p><strong className="block font-semibold text-gray-800 dark:text-white">{t('address')}:</strong> {contactInfo.address[language]}</p>
                            </div>
                            <div className="flex items-start">
                                 <p><strong className="block font-semibold text-gray-800 dark:text-white">{t('email')}:</strong> <a href={`mailto:${contactInfo.email}`} className="text-green-600 hover:underline">{contactInfo.email}</a></p>
                            </div>
                            <div className="flex items-start">
                                 <p><strong className="block font-semibold text-gray-800 dark:text-white">{t('phone')}:</strong> <a href={`tel:${contactInfo.phone.replace(/\s/g, '')}`} className="text-green-600 hover:underline">{contactInfo.phone}</a></p>
                            </div>
                        </div>
                    )}
                    {/* Placeholder for map */}
                     <div className="mt-8 h-64 bg-gray-300 dark:bg-gray-600 rounded-lg flex items-center justify-center">
                        <p className="text-gray-500 dark:text-gray-400">Map Integration Here</p>
                    </div>
                </div>
            </div>
        </div>
    );
};