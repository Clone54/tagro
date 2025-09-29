// FIX: Corrected import path for types.
import { DealerInfo } from '../types';

const mockDealers: DealerInfo[] = [
    { id: 'd_001', image: 'https://picsum.photos/seed/dealer1/400/400', name: { en: 'John Smith', bn: 'জন স্মিথ' }, zone: { en: 'Northern Zone', bn: 'উত্তর জোন' }, phone: '123-456-7890', code: 'N-101' },
    { id: 'd_002', image: 'https://picsum.photos/seed/dealer2/400/400', name: { en: 'Jane Doe', bn: 'জেন ডো' }, zone: { en: 'Southern Zone', bn: 'দক্ষিণ জোন' }, phone: '234-567-8901', code: 'S-202' },
    { id: 'd_003', image: 'https://picsum.photos/seed/dealer3/400/400', name: { en: 'Mike Williams', bn: 'মাইট উইলিয়ামস' }, zone: { en: 'Eastern Zone', bn: 'পূর্ব জোন' }, phone: '345-678-9012', code: 'E-303' },
    { id: 'd_004', image: 'https://picsum.photos/seed/dealer4/400/400', name: { en: 'Emily Brown', bn: 'এমিলি ব্রাউন' }, zone: { en: 'Western Zone', bn: 'পশ্চিম জোন' }, phone: '456-789-0123', code: 'W-404' },
    { id: 'd_005', image: 'https://picsum.photos/seed/dealer5/400/400', name: { en: 'David Jones', bn: 'ডেভিড জোনস' }, zone: { en: 'Central Zone', bn: 'কেন্দ্রীয় জোন' }, phone: '567-890-1234', code: 'C-505' },
    { id: 'd_006', image: 'https://picsum.photos/seed/dealer6/400/400', name: { en: 'Sarah Garcia', bn: 'সারা গার্সিয়া' }, zone: { en: 'Northern Zone', bn: 'উত্তর জোন' }, phone: '678-901-2345', code: 'N-102' },
];

const STORAGE_KEY = 'TAgroFeeds_Dealers';

const getDealersFromStorage = (): DealerInfo[] => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (error) {
        console.error("Failed to parse dealers from localStorage", error);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockDealers));
    return mockDealers;
};

const saveDealersToStorage = (dealers: DealerInfo[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dealers));
};

export const getDealers = (): Promise<DealerInfo[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getDealersFromStorage()), 300);
  });
};

export const addDealer = (dealerData: Omit<DealerInfo, 'id'>): Promise<DealerInfo> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const dealers = getDealersFromStorage();
            const newDealer: DealerInfo = {
                ...dealerData,
                id: `dealer_${Date.now()}`
            };
            const updatedDealers = [...dealers, newDealer];
            saveDealersToStorage(updatedDealers);
            resolve(newDealer);
        }, 300);
    });
};

export const updateDealer = (updatedDealerData: DealerInfo): Promise<DealerInfo> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const dealers = getDealersFromStorage();
            const index = dealers.findIndex(d => d.id === updatedDealerData.id);
            if (index > -1) {
                const updatedDealers = [...dealers];
                updatedDealers[index] = updatedDealerData;
                saveDealersToStorage(updatedDealers);
                resolve(updatedDealerData);
            } else {
                reject(new Error("Dealer not found"));
            }
        }, 300);
    });
};

export const deleteDealer = (dealerId: string): Promise<void> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const dealers = getDealersFromStorage();
            const updatedDealers = dealers.filter(d => d.id !== dealerId);
            saveDealersToStorage(updatedDealers);
            resolve();
        }, 300);
    });
};