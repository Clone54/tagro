
import { SmsTemplates } from '../types';

const SMS_TEMPLATES_KEY = 'TAgroFeeds_SmsTemplates';

const defaultSmsTemplates: SmsTemplates = {
    otp: {
        en: 'Your T Agro Feeds verification code is: {otp}',
        bn: 'আপনার টি এগ্রো ফিডস যাচাইকরণ কোডটি হল: {otp}',
    },
    orderConfirmation: {
        en: 'Thank you, {userName}! Your order #{orderId} for BDT {totalAmount} is now being processed.',
        bn: 'ধন্যবাদ, {userName}! আপনার অর্ডার #{orderId} (BDT {totalAmount}) এখন প্রক্রিয়া করা হচ্ছে।',
    },
};

export const getSmsTemplates = (): Promise<SmsTemplates> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            try {
                const stored = localStorage.getItem(SMS_TEMPLATES_KEY);
                if (stored) {
                    resolve(JSON.parse(stored));
                } else {
                    localStorage.setItem(SMS_TEMPLATES_KEY, JSON.stringify(defaultSmsTemplates));
                    resolve(defaultSmsTemplates);
                }
            } catch (error) {
                console.error("Failed to parse SMS templates from localStorage", error);
                resolve(defaultSmsTemplates);
            }
        }, 100);
    });
};

export const updateSmsTemplates = (templates: SmsTemplates): Promise<void> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            localStorage.setItem(SMS_TEMPLATES_KEY, JSON.stringify(templates));
            resolve();
        }, 100);
    });
};
