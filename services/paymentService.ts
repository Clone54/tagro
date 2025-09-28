import { PaymentMethod } from '../types';

const PAYMENT_METHODS_KEY = 'TAgroFeeds_PaymentMethods';

const defaultPaymentMethods: PaymentMethod[] = [
    {
        type: 'bkash',
        name: 'Bkash',
        details: { accountNumber: '', paymentType: 'sendMoney' },
        isEnabled: false,
    },
    {
        type: 'nagad',
        name: 'Nagad',
        details: { accountNumber: '', paymentType: 'sendMoney' },
        isEnabled: false,
    },
    {
        type: 'rocket',
        name: 'Rocket',
        details: { accountNumber: '', paymentType: 'sendMoney' },
        isEnabled: false,
    },
    {
        type: 'bank',
        name: 'Bank Transfer',
        details: {
            accountName: '',
            accountNumber: '',
            bankName: '',
            branchName: '',
            routingNumber: ''
        },
        isEnabled: false,
    },
];

export const getPaymentMethods = (): Promise<PaymentMethod[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            try {
                const stored = localStorage.getItem(PAYMENT_METHODS_KEY);
                if (stored) {
                    resolve(JSON.parse(stored));
                } else {
                     localStorage.setItem(PAYMENT_METHODS_KEY, JSON.stringify(defaultPaymentMethods));
                     resolve(defaultPaymentMethods);
                }
            } catch (error) {
                console.error("Failed to parse payment methods from localStorage", error);
                resolve(defaultPaymentMethods);
            }
        }, 200);
    });
};

export const updatePaymentMethods = (methods: PaymentMethod[]): Promise<void> => {
     return new Promise((resolve) => {
        setTimeout(() => {
            localStorage.setItem(PAYMENT_METHODS_KEY, JSON.stringify(methods));
            resolve();
        }, 200);
    });
};