
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useNotification } from '../context/NotificationContext';
import { useSettings } from '../context/SettingsContext';
import * as userService from '../services/userService';
import * as smsService from '../services/smsService';
import { Spinner } from './Spinner';
import { BackButton } from './BackButton';
import { useSmsTemplates } from '../context/SmsTemplateContext';

type ForgotPasswordStep = 'phone' | 'verify' | 'password';

export const ForgotPassword: React.FC = () => {
    const [step, setStep] = useState<ForgotPasswordStep>('phone');
    const [phone, setPhone] = useState('');
    const [passwordData, setPasswordData] = useState({ password: '', confirmPassword: '' });
    const [otp, setOtp] = useState('');
    const [generatedOtp, setGeneratedOtp] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const [timer, setTimer] = useState(60);
    const timerInterval = useRef<number | null>(null);

    const navigate = useNavigate();
    const { showNotification } = useNotification();
    const { language, t } = useSettings();
    const { smsTemplates, loading: templatesLoading } = useSmsTemplates();

    useEffect(() => {
        if (step === 'verify' && timer > 0) {
            timerInterval.current = window.setInterval(() => {
                setTimer(prev => prev - 1);
            }, 1000);
        } else if (timer <= 0 && timerInterval.current) {
            clearInterval(timerInterval.current);
            timerInterval.current = null;
        }
        return () => {
            if (timerInterval.current) clearInterval(timerInterval.current);
        };
    }, [step, timer]);

    const startOtpProcess = async () => {
        if (!smsTemplates) return;
        setError('');
        setLoading(true);

        try {
            const user = await userService.findUserByPhone(phone);
            if (!user) {
                throw new Error(t('phoneNotFoundError'));
            }
            
            const messageTemplate = smsTemplates.otp[language];
            const { otp: newOtp } = await smsService.sendOtp(phone, messageTemplate);
            setGeneratedOtp(newOtp);

            showNotification(t('verificationCodeSent'), 'info');
            setStep('verify');
            setTimer(60);
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    const handlePhoneSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await startOtpProcess();
    };
    
    const handleResendOtp = async () => {
        if (timer > 0) return;
        await startOtpProcess();
    };

    const handleVerifySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (otp === generatedOtp) {
            setError('');
            setStep('password');
        } else {
            setError(t('invalidCodeError'));
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordData.password !== passwordData.confirmPassword) {
            setError(t('passwordsDoNotMatch'));
            return;
        }
        setError('');
        setLoading(true);
        try {
            await userService.updatePassword(phone, passwordData.password);
            showNotification(t('passwordResetSuccess'), 'success');
            navigate('/login');
        } catch (err: any) {
            setError(err.message || 'Failed to reset password.');
        } finally {
            setLoading(false);
        }
    };
    
    const renderStep = () => {
        switch (step) {
            case 'phone':
                return (
                    <form className="mt-8 space-y-6" onSubmit={handlePhoneSubmit}>
                        <input name="phone" type="tel" required value={phone} onChange={e => setPhone(e.target.value)} className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-gray-200 bg-white dark:bg-gray-700 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm" placeholder={t('phoneNumber')} />
                        <button type="submit" disabled={loading || templatesLoading} className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400">
                            {loading || templatesLoading ? <Spinner /> : t('sendCode')}
                        </button>
                    </form>
                );
            case 'verify':
                return (
                    <form className="mt-8 space-y-6" onSubmit={handleVerifySubmit}>
                        <input name="otp" type="text" required value={otp} onChange={e => setOtp(e.target.value)} className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-gray-200 bg-white dark:bg-gray-700 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm" placeholder={t('verificationCode')} />
                        <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                            {t('verifyCode')}
                        </button>
                         <div className="text-center text-sm">
                            <button type="button" onClick={handleResendOtp} disabled={timer > 0 || templatesLoading} className="font-medium text-green-600 hover:text-green-500 disabled:text-gray-400 disabled:cursor-not-allowed">
                                {timer > 0 ? `${t('resendCodeIn')} ${timer} ${t('seconds')}` : t('resendCode')}
                            </button>
                        </div>
                    </form>
                );
            case 'password':
                return (
                     <form className="mt-8 space-y-6" onSubmit={handlePasswordSubmit}>
                        <div className="rounded-md shadow-sm space-y-4">
                            <input name="password" type="password" required value={passwordData.password} onChange={e => setPasswordData({...passwordData, password: e.target.value})} className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-gray-200 bg-white dark:bg-gray-700 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm" placeholder="New Password" />
                            <input name="confirmPassword" type="password" required value={passwordData.confirmPassword} onChange={e => setPasswordData({...passwordData, confirmPassword: e.target.value})} className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-gray-200 bg-white dark:bg-gray-700 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm" placeholder="Confirm New Password" />
                        </div>
                        <button type="submit" disabled={loading} className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400">
                             {loading ? <Spinner /> : t('resetPassword')}
                        </button>
                    </form>
                );
        }
    };
    
    const getHeaderText = () => {
        switch (step) {
            case 'phone': return t('forgotPassword');
            case 'verify': return t('verificationCode');
            case 'password': return t('setNewPassword');
        }
    };
    
    const getSubheaderText = () => {
         switch (step) {
            case 'phone': return t('forgotPasswordIntro');
            case 'verify': return t('enterVerificationCode');
            case 'password': return 'Please enter a new password for your account.';
        }
    };

    return (
        <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md">
                 <BackButton />
            </div>
            <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-10 rounded-xl shadow-lg">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
                        {getHeaderText()}
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                        {getSubheaderText()}
                    </p>
                </div>
                {error && <p className="text-red-500 text-sm text-center mt-4">{error}</p>}
                {renderStep()}
                 <div className="text-sm text-center">
                     <Link to="/login" className="font-medium text-green-600 hover:text-green-500">
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};
