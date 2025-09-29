
import React, { useState, useEffect } from 'react';
import { useContent } from '../context/ContentContext';
import { HomeContent, AboutContent, ContactInfo, FooterContent, SiteSettingsContent } from '../types';
import { Spinner } from './Spinner';
import { useProducts } from '../context/ProductContext';
import { ImageUpload } from './ImageUpload';

const SectionWrapper: React.FC<{ title: string; onSave: () => void; children: React.ReactNode }> = ({ title, onSave, children }) => (
    <div className="mb-6 border dark:border-gray-700 rounded-lg">
        <div className="p-4 flex justify-between items-center bg-gray-50 dark:bg-gray-700/50 rounded-t-lg border-b dark:border-gray-700">
            <h3 className="text-lg font-semibold">{title}</h3>
            <button onClick={onSave} className="px-4 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700">Save</button>
        </div>
        <div className="p-4 space-y-4">
            {children}
        </div>
    </div>
);

export const AdminContentManagement: React.FC = () => {
    const {
        homeContent, aboutContent, contactInfo, footerContent, siteSettings, loading,
        updateHomeContent, updateAboutContent, updateContactInfo, updateFooterContent, updateSiteSettings,
    } = useContent();
    const { products } = useProducts();

    const [homeData, setHomeData] = useState<HomeContent | null>(null);
    const [aboutData, setAboutData] = useState<AboutContent | null>(null);
    const [contactData, setContactData] = useState<ContactInfo | null>(null);
    const [footerData, setFooterData] = useState<FooterContent | null>(null);
    const [settingsData, setSettingsData] = useState<SiteSettingsContent | null>(null);

    useEffect(() => {
        setHomeData(homeContent);
        setAboutData(aboutContent);
        setContactData(contactInfo);
        setFooterData(footerContent);
        setSettingsData(siteSettings);
    }, [homeContent, aboutContent, contactInfo, footerContent, siteSettings]);
    
    if (loading || !homeData || !aboutData || !contactData || !footerData || !settingsData) {
        return <div className="flex justify-center"><Spinner /></div>;
    }

    const handleFeaturedProductChange = (productId: string) => {
        const currentIds = homeData.featuredProductIds || [];
        const newIds = currentIds.includes(productId)
            ? currentIds.filter(id => id !== productId)
            : [...currentIds, productId];
        setHomeData({ ...homeData, featuredProductIds: newIds });
    };
    
    const formInputClasses = "w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500";


    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Manage Site Content</h2>
            
            <SectionWrapper title="Home Page" onSave={() => updateHomeContent(homeData)}>
                <ImageUpload 
                    label="Hero Image"
                    initialImage={homeData.heroImage}
                    onImageUpload={url => setHomeData({ ...homeData, heroImage: url })}
                    sizeSuggestion="Recommended: 1920x1080px"
                />
                <div><label>Main Slogan (EN)</label><input type="text" value={homeData.mainSlogan.en} onChange={e => setHomeData({ ...homeData, mainSlogan: { ...homeData.mainSlogan, en: e.target.value } })} className={formInputClasses}/></div>
                <div><label>Main Slogan (BN)</label><input type="text" value={homeData.mainSlogan.bn} onChange={e => setHomeData({ ...homeData, mainSlogan: { ...homeData.mainSlogan, bn: e.target.value } })} className={formInputClasses}/></div>
                <div><label>Secondary Slogan (EN)</label><textarea value={homeData.secondarySlogan.en} onChange={e => setHomeData({ ...homeData, secondarySlogan: { ...homeData.secondarySlogan, en: e.target.value } })} className={formInputClasses}/></div>
                <div><label>Secondary Slogan (BN)</label><textarea value={homeData.secondarySlogan.bn} onChange={e => setHomeData({ ...homeData, secondarySlogan: { ...homeData.secondarySlogan, bn: e.target.value } })} className={formInputClasses}/></div>
                <div>
                    <label>Featured Products</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2 max-h-48 overflow-y-auto p-2 border rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700">
                        {products.map(p => (
                            <label key={p.id} className="flex items-center space-x-2">
                                <input type="checkbox" checked={homeData.featuredProductIds.includes(p.id)} onChange={() => handleFeaturedProductChange(p.id)} />
                                <span className="text-gray-900 dark:text-gray-200">{p.name.en}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </SectionWrapper>
            
            <SectionWrapper title="About Us Page" onSave={() => updateAboutContent(aboutData)}>
                 <ImageUpload 
                    label="Hero Image"
                    initialImage={aboutData.heroImage}
                    onImageUpload={url => setAboutData({ ...aboutData, heroImage: url })}
                    sizeSuggestion="Recommended: 1920x1080px"
                />
                 <div><label>Our Story (EN)</label><textarea rows={4} value={aboutData.story.en} onChange={e => setAboutData({ ...aboutData, story: { ...aboutData.story, en: e.target.value } })} className={formInputClasses}/></div>
                 <div><label>Our Story (BN)</label><textarea rows={4} value={aboutData.story.bn} onChange={e => setAboutData({ ...aboutData, story: { ...aboutData.story, bn: e.target.value } })} className={formInputClasses}/></div>
                 <div><label>Our Mission (EN)</label><textarea rows={3} value={aboutData.mission.en} onChange={e => setAboutData({ ...aboutData, mission: { ...aboutData.mission, en: e.target.value } })} className={formInputClasses}/></div>
                 <div><label>Our Mission (BN)</label><textarea rows={3} value={aboutData.mission.bn} onChange={e => setAboutData({ ...aboutData, mission: { ...aboutData.mission, bn: e.target.value } })} className={formInputClasses}/></div>
                 <div><label>Our Vision (EN)</label><textarea rows={3} value={aboutData.vision.en} onChange={e => setAboutData({ ...aboutData, vision: { ...aboutData.vision, en: e.target.value } })} className={formInputClasses}/></div>
                 <div><label>Our Vision (BN)</label><textarea rows={3} value={aboutData.vision.bn} onChange={e => setAboutData({ ...aboutData, vision: { ...aboutData.vision, bn: e.target.value } })} className={formInputClasses}/></div>
            </SectionWrapper>
            
             <SectionWrapper title="Contact Info" onSave={() => updateContactInfo(contactData)}>
                <div><label>Address (EN)</label><input type="text" value={contactData.address.en} onChange={e => setContactData({ ...contactData, address: { ...contactData.address, en: e.target.value } })} className={formInputClasses}/></div>
                <div><label>Address (BN)</label><input type="text" value={contactData.address.bn} onChange={e => setContactData({ ...contactData, address: { ...contactData.address, bn: e.target.value } })} className={formInputClasses}/></div>
                <div><label>Email</label><input type="email" value={contactData.email} onChange={e => setContactData({ ...contactData, email: e.target.value })} className={formInputClasses}/></div>
                <div><label>Phone</label><input type="tel" value={contactData.phone} onChange={e => setContactData({ ...contactData, phone: e.target.value })} className={formInputClasses}/></div>
            </SectionWrapper>

            <SectionWrapper title="Footer" onSave={() => updateFooterContent(footerData)}>
                <div><label>Facebook URL</label><input type="text" value={footerData.socialLinks.facebook} onChange={e => setFooterData({ ...footerData, socialLinks: { ...footerData.socialLinks, facebook: e.target.value } })} className={formInputClasses}/></div>
                <div><label>Twitter URL</label><input type="text" value={footerData.socialLinks.twitter} onChange={e => setFooterData({ ...footerData, socialLinks: { ...footerData.socialLinks, twitter: e.target.value } })} className={formInputClasses}/></div>
                <div><label>Instagram URL</label><input type="text" value={footerData.socialLinks.instagram} onChange={e => setFooterData({ ...footerData, socialLinks: { ...footerData.socialLinks, instagram: e.target.value } })} className={formInputClasses}/></div>
                <div><label>LinkedIn URL</label><input type="text" value={footerData.socialLinks.linkedin} onChange={e => setFooterData({ ...footerData, socialLinks: { ...footerData.socialLinks, linkedin: e.target.value } })} className={formInputClasses}/></div>
            </SectionWrapper>
            
            <SectionWrapper title="Site Settings" onSave={() => updateSiteSettings(settingsData)}>
                <ImageUpload onImageUpload={url => setSettingsData({ ...settingsData, logoUrl: url })} initialImage={settingsData.logoUrl} label="Site Logo" sizeSuggestion="Recommended: 200px width, auto height"/>
            </SectionWrapper>
        </div>
    );
};