
import React, { useState, useEffect, useCallback } from 'react';
// FIX: Corrected import path for types.
import { Order, User } from '../types';
// FIX: Corrected import path for user service.
import * as userService from '../services/userService';
import * as smsService from '../services/smsService';
import { Spinner } from './Spinner';
import { useSettings } from '../context/SettingsContext';
import { useNotification } from '../context/NotificationContext';
import { useSmsTemplates } from '../context/SmsTemplateContext';

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const AdminOrderDetailModal: React.FC<{ order: Order; onClose: () => void }> = ({ order, onClose }) => {
    const { t, language } = useSettings();

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="p-5 border-b dark:border-gray-700 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-800">
                    <h3 className="text-2xl font-bold">{t('orderDetails')}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2 rounded-full -mr-2">
                        <CloseIcon/>
                    </button>
                </div>
                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div><strong>{t('orderId')}:</strong> <span className="font-mono">{order.id}</span></div>
                        <div><strong>{t('customer')}:</strong> {order.userName}</div>
                        <div><strong>{t('date')}:</strong> {new Date(order.orderDate).toLocaleString()}</div>
                        <div><strong>{t('total')}:</strong> <span className="font-bold text-green-600">BDT {order.totalAmount.toFixed(2)}</span></div>
                    </div>

                    <div className="border-t dark:border-gray-700 pt-4">
                        <h4 className="text-lg font-semibold mb-2">{t('shippingAddress')}</h4>
                        <address className="not-italic text-gray-600 dark:text-gray-400">
                            {order.shippingAddress.details}<br />
                            {order.shippingAddress.upazila}, {order.shippingAddress.district}<br/>
                            {order.shippingAddress.division}
                        </address>
                    </div>

                    <div className="border-t dark:border-gray-700 pt-4">
                        <h4 className="text-lg font-semibold mb-2">{t('paymentInformation')}</h4>
                        <div className="text-gray-600 dark:text-gray-400 space-y-1">
                            <p><strong>Method:</strong> {order.paymentDetails.method}</p>
                            {order.paymentDetails.senderNumber && <p><strong>{t('senderNumber')}:</strong> {order.paymentDetails.senderNumber}</p>}
                            {order.paymentDetails.transactionId && <p><strong>{t('transactionId')}:</strong> {order.paymentDetails.transactionId}</p>}
                            {order.paymentDetails.senderAccountName && <p><strong>{t('accountHolderName')}:</strong> {order.paymentDetails.senderAccountName}</p>}
                            {order.paymentDetails.senderAccountNumber && <p><strong>{t('accountNumber')}:</strong> {order.paymentDetails.senderAccountNumber}</p>}
                        </div>
                    </div>
                    
                    <div className="border-t dark:border-gray-700 pt-4">
                        <h4 className="text-lg font-semibold mb-2">{t('itemsOrdered')}</h4>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th className="px-4 py-2">{t('product')}</th>
                                        <th className="px-4 py-2 text-center">{t('quantity')}</th>
                                        <th className="px-4 py-2 text-right">{t('price')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {order.items.map(item => (
                                        <tr key={item.product.id} className="border-b dark:border-gray-700">
                                            <td className="px-4 py-2">{item.product.name[language]}</td>
                                            <td className="px-4 py-2 text-center">{item.quantity}</td>
                                            <td className="px-4 py-2 text-right">BDT {(item.product.price * item.quantity).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                 <div className="p-5 border-t dark:border-gray-700 text-right sticky bottom-0 bg-white dark:bg-gray-800">
                    <button onClick={onClose} className="px-5 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
                        {t('close')}
                    </button>
                </div>
            </div>
        </div>
    );
};


export const AdminOrderManagement: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
    const { language, t } = useSettings();
    const { showNotification } = useNotification();
    const { smsTemplates, loading: templatesLoading } = useSmsTemplates();

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        try {
            const allOrders = await userService.getAllOrders();
            setOrders(allOrders);
        } catch (error) {
            showNotification('Failed to load orders.', 'error');
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [showNotification]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const handleStatusChange = async (orderId: string, userId: string, newStatus: Order['status'], action?: 'approve' | 'deny') => {
        try {
            // Update status in the database first
            await userService.updateOrderStatus(orderId, userId, newStatus);
            
            // If status is 'Processing', send SMS
            if (newStatus === 'Processing' && smsTemplates) {
                const orderToUpdate = orders.find(o => o.id === orderId);
                if (orderToUpdate && orderToUpdate.userPhone) {
                    try {
                        const messageTemplate = smsTemplates.orderConfirmation[language];
                        const orderData = {
                            orderId: orderToUpdate.id,
                            userName: orderToUpdate.userName,
                            totalAmount: orderToUpdate.totalAmount.toFixed(2),
                        };
                        await smsService.sendOrderConfirmationSms(orderToUpdate.userPhone, messageTemplate, orderData);
                        showNotification('Order confirmation SMS sent.', 'success');
                    } catch (smsError) {
                        console.error("Failed to send order confirmation SMS:", smsError);
                        showNotification('Order status updated, but failed to send SMS.', 'error');
                    }
                }
            }
            
            // Update local state for the admin panel UI
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order.id === orderId ? { ...order, status: newStatus } : order
                )
            );
            
            let notificationMessage = `Order ${orderId} status updated to ${newStatus}.`;
             if(action === 'approve') notificationMessage = t('cancellationApproved');
             else if(action === 'deny') notificationMessage = t('cancellationDenied');

            showNotification(notificationMessage, 'success');
        } catch (error) {
            showNotification('Failed to update order status.', 'error');
            console.error(error);
        }
    };

    const getStatusColor = (status: Order['status']) => {
        switch (status) {
            case 'Delivered': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'Shipped': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            case 'Processing': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
            case 'Pending': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
            case 'Cancellation Requested': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
            case 'Cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        }
    };
    
    const statusKey = (status: string) => status.charAt(0).toLowerCase() + status.slice(1).replace(/\s/g, '');

    return (
        <>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">{t('manageOrders')}</h2>
            {loading ? <div className="flex justify-center"><Spinner /></div> : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">{t('orderId')}</th>
                                <th scope="col" className="px-6 py-3">{t('customer')}</th>
                                <th scope="col" className="px-6 py-3">{t('date')}</th>
                                <th scope="col" className="px-6 py-3">{t('total')}</th>
                                <th scope="col" className="px-6 py-3">{t('status')}</th>
                                <th scope="col" className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <td className="px-6 py-4 font-mono">
                                        <button onClick={() => setViewingOrder(order)} className="text-blue-600 dark:text-blue-400 hover:underline">
                                            {order.id}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{order.userName}</td>
                                    <td className="px-6 py-4">{new Date(order.orderDate).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">BDT {order.totalAmount.toFixed(2)}</td>
                                    <td className="px-6 py-4">
                                        <span className={`text-xs font-medium me-2 px-2.5 py-0.5 rounded ${getStatusColor(order.status)}`}>
                                            {t(statusKey(order.status)) || order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 space-x-2 whitespace-nowrap">
                                        {order.status === 'Pending' && (
                                            <button onClick={() => handleStatusChange(order.id, order.userId, 'Processing')} disabled={templatesLoading} className="font-medium text-green-600 dark:text-green-500 hover:underline disabled:text-gray-400">{t('confirmPayment')}</button>
                                        )}
                                        {order.status === 'Processing' && (
                                            <button onClick={() => handleStatusChange(order.id, order.userId, 'Shipped')} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Mark as Shipped</button>
                                        )}
                                        {order.status === 'Cancellation Requested' && (
                                            <>
                                                <button onClick={() => handleStatusChange(order.id, order.userId, 'Cancelled', 'approve')} className="font-medium text-green-600 dark:text-green-500 hover:underline">{t('approveCancellation')}</button>
                                                <button onClick={() => handleStatusChange(order.id, order.userId, 'Processing', 'deny')} className="font-medium text-red-600 dark:text-red-500 hover:underline">{t('denyCancellation')}</button>
                                            </>
                                        )}
                                        {order.status === 'Shipped' && (
                                            <button onClick={() => handleStatusChange(order.id, order.userId, 'Delivered')} className="font-medium text-indigo-600 dark:text-indigo-500 hover:underline">Mark as Delivered</button>
                                        )}
                                        {(order.status === 'Delivered' || order.status === 'Cancelled') && (
                                            <span className="text-xs text-gray-500">No actions</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
        {viewingOrder && <AdminOrderDetailModal order={viewingOrder} onClose={() => setViewingOrder(null)} />}
        </>
    );
};
