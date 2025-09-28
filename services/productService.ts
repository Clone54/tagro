

// FIX: Corrected import path for types.
import { Product, Category, Rating } from '../types';

const mockProducts: Product[] = [
    // Fish Feed
    {
        id: 'ff001',
        name: { en: 'Starter Fish Feed', bn: 'স্টার্টার ফিশ ফিড' },
        category: Category.FishFeed,
        description: { en: 'High protein starter feed for young fish.', bn: 'ছোট মাছের জন্য উচ্চ প্রোটিনযুক্ত স্টার্টার ফিড।' },
        ingredients: { en: 'Fish meal, soybean meal, wheat flour, vitamins, minerals.', bn: 'মাছের খাবার, সয়াবিন খাবার, গমের আটা, ভিটামিন, খনিজ।' },
        storage: { en: 'Store in a cool, dry place away from direct sunlight.', bn: 'সরাসরি সূর্যালোক থেকে দূরে একটি শীতল, শুষ্ক জায়গায় সংরক্ষণ করুন।' },
        featuresAndAdvantages: { en: 'Promotes rapid growth. Improves immunity. Easy to digest.', bn: 'দ্রুত বৃদ্ধি উৎসাহিত করে। রোগ প্রতিরোধ ক্ষমতা উন্নত করে। হজম করা সহজ।' },
        imageUrl: 'https://picsum.photos/seed/fishfeed1/400/400',
        price: 1599.00,
        stock: 100,
        weightOptions: [1, 5, 20],
        ratings: [
            { userId: 'user1', userName: 'Alice', rating: 5, comment: 'My fish love this!', date: new Date('2023-10-26T10:00:00Z').toISOString() },
            { userId: 'user2', userName: 'Bob', rating: 4, date: new Date('2023-10-25T14:30:00Z').toISOString() }
        ],
    },
    {
        id: 'ff002',
        name: { en: 'Grower Fish Feed', bn: 'গ্রোয়ার ফিশ ফিড' },
        category: Category.FishFeed,
        description: { en: 'Balanced nutrition for growing fish.', bn: 'বাড়ন্ত মাছের জন্য সুষম পুষ্টি।' },
        ingredients: { en: 'Corn gluten meal, fish oil, vitamin premix.', bn: 'ভূট্টা গ্লুটেন খাবার, মাছের তেল, ভিটামিন প্রিমিক্স।' },
        storage: { en: 'Keep bag sealed and store in a well-ventilated area.', bn: 'ব্যাগটি সিল করে রাখুন এবং একটি ভাল বায়ুচলাচল এলাকায় সংরক্ষণ করুন।' },
        featuresAndAdvantages: { en: 'Ensures healthy development. Optimized for better Feed Conversion Ratio (FCR).', bn: 'স্বাস্থ্যকর বিকাশ নিশ্চিত করে। উন্নত ফিড রূপান্তর অনুপাতের (FCR) জন্য অপ্টিমাইজ করা হয়েছে।' },
        imageUrl: 'https://picsum.photos/seed/fishfeed2/400/400',
        price: 1399.00,
        stock: 150,
        weightOptions: [5, 25, 50],
        ratings: [
            { userId: 'user3', userName: 'Charlie', rating: 5, comment: 'Great results in just a few weeks.', date: new Date('2023-11-01T12:00:00Z').toISOString() },
        ],
    },
    // Poultry Feed
    {
        id: 'pf001',
        name: { en: 'Broiler Starter Feed', bn: 'ব্রয়লার স্টার্টার ফিড' },
        category: Category.PoultryFeed,
        description: { en: 'Nutrient-rich feed for broiler chicks.', bn: 'ব্রয়লার বাচ্চাদের জন্য পুষ্টিকর খাবার।' },
        ingredients: { en: 'Maize, De-oiled Soya bean meal, amino acids.', bn: 'ভূট্টা, ডি-অয়েলড সয়াবিন খাবার, অ্যামিনো অ্যাসিড।' },
        storage: { en: 'Store in a pest-free environment.', bn: 'একটি কীটপতঙ্গমুক্ত পরিবেশে সংরক্ষণ করুন।' },
        featuresAndAdvantages: { en: 'High in protein for muscle development. Contains coccidiostat to prevent disease.', bn: 'পেশী বিকাশের জন্য প্রোটিন সমৃদ্ধ। রোগ প্রতিরোধের জন্য কক্সিডিওস্ট্যাট রয়েছে।' },
        imageUrl: 'https://picsum.photos/seed/poultryfeed1/400/400',
        price: 2550.00,
        stock: 200,
        weightOptions: [10, 25, 50],
        ratings: [],
    },
    {
        id: 'pf002',
        name: { en: 'Layer Mash', bn: 'লেয়ার ম্যাশ' },
        category: Category.PoultryFeed,
        description: { en: 'Complete feed for laying hens.', bn: 'ডিম পাড়া মুরগির জন্য সম্পূর্ণ ফিড।' },
        ingredients: { en: 'Ground corn, soybean meal, calcium carbonate.', bn: 'গুঁড়ো ভূট্টা, সয়াবিন খাবার, ক্যালসিয়াম কার্বনেট।' },
        storage: { en: 'Ensure the feed is not exposed to moisture.', bn: 'ফিডটি আর্দ্রতার সংস্পর্শে না আসে তা নিশ্চিত করুন।' },
        featuresAndAdvantages: { en: 'Enriched with calcium for strong eggshells. Promotes consistent egg production.', bn: 'শক্তিশালী ডিমের খোসার জন্য ক্যালসিয়াম সমৃদ্ধ। ধারাবাহিক ডিম উৎপাদন উৎসাহিত করে।' },
        imageUrl: 'https://picsum.photos/seed/poultryfeed2/400/400',
        price: 2200.00,
        stock: 180,
        weightOptions: [10, 25, 50],
        ratings: [
             { userId: 'user4', userName: 'David', rating: 5, comment: 'My hens are laying more eggs than ever!', date: new Date('2023-11-05T09:20:00Z').toISOString() },
        ],
    },
    // Cattle Feed
    {
        id: 'cf001',
        name: { en: 'Dairy Cattle Feed', bn: 'দুগ্ধবতী গরুর ফিড' },
        category: Category.CattleFeed,
        description: { en: 'High energy feed for milking cows.', bn: 'দুধেল গরুর জন্য উচ্চ শক্তির খাবার।' },
        ingredients: { en: 'De-oiled rice bran, molasses, urea, salt.', bn: 'ডি-অয়েলড রাইস ব্রান, মোলাসেস, ইউরিয়া, লবণ।' },
        storage: { en: 'Store on pallets in a dry place.', bn: 'একটি শুকনো জায়গায় প্যালেটের উপর সংরক্ষণ করুন।' },
        featuresAndAdvantages: { en: 'Increases milk yield. Improves fat content in milk.', bn: 'দুধের ফলন বাড়ায়। দুধে চর্বির পরিমাণ উন্নত করে।' },
        imageUrl: 'https://picsum.photos/seed/cattlefeed1/400/400',
        price: 3500.00,
        stock: 80,
        weightOptions: [25, 50],
        ratings: [],
    },
    // Fish Medicine
    {
        id: 'fm001',
        name: { en: 'AquaHeal', bn: 'অ্যাকোয়াহিল' },
        category: Category.FishMedicine,
        description: { en: 'Broad-spectrum antibiotic for fish diseases.', bn: 'মাছের রোগের জন্য ব্রড-স্পেকট্রাম অ্যান্টিবায়োটিক।' },
        ingredients: { en: 'Ciprofloxacin Hydrochloride, excipients.', bn: 'সিপ্রোফ্লক্সাসিন হাইড্রোক্লোরাইড, এক্সিপিয়েন্টস।' },
        storage: { en: 'Store below 25°C. Protect from light.', bn: '২৫°C এর নিচে সংরক্ষণ করুন। আলো থেকে রক্ষা করুন।' },
        featuresAndAdvantages: { en: 'Effective against a wide range of bacterial infections. Fast-acting formula.', bn: 'বিভিন্ন ধরণের ব্যাকটেরিয়া সংক্রমণের বিরুদ্ধে কার্যকর। দ্রুত-কার্যকরী সূত্র।' },
        imageUrl: 'https://picsum.photos/seed/fishmed1/400/400',
        price: 800.00,
        stock: 300,
        weightOptions: [0.1, 0.5], // in kg/L
        ratings: [],
    },
];

