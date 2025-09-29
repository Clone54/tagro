import React, { useState, useEffect, useMemo } from 'react';
import { User } from '../types';
import * as userService from '../services/userService';
import { Spinner } from './Spinner';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

// Helper function to convert data to CSV format
const convertToCSV = (data: User[]): string => {
    if (data.length === 0) return '';
    
    // Using a more detailed header set
    const headers = [
        'ID', 'Name', 'Email', 'Phone', 'Role', 
        'Profile Picture URL', 'Addresses (JSON)', 'Orders (JSON)'
    ];
    
    const rows = data.map(user => {
        // Escape commas within fields by wrapping in double quotes
        const escape = (str: string) => `"${str.replace(/"/g, '""')}"`;

        const addressesJson = JSON.stringify(user.addresses);
        const ordersJson = JSON.stringify(user.orders);

        return [
            escape(user.id),
            escape(user.name),
            escape(user.email),
            escape(user.phone),
            escape(user.role),
            escape(user.profilePictureUrl),
            escape(addressesJson),
            escape(ordersJson)
        ].join(',');
    });

    return [headers.join(','), ...rows].join('\n');
};


export const AdminUserManagement: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const { user: adminUser } = useAuth();
    const { showNotification } = useNotification();

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const allUsers = await userService.getAllUsers();
                setUsers(allUsers);
            } catch (error) {
                console.error("Failed to fetch users:", error);
                showNotification('Failed to load user list.', 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, [showNotification]);

    const filteredUsers = useMemo(() => {
        return users.filter(user =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.phone.includes(searchTerm)
        );
    }, [users, searchTerm]);

    const handleDeleteUser = async (userIdToDelete: string) => {
        if (!adminUser) {
            showNotification('Authentication error.', 'error');
            return;
        }

        if (window.confirm('Are you sure you want to permanently delete this user? This action cannot be undone.')) {
            try {
                await userService.deleteUser(userIdToDelete, adminUser.id);
                setUsers(prevUsers => prevUsers.filter(u => u.id !== userIdToDelete));
                showNotification('User deleted successfully.', 'success');
            } catch (error: any) {
                console.error("Failed to delete user:", error);
                showNotification(error.message || 'Failed to delete user.', 'error');
            }
        }
    };

    const handleDownloadCsv = () => {
        const csvData = convertToCSV(filteredUsers);
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `users_export_${new Date().toISOString()}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                <h2 className="text-xl font-semibold">Manage Users</h2>
                <button 
                    onClick={handleDownloadCsv} 
                    className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                    Download CSV
                </button>
            </div>
             <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full p-2 mb-4 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {loading ? <Spinner /> : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th className="px-4 py-2">Profile</th>
                                <th className="px-4 py-2">Name</th>
                                <th className="px-4 py-2">Contact</th>
                                <th className="px-4 py-2">Role</th>
                                <th className="px-4 py-2 text-center">Addresses</th>
                                <th className="px-4 py-2 text-center">Orders</th>
                                <th className="px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map(user => (
                                <tr key={user.id} className="border-b dark:border-gray-700">
                                    <td className="p-2">
                                        <img src={user.profilePictureUrl} alt={user.name} className="w-10 h-10 object-cover rounded-full"/>
                                    </td>
                                    <td className="px-4 py-2 font-medium text-gray-900 dark:text-white">{user.name}</td>
                                    <td className="px-4 py-2">
                                        <div className="flex flex-col">
                                            <span>{user.email}</span>
                                            <span className="text-xs text-gray-500">{user.phone}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-2 capitalize">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                            user.role === 'admin' 
                                            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' 
                                            : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                        }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2 text-center">{user.addresses.length}</td>
                                    <td className="px-4 py-2 text-center">{user.orders.length}</td>
                                    <td className="px-4 py-2">
                                        <button
                                            onClick={() => handleDeleteUser(user.id)}
                                            disabled={user.id === adminUser?.id}
                                            className="text-red-600 hover:underline disabled:text-gray-400 disabled:cursor-not-allowed text-xs font-medium"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};