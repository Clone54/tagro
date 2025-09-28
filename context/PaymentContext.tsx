import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
import { PaymentMethod } from '../types';
import * as paymentService from '../services/paymentService';
import { useNotification } from './NotificationContext';

interface PaymentContextType {
  paymentMethods: PaymentMethod[];
  loading: boolean;
  updatePaymentMethods: (methods: PaymentMethod[]) => Promise<void>;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const PaymentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [loading, setLoading] = useState(true);
    const { showNotification } = useNotification();

    const fetchPaymentMethods = useCallback(async () => {
        setLoading(true);
        try {
            const methods = await paymentService.getPaymentMethods();
            setPaymentMethods(methods);
        } catch (error) {
            console.error("Failed to fetch payment methods:", error);
            showNotification('Failed to load payment settings.', 'error');
        } finally {
            setLoading(false);
        }
    }, [showNotification]);

    useEffect(() => {
        fetchPaymentMethods();
    }, [fetchPaymentMethods]);

    const updatePaymentMethods = async (methods: PaymentMethod[]) => {
        await paymentService.updatePaymentMethods(methods);
        setPaymentMethods(methods);
        showNotification('Payment settings updated successfully!', 'success');
    };

    const value = { paymentMethods, loading, updatePaymentMethods };

    return <PaymentContext.Provider value={value}>{children}</PaymentContext.Provider>;
}

export const usePayments = () => {
  const context = useContext(PaymentContext);
  if (context === undefined) {
    throw new Error('usePayments must be used within a PaymentProvider');
  }
  return context;
};