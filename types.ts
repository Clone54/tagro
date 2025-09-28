
export type LocalizedString = {
    en: string;
    bn: string;
};

export enum Category {
    FishFeed = 'Fish Feed',
    PoultryFeed = 'Poultry Feed',
    CattleFeed = 'Cattle Feed',
    FishMedicine = 'Fish Medicine',
}

export interface Rating {
    userId: string;
    userName: string;
    rating: number;
    comment?: string;
    date: string;
}

export interface Product {
    id: string;
    name: LocalizedString;
    category: Category;
    description: LocalizedString;
    ingredients: LocalizedString;
    storage: LocalizedString;
    featuresAndAdvantages: LocalizedString;
    imageUrl: string;
    price: number;
    stock: number;
    weightOptions: number[];
    ratings: Rating[];
}

export interface CartItem {
    product: Product;
    quantity: number;
}

export interface Address {
    id: string;
    division: string;
    district: string;

    upazila: string;
    details: string;
    isDefault: boolean;
}

export interface OrderItem {
    product: Product;
    quantity: number;
}

export interface PaymentDetails {
    method: string;
    senderNumber?: string;
    transactionId?: string;
    senderAccountName?: string;
    senderAccountNumber?: string;
}

export interface Order {
    id: string;
    userId: string;
    userName: string;
    userPhone?: string;
    orderDate: string;
    items: OrderItem[];
    totalAmount: number;
    shippingAddress: Address;
    paymentDetails: PaymentDetails;
    status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Cancellation Requested';
}

export interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    passwordHash: string;
    role: 'customer' | 'admin';
    profilePictureUrl: string;
    addresses: Address[];
    orders: Order[];
}

export interface DealerInfo {
    id: string;
    image: string;
    name: LocalizedString;
    zone: LocalizedString;
    phone: string;
    code: string;
}

export interface HomeContent {
    heroImage: string;
    mainSlogan: LocalizedString;
    secondarySlogan: LocalizedString;
    featuredProductIds: string[];
}

export interface AboutContent {
    heroImage: string;
    story: LocalizedString;
    mission: LocalizedString;
    vision: LocalizedString;
}

export interface ContactInfo {
    address: LocalizedString;
    email: string;
    phone: string;
}

export interface FooterContent {
    socialLinks: {
        facebook: string;
        twitter: string;
        instagram: string;
        linkedin: string;
    }
}

export interface SiteSettingsContent {
    logoUrl: string;
}

export interface MobilePaymentDetails {
    accountNumber: string;
    paymentType: 'sendMoney' | 'payment';
}

export interface BankPaymentDetails {
    accountName: string;
    accountNumber: string;
    bankName: string;
    branchName: string;
    routingNumber: string;
}

export interface PaymentMethod {
    type: 'bkash' | 'nagad' | 'rocket' | 'bank';
    name: string;
    details: MobilePaymentDetails | BankPaymentDetails | any; // Using any for details to simplify form handling
    isEnabled: boolean;
}

export interface SmsTemplate {
    en: string;
    bn: string;
}

export interface SmsTemplates {
    otp: SmsTemplate;
    orderConfirmation: SmsTemplate;
}
