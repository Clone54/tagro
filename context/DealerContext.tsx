import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
// FIX: Corrected import path for types.
import { DealerInfo } from '../types';
import * as dealerService from '../services/dealerService';

interface DealerContextType {
  dealers: DealerInfo[];
  loading: boolean;
  addDealer: (dealerData: Omit<DealerInfo, 'id'>) => Promise<void>;
  updateDealer: (updatedDealerData: DealerInfo) => Promise<void>;
  deleteDealer: (dealerId: string) => Promise<void>;
}

const DealerContext = createContext<DealerContextType | undefined>(undefined);

export const DealerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [dealers, setDealers] = useState<DealerInfo[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchDealers = useCallback(async () => {
        setLoading(true);
        try {
            const dealerData = await dealerService.getDealers();
            setDealers(dealerData);
        } catch (error) {
            console.error("Failed to fetch dealers:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDealers();
    }, [fetchDealers]);

    const addDealer = async (dealerData: Omit<DealerInfo, 'id'>) => {
        const newDealer = await dealerService.addDealer(dealerData);
        setDealers(prev => [...prev, newDealer]);
    };

    const updateDealer = async (updatedDealerData: DealerInfo) => {
        const updatedDealer = await dealerService.updateDealer(updatedDealerData);
        setDealers(prev => prev.map(d => d.id === updatedDealer.id ? updatedDealer : d));
    };
    
    const deleteDealer = async (dealerId: string) => {
        await dealerService.deleteDealer(dealerId);
        setDealers(prev => prev.filter(d => d.id !== dealerId));
    };
    
    const value = { dealers, loading, addDealer, updateDealer, deleteDealer };

    return <DealerContext.Provider value={value}>{children}</DealerContext.Provider>;
}

export const useDealers = () => {
  const context = useContext(DealerContext);
  if (context === undefined) {
    throw new Error('useDealers must be used within a DealerProvider');
  }
  return context;
};