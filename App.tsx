
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './components/Home';
import { ProductList } from './components/ProductList';
import { ProductDetail } from './components/ProductDetail';
import { AboutUs } from './components/AboutUs';
import { ContactUs } from './components/ContactUs';
import { Dealer } from './components/Dealer';
import { CartView } from './components/CartView';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { ProfilePage } from './components/ProfilePage';
import { SearchResults } from './components/SearchResults';
import { AdminPanel } from './components/AdminPanel';
import { PaymentConfirmationPage } from './components/PaymentConfirmationPage';
import { AddAddressPage } from './components/AddAddressPage';
import { ForgotPassword } from './components/ForgotPassword';
import { Notification } from './components/Notification';

import { SettingsProvider } from './context/SettingsContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ProductProvider } from './context/ProductContext';
import { DealerProvider } from './context/DealerContext';
import { ContentProvider } from './context/ContentContext';
import { NotificationProvider } from './context/NotificationContext';
import { PaymentProvider } from './context/PaymentContext';
import { SmsTemplateProvider } from './context/SmsTemplateContext';

import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminRoute } from './components/AdminRoute';

const PageLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const location = useLocation();
    const noPaddingRoutes = ['/'];

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
            <Header />
            <main className={`flex-grow ${noPaddingRoutes.includes(location.pathname) ? '' : 'container mx-auto px-4 sm:px-6 lg:px-8 py-8'}`}>
                {children}
            </main>
            <Footer />
            <Notification />
        </div>
    );
};

function App() {
  return (
    <SettingsProvider>
      <NotificationProvider>
        <AuthProvider>
          <ContentProvider>
            <ProductProvider>
              <DealerProvider>
                <PaymentProvider>
                  <SmsTemplateProvider>
                    <CartProvider>
                      <Router >
                        <PageLayout>
                          <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/products" element={<ProductList />} />
                            <Route path="/product/:productId" element={<ProductDetail />} />
                            <Route path="/about" element={<AboutUs />} />
                            <Route path="/contact" element={<ContactUs />} />
                            <Route path="/dealer" element={<Dealer />} />
                            <Route path="/cart" element={<CartView />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/forgot-password" element={<ForgotPassword />} />
                            <Route path="/search" element={<SearchResults />} />
                            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                            <Route path="/profile/address/new" element={<ProtectedRoute><AddAddressPage /></ProtectedRoute>} />
                            <Route path="/profile/address/edit/:addressId" element={<ProtectedRoute><AddAddressPage /></ProtectedRoute>} />
                            <Route path="/payment-confirmation" element={<ProtectedRoute><PaymentConfirmationPage /></ProtectedRoute>} />
                            <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />
                          </Routes>
                        </PageLayout>
                      </Router>
                    </CartProvider>
                  </SmsTemplateProvider>
                </PaymentProvider>
              </DealerProvider>
            </ProductProvider>
          </ContentProvider>
        </AuthProvider>
      </NotificationProvider>
    </SettingsProvider>
  );
}

export default App;
