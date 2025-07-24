
import type { Product, Manager, Shop } from './types';

// Deterministic pseudo-random number generator
const seededRandom = (seedStr: string) => {
  let seed = 0;
  for (let i = 0; i < seedStr.length; i++) {
    seed = (seed + seedStr.charCodeAt(i)) % 10000;
  }
  return () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
};

function generatePriceHistory(basePrice: number, days: number, sku: string): { date: string, price: number }[] {
  const history = [];
  let price = basePrice;
  const random = seededRandom(sku);

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    price += (random() - 0.5) * (basePrice * 0.05); // smaller fluctuation
    if (i % 30 === 0 && i > 0 && days > 60) {
      price *= (0.9 + random() * 0.05); // pseudo-seasonal drop
    }
    if (i % 15 === 0 && days > 30) {
      price *= (1.02 + random() * 0.01); // pseudo-seasonal rise
    }
    history.push({
      date: date.toISOString().split('T')[0],
      price: Math.max(10, parseFloat(price.toFixed(2))), // ensure price doesn't drop too low
    });
  }
  return history;
}

export const shops: Shop[] = [
  { id: 'shop-1', name: 'Основной магазин' },
  { id: 'shop-2', name: 'Филиал "Север"' },
];

export const managers: Manager[] = [
  { id: 'manager-1', name: 'Анна Иванова', avatarUrl: 'https://placehold.co/40x40.png', shopId: 'shop-1' },
  { id: 'manager-2', name: 'Петр Петров', avatarUrl: 'https://placehold.co/40x40.png', shopId: 'shop-1' },
  { id: 'manager-3', name: 'Мария Сидорова', avatarUrl: 'https://placehold.co/40x40.png', shopId: 'shop-2' },
  { id: 'manager-4', name: 'Игорь Васильев', avatarUrl: 'https://placehold.co/40x40.png', shopId: 'shop-2' },
];

const allProductsData: Omit<Product, 'priceHistory' | 'shopId' | 'marketplace'>[] = [
  {
    id: 'B08H93ZRK9',
    name: 'Echo Dot (4-го поколения)',
    imageUrl: 'https://placehold.co/100x100.png',
    managerId: 'manager-1',
    rating: 4.7,
    reviews: 782341,
    features: ['Умная колонка', 'С поддержкой Alexa', 'Цвет древесного угля', 'Компактный дизайн'],
    notifications: 2,
  },
  {
    id: 'B08P2H5L7G',
    name: 'Google Nest Hub (2-го поколения)',
    imageUrl: 'https://placehold.co/100x100.png',
    managerId: 'manager-1',
    rating: 4.6,
    reviews: 12543,
    features: ['Умный дисплей', 'Google Ассистент', 'Цвет «мел»', 'Анализ сна'],
    notifications: 0,
  },
  {
    id: 'B09B8V2T6C',
    name: 'Sony WH-1000XM5',
    imageUrl: 'https://placehold.co/100x100.png',
    managerId: 'manager-2',
    rating: 4.8,
    reviews: 15234,
    features: ['Шумоподавление', '30 часов работы', 'Hi-Res Audio', 'Multipoint'],
    notifications: 1,
  },
  {
    id: 'B09J29QDP9',
    name: 'Apple HomePod mini',
    imageUrl: 'https://placehold.co/100x100.png',
    managerId: null, // Unassigned
    rating: 4.8,
    reviews: 45678,
    features: ['360-градусный звук', 'Интеграция с Siri', 'Цвет «серый космос»', 'Интерком'],
    notifications: 0,
  },
  {
    id: 'B07Y2P3Y9W',
    name: 'Sonos One (Gen 2)',
    imageUrl: 'https://placehold.co/100x100.png',
    managerId: 'manager-2',
    rating: 4.7,
    reviews: 23456,
    features: ['Голосовое управление', 'Насыщенный звук', 'Влагостойкий', 'Apple AirPlay 2'],
    notifications: 5,
  },
  {
    id: 'B07XJ8C8F7',
    name: 'Bose Home Speaker 500',
    imageUrl: 'https://placehold.co/100x100.png',
    managerId: 'manager-4',
    rating: 4.5,
    reviews: 15987,
    features: ['Стереозвук', 'Встроенный Alexa', 'ЖК-дисплей', 'Bluetooth'],
    notifications: 0,
  },
  {
    id: 'B08F26C7R1',
    name: 'Amazon Echo Show 10 (3rd Gen)',
    imageUrl: 'https://placehold.co/100x100.png',
    managerId: null, // Unassigned
    rating: 4.7,
    reviews: 32109,
    features: ['HD-дисплей', 'Движение', 'Alexa', 'Камера 13 Мп'],
    notifications: 1,
  },
   {
    id: 'B0C1J3V6P4',
    name: 'Anker Soundcore Liberty 4',
    imageUrl: 'https://placehold.co/100x100.png',
    managerId: 'manager-3',
    rating: 4.5,
    reviews: 9876,
    features: ['ANC', 'Hi-Res Wireless', 'Мониторинг ЧСС', 'Пространственный звук'],
    notifications: 3,
  },
];

