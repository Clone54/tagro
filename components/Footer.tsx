import React from 'react';
import { useSettings } from '../context/SettingsContext';
import { useContent } from '../context/ContentContext';
import { Spinner } from './Spinner';

const SunIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 14.95a1 1 0 001.414 1.414l.707-.707a1 1 0 00-1.414-1.414l-.707.707zm-2.121-2.121a1 1 0 011.414 0l.707.707a1 1 0 11-1.414 1.414l-.707-.707a1 1 0 010-1.414zM3 11a1 1 0 100-2H2a1 1 0 100 2h1z" clipRule="evenodd" /></svg>;
const MoonIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>;
const FacebookIcon = () => <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>;
const TwitterIcon = () => <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>;
const InstagramIcon = () => <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.024.06 1.378.06 3.808s-.012 2.784-.06 3.808c-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.024.048-1.378.06-3.808.06s-2.784-.013-3.808-.06c-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.048-1.024-.06-1.378-.06-3.808s.012-2.784.06-3.808c.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 016.345 2.525c.636-.247 1.363-.416 2.427-.465C9.793 2.013 10.147 2 12.315 2zm0 1.623c-2.378 0-2.693.01-3.638.056-.945.045-1.468.2-1.91.386-.464.195-.82.43-1.168.778a3.287 3.287 0 00-.778 1.168c-.186.442-.341.965-.386 1.91-.046.945-.056 1.26-.056 3.638s.01 2.693.056 3.638c.045.945.2 1.468.386 1.91.195.464.43.82.778 1.168a3.287 3.287 0 001.168.778c.442.186.965.341 1.91.386.945.046 1.26.056 3.638.056s2.693-.01 3.638-.056c.945-.045 1.468-.2 1.91-.386.464-.195.82-.43 1.168-.778a3.287 3.287 0 00.778-1.168c.186-.442.341-.965-.386-1.91.046-.945.056-1.26.056-3.638s-.01-2.693-.056-3.638c-.045-.945-.2-1.468-.386-1.91-.195-.464-.43-.82-.778-1.168a3.287 3.287 0 00-1.168-.778c-.442-.186-.965-.341-1.91-.386-.945-.046-1.26-.056-3.638-.056zM12 6.845a5.155 5.155 0 100 10.31 5.155 5.155 0 000-10.31zm0 1.623a3.532 3.532 0 110 7.064 3.532 3.532 0 010-7.064zM16.802 6.11a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z" clipRule="evenodd" /></svg>;
const LinkedInIcon = () => <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd"/></svg>;


export const Footer: React.FC = () => {
    const { theme, toggleTheme, language, setLanguage, t } = useSettings();
    const { footerContent } = useContent();

    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setLanguage(e.target.value as 'en' | 'bn');
    };

    return (
        <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
                    <div className="text-center md:text-left">
                         <p className="text-sm text-gray-500 dark:text-gray-400">
                            &copy; {new Date().getFullYear()} {t('footerRights')}
                        </p>
                    </div>

                    <div className="flex items-center gap-6">
                        {footerContent ? (
                            <div className="flex justify-center gap-6">
                                <a href={footerContent.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"><span className="sr-only">Facebook</span><FacebookIcon /></a>
                                <a href={footerContent.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"><span className="sr-only">Twitter</span><TwitterIcon /></a>
                                <a href={footerContent.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"><span className="sr-only">Instagram</span><InstagramIcon /></a>
                                <a href={footerContent.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"><span className="sr-only">LinkedIn</span><LinkedInIcon /></a>
                            </div>
                        ) : <Spinner />}
                    </div>

                    <div className="flex items-center gap-4">
                        <select onChange={handleLanguageChange} value={language} className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-1 px-2 text-sm text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500">
                            <option value="en">English</option>
                            <option value="bn">বাংলা</option>
                        </select>
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            aria-label="Toggle theme"
                        >
                            {theme === 'light' ? <MoonIcon /> : <SunIcon />}
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
};