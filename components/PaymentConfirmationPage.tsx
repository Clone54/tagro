import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { usePayments } from '../context/PaymentContext';
import { useSettings } from '../context/SettingsContext';
import { useNotification } from '../context/NotificationContext';
import { CartItem, Address, PaymentMethod, PaymentDetails } from '../types';
import * as userService from '../services/userService';
import { Spinner } from './Spinner';
import { BackButton } from './BackButton';

export const PaymentConfirmationPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, updateUserProfile } = useAuth();
    const { clearCart } = useCart();
    const { paymentMethods, loading: paymentLoading } = usePayments();
    const { language, t } = useSettings();
    const { showNotification } = useNotification();
    
    const { items } = (location.state as { items: CartItem[] }) || { items: [] };

    const [selectedAddressId, setSelectedAddressId] = useState<string | undefined>(
        user?.addresses.find(a => a.isDefault)?.id || user?.addresses[0]?.id
    );
    const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(null);
    const [paymentProof, setPaymentProof] = useState({ senderNumber: '', transactionId: '', senderAccountName: '', senderAccountNumber: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const totalPrice = useMemo(() => items.reduce((total, item) => total + item.product.price * item.quantity, 0), [items]);
    const enabledPaymentMethods = useMemo(() => paymentMethods.filter(p => p.isEnabled), [paymentMethods]);

    useEffect(() => {
        if (user && user.addresses.length > 0 && !selectedAddressId) {
            setSelectedAddressId(user.addresses.find(a => a.isDefault)?.id || user.addresses[0].id);
        }
    }, [user, selectedAddressId]);

    if (!user || items.length === 0) {
        navigate('/');
        return null;
    }
    
    const handleProofChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPaymentProof({ ...paymentProof, [e.target.name]: e.target.value });
    };

    const handleConfirmOrder = async () => {
        const selectedAddress = user.addresses.find(a => a.id === selectedAddressId);
        if (!selectedAddress) {
            showNotification('Please select a shipping address.', 'error');
            return;
        }
        if (!selectedPayment) {
            showNotification('Please select a payment method.', 'error');
            return;
        }

        const paymentDetails: PaymentDetails = { method: selectedPayment.name };

        if (selectedPayment.type === 'bank') {
            if (!paymentProof.senderAccountName || !paymentProof.senderAccountNumber) {
                showNotification('Please provide your account name and number.', 'error');
                return;
            }
            paymentDetails.senderAccountName = paymentProof.senderAccountName;
            paymentDetails.senderAccountNumber = paymentProof.senderAccountNumber;
        } else { // Mobile banking
            if (!paymentProof.senderNumber || !paymentProof.transactionId) {
                showNotification('Please provide your sending number and transaction ID.', 'error');
                return;
            }
            paymentDetails.senderNumber = paymentProof.senderNumber;
            paymentDetails.transactionId = paymentProof.transactionId;
        }
        
        setIsSubmitting(true);
        try {
            const newOrder = await userService.addOrder(user, items, totalPrice, selectedAddress, paymentDetails);
            const updatedUser = { ...user, orders: [...user.orders, newOrder] };
            await updateUserProfile(updatedUser);
            clearCart();
            showNotification(t('paymentPending'), 'info');
            navigate('/profile');
        } catch (error) {
            showNotification('Failed to place order. Please try again.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleAddAddress = () => {
        navigate('/profile/address/new', {
            state: {
                from: '/payment-confirmation',
                items: items
            }
        });
    };

    if (user.addresses.length === 0) {
        return (
            <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">{t('noAddressPrompt')}</h2>
                <button onClick={handleAddAddress} className="mt-6 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors duration-200 shadow">
                    {t('addAddress')}
                </button>
            </div>
        );
    }
    
    const formInputClasses = "w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500";


    return (
        <div>
            <BackButton />
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8">{t('paymentConfirmation')}</h1>
            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-4">{t('shippingTo')}</h2>
                    <select value={selectedAddressId} onChange={(e) => setSelectedAddressId(e.target.value)} className={`${formInputClasses} mb-6`}>
                        {user.addresses.map(addr => (
                            <option key={addr.id} value={addr.id}>{`${addr.details}, ${addr.upazila}, ${addr.district}`}</option>
                        ))}
                    </select>

                    <h2 className="text-xl font-bold mb-4">{t('selectPayment')}</h2>
                    {paymentLoading ? <Spinner/> : (
                         <div className="space-y-4">
                            {enabledPaymentMethods.map(method => (
                                <div key={method.type} className={`border rounded-lg p-4 cursor-pointer ${selectedPayment?.type === method.type ? 'border-green-500 ring-2 ring-green-500' : 'dark:border-gray-600'}`} onClick={() => setSelectedPayment(method)}>
                                    <h3 className="font-bold text-lg">{method.name}</h3>
                                    {selectedPayment?.type === method.type && (
                                        <div className="mt-4 text-sm text-gray-600 dark:text-gray-300 space-y-2">
                                            {method.type === 'bank' ? (
                                                <div className="space-y-2">
                                                    <p><strong>{t('bankName')}:</strong> {method.details.bankName}</p>
                                                    <p><strong>{t('branchName')}:</strong> {method.details.branchName}</p>
                                                    <p><strong>{t('accountName')}:</strong> {method.details.accountName}</p>
                                                    <p><strong>{t('accountNumber')}:</strong> {method.details.accountNumber}</p>
                                                    <p><strong>{t('routingNumber')}:</strong> {method.details.routingNumber}</p>
                                                    <div className="pt-2 space-y-2">
                                                        <p className="font-semibold text-blue-500">Please deposit to the account above and provide your payment details below.</p>
                                                        <input type="text" name="senderAccountName" value={paymentProof.senderAccountName} onChange={handleProofChange} placeholder={t('accountHolderName')} className={formInputClasses}/>
                                                        <input type="text" name="senderAccountNumber" value={paymentProof.senderAccountNumber} onChange={handleProofChange} placeholder={t('accountNumber')} className={formInputClasses}/>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <p><strong>{t('accountNumber')}:</strong> {method.details.accountNumber}</p>
                                                     <div className="pt-2 space-y-2">
                                                        {method.details.paymentType === 'sendMoney' && (
                                                            <p className="font-semibold text-red-500">Please "Send Money" to the number above and provide details below.</p>
                                                        )}
                                                         {method.details.paymentType === 'payment' && (
                                                            <p className="font-semibold text-blue-500">Please use the "Payment" option to send money to the number above and provide details below.</p>
                                                        )}
                                                        <input type="text" name="senderNumber" value={paymentProof.senderNumber} onChange={handleProofChange} placeholder={t('senderNumber')} className={formInputClasses}/>
                                                        <input type="text" name="transactionId" value={paymentProof.transactionId} onChange={handleProofChange} placeholder={t('transactionId')} className={formInputClasses}/>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="lg:col-span-1">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md sticky top-28">
                        <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
                        <div className="space-y-2 max-h-60 overflow-y-auto mb-4 border-b pb-4 dark:border-gray-700">
                             {items.map(item => (
                                <div key={item.product.id} className="flex justify-between text-sm">
                                    <span>{item.product.name[language]} x {item.quantity}</span>
                                    <span className="font-medium">BDT {(item.product.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                         <div className="flex justify-between font-bold text-xl text-gray-900 dark:text-white">
                            <span>Total</span>
                            <span>BDT {totalPrice.toFixed(2)}</span>
                        </div>
                         <button onClick={handleConfirmOrder} disabled={isSubmitting} className="mt-6 w-full py-3 px-6 bg-green-600 text-white font-bold text-lg rounded-lg hover:bg-green-700 transition-colors shadow-lg disabled:bg-gray-400 disabled:cursor-wait">
                            {isSubmitting ? <Spinner/> : t('confirmOrder')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};