
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { useSettings } from '../context/SettingsContext';
import * as userService from '../services/userService';
import * as smsService from '../services/smsService';
import { Spinner } from './Spinner';
import { useSmsTemplates } from '../context/SmsTemplateContext';

type RegisterStep = 'details' | 'verify' | 'password';

export const Register: React.FC = () => {
    const [step, setStep] = useState<RegisterStep>('details');
    const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
    const [passwordData, setPasswordData] = useState({ password: '', confirmPassword: '' });
    const [otp, setOtp] = useState('');
    const [generatedOtp, setGeneratedOtp] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const [timer, setTimer] = useState(60);
    const timerInterval = useRef<number | null>(null);

    const { register, login } = useAuth();
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

    const handleDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };
    
    const startOtpProcess = async () => {
        if (!smsTemplates) return;
        setError('');
        setLoading(true);

        try {
            const userExists = await userService.checkUserExists(formData.email, formData.phone);
            if (userExists) {
                throw new Error(t('userExistsError'));
            }

            const messageTemplate = smsTemplates.otp[language];
            const { otp: newOtp } = await smsService.sendOtp(formData.phone, messageTemplate);
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

    const handleDetailsSubmit = async (e: React.FormEvent) => {
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
            await register({ ...formData, password: passwordData.password });
            await login(formData.email, passwordData.password); // Auto-login after registration
            showNotification('Registration successful! You are now logged in.', 'success');
            navigate('/');
        } catch (err: any) {
            setError(err.message || 'Failed to register. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 'details':
                return (
                    <form className="mt-8 space-y-6" onSubmit={handleDetailsSubmit}>
                        <div className="rounded-md shadow-sm space-y-4">
                            <input name="name" type="text" required value={formData.name} onChange={handleDetailsChange} className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-gray-200 bg-white dark:bg-gray-700 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm" placeholder={t('fullName')} />
                            <input name="email" type="email" autoComplete="email" required value={formData.email} onChange={handleDetailsChange} className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-gray-200 bg-white dark:bg-gray-700 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm" placeholder={t('emailAddress')} />
                            <input name="phone" type="tel" required value={formData.phone} onChange={handleDetailsChange} className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-gray-200 bg-white dark:bg-gray-700 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm" placeholder={t('phoneNumber')} />
                        </div>
                        <button type="submit" disabled={loading || templatesLoading} className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400">
                            {loading || templatesLoading ? <Spinner /> : t('sendCode')}
                        </button>
                    </form>
                );
            case 'verify':
                return (
                    <form className="mt-8 space-y-6" onSubmit={handleVerifySubmit}>
                         <p className="text-center text-sm text-gray-600 dark:text-gray-400">{t('enterVerificationCode')}</p>
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
                            <input name="password" type="password" required value={passwordData.password} onChange={handlePasswordChange} className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-gray-200 bg-white dark:bg-gray-700 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm" placeholder="Password" />
                            <input name="confirmPassword" type="password" required value={passwordData.confirmPassword} onChange={handlePasswordChange} className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-gray-200 bg-white dark:bg-gray-700 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm" placeholder="Confirm Password" />
                        </div>
                        <button type="submit" disabled={loading} className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400">
                             {loading ? <Spinner /> : t('register')}
                        </button>
                    </form>
                );
        }
    }

    return (
        <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-10 rounded-xl shadow-lg">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
                        Create a new account
                    </h2>
                </div>
                {error && <p className="text-red-500 text-sm text-center mt-4">{error}</p>}
                {renderStep()}
                <div className="text-sm text-center">
                    <p className="text-gray-600 dark:text-gray-400">
                        Already have an account?{' '}
                        <Link to="/login" className="font-medium text-green-600 hover:text-green-500">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};
