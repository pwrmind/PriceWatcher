import type { Product } from './types';

function generatePriceHistory(basePrice: number, days: number): { date: string, price: number }[] {
  const history = [];
  let price = basePrice;
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    price += (Math.random() - 0.5) * (basePrice * 0.05);
    if (i % 30 === 0 && i > 0) {
      price *= 0.9;
    }
    if (i % 15 === 0) {
      price *= 1.02;
    }
    history.push({
      date: date.toISOString().split('T')[0],
      price: parseFloat(price.toFixed(2)),
    });
  }
  return history;
}

// Represents the SKUs the manager is responsible for.
export const managedProducts: Product[] = [
  {
    id: 'B08H93ZRK9',
    name: 'Echo Dot (4-го поколения)',
    imageUrl: 'https://placehold.co/100x100.png',
    marketplace: 'Наш магазин',
    rating: 4.7,
    reviews: 782341,
    features: ['Умная колонка', 'С поддержкой Alexa', 'Цвет древесного угля', 'Компактный дизайн'],
    priceHistory: generatePriceHistory(49.99, 90),
  },
  {
    id: 'B08P2H5L7G',
    name: 'Google Nest Hub (2-го поколения)',
    imageUrl: 'https://placehold.co/100x100.png',
    marketplace: 'Наш магазин',
    rating: 4.6,
    reviews: 12543,
    features: ['Умный дисплей', 'Google Ассистент', 'Цвет «мел»', 'Анализ сна'],
    priceHistory: generatePriceHistory(99.99, 90),
  },
];

// Represents all available products in the market for comparison.
export const allAvailableProducts: Product[] = [
  ...managedProducts,
  {
    id: 'B09J29QDP9',
    name: 'Apple HomePod mini',
    imageUrl: 'https://placehold.co/100x100.png',
    marketplace: 'Магазин Apple',
    rating: 4.8,
    reviews: 45678,
    features: ['360-градусный звук', 'Интеграция с Siri', 'Цвет «серый космос»', 'Интерком'],
    priceHistory: generatePriceHistory(99.00, 90),
  },
  {
    id: 'B07Y2P3Y9W',
    name: 'Sonos One (Gen 2)',
    imageUrl: 'https://placehold.co/100x100.png',
    marketplace: 'Sonos.com',
    rating: 4.7,
    reviews: 23456,
    features: ['Голосовое управление', 'Насыщенный звук', 'Влагостойкий', 'Apple AirPlay 2'],
    priceHistory: generatePriceHistory(219.00, 90),
  },
    {
    id: 'B07XJ8C8F7',
    name: 'Bose Home Speaker 500',
    imageUrl: 'https://placehold.co/100x100.png',
    marketplace: 'Amazon',
    rating: 4.5,
    reviews: 15987,
    features: ['Стереозвук', 'Встроенный Alexa', 'ЖК-дисплей', 'Bluetooth'],
    priceHistory: generatePriceHistory(299.00, 90),
  },
  {
    id: 'B08F26C7R1',
    name: 'Amazon Echo Show 10 (3rd Gen)',
    imageUrl: 'https://placehold.co/100x100.png',
    marketplace: 'Best Buy',
    rating: 4.7,
    reviews: 32109,
    features: ['HD-дисплей', 'Движение', 'Alexa', 'Камера 13 Мп'],
    priceHistory: generatePriceHistory(249.99, 90),
  },
];