const basePrices: { [key: string]: number } = {
  'B08H93ZRK9': 49.99,
  'B08P2H5L7G': 99.99,
  'B09B8V2T6C': 399.99,
  'B09J29QDP9': 99.00,
  'B07Y2P3Y9W': 219.00,
  'B07XJ8C8F7': 299.00,
  'B08F26C7R1': 249.99,
  'B0C1J3V6P4': 129.99,
};

const productMarketplaces: { [key: string]: { shopId: string, marketplace: string } } = {
    'B08H93ZRK9': { shopId: 'shop-1', marketplace: 'Наш магазин' },
    'B08P2H5L7G': { shopId: 'shop-1', marketplace: 'Наш магазин' },
    'B09B8V2T6C': { shopId: 'shop-1', marketplace: 'Наш магазин' },
    'B09J29QDP9': { shopId: 'shop-2', marketplace: 'Филиал "Север"' },
    'B07Y2P3Y9W': { shopId: 'shop-1', marketplace: 'Наш магазин' },
    'B07XJ8C8F7': { shopId: 'shop-2', marketplace: 'Филиал "Север"' },
    'B08F26C7R1': { shopId: 'shop-1', marketplace: 'Наш магазин' },
    'B0C1J3V6P4': { shopId: 'shop-2', marketplace: 'Филиал "Север"' },
};

// Add some competitor products that don't belong to any of our shops
const competitorProducts: Omit<Product, 'priceHistory' | 'shopId' | 'managerId' | 'notifications'>[] = [
    {
        id: 'COMP-GGL-NEST-A',
        name: 'Google Nest Audio',
        imageUrl: 'https://placehold.co/100x100.png',
        marketplace: 'Competitor A',
        rating: 4.6,
        reviews: 25890,
        features: ['Умная колонка', 'Google Ассистент', 'Отличное качество звука'],
    },
    {
        id: 'COMP-BOSE-QC-45',
        name: 'Bose QuietComfort 45',
        imageUrl: 'https://placehold.co/100x100.png',
        marketplace: 'Competitor B',
        rating: 4.7,
        reviews: 19870,
        features: ['Шумоподавление', '24 часа работы', 'Режим Aware'],
    }
];

export const allAvailableProducts: Product[] = [
    ...allProductsData.map(p => {
        const marketInfo = productMarketplaces[p.id];
        return {
            ...p,
            shopId: marketInfo.shopId,
            marketplace: marketInfo.marketplace,
            priceHistory: generatePriceHistory(basePrices[p.id] || 100, 365, p.id),
        }
    }),
    ...competitorProducts.map(p => ({
        ...p,
        id: p.id,
        shopId: 'competitor',
        managerId: null,
        notifications: 0,
        priceHistory: generatePriceHistory((basePrices[p.id] || 150) * 1.1, 365, p.id),
    }))
];

export const managedProducts: Product[] = allAvailableProducts.filter(p => p.shopId !== 'competitor');
