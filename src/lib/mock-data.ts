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

export const mockProducts: Product[] = [
  {
    id: 'B08H93ZRK9',
    name: 'Echo Dot (4th Gen)',
    imageUrl: 'https://placehold.co/100x100.png',
    marketplace: 'Amazon',
    rating: 4.7,
    reviews: 782341,
    features: ['Smart speaker', 'Alexa enabled', 'Charcoal fabric', 'Compact design'],
    priceHistory: generatePriceHistory(49.99, 90),
  },
  {
    id: 'B08P2H5L7G',
    name: 'Google Nest Hub (2nd Gen)',
    imageUrl: 'https://placehold.co/100x100.png',
    marketplace: 'Best Buy',
    rating: 4.6,
    reviews: 12543,
    features: ['Smart display', 'Google Assistant', 'Chalk color', 'Sleep Sensing'],
    priceHistory: generatePriceHistory(99.99, 90),
  },
  {
    id: 'B09J29QDP9',
    name: 'Apple HomePod mini',
    imageUrl: 'https://placehold.co/100x100.png',
    marketplace: 'Apple Store',
    rating: 4.8,
    reviews: 45678,
    features: ['360-degree audio', 'Siri integrated', 'Space Gray', 'Intercom feature'],
    priceHistory: generatePriceHistory(99.00, 90),
  },
  {
    id: 'B07Y2P3Y9W',
    name: 'Sonos One (Gen 2)',
    imageUrl: 'https://placehold.co/100x100.png',
    marketplace: 'Sonos.com',
    rating: 4.7,
    reviews: 23456,
    features: ['Voice control', 'Rich sound', 'Humidity resistant', 'Apple AirPlay 2'],
    priceHistory: generatePriceHistory(219.00, 90),
  },
];
