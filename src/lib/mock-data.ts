
import type { Product, Manager } from './types';

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
    if (i % 30 === 0 && i > 0) {
      price *= (0.9 + random() * 0.05); // pseudo-seasonal drop
    }
    if (i % 15 === 0) {
      price *= (1.02 + random() * 0.01); // pseudo-seasonal rise
    }
    history.push({
      date: date.toISOString().split('T')[0],
      price: Math.max(10, parseFloat(price.toFixed(2))), // ensure price doesn't drop too low
    });
  }
  return history;
}

export const managers: Manager[] = [
  { id: 'manager-1', name: 'Анна Иванова', avatarUrl: 'https://placehold.co/40x40.png' },
  { id: 'manager-2', name: 'Петр Петров', avatarUrl: 'https://placehold.co/40x40.png' },
  { id: 'manager-3', name: 'Мария Сидорова', avatarUrl: 'https://placehold.co/40x40.png' },
];

const allProductsData: Omit<Product, 'priceHistory'>[] = [
  {
    id: 'B08H93ZRK9',
    name: 'Echo Dot (4-го поколения)',
    imageUrl: 'https://placehold.co/100x100.png',
    managerId: 'manager-1',
    marketplace: 'Наш магазин',
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
    marketplace: 'Наш магазин',
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
    marketplace: 'Наш магазин',
    rating: 4.8,
    reviews: 15234,
    features: ['Шумоподавление', '30 часов работы', 'Hi-Res Audio', 'Multipoint'],
    notifications: 1,
  },
  {
    id: 'B09J29QDP9',
    name: 'Apple HomePod mini',
    imageUrl: 'https://placehold.co/100x100.png',
    managerId: 'manager-3',
    marketplace: 'Магазин Apple',
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
    marketplace: 'Sonos.com',
    rating: 4.7,
    reviews: 23456,
    features: ['Голосовое управление', 'Насыщенный звук', 'Влагостойкий', 'Apple AirPlay 2'],
    notifications: 5,
  },
  {
    id: 'B07XJ8C8F7',
    name: 'Bose Home Speaker 500',
    imageUrl: 'https://placehold.co/100x100.png',
    managerId: 'manager-3',
    marketplace: 'Amazon',
    rating: 4.5,
    reviews: 15987,
    features: ['Стереозвук', 'Встроенный Alexa', 'ЖК-дисплей', 'Bluetooth'],
    notifications: 0,
  },
  {
    id: 'B08F26C7R1',
    name: 'Amazon Echo Show 10 (3rd Gen)',
    imageUrl: 'https://placehold.co/100x100.png',
    managerId: 'manager-1',
    marketplace: 'Best Buy',
    rating: 4.7,
    reviews: 32109,
    features: ['HD-дисплей', 'Движение', 'Alexa', 'Камера 13 Мп'],
    notifications: 1,
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
};

export const allAvailableProducts: Product[] = allProductsData.map(p => ({
  ...p,
  priceHistory: generatePriceHistory(basePrices[p.id] || 100, 90, p.id),
}));

export const managedProducts: Product[] = allAvailableProducts.filter(p => p.marketplace === 'Наш магазин');
