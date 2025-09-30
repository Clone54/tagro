import { User, Order, Address, CartItem, PaymentDetails } from '../types';


// This correctly uses your environment variable
const API_URL = `${import.meta.env.VITE_API_URL}/api/users`;

// Helper function to get auth token
const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

// Helper function to make authenticated requests
const authFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });
};

// Register user
export const register = async (userData: {
  name: string;
  email: string;
  phone: string;
  password: string;
}): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/users/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Registration failed');
  }
};

// Login user
export const login = async (email: string, password: string): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Login failed');
  }

  const data = await response.json();
  localStorage.setItem('authToken', data.token);
  return data.user;
};

// Logout user
export const logout = (): void => {
  localStorage.removeItem('authToken');
};

// Get logged in user
export const getLoggedInUser = async (): Promise<User> => {
  const response = await authFetch('/users/me');

  if (!response.ok) {
    if (response.status === 401) {
      logout();
    }
    const error = await response.json();
    throw new Error(error.message || 'Failed to get user');
  }

  return response.json();
};

// Update user profile
export const updateUser = async (updatedUserData: User): Promise<User> => {
  const response = await authFetch('/users/profile', {
    method: 'PUT',
    body: JSON.stringify(updatedUserData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update user');
  }

  return response.json();
};

// Get all users (admin only)
export const getAllUsers = async (): Promise<User[]> => {
  const response = await authFetch('/users');

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to get users');
  }

  return response.json();
};

// Delete user (admin only)
export const deleteUser = async (userIdToDelete: string, currentAdminId: string): Promise<void> => {
  const response = await authFetch(`/users/${userIdToDelete}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete user');
  }
};

// Add order
export const addOrder = async (
  user: User,
  items: CartItem[],
  totalAmount: number,
  shippingAddress: Address,
  paymentDetails: PaymentDetails
): Promise<Order> => {
  const response = await authFetch('/users/order', {
    method: 'POST',
    body: JSON.stringify({
      items,
      totalAmount,
      shippingAddress,
      paymentDetails,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to place order');
  }

  return response.json();
};

// Get all orders (admin only)
export const getAllOrders = async (): Promise<Order[]> => {
  const response = await authFetch('/users/orders');

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to get orders');
  }

  return response.json();
};

// Update order status (admin only)
export const updateOrderStatus = async (
  orderId: string,
  userId: string,
  status: Order['status']
): Promise<void> => {
  const response = await authFetch(`/users/order/${orderId}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update order status');
  }
};

// Legacy functions for compatibility (may not be needed)
export const findUserByPhone = async (phone: string): Promise<User | undefined> => {
  // This might not be needed with API, but keeping for compatibility
  throw new Error('Not implemented with API');
};

export const checkUserExists = async (email: string, phone: string): Promise<boolean> => {
  // This might not be needed with API, but keeping for compatibility
  throw new Error('Not implemented with API');
};

export const updatePassword = async (phone: string, newPassword: string): Promise<User> => {
  // This might not be needed with API, but keeping for compatibility
  throw new Error('Not implemented with API');
};
