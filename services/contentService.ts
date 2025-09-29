// FIX: Corrected import path for types.
import { HomeContent, AboutContent, ContactInfo, FooterContent, SiteSettingsContent } from '../types';

const HOME_KEY = 'TAgroFeeds_HomeContent';
const ABOUT_KEY = 'TAgroFeeds_AboutContent';
const CONTACT_KEY = 'TAgroFeeds_ContactContent';
const FOOTER_KEY = 'TAgroFeeds_FooterContent';
const SITE_SETTINGS_KEY = 'TAgroFeeds_SiteSettingsContent';

// --- Default Content ---
const defaultHomeContent: HomeContent = {
    heroImage: "https://picsum.photos/seed/farm/1920/1080",
    mainSlogan: { en: "Nourishing Growth, Ensuring Quality", bn: "পুষ্টি বৃদ্ধি, গুণমান নিশ্চিত" },
    secondarySlogan: { en: "Your trusted partner in premium fish, poultry, and cattle feeds for a healthier, more productive tomorrow.", bn: "স্বাস্থ্যকর এবং আরও উৎপাদনশীল আগামীকালের জন্য প্রিমিয়াম মাছ, পোল্ট্রি এবং ক্যাটল ফিডে আপনার বিশ্বস্ত অংশীদার।" },
    featuredProductIds: ['ff001', 'pf001', 'cf001', 'fm001'],
};

const defaultAboutContent: AboutContent = {
    heroImage: "https://picsum.photos/seed/about/1920/1080",
    story: { en: "Founded on the principle of empowering farmers, T Agro Fish and Poultry Feed Industries Limited began as a small initiative to provide local communities with superior quality animal nutrition. Over the years, our dedication to research, innovation, and customer satisfaction has fueled our growth, transforming us into a trusted leader in the industry. We are proud of our journey and remain committed to the values that have guided us from the start.", bn: "কৃষকদের ক্ষমতায়নের নীতির উপর প্রতিষ্ঠিত, টি এগ্রো ফিশ অ্যান্ড পোল্ট্রি ফিড ইন্ডাস্ট্রিজ লিমিটেড স্থানীয় সম্প্রদায়কে উচ্চ মানের পশু পুষ্টি সরবরাহের জন্য একটি ছোট উদ্যোগ হিসাবে শুরু হয়েছিল। বছরের পর বছর ধরে, গবেষণা, উদ্ভাবন এবং গ্রাহক সন্তুষ্টির প্রতি আমাদের উৎসর্গ আমাদের বৃদ্ধিকে ত্বরান্বিত করেছে, যা আমাদের শিল্পে এক বিশ্বস্ত নেতা হিসেবে রূপান্তরিত করেছে। আমরা আমাদের যাত্রা নিয়ে গর্বিত এবং শুরু থেকে আমাদের পরিচালিত মূল্যবোধের প্রতি প্রতিশ্রুতিবদ্ধ।" },
    mission: { en: "To support farmers and aquaculturists by providing nutritious, safe, and reliable animal feed and health products. We aim to enhance productivity and animal welfare through continuous innovation and a commitment to excellence, contributing to a sustainable and food-secure future.", bn: "পুষ্টিকর, নিরাপদ এবং নির্ভরযোগ্য পশু খাদ্য এবং স্বাস্থ্য পণ্য সরবরাহ করে কৃষক এবং জলচাষীদের সমর্থন করা। আমরা ক্রমাগত উদ্ভাবন এবং শ্রেষ্ঠত্বের প্রতিশ্রুতির মাধ্যমে উৎপাদনশীলতা এবং পশু কল্যাণ বাড়ানোর লক্ষ্য রাখি, যা একটি টেকসই এবং খাদ্য-সুরক্ষিত ভবিষ্যতে অবদান রাখে।" },
    vision: { en: "To be the most trusted and preferred partner in the animal nutrition industry, recognized for our quality products, ethical practices, and positive impact on the agricultural community across the nation and beyond.", bn: "পশু পুষ্টি শিল্পে সবচেয়ে বিশ্বস্ত এবং পছন্দের অংশীদার হওয়া, যা আমাদের মানসম্পন্ন পণ্য, নৈতিক অনুশীলন এবং দেশ ও তার বাইরের কৃষি সম্প্রদায়ের উপর ইতিবাচক প্রভাবের জন্য স্বীকৃত।" }
};

const defaultContactInfo: ContactInfo = {
    address: { en: "123 Feed Street, Agro City, Farm Country", bn: "১২৩ ফিড স্ট্রিট, এগ্রো সিটি, ফার্ম কান্ট্রি" },
    email: "contact@tagrofeeds.com",
    phone: "+123 456 7890",
};

const defaultFooterContent: FooterContent = {
    socialLinks: {
        facebook: "https://facebook.com",
        twitter: "https://twitter.com",
        instagram: "https://instagram.com",
        linkedin: "https://linkedin.com",
    }
};

const defaultSiteSettingsContent: SiteSettingsContent = {
    logoUrl: "",
};


// --- Generic Functions ---
const getContent = <T>(key: string, defaultValue: T): T => {
    try {
        const stored = localStorage.getItem(key);
        if (stored) {
            // Basic migration for old string data to new object format
            const parsed = JSON.parse(stored);
            if (key === ABOUT_KEY && typeof parsed.story === 'string') {
                 localStorage.setItem(key, JSON.stringify(defaultValue));
                 return defaultValue;
            }
            return parsed;
        }
    } catch (error) {
        console.error(`Failed to parse content from localStorage for key: ${key}`, error);
    }
    localStorage.setItem(key, JSON.stringify(defaultValue));
    return defaultValue;
};

const updateContent = <T>(key: string, data: T): void => {
    localStorage.setItem(key, JSON.stringify(data));
};

// --- Home Page ---
export const getHomeContent = (): Promise<HomeContent> => Promise.resolve(getContent(HOME_KEY, defaultHomeContent));
export const updateHomeContent = (data: HomeContent): Promise<void> => {
    updateContent(HOME_KEY, data);
    return Promise.resolve();
};

// --- About Page ---
export const getAboutContent = (): Promise<AboutContent> => Promise.resolve(getContent(ABOUT_KEY, defaultAboutContent));
export const updateAboutContent = (data: AboutContent): Promise<void> => {
    updateContent(ABOUT_KEY, data);
    return Promise.resolve();
};

// --- Contact Page ---
export const getContactInfo = (): Promise<ContactInfo> => Promise.resolve(getContent(CONTACT_KEY, defaultContactInfo));
export const updateContactInfo = (data: ContactInfo): Promise<void> => {
    updateContent(CONTACT_KEY, data);
    return Promise.resolve();
};

// --- Footer ---
export const getFooterContent = (): Promise<FooterContent> => Promise.resolve(getContent(FOOTER_KEY, defaultFooterContent));
export const updateFooterContent = (data: FooterContent): Promise<void> => {
    updateContent(FOOTER_KEY, data);
    return Promise.resolve();
};

// --- Site Settings ---
export const getSiteSettingsContent = (): Promise<SiteSettingsContent> => Promise.resolve(getContent(SITE_SETTINGS_KEY, defaultSiteSettingsContent));
export const updateSiteSettingsContent = (data: SiteSettingsContent): Promise<void> => {
    updateContent(SITE_SETTINGS_KEY, data);
    return Promise.resolve();
};