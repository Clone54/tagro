import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
// FIX: Corrected import path for types.
import { HomeContent, AboutContent, ContactInfo, FooterContent, SiteSettingsContent } from '../types';
import * as contentService from '../services/contentService';

interface ContentContextType {
  homeContent: HomeContent | null;
  aboutContent: AboutContent | null;
  contactInfo: ContactInfo | null;
  footerContent: FooterContent | null;
  siteSettings: SiteSettingsContent | null;
  loading: boolean;
  updateHomeContent: (data: HomeContent) => Promise<void>;
  updateAboutContent: (data: AboutContent) => Promise<void>;
  updateContactInfo: (data: ContactInfo) => Promise<void>;
  updateFooterContent: (data: FooterContent) => Promise<void>;
  updateSiteSettings: (data: SiteSettingsContent) => Promise<void>;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [homeContent, setHomeContent] = useState<HomeContent | null>(null);
    const [aboutContent, setAboutContent] = useState<AboutContent | null>(null);
    const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
    const [footerContent, setFooterContent] = useState<FooterContent | null>(null);
    const [siteSettings, setSiteSettings] = useState<SiteSettingsContent | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchContent = useCallback(async () => {
        setLoading(true);
        try {
            const [home, about, contact, footer, settings] = await Promise.all([
                contentService.getHomeContent(),
                contentService.getAboutContent(),
                contentService.getContactInfo(),
                contentService.getFooterContent(),
                contentService.getSiteSettingsContent()
            ]);
            setHomeContent(home);
            setAboutContent(about);
            setContactInfo(contact);
            setFooterContent(footer);
            setSiteSettings(settings);
        } catch (error) {
            console.error("Failed to fetch content:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchContent();
    }, [fetchContent]);

    const updateHomeContent = async (data: HomeContent) => {
        await contentService.updateHomeContent(data);
        setHomeContent(data);
    };
    const updateAboutContent = async (data: AboutContent) => {
        await contentService.updateAboutContent(data);
        setAboutContent(data);
    };
    const updateContactInfo = async (data: ContactInfo) => {
        await contentService.updateContactInfo(data);
        setContactInfo(data);
    };
    const updateFooterContent = async (data: FooterContent) => {
        await contentService.updateFooterContent(data);
        setFooterContent(data);
    };
    const updateSiteSettings = async (data: SiteSettingsContent) => {
        await contentService.updateSiteSettingsContent(data);
        setSiteSettings(data);
    };
    
    const value = {
        homeContent, aboutContent, contactInfo, footerContent, siteSettings, loading,
        updateHomeContent, updateAboutContent, updateContactInfo, updateFooterContent, updateSiteSettings
    };

    return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export const useContent = () => {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};