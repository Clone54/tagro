import React, { useEffect, useState } from 'react';
import { useNotification } from '../context/NotificationContext';

const SuccessIcon = () => (
    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
);

const ErrorIcon = () => (
     <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
);

const InfoIcon = () => (
    <svg className="w-8 h-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);


export const Notification: React.FC = () => {
    const { notification } = useNotification();
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (notification?.visible) {
            setShow(true);
        } else if (show) { // Only set timer if it was previously showing
            const timer = setTimeout(() => {
                setShow(false);
            }, 300); // Wait for fade-out animation
            return () => clearTimeout(timer);
        }
    }, [notification, show]);

    if (!show) return null;
    
    const backdropBaseClasses = "fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300";
    const backdropAnimation = notification?.visible ? 'opacity-100' : 'opacity-0';

    const boxBaseClasses = "flex items-center p-6 min-w-[320px] max-w-md rounded-xl shadow-2xl";
    const typeClasses = {
        success: 'bg-green-500 text-white',
        error: 'bg-red-500 text-white',
        info: 'bg-blue-500 text-white',
    };
    
    return (
        <div className={`${backdropBaseClasses} ${backdropAnimation}`}>
            <div className={`${boxBaseClasses} ${typeClasses[notification?.type || 'info']} animate-scale-in-center`}>
                {notification?.type === 'success' && <SuccessIcon />}
                {notification?.type === 'error' && <ErrorIcon />}
                {notification?.type === 'info' && <InfoIcon />}
                <div className="ml-4 text-lg font-medium">
                    {notification?.message}
                </div>
            </div>
        </div>
    );
};