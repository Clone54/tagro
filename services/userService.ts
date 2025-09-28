
import { User, Order, Address, CartItem, PaymentDetails } from '../types';

// Simple in-memory password hashing for mock purposes
const hashPassword = (password: string): string => `hashed_${password}`;
const checkPassword = (password: string, hash: string): boolean => hash === `hashed_${password}`;

const USERS_KEY = 'TAgroFeeds_Users';
const LOGGED_IN_USER_KEY = 'TAgroFeeds_LoggedInUser';

const getMockUsers = (): User[] => {
    return [
        {
            id: 'admin_user',
            name: 'Admin User',
            email: 'admin@tagrofeeds.com',
            phone: '01234567890',
            passwordHash: hashPassword('admin123'),
            role: 'admin',
            profilePictureUrl: 'https://i.pravatar.cc/150?u=admin',
            addresses: [],
            orders: [],
        },
        {
            id: 'customer_user',
            name: 'Customer User',
            email: 'customer@example.com',
            phone: '09876543210',
            passwordHash: hashPassword('customer123'),
            role: 'customer',
            profilePictureUrl: 'https://i.pravatar.cc/150?u=customer',
            addresses: [
                { id: 'addr_1', division: 'Dhaka', district: 'Dhaka', upazila: 'Gulshan', details: 'House 123, Road 45, Block B', isDefault: true },
            ],
            orders: [],
        }
    ];
};

const getUsersFromStorage = (): User[] => {
    try {
        const stored = localStorage.getItem(USERS_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (error) {
        console.error("Failed to parse users from localStorage", error);
    }
    const mockUsers = getMockUsers();
    localStorage.setItem(USERS_KEY, JSON.stringify(mockUsers));
    return mockUsers;
};

const saveUsersToStorage = (users: User[]) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const findUserByPhone = (phone: string): Promise<User | undefined> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const users = getUsersFromStorage();
            const user = users.find(u => u.phone === phone);
            resolve(user);
        }, 100);
    });
};

export const checkUserExists = (email: string, phone: string): Promise<boolean> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const users = getUsersFromStorage();
            const exists = users.some(u => u.email === email || u.phone === phone);
            resolve(exists);
        }, 100);
    });
};

export const updatePassword = (phone: string, newPassword: string): Promise<User> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const users = getUsersFromStorage();
            const userIndex = users.findIndex(u => u.phone === phone);
            if (userIndex > -1) {
                users[userIndex].passwordHash = hashPassword(newPassword);
                saveUsersToStorage(users);
                resolve(users[userIndex]);
            } else {
                reject(new Error("User not found"));
            }
        }, 300);
    });
};


export const login = (email: string, password: string): Promise<User> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const users = getUsersFromStorage();
            const user = users.find(u => u.email === email);
            if (user && checkPassword(password, user.passwordHash)) {
                localStorage.setItem(LOGGED_IN_USER_KEY, user.id);
                resolve(user);
            } else {
                reject(new Error("Invalid email or password"));
            }
        }, 300);
    });
};

export const register = (userData: Omit<User, 'id' | 'passwordHash' | 'role' | 'profilePictureUrl'| 'addresses' | 'orders'> & { password: string }): Promise<User> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const users = getUsersFromStorage();
            if (users.some(u => u.email === userData.email || u.phone === userData.phone)) {
                reject(new Error("User with this email or phone number already exists"));
                return;
            }
            const newUser: User = {
                id: `user_${Date.now()}`,
                name: userData.name,
                email: userData.email,
                phone: userData.phone,
                passwordHash: hashPassword(userData.password),
                role: 'customer',
                profilePictureUrl: `https://i.pravatar.cc/150?u=${Date.now()}`,
                addresses: [],
                orders: [],
            };
            const updatedUsers = [...users, newUser];
            saveUsersToStorage(updatedUsers);
            resolve(newUser);
        }, 300);
    });
};

export const logout = (): void => {
    localStorage.removeItem(LOGGED_IN_USER_KEY);
};

export const getLoggedInUser = (): Promise<User> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const userId = localStorage.getItem(LOGGED_IN_USER_KEY);
            if (!userId) {
                reject(new Error("No user is logged in"));
                return;
            }
            const users = getUsersFromStorage();
            const user = users.find(u => u.id === userId);
            if (user) {
                resolve(user);
            } else {
                // If user in session doesn't exist in DB, clear session
                logout();
                reject(new Error("Logged in user not found in database"));
            }
        }, 100);
    });
};

export const updateUser = (updatedUserData: User): Promise<User> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const users = getUsersFromStorage();
            const index = users.findIndex(u => u.id === updatedUserData.id);
            if (index > -1) {
                users[index] = updatedUserData;
                saveUsersToStorage(users);
                resolve(updatedUserData);
            } else {
                reject(new Error("User not found"));
            }
        }, 300);
    });
};

export const getAllOrders = (): Promise<Order[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const users = getUsersFromStorage();
            const allOrders = users.flatMap(user => 
                user.orders.map(order => ({
                    ...order, 
                    userName: user.name, 
                    userId: user.id,
                    userPhone: user.phone
                }))
            );
            resolve(allOrders.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()));
        }, 300);
    });
};

export const updateOrderStatus = async (orderId: string, userId: string, status: Order['status']): Promise<void> => {
    const users = getUsersFromStorage();
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) throw new Error("User not found");

    const orderIndex = users[userIndex].orders.findIndex(o => o.id === orderId);
    if (orderIndex === -1) throw new Error("Order not found");

    users[userIndex].orders[orderIndex].status = status;
    saveUsersToStorage(users);
};

export const addOrder = (user: User, items: CartItem[], totalAmount: number, shippingAddress: Address, paymentDetails: PaymentDetails): Promise<Order> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const newOrder: Order = {
                id: `order_${Date.now()}`,
                userId: user.id,
                userName: user.name,
                orderDate: new Date().toISOString(),
                items: items,
                totalAmount: totalAmount,
                shippingAddress: shippingAddress,
                paymentDetails: paymentDetails,
                status: 'Pending',
            };
            resolve(newOrder);
        }, 300);
    });
};
