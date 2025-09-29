
import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
import { SmsTemplates } from '../types';
import * as smsTemplateService from '../services/smsTemplateService';
import { useNotification } from './NotificationContext';

interface SmsTemplateContextType {
  smsTemplates: SmsTemplates | null;
  loading: boolean;
  updateSmsTemplates: (templates: SmsTemplates) => Promise<void>;
}

const SmsTemplateContext = createContext<SmsTemplateContextType | undefined>(undefined);

export const SmsTemplateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [smsTemplates, setSmsTemplates] = useState<SmsTemplates | null>(null);
    const [loading, setLoading] = useState(true);
    const { showNotification } = useNotification();

    const fetchSmsTemplates = useCallback(async () => {
        setLoading(true);
        try {
            const templates = await smsTemplateService.getSmsTemplates();
            setSmsTemplates(templates);
        } catch (error) {
            console.error("Failed to fetch SMS templates:", error);
            showNotification('Failed to load SMS templates.', 'error');
        } finally {
            setLoading(false);
        }
    }, [showNotification]);

    useEffect(() => {
        fetchSmsTemplates();
    }, [fetchSmsTemplates]);

    const updateSmsTemplates = async (templates: SmsTemplates) => {
        await smsTemplateService.updateSmsTemplates(templates);
        setSmsTemplates(templates);
        showNotification('SMS templates updated successfully!', 'success');
    };

    const value = { smsTemplates, loading, updateSmsTemplates };

    return <SmsTemplateContext.Provider value={value}>{children}</SmsTemplateContext.Provider>;
}

export const useSmsTemplates = () => {
  const context = useContext(SmsTemplateContext);
  if (context === undefined) {
    throw new Error('useSmsTemplates must be used within a SmsTemplateProvider');
  }
  return context;
};