const STORAGE_KEY = 'TAgroFeeds_Products';

const getProductsFromStorage = (): Product[] => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const products = JSON.parse(stored) as Product[];
            // Basic data migration for products that might not have the new fields
            return products.map(p => ({
                ...p,
                ingredients: p.ingredients || { en: 'Not specified', bn: 'নির্দিষ্ট নয়' },
                storage: p.storage || { en: 'Not specified', bn: 'নির্দিষ্ট নয়' },
                featuresAndAdvantages: p.featuresAndAdvantages || { en: 'Not specified', bn: 'নির্দিষ্ট নয়' },
                ratings: p.ratings || [],
            }));
        }
    } catch (error) {
        console.error("Failed to parse products from localStorage", error);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockProducts));
    return mockProducts;
};

const saveProductsToStorage = (products: Product[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
};

export const getProducts = (): Promise<Product[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getProductsFromStorage()), 300);
  });
};

export const getProductById = (productId: string): Promise<Product | undefined> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const products = getProductsFromStorage();
            resolve(products.find(p => p.id === productId));
        }, 300);
    });
};

export const addProduct = (productData: Omit<Product, 'id' | 'ratings'>): Promise<Product> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const products = getProductsFromStorage();
            const newProduct: Product = {
                ...productData,
                id: `prod_${Date.now()}`,
                ratings: [],
            };
            const updatedProducts = [...products, newProduct];
            saveProductsToStorage(updatedProducts);
            resolve(newProduct);
        }, 300);
    });
};

export const updateProduct = (updatedProductData: Product): Promise<Product> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const products = getProductsFromStorage();
            const index = products.findIndex(p => p.id === updatedProductData.id);
            if (index > -1) {
                const updatedProducts = [...products];
                updatedProducts[index] = { ...products[index], ...updatedProductData };
                saveProductsToStorage(updatedProducts);
                resolve(updatedProducts[index]);
            } else {
                reject(new Error("Product not found"));
            }
        }, 300);
    });
};

export const deleteProduct = (productId: string): Promise<void> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const products = getProductsFromStorage();
            const updatedProducts = products.filter(p => p.id !== productId);
            saveProductsToStorage(updatedProducts);
            resolve();
        }, 300);
    });
};

export const addRating = (productId: string, ratingData: Omit<Rating, 'date'>): Promise<Product> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const products = getProductsFromStorage();
            const index = products.findIndex(p => p.id === productId);
            if (index > -1) {
                const newRating: Rating = {
                    ...ratingData,
                    date: new Date().toISOString()
                };
                products[index].ratings.push(newRating);
                saveProductsToStorage(products);
                resolve(products[index]);
            } else {
                reject(new Error("Product not found"));
            }
        }, 300);
    });
};